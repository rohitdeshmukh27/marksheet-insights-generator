import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

// Simple wrapper: prepare prompt and call LLM provider
export async function generateInsights(stats) {
  // Build short structured prompt
  const prompt = `You are an assistant that summarizes student performance.
Return JSON with keys: summary, top_insights (array), recommendations (array).


Input DATA:
${JSON.stringify(stats, null, 2)}


Produce concise, actionable insights.`;

  // -------------------------
  // Example: call Groq REST API (pseudo) -- replace with actual SDK as needed
  // -------------------------
  const apiKey = process.env.GROQ_API_KEY;
  const model = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

  if (!apiKey) {
    // If no API key provided, return a simple local summary
    return simpleLocalSummary(stats);
  }

  // Example POST to Groq or alternative. Adjust to actual provider's endpoint & shape.
  const body = {
    model,
    input: prompt,
    max_tokens: 800,
  };

  const resp = await fetch("https://api.groq.com/v1/outputs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const txt = await resp.text();
    console.error("LLM error", txt);
    return simpleLocalSummary(stats);
  }

  const data = await resp.json();

  // Attempt to extract text (depends on provider response shape)
  const outputText =
    data?.outputs?.[0]?.content?.[0]?.text || JSON.stringify(data);
  return outputText;
}

function simpleLocalSummary(stats) {
  const top = stats.topPerformers
    .slice(0, 3)
    .map((t) => `${t.name} (${Math.round(t.total)})`)
    .join(", ");
  const weak =
    stats.weakSubjects && stats.weakSubjects.length
      ? stats.weakSubjects
          .map((w) => `${w.subject} (${Math.round(w.average)})`)
          .join(", ")
      : "None";

  return `Summary: Class top performers: ${top}. Weak subjects: ${weak}. Recommendations: Focus on ${
    weak === "None"
      ? "higher order thinking"
      : stats.weakSubjects.map((w) => w.subject).join(", ")
  }.`;
}
