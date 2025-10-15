"use client"

import { useMemo, useState, Fragment, useEffect } from "react"
import axios from "../config/axios"
import { ChevronDown, Download, Check } from "lucide-react"
import { Listbox, Transition } from "@headlessui/react"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area } from "recharts"
import Footer from "../components/miniComponents/Footer"
import NavBar from "../components/miniComponents/NavBar"

export default function StateDashboard() {
  const [remoteStateData, setRemoteStateData] = useState(null)
  const [regions, setRegions] = useState([])
  useEffect(() => {
    ;(async () => {
      try {
        const { data } = await axios.get("/api/v1/state?code=JH")
        setRemoteStateData(data?.data || data)
        setRegions(Array.isArray(data?.regions) ? data.regions : Object.keys(data?.data || {}))
      } catch (e) {
        console.log("[v0] StateDashboard no data:", e?.message)
        setRemoteStateData({})
        setRegions([])
      }
    })()
  }, [])

  const [region, setRegion] = useState(regions[0])
  const data = remoteStateData?.[region] || null

  const perfChart = useMemo(
    () =>
      (data?.performance || []).map((d) => ({
        name: d.district,
        Certified: d.certified,
        "In Progress": d.progress,
      })),
    [data],
  )

  return (
    <div className="min-h-screen bg-gray-50 text-slate-800 pt-16">
      <NavBar />
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-6 space-y-6">
        {/* Header band */}
        <div className="bg-blue-700 text-white rounded-2xl shadow-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-lg font-semibold">{data?.header.title}</h1>
              <p className="text-xs text-blue-100">{data?.header.subtitle}</p>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-blue-100">Overall Readiness</div>
              <div className="text-2xl font-semibold">{data?.header.overall}%</div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <Kpi label="Districts" value={data?.header.districts} />
            <Kpi label="Total Villages" value={data?.header.totalVillages} />
            <Kpi label="Certified" value={data?.header.certified} />
            <Kpi label="In Progress" value={data?.header.inProgress} />
            <Kpi label="Budget Used" value={`${data?.header.budgetUsed}%`} stringValue />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="relative">
            <Listbox value={region} onChange={setRegion}>
              <Listbox.Button className="h-10 min-w-[160px] inline-flex items-center justify-between gap-2 rounded-2xl border border-blue-200 bg-white/60 px-3 text-sm text-gray-900 shadow-sm ring-2 ring-inset ring-blue-100 hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400">
                <span className="truncate">{region}</span>
                <ChevronDown className="w-4 h-4 text-gray-600" />
              </Listbox.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-75"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Listbox.Options className="absolute z-40 mt-2 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
                  {regions.map((r) => (
                    <Listbox.Option
                      key={r}
                      value={r}
                      className={({ active }) =>
                        [
                          "relative cursor-pointer select-none px-3 py-2 text-sm",
                          active ? "bg-gray-100" : "bg-white",
                          "text-gray-700",
                        ].join(" ")
                      }
                    >
                      {({ selected }) => (
                        <div className="flex items-center justify-between">
                          <span className="truncate">{r}</span>
                          {selected && <Check className="w-4 h-4 text-blue-600" />}
                        </div>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </Listbox>
          </div>

          <button className="inline-flex items-center gap-2 rounded-xl border bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>

        {/* Row: Performance + Trend */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* District-wise Performance */}
          <div className="bg-white rounded-2xl border shadow-sm">
            <div className="px-4 py-3 border-b text-sm font-semibold text-gray-800">District-wise Performance</div>
            <div className="p-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={perfChart} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                  <CartesianGrid stroke="#F1F5F9" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12, fill: "#64748B" }}
                    axisLine={{ stroke: "#E2E8F0" }}
                    tickLine={false}
                  />
                  <YAxis tick={{ fontSize: 12, fill: "#64748B" }} axisLine={{ stroke: "#E2E8F0" }} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E2E8F0" }} />
                  <Bar dataKey="Certified" fill="#22C55E" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="In Progress" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Monthly Progress Trend */}
          <div className="bg-white rounded-2xl border shadow-sm">
            <div className="px-4 py-3 border-b text-sm font-semibold text-gray-800">Monthly Progress Trend</div>
            <div className="p-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.monthlyTrend || []} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                  <defs>
                    <linearGradient id="c1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="c2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22C55E" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#F1F5F9" vertical={false} />
                  <XAxis
                    dataKey="m"
                    tick={{ fontSize: 12, fill: "#64748B" }}
                    axisLine={{ stroke: "#E2E8F0" }}
                    tickLine={false}
                  />
                  <YAxis tick={{ fontSize: 12, fill: "#64748B" }} axisLine={{ stroke: "#E2E8F0" }} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E2E8F0" }} />
                  <Area type="monotone" dataKey="certified" stroke="#3B82F6" fill="url(#c1)" strokeWidth={2} />
                  <Area type="monotone" dataKey="projects" stroke="#22C55E" fill="url(#c2)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="px-4 pb-4">
              <div className="flex items-center gap-6 text-xs text-gray-600">
                <span className="inline-flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-blue-500"></span> Certified
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-emerald-500"></span> Projects
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Service Gaps Across State */}
        <div className="bg-white rounded-2xl border shadow-sm">
          <div className="px-4 py-3 border-b text-sm font-semibold text-gray-800">Service Gaps Across State</div>
          <div className="p-4 space-y-3">
            {(data?.serviceGaps || []).map((g) => (
              <div key={g.name} className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-gray-600">
                  <span>{g.name}</span>
                  <span>
                    {g.val} villages ({g.pct})
                  </span>
                </div>
                <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full" style={{ width: `${(g.val / 100) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* District Rankings */}
        <div className="bg-white rounded-2xl border shadow-sm">
          <div className="px-4 py-3 border-b text-sm font-semibold text-gray-800">District Rankings</div>
          <div className="divide-y">
            {(data?.rankings || []).map((r) => (
              <div key={r.rank} className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-yellow-50 text-yellow-700 border text-xs font-semibold">
                    #{String(r.rank).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <div className="font-medium text-gray-900">{r.name}</div>
                    <div className="text-[11px] text-gray-500">{r.meta}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={tagClass(r.tag)}>{r.tag}</span>
                  <div className="text-right ml-2">
                    <div className="text-sm font-semibold text-gray-900">{r.score}%</div>
                    <div className="text-[11px] text-gray-500">Score</div>
                  </div>
                  <button className="rounded-lg border bg-white px-2 py-1 text-xs text-gray-700 hover:bg-gray-50">
                    ⋯
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

function Kpi({ label, value, stringValue = false }) {
  return (
    <div className="rounded-xl bg-white/10 text-white px-4 py-3">
      <div className="text-[11px] text-blue-100">{label}</div>
      <div className="text-lg font-semibold">{stringValue ? value : Number(value).toLocaleString()}</div>
    </div>
  )
}

function tagClass(tag) {
  if (tag === "Excellent") return "text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700"
  if (tag === "Good") return "text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700"
  return "text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-700"
}
