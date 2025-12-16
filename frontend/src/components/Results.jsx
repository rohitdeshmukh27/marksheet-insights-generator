import React from "react";
import Charts from "./Charts";

export default function Results({ data }) {
  const { stats, insights } = data;

  // Parse insights if it's a string
  const parsedInsights =
    typeof insights === "string"
      ? { summary: insights, student_insights: [], class_recommendations: [] }
      : insights;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 mt-8">
      {/* Print Button */}
      <div className="flex justify-end print:hidden">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
            />
          </svg>
          Print / Save as PDF
        </button>
      </div>
      {/* Class Overview Section */}
      {parsedInsights.class_overview && (
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
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Class Overview</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-sm text-gray-600">Total Students</div>
              <div className="text-2xl font-bold text-blue-600">
                {parsedInsights.class_overview.total_students}
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-sm text-gray-600">Overall Average</div>
              <div className="text-2xl font-bold text-green-600">
                {parsedInsights.class_overview.overall_average?.toFixed(1)}%
              </div>
            </div>
            {parsedInsights.class_overview.performance_distribution && (
              <>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-sm text-gray-600">
                    Excellent (&gt;90%)
                  </div>
                  <div className="text-2xl font-bold text-purple-600">
                    {
                      parsedInsights.class_overview.performance_distribution
                        .excellent
                    }
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-sm text-gray-600">
                    Needs Attention (&lt;60%)
                  </div>
                  <div className="text-2xl font-bold text-orange-600">
                    {
                      parsedInsights.class_overview.performance_distribution
                        .needs_attention
                    }
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="bg-white rounded-lg p-5 shadow-sm">
            <p className="text-gray-700 leading-relaxed">
              {parsedInsights.class_overview.summary}
            </p>
          </div>
        </div>
      )}

      {/* Subject Analysis */}
      {parsedInsights.subject_analysis &&
        parsedInsights.subject_analysis.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-indigo-500">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-2xl">📚</span> Subject Analysis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {parsedInsights.subject_analysis.map((subject, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-bold text-gray-800">
                      {subject.subject}
                    </h4>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        subject.trend === "strength"
                          ? "bg-green-100 text-green-700"
                          : subject.trend === "concern"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {subject.trend}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Class Avg:</span>
                      <span className="font-semibold text-blue-600">
                        {subject.class_average?.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Highest:</span>
                      <span className="font-semibold text-green-600">
                        {subject.highest_score}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Lowest:</span>
                      <span className="font-semibold text-orange-600">
                        {subject.lowest_score}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Difficulty:</span>
                      <span className="font-semibold capitalize">
                        {subject.difficulty_rating}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-3 italic">
                    {subject.insight}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      {/* Top Performers & Students Needing Support - Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Top Performers */}
        {parsedInsights.top_performers &&
          parsedInsights.top_performers.length > 0 && (
            <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-green-500">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">🏆</span> Top Performers
              </h3>
              <div className="space-y-3">
                {parsedInsights.top_performers.map((student, idx) => (
                  <div
                    key={idx}
                    className="bg-green-50 rounded-lg p-4 hover:bg-green-100 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                          {student.rank || idx + 1}
                        </span>
                        <span className="font-bold text-gray-800">
                          {student.name}
                        </span>
                      </div>
                      <span className="text-lg font-bold text-green-600">
                        {student.overall_percentage?.toFixed(1)}%
                      </span>
                    </div>
                    {student.strengths && student.strengths.length > 0 && (
                      <div className="text-sm text-gray-600 mb-1">
                        <strong>Strengths:</strong>{" "}
                        {student.strengths.join(", ")}
                      </div>
                    )}
                    {student.achievement_note && (
                      <div className="text-sm text-gray-700 italic">
                        {student.achievement_note}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Students Needing Support */}
        {parsedInsights.students_needing_support &&
          parsedInsights.students_needing_support.length > 0 && (
            <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-orange-500">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">🤝</span> Students Needing Support
              </h3>
              <div className="space-y-3">
                {parsedInsights.students_needing_support.map((student, idx) => (
                  <div
                    key={idx}
                    className="bg-orange-50 rounded-lg p-4 hover:bg-orange-100 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-gray-800">
                        {student.name}
                      </span>
                      <div className="text-right">
                        <div className="text-lg font-bold text-orange-600">
                          {student.overall_percentage?.toFixed(1)}%
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            student.intervention_priority === "high"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {student.intervention_priority} priority
                        </span>
                      </div>
                    </div>
                    {student.critical_subjects &&
                      student.critical_subjects.length > 0 && (
                        <div className="text-sm text-gray-600 mb-1">
                          <strong>Critical subjects:</strong>{" "}
                          {student.critical_subjects.join(", ")}
                        </div>
                      )}
                    {student.recommended_action && (
                      <div className="text-sm text-gray-700 italic">
                        💡 {student.recommended_action}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
      </div>

      {/* Individual Insights */}
      {parsedInsights.individual_insights &&
        parsedInsights.individual_insights.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-purple-500">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-2xl">👤</span> Individual Student Insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {parsedInsights.individual_insights.map((student, idx) => (
                <div
                  key={idx}
                  className="bg-purple-50 rounded-lg p-4 hover:bg-purple-100 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-gray-800">{student.name}</h4>
                    <span className="text-xs px-2 py-1 rounded-full bg-purple-200 text-purple-800 capitalize">
                      {student.profile}
                    </span>
                  </div>
                  {student.strength_subjects &&
                    student.strength_subjects.length > 0 && (
                      <div className="text-sm mb-1">
                        <span className="text-green-600 font-semibold">
                          ✓ Strengths:
                        </span>
                        <div className="text-gray-700">
                          {student.strength_subjects.join(", ")}
                        </div>
                      </div>
                    )}
                  {student.improvement_areas &&
                    student.improvement_areas.length > 0 && (
                      <div className="text-sm mb-1">
                        <span className="text-orange-600 font-semibold">
                          ⚠ Improve:
                        </span>
                        <div className="text-gray-700">
                          {student.improvement_areas.join(", ")}
                        </div>
                      </div>
                    )}
                  {student.personalized_tip && (
                    <div className="text-sm text-gray-700 mt-2 p-2 bg-white rounded border-l-2 border-purple-400">
                      <strong>Tip:</strong> {student.personalized_tip}
                    </div>
                  )}
                  {student.growth_potential && (
                    <div className="text-xs text-gray-600 mt-2 italic">
                      🌱 {student.growth_potential}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      {/* Class Recommendations */}
      {parsedInsights.class_recommendations && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg shadow-lg p-6 border border-purple-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
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
              Recommendations
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {parsedInsights.class_recommendations.immediate_actions && (
              <div className="bg-white rounded-lg p-5 shadow-sm">
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="text-red-500">🚨</span> Immediate Actions
                </h3>
                <ul className="space-y-2">
                  {parsedInsights.class_recommendations.immediate_actions.map(
                    (action, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-gray-700 flex items-start gap-2"
                      >
                        <span className="text-red-500 font-bold">•</span>
                        <span>{action}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}

            {parsedInsights.class_recommendations.teaching_strategies && (
              <div className="bg-white rounded-lg p-5 shadow-sm">
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="text-blue-500">📖</span> Teaching Strategies
                </h3>
                <ul className="space-y-2">
                  {parsedInsights.class_recommendations.teaching_strategies.map(
                    (strategy, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-gray-700 flex items-start gap-2"
                      >
                        <span className="text-blue-500 font-bold">•</span>
                        <span>{strategy}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}

            {parsedInsights.class_recommendations.parent_communication_tips && (
              <div className="bg-white rounded-lg p-5 shadow-sm">
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="text-green-500">👨‍👩‍👧</span> Parent
                  Communication
                </h3>
                <ul className="space-y-2">
                  {parsedInsights.class_recommendations.parent_communication_tips.map(
                    (tip, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-gray-700 flex items-start gap-2"
                      >
                        <span className="text-green-500 font-bold">•</span>
                        <span>{tip}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Subject Correlations & Hidden Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {parsedInsights.subject_correlations &&
          parsedInsights.subject_correlations.length > 0 && (
            <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-teal-500">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">🔗</span> Subject Correlations
              </h3>
              <div className="space-y-3">
                {parsedInsights.subject_correlations.map((corr, idx) => (
                  <div key={idx} className="bg-teal-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          corr.correlation_type === "positive"
                            ? "bg-green-200 text-green-800"
                            : corr.correlation_type === "negative"
                            ? "bg-red-200 text-red-800"
                            : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        {corr.correlation_type}
                      </span>
                      <span className="text-sm text-gray-600">
                        {corr.subjects?.join(" ↔ ")}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{corr.observation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        {parsedInsights.hidden_insights &&
          parsedInsights.hidden_insights.length > 0 && (
            <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-amber-500">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">🔍</span> Hidden Insights
              </h3>
              <div className="space-y-3">
                {parsedInsights.hidden_insights.map((insight, idx) => (
                  <div
                    key={idx}
                    className="bg-amber-50 rounded-lg p-4 flex items-start gap-3"
                  >
                    <span className="text-amber-500 text-xl">💡</span>
                    <p className="text-sm text-gray-700 flex-1">{insight}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
      </div>

      {/* Motivational Highlights */}
      {parsedInsights.motivational_highlights &&
        parsedInsights.motivational_highlights.length > 0 && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg shadow-lg p-6 border border-yellow-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-2xl">⭐</span> Motivational Highlights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {parsedInsights.motivational_highlights.map((highlight, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🎉</span>
                    <p className="text-sm text-gray-700">{highlight}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      {/* Fallback for old format */}
      {!parsedInsights.class_overview && parsedInsights.summary && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-lg p-6 border border-blue-100">
          <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <span className="text-blue-500">📊</span> Summary
          </h3>
          <p className="text-gray-700 leading-relaxed">
            {parsedInsights.summary}
          </p>
        </div>
      )}

      {/* Basic Stats (from backend stats) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Performers (from stats) */}
        {stats.topPerformers &&
          stats.topPerformers.length > 0 &&
          !parsedInsights.top_performers && (
            <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-green-500">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">🏆</span> Top Performers (Stats)
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
          )}

        {/* Weak Subjects (from stats) */}
        {stats.weakSubjects &&
          stats.weakSubjects.length > 0 &&
          !parsedInsights.subject_analysis && (
            <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-orange-500">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">📚</span> Areas for Improvement
              </h3>
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
            </div>
          )}
      </div>

      {/* Charts */}
      <Charts stats={stats} />
    </div>
  );
}
