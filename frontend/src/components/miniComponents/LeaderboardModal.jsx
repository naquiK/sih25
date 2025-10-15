import React from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { X } from "lucide-react";

export default function LeaderboardModal({
  open,
  onClose,
  title,                 // "Weekly Leaderboard" | "Monthly Leaderboard"
  subtitle,              // "Top contributors for this week/month"
  entries,               // [{ rank, name, avatar, issues, points, highlight? }]
  accent = "indigo",     // tailwind color prefix
}) {
  const accentBg = `bg-${accent}-50`;
  const accentText = `text-${accent}-700`;
  const accentPoints = `text-${accent}-600`;

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/40" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-2xl rounded-2xl bg-white p-4 sm:p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold text-gray-900">
              {title}
            </DialogTitle>
            <button
              onClick={onClose}
              aria-label="Close"
              className="p-2 rounded hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {subtitle ? (
            <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
          ) : null}

          {/* List */}
          <div role="list" className="mt-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {entries.map((e) => (
              <div
                key={e.rank}
                role="listitem"
                className={`rounded-2xl border ${e.highlight ? `bg-${accent}-50/60` : "bg-white"} p-3 sm:p-4 flex items-center justify-between`}
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  {/* Rank badge */}
                  <span
                    className={`inline-flex items-center justify-center w-9 h-9 rounded-full ${
                      e.rank === 1
                        ? "bg-amber-400 text-white"
                        : e.rank === 2
                        ? "bg-gray-200 text-gray-800"
                        : e.rank === 3
                        ? "bg-orange-400 text-white"
                        : "bg-gray-100 text-gray-600"
                    } text-sm font-semibold`}
                  >
                    #{e.rank}
                  </span>

                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-yellow-100 to-rose-100 flex items-center justify-center text-xl">
                    {e.avatar}
                  </div>

                  {/* Name + issues */}
                  <div>
                    <div className="font-medium text-gray-900">{e.name}</div>
                    <div className="text-xs text-gray-500">{e.issues} issues</div>
                  </div>
                </div>

                {/* Points */}
                <div className="text-right">
                  <div className={`text-lg font-semibold ${accentPoints}`}>{e.points}</div>
                  <div className="text-xs text-gray-500">points</div>
                </div>
              </div>
            ))}
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
