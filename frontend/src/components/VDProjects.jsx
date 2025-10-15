import React from "react";
import VillageDashboardHero from "./VillageDashboardHero";
import { CalendarDays, IndianRupee, ChevronRight, TrendingUp, Landmark } from "lucide-react";
import Footer from "./miniComponents/Footer";

export default function VDProjects() {
  const projects = [
    {
      id: "P-001",
      title: "Primary Health Center Construction",
      category: "Health",
      summary: "Building new PHC with 10‑bed capacity",
      budgetCr: 0.45, // 45 Lakhs
      expected: "6/30/2025",
      progress: 45,
    },
    {
      id: "P-002",
      title: "Road Connectivity Improvement",
      category: "Public Works",
      summary: "Paving 3.2km village road with concrete",
      budgetCr: 0.65, // 65 Lakhs
      expected: "5/15/2025",
      progress: 30,
    },
    {
      id: "P-003",
      title: "Hand Pump Installation",
      category: "Water Supply",
      summary: "Installing 5 new hand pumps in uncovered areas",
      budgetCr: 0.38, // 38 Lakhs
      expected: "3/20/2025",
      progress: 80,
    },
  ];

  const chipStyle = (c) => {
    if (c === "Health") return "bg-sky-100 text-sky-700";
    if (c === "Public Works") return "bg-violet-100 text-violet-700";
    if (c === "Water Supply") return "bg-emerald-100 text-emerald-700";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <VillageDashboardHero />

      {/* Body */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-6 space-y-6">
        {/* Header row for list */}
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-gray-800">
            Ongoing Development Projects
          </div>
          <span className="text-xs text-gray-500">{projects.length} Active</span>
        </div>

        {/* Project cards */}
        <div className="space-y-4">
          {projects.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl border shadow-sm">
              <div className="p-4">
                {/* Top row */}
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900 truncate">
                        {p.title}
                      </h3>
                      <span className={`text-[11px] px-2 py-0.5 rounded-full ${chipStyle(p.category)}`}>
                        {p.category}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-600">{p.summary}</p>
                    <div className="mt-2 flex items-center gap-6 text-xs text-gray-700">
                      <span className="inline-flex items-center gap-1">
                        <IndianRupee className="w-3.5 h-3.5 text-gray-500" />
                        Budget: <span className="font-semibold">&nbsp;{Math.round(p.budgetCr * 100)} Lakhs</span>
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[11px] text-gray-500">Expected:</div>
                    <div className="flex items-center justify-end gap-1 text-xs text-gray-800">
                      <CalendarDays className="w-3.5 h-3.5 text-gray-500" />
                      <span className="font-medium">{p.expected}</span>
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>Progress</span>
                    <span>{p.progress}%</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full bg-gray-900 rounded-full"
                      style={{ width: `${p.progress}%` }}
                    />
                  </div>
                </div>

                {/* Footer row */}
                <div className="mt-3">
                  <button className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50">
                    View Details
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom quick links same as overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="group flex items-center justify-between rounded-2xl border bg-white shadow-sm hover:bg-emerald-50 px-4 py-4 transition">
            <div className="flex items-center gap-3">
              <span className="inline-flex w-8 h-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                <Landmark className="w-5 h-5" />
              </span>
              <div className="text-left">
                <div className="font-medium text-gray-900">Government Schemes</div>
                <div className="text-xs text-gray-600">Explore available schemes and benefits</div>
              </div>
            </div>
            <span className="text-emerald-600 group-hover:translate-x-0.5 transition">›</span>
          </button>

          <button className="group flex items-center justify-between rounded-2xl border bg-white shadow-sm hover:bg-blue-50 px-4 py-4 transition">
            <div className="flex items-center gap-3">
              <span className="inline-flex w-8 h-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                <TrendingUp className="w-5 h-5" />
              </span>
              <div className="text-left">
                <div className="font-medium text-gray-900">Village Progress</div>
                <div className="text-xs text-gray-600">Track development projects and growth</div>
              </div>
            </div>
            <span className="text-blue-600 group-hover:translate-x-0.5 transition">›</span>
          </button>
        </div>
      </div>
      {/* Footer */}
      <Footer/>
    </div>
  );
}
