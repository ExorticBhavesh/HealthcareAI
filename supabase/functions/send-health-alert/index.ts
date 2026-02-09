import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface HealthAlertRequest {
  userName: string;
  email: string;
  healthScore: number;
  riskLevel: string;
  symptoms: { category: string; items: string[] }[];
  wellnessInsights: { label: string; value: string; trend: string }[];
  recommendations: string[];
  reportDate: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!resendApiKey) {
      console.log("RESEND_API_KEY not configured - health alert email not sent");
      return new Response(
        JSON.stringify({
          success: false,
          message: "Email service not configured. Alert logged but email not sent.",
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const {
      userName,
      email,
      healthScore,
      riskLevel,
      symptoms,
      wellnessInsights,
      recommendations,
      reportDate,
    }: HealthAlertRequest = await req.json();

    if (!email || healthScore === undefined) {
      throw new Error("Missing required fields: email and healthScore");
    }

    const scoreColor = healthScore >= 65 ? "#22c55e" : healthScore >= 45 ? "#f59e0b" : "#ef4444";
    const riskBadgeColor = riskLevel === "Low" ? "#22c55e" : riskLevel === "Moderate" ? "#f59e0b" : "#ef4444";
    const riskBadgeBg = riskLevel === "Low" ? "#f0fdf4" : riskLevel === "Moderate" ? "#fffbeb" : "#fef2f2";

    const symptomsHtml = symptoms.length > 0
      ? symptoms.map(cat => `
        <div style="margin-bottom: 12px;">
          <p style="color: #475569; font-weight: 600; margin: 0 0 6px 0; font-size: 13px;">🏷️ ${cat.category}</p>
          <div style="display: flex; flex-wrap: wrap; gap: 6px;">
            ${cat.items.map(item => `<span style="display: inline-block; background: #f1f5f9; color: #334155; padding: 4px 10px; border-radius: 20px; font-size: 12px; border: 1px solid #e2e8f0;">${item}</span>`).join('')}
          </div>
        </div>
      `).join('')
      : '<p style="color: #94a3b8; font-size: 13px;">No recent symptom data available.</p>';

    const insightsHtml = wellnessInsights.length > 0
      ? wellnessInsights.map(insight => {
          const trendIcon = insight.trend === 'up' ? '📈' : insight.trend === 'down' ? '📉' : '➡️';
          return `
            <tr>
              <td style="padding: 10px 14px; border-bottom: 1px solid #f1f5f9; color: #475569; font-size: 13px;">${insight.label}</td>
              <td style="padding: 10px 14px; border-bottom: 1px solid #f1f5f9; font-weight: 600; color: #1e293b; font-size: 13px;">${insight.value}</td>
              <td style="padding: 10px 14px; border-bottom: 1px solid #f1f5f9; font-size: 13px;">${trendIcon}</td>
            </tr>
          `;
        }).join('')
      : '<tr><td colspan="3" style="padding: 14px; color: #94a3b8; font-size: 13px;">No lifestyle data available yet.</td></tr>';

    const recommendationsHtml = recommendations.map(rec => `
      <li style="padding: 8px 0; color: #475569; font-size: 13px; line-height: 1.5; border-bottom: 1px solid #f8fafc;">
        ✅ ${rec}
      </li>
    `).join('');

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Health Alert & Wellness Report</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="640" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
          
          <!-- Alert Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #dc2626 0%, #ef4444 50%, #f97316 100%); padding: 28px 32px; text-align: center;">
              <p style="color: rgba(255,255,255,0.9); margin: 0 0 4px 0; font-size: 14px; letter-spacing: 1px; text-transform: uppercase;">⚠️ Health Stability Alert</p>
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">Important Health Alert & Wellness Report</h1>
              <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0 0; font-size: 13px;">Wellness AI • ${reportDate}</p>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding: 28px 32px 16px;">
              <p style="color: #1e293b; font-size: 15px; margin: 0; line-height: 1.7;">
                Hello <strong>${userName || 'there'}</strong>,
              </p>
              <p style="color: #475569; font-size: 14px; margin: 12px 0 0 0; line-height: 1.7;">
                Our wellness monitoring system has identified that your health stability score has fallen below the recommended threshold.
              </p>
              <p style="color: #475569; font-size: 14px; margin: 10px 0 0 0; line-height: 1.7;">
                To help you better understand your current wellness status, we have included a personalized health summary report based on your recent data and symptom inputs.
              </p>
            </td>
          </tr>

          <!-- Disclaimer Banner -->
          <tr>
            <td style="padding: 0 32px 20px;">
              <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 10px; padding: 14px 16px;">
                <p style="color: #92400e; margin: 0; font-size: 13px; line-height: 1.5;">
                  ⚠️ <strong>Important:</strong> This information is for awareness purposes only and is not a medical diagnosis. We strongly encourage you to consult a qualified healthcare professional for further evaluation and guidance.
                </p>
              </div>
            </td>
          </tr>

          <!-- ═══ HEALTH REPORT START ═══ -->
          <tr>
            <td style="padding: 0 32px;">
              <div style="border: 2px solid #e2e8f0; border-radius: 14px; overflow: hidden;">
                
                <!-- Report Header -->
                <div style="background: linear-gradient(135deg, #14b8a6 0%, #22d3ee 100%); padding: 18px 20px; text-align: center;">
                  <h2 style="color: #ffffff; margin: 0; font-size: 18px; font-weight: 700;">📄 Personalized Health Summary Report</h2>
                </div>

                <!-- Section 1: Health Overview -->
                <div style="padding: 20px; border-bottom: 1px solid #f1f5f9;">
                  <h3 style="color: #1e293b; margin: 0 0 14px 0; font-size: 15px;">📊 Section 1: Health Overview</h3>
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td width="50%" style="text-align: center; padding: 12px;">
                        <div style="background: #f8fafc; border-radius: 12px; padding: 20px;">
                          <p style="color: #64748b; margin: 0 0 8px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Health Stability Score</p>
                          <div style="width: 80px; height: 80px; border-radius: 50%; background: ${scoreColor}; margin: 0 auto 8px; line-height: 80px; text-align: center;">
                            <span style="color: #ffffff; font-size: 28px; font-weight: 700;">${Math.round(healthScore)}</span>
                          </div>
                          <p style="color: #64748b; margin: 0; font-size: 12px;">out of 100</p>
                        </div>
                      </td>
                      <td width="50%" style="text-align: center; padding: 12px;">
                        <div style="background: #f8fafc; border-radius: 12px; padding: 20px;">
                          <p style="color: #64748b; margin: 0 0 8px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Risk Level</p>
                          <div style="display: inline-block; background: ${riskBadgeBg}; color: ${riskBadgeColor}; padding: 10px 24px; border-radius: 20px; font-size: 16px; font-weight: 700; border: 2px solid ${riskBadgeColor}40; margin-top: 16px;">
                            ${riskLevel === 'Low' ? '🟢' : riskLevel === 'Moderate' ? '🟡' : '🔴'} ${riskLevel}
                          </div>
                          <p style="color: #64748b; margin: 10px 0 0 0; font-size: 12px;">Current indicator</p>
                        </div>
                      </td>
                    </tr>
                  </table>
                </div>

                <!-- Section 2: Symptoms Summary -->
                <div style="padding: 20px; border-bottom: 1px solid #f1f5f9;">
                  <h3 style="color: #1e293b; margin: 0 0 14px 0; font-size: 15px;">🧠 Section 2: Symptoms Summary</h3>
                  ${symptomsHtml}
                </div>

                <!-- Section 3: Key Wellness Insights -->
                <div style="padding: 20px; border-bottom: 1px solid #f1f5f9;">
                  <h3 style="color: #1e293b; margin: 0 0 14px 0; font-size: 15px;">📈 Section 3: Key Wellness Insights</h3>
                  <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                    <tr style="background: #f8fafc;">
                      <th style="padding: 10px 14px; text-align: left; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #e2e8f0;">Metric</th>
                      <th style="padding: 10px 14px; text-align: left; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #e2e8f0;">Value</th>
                      <th style="padding: 10px 14px; text-align: left; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #e2e8f0;">Trend</th>
                    </tr>
                    ${insightsHtml}
                  </table>
                </div>

                <!-- Section 4: Recommended Actions -->
                <div style="padding: 20px; border-bottom: 1px solid #f1f5f9;">
                  <h3 style="color: #1e293b; margin: 0 0 14px 0; font-size: 15px;">✅ Section 4: Recommended Actions</h3>
                  <ul style="list-style: none; margin: 0; padding: 0;">
                    ${recommendationsHtml}
                  </ul>
                </div>

                <!-- Section 5: When to Seek Medical Help -->
                <div style="padding: 20px;">
                  <h3 style="color: #1e293b; margin: 0 0 14px 0; font-size: 15px;">⚠️ Section 5: When to Seek Medical Help</h3>
                  <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 10px; padding: 16px;">
                    <p style="color: #991b1b; margin: 0 0 10px 0; font-size: 13px; font-weight: 600;">Please consider consulting a healthcare professional if you experience:</p>
                    <ul style="color: #7f1d1d; margin: 0; padding-left: 18px; font-size: 13px; line-height: 1.8;">
                      <li>Persistent symptoms lasting more than a few days</li>
                      <li>Significant changes in sleep, appetite, or energy levels</li>
                      <li>Increasing stress or anxiety affecting daily activities</li>
                      <li>Any symptom that causes you concern</li>
                    </ul>
                    <p style="color: #991b1b; margin: 12px 0 0 0; font-size: 13px; line-height: 1.5;">
                      🩺 Remember: Early consultation often leads to better outcomes. Your wellbeing matters, and seeking help is a sign of strength, not weakness.
                    </p>
                  </div>
                </div>

              </div>
            </td>
          </tr>
          <!-- ═══ HEALTH REPORT END ═══ -->

          <!-- Closing -->
          <tr>
            <td style="padding: 24px 32px 16px;">
              <p style="color: #475569; font-size: 14px; margin: 0; line-height: 1.6;">
                Take care,<br>
                <strong style="color: #1e293b;">Wellness AI Team</strong>
              </p>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding: 0 32px 24px; text-align: center;">
              <a href="${Deno.env.get('SUPABASE_URL')?.replace('.supabase.co', '.lovable.app')}/dashboard" style="display: inline-block; background: linear-gradient(135deg, #14b8a6 0%, #22d3ee 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 600; font-size: 15px;">View Full Dashboard</a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: #f8fafc; padding: 20px 32px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #94a3b8; margin: 0; font-size: 11px; line-height: 1.6;">
                📌 <strong>Disclaimer:</strong> This report is generated for informational and wellness guidance purposes only and should not be considered a medical diagnosis.
              </p>
              <p style="color: #94a3b8; margin: 8px 0 0 0; font-size: 11px;">
                © 2024 Wellness AI. You can manage your notification preferences in your account settings.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "Wellness AI <noreply@wellnessai.app>",
        to: [email],
        subject: `Important Health Alert & Wellness Report – Wellness AI`,
        html: emailHtml,
      }),
    });

    const result = await emailResponse.json();

    if (!emailResponse.ok) {
      throw new Error(result.message || "Failed to send health alert email");
    }

    console.log("Health alert email with report sent successfully:", result);

    return new Response(
      JSON.stringify({ success: true, id: result.id }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in send-health-alert function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
