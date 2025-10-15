"use client"

import { useEffect, useMemo, useState, Fragment } from "react"
import axios from "../config/axios"
import { ChevronDown, Download, Check } from "lucide-react"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { Listbox, Transition } from "@headlessui/react"
import NavBar from "../components/miniComponents/NavBar"
import Footer from "../components/miniComponents/Footer"

export default function DistrictDashboard() {
  const [remoteDistricts, setRemoteDistricts] = useState(null)
  useEffect(() => {
    ;(async () => {
      try {
        const { data } = await axios.get("/api/v1/districts?state=JH")
        setRemoteDistricts(Array.isArray(data?.data) ? data.data : data)
      } catch (e) {
        console.log("[v0] DistrictDashboard no data:", e?.message)
        setRemoteDistricts([])
      }
    })()
  }, [])

  const districts = remoteDistricts || []
  const [selectedId, setSelectedId] = useState(districts[0]?.id)
  const selected = useMemo(() => districts.find((d) => d.id === selectedId), [selectedId, districts])

  const chartData = useMemo(
    () =>
      (selected?.performance || []).map((row) => ({
        name: row.tehsil,
        Certified: row.certified,
        "In Progress": row.progress,
      })),
    [selected],
  )

  return (
    <div className="min-h-screen bg-gray-50 text-slate-800 pt-16">
      <NavBar />
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-6 space-y-6">
        <div className="bg-gradient-to-r from-sky-600 to-indigo-600 rounded-2xl shadow-lg p-8 text-white">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-lg font-semibold">{selected?.name}</h1>
              <p className="text-xs text-blue-100">{selected?.stateLine}</p>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-blue-100">District Score</div>
              <div className="text-2xl font-semibold">{selected?.districtScore}%</div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Kpi label="Total Tehsils" value={selected?.totalTehsils} />
            <Kpi label="Total Villages" value={selected?.totalVillages} />
            <Kpi label="Certified" value={selected?.certified} />
            <Kpi label="In Progress" value={selected?.inProgress} />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="relative">
            <Listbox value={selectedId} onChange={setSelectedId}>
              <Listbox.Button className="h-10 min-w-[160px] inline-flex items-center justify-between gap-2 rounded-2xl border border-blue-200 bg-white/60 px-3 text-sm text-gray-900 shadow-sm ring-2 ring-inset ring-blue-100 hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400">
                <span className="truncate">
                  {districts.find((d) => d.id === selectedId)?.name.replace(" District", "")}
                </span>
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
                  {districts.map((d) => (
                    <Listbox.Option
                      key={d.id}
                      value={d.id}
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
                          <span className="truncate">{d.name.replace(" District", "")}</span>
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
            Export
          </button>
        </div>
        <div className="bg-white rounded-2xl border shadow-sm">
          <div className="px-4 py-3 border-b text-sm font-semibold text-gray-800">Tehsil-wise Performance</div>
          <div className="p-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
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
          <div className="px-4 pb-4">
            <div className="flex items-center gap-6 text-xs text-gray-600">
              <span className="inline-flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-emerald-500"></span> Certified
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-blue-500"></span> In Progress
              </span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border shadow-sm">
          <div className="px-4 py-3 border-b text-sm font-semibold text-gray-800">Tehsil Rankings</div>
          <div className="divide-y">
            {(selected?.rankings || []).map((r) => (
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
                <div className="flex items-center gap-3">
                  <div className="text-right">
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

function Kpi({ label, value }) {
  return (
    <div className="rounded-xl bg-white/10 text-white px-4 py-3">
      <div className="text-[11px] text-blue-100">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  )
}
