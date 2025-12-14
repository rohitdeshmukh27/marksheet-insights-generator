import React from "react";
import Charts from "./Charts";

export default function Results({ data }) {
  const { stats, insights } = data;
  return (
    <div className="space-y-4">
      <div className="p-4 bg-white rounded shadow">
        <h2 className="font-semibold">Insights</h2>
        <pre className="whitespace-pre-wrap mt-2">
          {typeof insights === "string"
            ? insights
            : JSON.stringify(insights, null, 2)}
        </pre>
      </div>

      <div className="p-4 bg-white rounded shadow">
        <h2 className="font-semibold">Class Stats</h2>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div>
            <h3 className="font-medium">Top performers</h3>
            <ol className="list-decimal ml-6">
              {stats.topPerformers.map((t) => (
                <li key={t.name}>
                  {t.name} — {Math.round(t.total)}
                </li>
              ))}
            </ol>
          </div>
          <div>
            <h3 className="font-medium">Weak Subjects</h3>
            {stats.weakSubjects.length ? (
              <ul className="ml-4">
                {stats.weakSubjects.map((w) => (
                  <li key={w.subject}>
                    {w.subject} — {Math.round(w.average)}
                  </li>
                ))}
              </ul>
            ) : (
              <div>None detected</div>
            )}
          </div>
        </div>
      </div>

      <Charts stats={stats} />
    </div>
  );
}
