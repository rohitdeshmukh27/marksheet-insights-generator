import fs from "fs";
import pdf from "pdf-parse";

function linesToTable(lines) {
  // Very basic heuristic parser. You may need to adapt to your PDF layout.
  // Expects rows like: "Name Math English Science 78 90 85"
  const rows = [];
  for (const line of lines) {
    const parts = line
      .split(/\s{2,}|\t/)
      .map((p) => p.trim())
      .filter(Boolean);
    if (parts.length < 2) continue;
    rows.push(parts);
  }
  // If header exists, first row is headers
  if (rows.length < 2) return [];

  const headers = rows[0];
  const data = rows.slice(1).map((r) => {
    const obj = {};
    for (let i = 0; i < headers.length && i < r.length; i++) {
      obj[headers[i]] = r[i];
    }
    return obj;
  });
  return data;
}

export async function parsePDF(filepath) {
  const buffer = fs.readFileSync(filepath);
  const data = await pdf(buffer);
  const text = data.text || "";
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  // Try to turn lines into table rows
  const table = linesToTable(lines);
  // If table empty, attempt CSV-like parse
  if (table.length === 0) {
    // fallback: try to parse each line as CSV
    if (lines.length < 2) return [];

    // First line is header
    const headers = lines[0].split(",").map((c) => c.trim());

    // Remaining lines are data
    return lines.slice(1).map((line) => {
      const cols = line.split(",").map((c) => c.trim());
      const obj = {};
      headers.forEach((header, i) => {
        obj[header] = cols[i] || "";
      });
      return obj;
    });
  }
  return table;
}
