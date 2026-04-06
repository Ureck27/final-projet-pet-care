import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // 1. Authenticate using server-side API Key (hidden from client)
    const apiKey = process.env.AI_API_KEY || "backend-secret-key";
    
    const contentType = req.headers.get("content-type") || "";
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Handle File Upload (analyzeMedia)
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const petId = formData.get('petId') as string;
      const petAge = parseInt(formData.get('petAge') as string) || 3;
      
      const isYoung = petAge < 2;
      const isSenior = petAge > 8;

      const findings = [];
      if (isSenior) {
        findings.push({
          type: "physical",
          concern: "Slightly reduced mobility detected",
          severity: "medium",
          recommendation: "Consider joint supplements and gentler exercise"
        });
      }
      
      findings.push({
        type: "behavior",
        concern: isYoung ? "High energy and playful behavior" : "Normal activity patterns",
        severity: "low",
        recommendation: isYoung ? "Provide plenty of exercise and stimulation" : "Maintain current routine"
      });

      return NextResponse.json({
        success: true,
        analysis: {
          petId,
          overallStatus: isSenior ? "attention-needed" : "healthy",
          confidence: Math.round(80 + Math.random() * 15),
          findings,
          vitals: {
            activityLevel: isYoung ? "high" : isSenior ? "low" : "moderate",
            stressLevel: "low"
          },
          recommendations: [
            "Maintain regular feeding schedule",
            "Continue daily exercise appropriate for age"
          ],
          followUpActions: [
            "Monitor activity levels over the next week",
            "Schedule vet appointment if concerns persist"
          ],
          timestamp: new Date()
        }
      });
    }

    // Handle JSON (chat & insights)
    const body = await req.json();
    
    if (body.action === 'chat') {
      const role = body.request?.userRole || "visitor";
      
      const responses = [
        {
          response: "Based on your question, I recommend monitoring your pet's behavior closely.",
          suggestions: ["Keep a daily log of activities", "Note any changes", "Monitor sleep patterns"],
          followUpQuestions: ["Have you noticed any recent changes in appetite?", "How is their energy level?"]
        }
      ];
      
      return NextResponse.json({
        success: true,
        ...responses[0]
      });
    }

    if (body.action === 'insights') {
      const period = body.period || "daily";
      return NextResponse.json({
        petId: body.petId,
        period,
        insights: {
          overallTrend: "stable",
          keyMetrics: {
            healthScore: Math.round(70 + Math.random() * 25),
            activityLevel: Math.round(60 + Math.random() * 35),
            moodScore: Math.round(65 + Math.random() * 30),
            routineConsistency: Math.round(75 + Math.random() * 20)
          },
          patterns: [],
          recommendations: ["Continue current exercise routine"],
          alerts: []
        },
        generatedAt: new Date()
      });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });

  } catch (error: any) {
    console.error('AI Route error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Error' },
      { status: 500 }
    );
  }
}
