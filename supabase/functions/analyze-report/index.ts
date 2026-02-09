import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fileContent, fileType, fileName } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    if (!fileContent || !fileType) {
      throw new Error("Missing file content or file type");
    }

    const systemPrompt = `You are an expert medical report analyst and wellness advisor. Your role is to analyze medical reports and provide clear, actionable wellness guidance.

CRITICAL RULES:
1. NEVER provide a medical diagnosis
2. NEVER prescribe medications or treatments
3. Focus on identifying health concerns mentioned in the report
4. Provide preventive wellness guidance only
5. Always recommend professional medical consultation
6. Use supportive, non-alarming language

Analyze the uploaded medical report and respond in this exact JSON format:
{
  "reportSummary": "Brief 2-3 sentence summary of what the report contains",
  "healthConcerns": [
    { "concern": "Health concern identified", "severity": "Low|Medium|High", "details": "Brief explanation" }
  ],
  "preventiveSteps": [
    "Actionable preventive step 1",
    "Actionable preventive step 2"
  ],
  "lifestyleCorrections": [
    "Lifestyle adjustment recommendation 1",
    "Lifestyle adjustment recommendation 2"
  ],
  "nutritionGuidance": [
    "Dietary recommendation 1",
    "Dietary recommendation 2"
  ],
  "followUpActions": [
    "Recommended follow-up action 1",
    "Recommended follow-up action 2"
  ],
  "overallRiskLevel": "Low|Medium|High",
  "disclaimer": "This analysis is for informational purposes only and does not constitute medical advice. Please consult your healthcare provider for proper diagnosis and treatment."
}

Provide 3-5 items for each array. Be specific, practical, and supportive.`;

    const userContent: any[] = [
      { type: "text", text: `Please analyze this medical report (${fileName || 'uploaded document'}) and provide a comprehensive wellness assessment with preventive guidance.` },
    ];

    // Add file as image for vision models
    if (fileType.startsWith('image/')) {
      userContent.push({
        type: "image_url",
        image_url: {
          url: `data:${fileType};base64,${fileContent}`,
        },
      });
    } else if (fileType === 'application/pdf') {
      // For PDFs, send as image_url with PDF mime type (Gemini supports this)
      userContent.push({
        type: "image_url",
        image_url: {
          url: `data:${fileType};base64,${fileContent}`,
        },
      });
    }

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
          { role: "user", content: userContent },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable. Please try again." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid AI response format");
    }

    const result = JSON.parse(jsonMatch[0]);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error analyzing report:", error);

    return new Response(JSON.stringify({
      reportSummary: "Unable to fully analyze the uploaded report. Please ensure the image is clear and readable.",
      healthConcerns: [
        { concern: "Report could not be fully analyzed", severity: "Low", details: "The system was unable to extract all information. Please try uploading a clearer image." }
      ],
      preventiveSteps: [
        "Consult with your healthcare provider about the report findings",
        "Keep copies of all medical reports for your records",
        "Schedule regular health check-ups"
      ],
      lifestyleCorrections: [
        "Maintain a balanced diet rich in fruits and vegetables",
        "Engage in regular physical activity",
        "Ensure adequate sleep (7-9 hours)"
      ],
      nutritionGuidance: [
        "Stay well hydrated throughout the day",
        "Reduce processed food intake"
      ],
      followUpActions: [
        "Share this report with your healthcare provider",
        "Schedule a follow-up appointment if needed"
      ],
      overallRiskLevel: "Low",
      disclaimer: "This analysis is for informational purposes only. Please consult your healthcare provider for proper diagnosis and treatment.",
      error: error instanceof Error ? error.message : "Analysis failed"
    }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
