import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { pdfBase64, fileName } = await req.json();
    if (!pdfBase64) {
      return new Response(JSON.stringify({ error: "No PDF data provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const systemPrompt = `You are a medical lab report parser. Extract health metrics from the provided lab report PDF content (base64 encoded).

Return ONLY a JSON object using the tool call with these numeric fields (use null if not found):
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

Parse values carefully. Convert units if needed. If a metric has multiple readings, use the most recent one.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [
              { type: "text", text: `Parse this lab report PDF (filename: ${fileName}):` },
              {
                type: "image_url",
                image_url: { url: `data:application/pdf;base64,${pdfBase64}` },
              },
            ],
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "extract_health_metrics",
              description: "Extract structured health metrics from a lab report",
              parameters: {
                type: "object",
                properties: {
                  fastingGlucose: { type: "number", nullable: true },
                  postMealGlucose: { type: "number", nullable: true },
                  systolicBP: { type: "number", nullable: true },
                  diastolicBP: { type: "number", nullable: true },
                  totalCholesterol: { type: "number", nullable: true },
                  hdl: { type: "number", nullable: true },
                  ldl: { type: "number", nullable: true },
                  heartRate: { type: "number", nullable: true },
                  hemoglobin: { type: "number", nullable: true },
                  wbc: { type: "number", nullable: true },
                  rbc: { type: "number", nullable: true },
                  plateletCount: { type: "number", nullable: true },
                },
                required: [
                  "fastingGlucose", "postMealGlucose", "systolicBP", "diastolicBP",
                  "totalCholesterol", "hdl", "ldl", "heartRate",
                  "hemoglobin", "wbc", "rbc", "plateletCount",
                ],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "extract_health_metrics" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI usage limit reached. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResult = await response.json();
    const toolCall = aiResult.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall?.function?.arguments) {
      throw new Error("AI did not return structured metrics");
    }

    const metrics = JSON.parse(toolCall.function.arguments);

    // Clean nulls
    const cleaned: Record<string, number> = {};
    for (const [key, val] of Object.entries(metrics)) {
      if (val != null && typeof val === "number") {
        cleaned[key] = val;
      }
    }

    return new Response(JSON.stringify({ metrics: cleaned }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("parse-lab-report error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
