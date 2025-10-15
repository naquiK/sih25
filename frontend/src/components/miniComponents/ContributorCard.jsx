import React from "react";
import { Award } from "lucide-react";

export default function ContributorCard({
  period = "week",                 // 'week' | 'month'
  periodTag = "This Week",
  title = "Weekly Top Contributor",
  name,
  role,
  points,
  avatar = "🧑",
  total,
  unsolved,                        // renamed from reported
  resolved,
  ctaText = "View Full Leaderboard",
  onCta = () => {},
}) {
  const isWeek = period === "week";

  // Colors per period
  const headerGrad = isWeek
    ? "from-blue-50 to-cyan-50"
    : "from-fuchsia-50 to-purple-50";
  const tagColors = isWeek
    ? "bg-blue-100 text-blue-700"
    : "bg-fuchsia-100 text-fuchsia-700";
  const ctaGrad = isWeek
    ? "from-blue-600 to-blue-700"
    : "from-fuchsia-600 to-purple-600";

  return (
    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
      {/* Top strip gradient */}
      <div className={`h-12 w-full bg-gradient-to-r ${headerGrad} flex items-center justify-between px-4`}>
        <div className="flex items-center gap-2 text-gray-800">
          <Award className={`w-4 h-4 ${isWeek ? "text-blue-600" : "text-fuchsia-600"}`} />
          <span className="text-sm font-medium">{title}</span>
        </div>
        <span className={`text-xs px-3 py-1 rounded-full ${tagColors}`}>{periodTag}</span>
      </div>

      {/* Body */}
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-100 to-rose-100 flex items-center justify-center text-3xl">
              {avatar}
            </div>
            <div>
              <div className="text-xl font-semibold text-gray-900">{name}</div>
              <div className={`${isWeek ? "text-blue-700" : "text-fuchsia-700"} text-sm`}>
                {role}
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className={`text-3xl font-bold ${isWeek ? "text-blue-700" : "text-fuchsia-700"}`}>
              {points}
            </div>
            <div className="text-xs text-gray-500">Points</div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="rounded-xl bg-gray-50 py-4 text-center">
            <div className="text-xl font-semibold text-gray-900">{total}</div>
            <div className="text-xs text-gray-500">Total</div>
          </div>

          <div className="rounded-xl bg-emerald-50 py-4 text-center">
            <div className="text-xl font-semibold text-emerald-700">{unsolved}</div>
            <div className="text-xs text-emerald-700">Unsolved</div>
          </div>

          <div className="rounded-xl bg-orange-50 py-4 text-center">
            <div className="text-xl font-semibold text-orange-700">{resolved}</div>
            <div className="text-xs text-orange-700">Resolved</div>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={onCta}
          className={`mt-6 w-full rounded-xl py-3 text-white font-medium shadow-sm bg-gradient-to-r ${ctaGrad} hover:opacity-95 transition`}
        >
          {ctaText}
        </button>
      </div>
    </div>
  );
}
