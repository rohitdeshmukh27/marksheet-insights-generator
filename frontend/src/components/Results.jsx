import React from "react";
import Charts from "./Charts";

export default function Results({ data }) {
  const { stats, insights } = data;

  // Parse insights if it's a string
  const parsedInsights =
    typeof insights === "string"
      ? { summary: insights, student_insights: [], class_recommendations: [] }
      : insights;

  return (
    <div className="space-y-6 mt-8">
      {/* AI Insights Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-lg p-6 border border-blue-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            AI-Powered Insights
          </h2>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-lg p-5 mb-4 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <span className="text-blue-500">📊</span> Summary
          </h3>
          <p className="text-gray-700 leading-relaxed">
            {parsedInsights.summary || "No summary available"}
          </p>
        </div>

        {/* Student Insights */}
        {parsedInsights.student_insights &&
          parsedInsights.student_insights.length > 0 && (
            <div className="bg-white rounded-lg p-5 mb-4 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <span className="text-green-500">👥</span> Student Performance
                Analysis
              </h3>
              <div className="space-y-2">
                {parsedInsights.student_insights.map((insight, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                      {idx + 1}
                    </span>
                    <p className="text-gray-700 flex-1">{insight}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Recommendations */}
        {parsedInsights.class_recommendations &&
          parsedInsights.class_recommendations.length > 0 && (
            <div className="bg-white rounded-lg p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <span className="text-purple-500">💡</span> Recommendations
              </h3>
              <ul className="space-y-2">
                {parsedInsights.class_recommendations.map((rec, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg"
                  >
                    <span className="text-purple-500 font-bold">•</span>
                    <span className="text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
      </div>

      {/* Class Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Performers */}
        <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-green-500">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-2xl">🏆</span> Top Performers
          </h3>
          <div className="space-y-3">
            {stats.topPerformers.map((student, idx) => (
              <div
                key={student.name}
                className="flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                    {idx + 1}
                  </span>
                  <span className="font-medium text-gray-800">
                    {student.name}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">
                    {Math.round(student.total)}
                  </div>
                  <div className="text-xs text-gray-500">Total Score</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weak Subjects */}
        <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-orange-500">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-2xl">📚</span> Areas for Improvement
          </h3>
          {stats.weakSubjects && stats.weakSubjects.length > 0 ? (
            <div className="space-y-3">
              {stats.weakSubjects.map((subject) => (
                <div
                  key={subject.subject}
                  className="flex items-center justify-between p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
                >
                  <span className="font-medium text-gray-800">
                    {subject.subject}
                  </span>
                  <div className="text-right">
                    <div className="text-lg font-bold text-orange-600">
                      {Math.round(subject.average)}
                    </div>
                    <div className="text-xs text-gray-500">Avg Score</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-8 text-gray-500">
              <div className="text-4xl mb-2">✨</div>
              <div>No weak subjects detected</div>
              <div className="text-sm">
                Great performance across all subjects!
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Charts */}
      <Charts stats={stats} />
    </div>
  );
}
