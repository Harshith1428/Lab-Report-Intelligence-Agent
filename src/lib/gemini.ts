import { type HealthMetrics } from "./healthConfig";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent";

export async function analyzeLabReportWithGemini(pdfBase64: string, fileName: string): Promise<HealthMetrics> {
    if (!GEMINI_API_KEY) {
        throw new Error("VITE_GEMINI_API_KEY is not configured in .env");
    }

    const systemPrompt = `You are a medical lab report parser. Analyze the provided PDF document.
First, determine if the document is actually a medical lab report containing health metrics.

If the document IS NOT a medical lab report (e.g., it's a receipt, a random article, an empty page, etc.), return exactly this JSON and nothing else:
{
  "isLabReport": false,
  "errorReason": "The uploaded document does not appear to be a medical lab report."
}

If the document IS a medical lab report, return a JSON object with this exact structure (use null for fields not found):
{
  "isLabReport": true,
  "metrics": {
    "fastingGlucose": <number or null>,
    "postMealGlucose": <number or null>,  
    "systolicBP": <number or null>,
    "diastolicBP": <number or null>,
    "totalCholesterol": <number or null>,
    "hdl": <number or null>,
    "ldl": <number or null>,
    "heartRate": <number or null>,
    "hemoglobin": <number or null>,
    "wbc": <number or null>,
    "rbc": <number or null>,
    "plateletCount": <number or null>
  }
}

Format the output as a valid JSON object.`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            contents: [
                {
                    parts: [
                        { text: systemPrompt },
                        { text: `Parse this lab report file: ${fileName}` },
                        {
                            inline_data: {
                                mime_type: "application/pdf",
                                data: pdfBase64,
                            },
                        },
                    ],
                },
            ],
            generationConfig: {
                response_mime_type: "application/json",
            },
        }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error("Gemini API Error:", errorData);
        throw new Error(errorData.error?.message || "Failed to call Gemini API");
    }

    const result = await response.json();
    const textResponse = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textResponse) {
        throw new Error("Gemini did not return any content");
    }

    try {
        const responseData = JSON.parse(textResponse);

        if (responseData.isLabReport === false) {
            throw new Error(responseData.errorReason || "The uploaded document does not appear to be a medical lab report.");
        }

        const metrics = responseData.metrics || responseData; // Fallback in case the model just returns the metrics

        // Clean nulls and ensure numeric
        const cleaned: Record<string, number> = {};
        for (const [key, val] of Object.entries(metrics)) {
            if (val != null && typeof val === "number") {
                cleaned[key] = val;
            }
        }
        return cleaned as HealthMetrics;
    } catch (e: any) {
        console.error("JSON Parse Error or Validation Error:", e);
        // Rethrow the specific error we threw above, or a generic parsing error
        if (e.message.includes("does not appear to be a medical lab report")) {
            throw e;
        }
        throw new Error("Failed to parse AI response into structured data");
    }
}

export async function askGeminiAboutReport(question: string, metrics: HealthMetrics | null): Promise<string> {
    if (!GEMINI_API_KEY) {
        throw new Error("VITE_GEMINI_API_KEY is not configured in .env");
    }

    const systemPrompt = `You are a helpful, empathetic, and knowledgeable medical AI assistant.
Your user is asking a question about their recent lab report results.

Here is the structured data extracted from their lab report (in JSON format):
${JSON.stringify(metrics || {}, null, 2)}

Answer the user's question clearly, in plain language. If the data provided doesn't cover their question, politely let them know you don't have that specific information. Also add a standard medical disclaimer at the end of your response reminding them that you are an AI and they should consult a doctor.`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            contents: [
                {
                    parts: [
                        { text: systemPrompt },
                        { text: `Question: ${question}` },
                    ],
                },
            ],
            generationConfig: {
                temperature: 0.7,
            },
        }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error("Gemini API Error (Chat):", errorData);
        throw new Error(errorData.error?.message || "Failed to get AI response");
    }

    const result = await response.json();
    const textResponse = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textResponse) {
        throw new Error("Gemini did not return any content for the question.");
    }

    return textResponse;
}
