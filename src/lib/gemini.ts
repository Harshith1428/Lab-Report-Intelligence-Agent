import { type HealthMetrics } from "./healthConfig";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

export async function analyzeLabReportWithGemini(pdfBase64: string, fileName: string): Promise<HealthMetrics> {
    if (!GEMINI_API_KEY) {
        throw new Error("VITE_GEMINI_API_KEY is not configured in .env");
    }

    const systemPrompt = `You are a medical lab report parser. Extract health metrics from the provided lab report PDF.
Return ONLY a JSON object with these numeric fields (use null if not found):
- fastingGlucose (mg/dL)
- postMealGlucose (mg/dL)  
- systolicBP (mmHg)
- diastolicBP (mmHg)
- totalCholesterol (mg/dL)
- hdl (mg/dL)
- ldl (mg/dL)
- heartRate (bpm)
- hemoglobin (g/dL)
- wbc (cells/µL)
- rbc (millions/µL)
- plateletCount (per µL)

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
        const metrics = JSON.parse(textResponse);
        // Clean nulls and ensure numeric
        const cleaned: Record<string, number> = {};
        for (const [key, val] of Object.entries(metrics)) {
            if (val != null && typeof val === "number") {
                cleaned[key] = val;
            }
        }
        return cleaned as HealthMetrics;
    } catch (e) {
        console.error("JSON Parse Error:", textResponse);
        throw new Error("Failed to parse AI response into structured data");
    }
}
