"use client"

import { useEffect, useMemo, useState, Fragment } from "react"
import axios from "../config/axios"
import { ChevronDown, Download, MapPin, Check } from "lucide-react"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { Listbox, Transition } from "@headlessui/react"
import NavBar from "../components/miniComponents/NavBar"
import Footer from "../components/miniComponents/Footer"

export default function TeshilDashboard() {
  const [remoteTehsils, setRemoteTehsils] = useState(null)
  useEffect(() => {
    ;(async () => {
      try {
        const { data } = await axios.get("/api/v1/tehsils?district=ranchi")
        setRemoteTehsils(Array.isArray(data?.data) ? data.data : data)
      } catch (e) {
        console.log("[v0] TehsilDashboard no data:", e?.message)
        setRemoteTehsils([])
      }
    })()
  }, [])

  const tehsils = remoteTehsils || []
  const [selectedId, setSelectedId] = useState(tehsils[0]?.id)
  const selected = useMemo(() => tehsils.find((t) => t.id === selectedId), [selectedId, tehsils])

  const chartData = useMemo(
    () =>
      (selected?.villages || []).map((v) => ({
        name: v.name,
        score: v.readiness,
      })),
    [selected],
  )

  const statusChip = (s) =>
    s === "Certified"
      ? "bg-emerald-100 text-emerald-700"
      : s === "In Progress"
        ? "bg-blue-100 text-blue-700"
        : "bg-rose-100 text-rose-700"

  return (
    <div className="min-h-screen bg-gray-50 text-slate-800 pt-16">
      {/* <NavBar /> */}
      <NavBar />

      {/* Body */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-6 space-y-6">
        {/* Header band */}
        <div className="relative">
          <div className="bg-gradient-to-r from-sky-600 to-emerald-500 rounded-2xl shadow-lg p-8 text-white overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-lg font-semibold">{selected?.name} Dashboard</h1>
                <p className="text-xs text-blue-100">{selected?.district} · Village-level monitoring</p>
              </div>
              <div className="text-right">
                <div className="text-[11px] text-blue-100">Total Score</div>
                <div className="text-2xl font-semibold">{selected?.totalScore}%</div>
              </div>
            </div>

            {/* KPIs */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <Kpi label="Total Villages" value={selected?.totalVillages} />
              <Kpi label="Certified" value={selected?.certified} />
              <Kpi label="In Progress" value={selected?.inProgress} />
              <Kpi label="Needs Work" value={selected?.needsWork} />
            </div>
          </div>
        </div>
        {/* Controls row */}
        <div className="flex items-center justify-between">
          {/* Tehsil select */}
          <div className="relative">
            <Listbox value={selectedId} onChange={setSelectedId}>
              {/* Trigger */}
              <Listbox.Button className="h-10 min-w-[160px] inline-flex items-center justify-between gap-2 rounded-2xl border border-blue-200 bg-white/60 px-3 text-sm text-gray-900 shadow-sm ring-2 ring-inset ring-blue-100 hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400">
                <span className="truncate">{tehsils.find((t) => t.id === selectedId)?.name}</span>
                <ChevronDown className="w-4 h-4 text-gray-600" />
              </Listbox.Button>

              {/* Menu */}
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
                  {tehsils.map((t) => (
                    <Listbox.Option
                      key={t.id}
                      value={t.id}
                      className={({ active, selected }) =>
                        [
                          "relative cursor-pointer select-none px-3 py-2 text-sm",
                          active ? "bg-gray-100" : "bg-white",
                          "text-gray-700",
                        ].join(" ")
                      }
                    >
                      {({ selected }) => (
                        <div className="flex items-center justify-between">
                          <span className="truncate">{t.name}</span>
                          {selected && <Check className="w-4 h-4 text-blue-600" />}
                        </div>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </Listbox>
          </div>

          {/* Export button slot */}
          <button className="inline-flex items-center gap-2 rounded-xl border bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>

        {/* Readiness chart */}
        <div className="bg-white rounded-2xl border shadow-sm">
          <div className="px-4 py-3 border-b text-sm font-semibold text-gray-800">Village Readiness Scores</div>
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
                <Tooltip
                  cursor={{ fill: "rgba(251,146,60,0.08)" }}
                  contentStyle={{ borderRadius: 12, border: "1px solid #E2E8F0" }}
                />
                <Bar dataKey="score" fill="#FB923C" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Village list */}
        <div className="bg-white rounded-2xl border shadow-sm">
          <div className="px-4 py-3 border-b text-sm font-semibold text-gray-800">Village List & Details</div>

          <div className="divide-y">
            {(selected?.villages || []).map((v) => (
              <div key={v.id} className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-orange-50 text-orange-600 border">
                    <MapPin className="w-4 h-4" />
                  </span>
                  <div className="min-w-0">
                    <div className="font-medium text-gray-900">{v.name}</div>
                    <div className="text-[11px] text-gray-500">
                      P: {v.population.toLocaleString()} · SC: {v.sc}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">{v.readiness}%</div>
                    <div className="text-[11px] text-gray-500">Readiness</div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${statusChip(v.status)}`}>{v.status}</span>
                  <button className="rounded-lg border bg-white px-2 py-1 text-xs text-gray-700 hover:bg-gray-50">
                    ⋯
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* <Footer /> */}
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
