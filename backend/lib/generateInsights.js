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
  const prompt = `Analyze student performance and return JSON with these keys:
- summary: Brief class overview (2 sentences)
- student_insights: Array of insights for each student (format: "StudentName: strength in Subject (score), needs improvement in Subject (score)")
- class_recommendations: Array of 3 top recommendations for the class

Data:
${JSON.stringify(structuredData, null, 2)}

Return valid JSON only.`;

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
