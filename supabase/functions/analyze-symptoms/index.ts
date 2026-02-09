import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Symptom severity weights for risk calculation
const symptomWeights: Record<string, number> = {
  chest_pain: 0.9,
  shortness_breath: 0.85,
  palpitations: 0.75,
  dizziness: 0.6,
  fever: 0.5,
  headache: 0.4,
  fatigue: 0.35,
  nausea: 0.45,
  stomach_pain: 0.5,
  muscle_pain: 0.3,
  joint_pain: 0.35,
  cough: 0.4,
  sore_throat: 0.3,
  insomnia: 0.35,
  anxiety: 0.45,
  depression: 0.55,
  stress: 0.4,
  skin_rash: 0.35,
  allergies: 0.25,
  diarrhea: 0.4,
  weight_change: 0.5,
  appetite_loss: 0.45,
};

// Symptom co-occurrence patterns
const symptomClusters = [
  { symptoms: ['fever', 'cough', 'sore_throat', 'fatigue'], label: 'viral infection pattern', severity: 0.6 },
  { symptoms: ['chest_pain', 'shortness_breath', 'palpitations'], label: 'cardiovascular concern', severity: 0.95 },
  { symptoms: ['headache', 'dizziness', 'fatigue'], label: 'neurological/exhaustion pattern', severity: 0.5 },
  { symptoms: ['nausea', 'stomach_pain', 'diarrhea'], label: 'gastrointestinal distress', severity: 0.55 },
  { symptoms: ['anxiety', 'stress', 'insomnia'], label: 'stress-related pattern', severity: 0.5 },
  { symptoms: ['muscle_pain', 'joint_pain', 'fatigue'], label: 'musculoskeletal/systemic pattern', severity: 0.45 },
  { symptoms: ['depression', 'appetite_loss', 'insomnia', 'fatigue'], label: 'mental health pattern', severity: 0.7 },
];

function calculateBaseRisk(symptoms: string[]): number {
  let totalWeight = 0;
  symptoms.forEach(symptom => {
    totalWeight += symptomWeights[symptom] || 0.3;
  });
  
  // Normalize and apply co-occurrence bonus
  let baseRisk = Math.min(totalWeight / 2, 1);
  
  // Check for dangerous patterns
  symptomClusters.forEach(cluster => {
    const matchCount = cluster.symptoms.filter(s => symptoms.includes(s)).length;
    if (matchCount >= 2) {
      baseRisk = Math.max(baseRisk, cluster.severity * (matchCount / cluster.symptoms.length));
    }
  });
  
  return baseRisk;
}

function determineRiskLevel(score: number): 'low' | 'medium' | 'high' {
  if (score >= 0.7) return 'high';
  if (score >= 0.4) return 'medium';
  return 'low';
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { symptoms, userProfile } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Calculate base risk using rule-based approach
    const baseRiskScore = calculateBaseRisk(symptoms);
    const baseRiskLevel = determineRiskLevel(baseRiskScore);

    // Enhanced AI prompt for comprehensive analysis
    const systemPrompt = `You are an advanced health risk assessment AI. Analyze the given symptoms and provide a comprehensive, non-diagnostic assessment.

IMPORTANT RULES:
1. NEVER provide a medical diagnosis
2. NEVER name specific diseases or conditions
3. Focus on general wellness guidance
4. Always recommend professional consultation for concerning symptoms

Based on the symptoms provided, generate a response in the following JSON format:
{
  "riskLevel": "${baseRiskLevel}",
  "analysis": "A 2-3 sentence summary of the symptom assessment (be supportive and clear)",
  "possibleCauses": [
    { "cause": "Brief description of potential contributor", "confidence": "Low|Medium|High" }
  ],
  "immediateActions": ["Action 1", "Action 2"],
  "lifestyleChanges": ["Change 1", "Change 2"],
  "monitoringAdvice": ["What to track", "Signs to watch for"],
  "doctorTriggers": ["When to seek immediate care", "Warning signs"],
  "recommendations": ["General recommendation 1", "General recommendation 2"]
}

Provide 2-3 items for each array. Be specific but avoid medical terminology.`;

    const userMessage = `Analyze these symptoms: ${symptoms.join(", ")}
${userProfile ? `User context: Age ${userProfile.age || 'unknown'}, ${userProfile.gender || 'unspecified gender'}` : ''}
Pre-calculated risk score: ${(baseRiskScore * 100).toFixed(0)}%`;

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
          { role: "user", content: userMessage }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable. Please try again." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    
    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid AI response format");
    }
    
    const result = JSON.parse(jsonMatch[0]);

    // Ensure risk level matches our calculation
    result.riskLevel = baseRiskLevel;
    result.riskScore = Math.round(baseRiskScore * 100);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    
    // Fallback response with basic guidance
    return new Response(JSON.stringify({ 
      riskLevel: "medium",
      riskScore: 50,
      analysis: "Unable to complete full analysis. Based on the symptoms provided, we recommend monitoring your condition and consulting a healthcare professional if symptoms persist or worsen.",
      possibleCauses: [
        { cause: "Multiple factors may contribute to your symptoms", confidence: "Medium" },
        { cause: "Lifestyle or environmental factors", confidence: "Low" }
      ],
      immediateActions: [
        "Rest and stay hydrated",
        "Monitor symptom progression"
      ],
      lifestyleChanges: [
        "Ensure adequate sleep (7-9 hours)",
        "Maintain balanced nutrition"
      ],
      monitoringAdvice: [
        "Track when symptoms occur",
        "Note any patterns or triggers"
      ],
      doctorTriggers: [
        "Symptoms persist beyond 48-72 hours",
        "Symptoms significantly worsen",
        "New concerning symptoms develop"
      ],
      recommendations: [
        "Consult with a healthcare provider for proper evaluation",
        "Keep a symptom diary for your next medical visit"
      ]
    }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
