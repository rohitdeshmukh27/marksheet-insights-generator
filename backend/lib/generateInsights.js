import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

// Simple wrapper: prepare prompt and call Google Gemini
export async function generateInsights(stats) {
  // Extract only essential data to minimize tokens
  const structuredData = {
    totalStudents: stats.students?.length || 0,
    subjects: stats.subjectKeys || [],
    subjectAverages: stats.averages || {},
    topPerformers:
      stats.topPerformers?.slice(0, 3).map((s) => ({
        name: s.name,
        total: Math.round(s.total * 10) / 10,
        avg: Math.round(s.avg * 10) / 10,
      })) || [],
    bottomPerformers:
      stats.bottomPerformers?.slice(0, 3).map((s) => ({
        name: s.name,
        total: Math.round(s.total * 10) / 10,
        avg: Math.round(s.avg * 10) / 10,
      })) || [],
    weakSubjects:
      stats.weakSubjects?.map((w) => ({
        subject: w.subject,
        avg: Math.round(w.average * 10) / 10,
      })) || [],
    // Individual student subject performance (best and worst for each)
    studentInsights:
      stats.students?.map((student) => {
        const subjects = stats.subjectKeys || [];
        const scores = subjects
          .map((sub) => ({ subject: sub, score: student[sub] }))
          .filter((s) => s.score !== null && s.score !== undefined);

        scores.sort((a, b) => b.score - a.score);

        return {
          name: student.Student,
          best: scores[0]
            ? {
                subject: scores[0].subject,
                score: Math.round(scores[0].score * 10) / 10,
              }
            : null,
          worst: scores[scores.length - 1]
            ? {
                subject: scores[scores.length - 1].subject,
                score: Math.round(scores[scores.length - 1].score * 10) / 10,
              }
            : null,
        };
      }) || [],
  };

  // Build concise structured prompt
  const prompt = `You are an educational data analyst. Analyze the student performance data and return a comprehensive JSON report.

Data:
${JSON.stringify(structuredData, null, 2)}

Generate a JSON response with the following structure:

{
  "class_overview": {
    "total_students": number,
    "overall_average": number,
    "performance_distribution": {
      "excellent": number,  // >90%
      "good": number,       // 75-90%
      "average": number,    // 60-75%
      "needs_attention": number  // <60%
    },
    "summary": "2-3 sentence overview of class performance"
  },
  
  "subject_analysis": [
    {
      "subject": "subject name",
      "class_average": number,
      "highest_score": number,
      "lowest_score": number,
      "difficulty_rating": "easy|moderate|challenging",
      "trend": "strength|concern|neutral",
      "insight": "Brief explanation of subject performance"
    }
  ],
  
  "top_performers": [
    {
      "name": "student name",
      "overall_percentage": number,
      "rank": number,
      "strengths": ["subject1", "subject2"],
      "achievement_note": "What makes them stand out"
    }
  ],
  
  "students_needing_support": [
    {
      "name": "student name",
      "overall_percentage": number,
      "critical_subjects": ["subjects below 60%"],
      "intervention_priority": "high|medium",
      "recommended_action": "Specific suggestion"
    }
  ],
  
  "individual_insights": [
    {
      "name": "student name",
      "profile": "balanced|science-oriented|humanities-oriented|inconsistent",
      "strength_subjects": ["subject: score"],
      "improvement_areas": ["subject: score"],
      "personalized_tip": "One actionable recommendation",
      "growth_potential": "Prediction or encouragement based on pattern"
    }
  ],
  
  "subject_correlations": [
    {
      "observation": "Students strong in X tend to be strong/weak in Y",
      "subjects": ["subject1", "subject2"],
      "correlation_type": "positive|negative|neutral"
    }
  ],
  
  "class_recommendations": {
    "immediate_actions": [
      "Top 3 urgent interventions with specific steps"
    ],
    "teaching_strategies": [
      "2-3 pedagogical suggestions based on data patterns"
    ],
    "parent_communication_tips": [
      "2 key points to share with parents"
    ]
  },
  
  "hidden_insights": [
    "Unexpected patterns, outliers, or non-obvious observations that a human might miss"
  ],
  
  "motivational_highlights": [
    "Positive stories: most improved, consistent performers, subject champions"
  ]
}

Be specific with numbers, names, and actionable recommendations. Focus on insights that help teachers make decisions.`;

  // Get API key and model from environment
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-pro";

  if (!apiKey) {
    // If no API key provided, return a simple local summary
    console.log("⚠️ No Gemini API key found, using local summary");
    return simpleLocalSummary(stats);
  }

  try {
    console.log("🤖 Calling Gemini API with model:", model);

    // Initialize Google Generative AI
    const genAI = new GoogleGenerativeAI(apiKey);
    const geminiModel = genAI.getGenerativeModel({ model });

    // Generate content
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("✅ Gemini API response received");
    console.log("📄 Response preview:", text.substring(0, 200));

    // Try to parse as JSON, if it fails return the text as is
    try {
      // Remove markdown code blocks if present
      let cleanText = text
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();

      // Try to find JSON object
      const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        console.log("✅ Successfully parsed JSON response");
        return parsed;
      }
      console.log("⚠️ No JSON found, returning raw text");
      return { summary: text, student_insights: [], class_recommendations: [] };
    } catch (parseError) {
      console.log("⚠️ JSON parse error, returning raw text");
      return { summary: text, student_insights: [], class_recommendations: [] };
    }
  } catch (error) {
    console.error("Gemini API error:", error.message);
    return simpleLocalSummary(stats);
  }
}

function simpleLocalSummary(stats) {
  const top =
    stats.topPerformers
      ?.slice(0, 3)
      .map((t) => `${t.name} (${Math.round(t.total)})`)
      .join(", ") || "N/A";
  const weak =
    stats.weakSubjects && stats.weakSubjects.length
      ? stats.weakSubjects
          .map((w) => `${w.subject} (${Math.round(w.average)})`)
          .join(", ")
      : "None";

  const studentInsights =
    stats.students?.map((student) => {
      const subjects = stats.subjectKeys || [];
      const scores = subjects
        .map((sub) => ({ subject: sub, score: student[sub] }))
        .filter((s) => s.score !== null && s.score !== undefined);

      scores.sort((a, b) => b.score - a.score);
      const best = scores[0];
      const worst = scores[scores.length - 1];

      return `${student.Student}: Best at ${best?.subject} (${Math.round(
        best?.score
      )}), needs improvement in ${worst?.subject} (${Math.round(
        worst?.score
      )})`;
    }) || [];

  return {
    summary: `Class top performers: ${top}. Weak subjects: ${weak}.`,
    student_insights: studentInsights,
    class_recommendations: [
      `Focus on improving ${weak === "None" ? "advanced concepts" : weak}`,
      "Provide additional practice sessions for struggling students",
      "Recognize and encourage top performers",
    ],
  };
}
