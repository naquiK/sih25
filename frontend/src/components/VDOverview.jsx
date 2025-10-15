"use client"

import { useEffect, useState } from "react"
import VillageDashboardHero from "./VillageDashboardHero"
import {
  CheckCircle2,
  TrendingUp,
  AlarmClock,
  Hospital,
  Droplets,
  Bolt,
  Route,
  GraduationCap,
  Home,
  Landmark,
} from "lucide-react"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import Footer from "./miniComponents/Footer"
import axios from "../config/axios"
import { useParams, useNavigate } from "react-router-dom"

export default function VDOverview() {
  const { villageId } = useParams()
  const navigate = useNavigate()

  const [village, setVillage] = useState(null)
  const [workers, setWorkers] = useState([])
  const [loading, setLoading] = useState(true)

  const [assignOpen, setAssignOpen] = useState(false)
  const [unassignedReports, setUnassignedReports] = useState([])
  const [loadingReports, setLoadingReports] = useState(false)
  const [selectedReport, setSelectedReport] = useState(null)
  const [assigning, setAssigning] = useState(false)

  const [editingStats, setEditingStats] = useState(false)
  const [populationInp, setPopulationInp] = useState("")
  const [employmentInp, setEmploymentInp] = useState("")
  const [literacyRateInp, setLiteracyRateInp] = useState("")
  const [scHouseholdsInp, setScHouseholdsInp] = useState("")

  const storedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null
  const user = storedUser ? JSON.parse(storedUser) : null
  const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null
  const isVillageAdmin = user?.role === "village-admin"

  useEffect(() => {
    let active = true
    async function fetchData() {
      setLoading(true)
      try {
        const vRes = await axios.get(`/api/v1/villages/${encodeURIComponent(villageId)}`)
        const wRes = await axios.get(`/api/v1/villages/${encodeURIComponent(villageId)}/workers`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        if (!active) return
        const vDoc = vRes.data?.data || null
        setVillage(vDoc)
        setWorkers(wRes.data?.data || [])

        if (vDoc) {
          setPopulationInp(String(vDoc.population ?? ""))
          const meta = vDoc.meta || {}
          setEmploymentInp(meta.employment != null ? String(meta.employment) : "")
          setLiteracyRateInp(meta.literacyRate != null ? String(meta.literacyRate) : "")
          setScHouseholdsInp(meta.scHouseholds != null ? String(meta.scHouseholds) : "")
        }
      } catch (e) {
        if (!active) return
        setVillage(null)
        setWorkers([])
        console.log("[v0] VDOverview data fetch error:", e?.message)
      } finally {
        if (active) setLoading(false)
      }
    }
    if (villageId) fetchData()
    return () => {
      active = false
    }
  }, [villageId])

  const openAssignModal = async () => {
    setAssignOpen(true)
    setSelectedReport(null)
    setLoadingReports(true)
    try {
      const { data } = await axios.get(`/api/v1/reports/unassigned`, {
        params: { village: villageId },
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      setUnassignedReports(data?.data || [])
    } catch (e) {
      console.log("[v0] VDOverview load unassigned error:", e?.message)
      setUnassignedReports([])
      alert("Failed to load unassigned reports.")
    } finally {
      setLoadingReports(false)
    }
  }

  const handleAssign = async (workerId) => {
    if (!selectedReport?._id) return
    setAssigning(true)
    try {
      await axios.post(`/api/v1/department/reports/${selectedReport._id}/assign`, {
        workerId,
      })
      setUnassignedReports((prev) => prev.filter((r) => r._id !== selectedReport._id))
      setSelectedReport(null)
      alert("Worker assigned successfully.")
    } catch (e) {
      console.log("[v0] VDOverview assign error:", e?.message)
      alert(e?.response?.data?.message || "Failed to assign worker.")
    } finally {
      setAssigning(false)
    }
  }

  const saveStats = async () => {
    if (!isVillageAdmin) return alert("Only village admins can update.")
    try {
      const payload = {
        population: populationInp !== "" ? Number(populationInp) : undefined,
        meta: {
          employment: employmentInp !== "" ? Number(employmentInp) : undefined,
          literacyRate: literacyRateInp !== "" ? Number(literacyRateInp) : undefined,
          scHouseholds: scHouseholdsInp !== "" ? Number(scHouseholdsInp) : undefined,
        },
      }
      Object.keys(payload.meta).forEach((k) => payload.meta[k] === undefined && delete payload.meta[k])
      if (payload.population === undefined) delete payload.population
      if (Object.keys(payload.meta).length === 0) delete payload.meta

      await axios.post(`/api/v1/villages/${encodeURIComponent(villageId)}/details`, payload, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      alert("Village stats updated.")
      setEditingStats(false)
    } catch (e) {
      console.log("[v0] saveStats error:", e?.message)
      alert(e?.response?.data?.message || "Failed to update village stats.")
    }
  }

  const gaps = [
    {
      name: "Education",
      hint: "Need 1 more primary school",
      value: 70,
      status: "medium",
      color: "bg-yellow-400",
      icon: <GraduationCap className="w-4 h-4" />,
    },
    {
      name: "Healthcare",
      hint: "No primary health center",
      value: 45,
      status: "critical",
      color: "bg-rose-500",
      icon: <Hospital className="w-4 h-4" />,
    },
    {
      name: "Sanitation",
      hint: "Good coverage",
      value: 85,
      status: "adequate",
      color: "bg-emerald-500",
      icon: <Home className="w-4 h-4" />,
    },
    {
      name: "Water Supply",
      hint: "2 hand pumps non-functional",
      value: 65,
      status: "medium",
      color: "bg-yellow-400",
      icon: <Droplets className="w-4 h-4" />,
    },
    {
      name: "Electricity",
      hint: "Good coverage",
      value: 90,
      status: "adequate",
      color: "bg-emerald-500",
      icon: <Bolt className="w-4 h-4" />,
    },
    {
      name: "Connectivity",
      hint: "Road needs repair",
      value: 40,
      status: "critical",
      color: "bg-rose-500",
      icon: <Route className="w-4 h-4" />,
    },
  ]

  const readiness = 67

  const infraData = [
    { name: "Schools", Current: 2, Target: 3 },
    { name: "Health", Current: 0.5, Target: 1 },
    { name: "Water", Current: 12, Target: 15 },
    { name: "Roads", Current: 5, Target: 8 },
  ]

  const statusBadge = (s) =>
    s === "adequate"
      ? "bg-emerald-100 text-emerald-700"
      : s === "medium"
        ? "bg-amber-100 text-amber-700"
        : "bg-rose-100 text-rose-700"

  return (
    <div className="min-h-screen bg-gray-50">
      <VillageDashboardHero />

      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border shadow-sm">
            <div className="px-4 py-3 border-b flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-semibold text-gray-900">Service Gap Summary</h3>
            </div>

            <div className="p-4 space-y-3">
              {gaps.map((g) => (
                <div key={g.name} className="rounded-xl border">
                  <div className="flex items-center justify-between px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 inline-flex items-center justify-center rounded-full border bg-white text-gray-700">
                        {g.icon || <AlarmClock className="w-4 h-4" />}
                      </span>
                      <span className="text-sm font-medium text-gray-800">{g.name}</span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${statusBadge(g.status)}`}>{g.status}</span>
                  </div>
                  <div className="px-3 pb-3">
                    <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div className={`h-full ${g.color} rounded-full`} style={{ width: `${g.value}%` }} />
                    </div>
                    <div className="mt-1.5 text-xs text-gray-500 flex items-center justify-between">
                      <span>{g.hint}</span>
                      <span>{g.value}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border shadow-sm">
            <div className="px-4 py-3 border-b flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-semibold text-gray-900">Adarsh Gram Readiness</h3>
            </div>

            <div className="p-6">
              <div className="mx-auto max-w-[360px]">
                <div className="relative mx-auto aspect-[2] w-full overflow-hidden rounded-t-full bg-gray-100">
                  <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-rose-200 via-amber-200 to-emerald-200" />
                  </div>
                  <div className="absolute left-1/2 top-[55%] h-[200%] w-[80%] -translate-x-1/2 rounded-full bg-white" />
                  <div
                    className="absolute left-1/2 bottom-0 h-[48%] w-0.5 origin-bottom bg-gray-700"
                    style={{
                      transform: `translateX(-50%) rotate(${(readiness / 100) * 180 - 90}deg)`,
                    }}
                  />
                </div>
                <div className="mt-3 text-center">
                  <div className="text-3xl font-bold text-gray-900">{readiness}%</div>
                  <p className="text-xs text-gray-500">Good progress towards Adarsh Gram status</p>
                  <div className="mt-2 flex items-center justify-center gap-4 text-[11px]">
                    <span className="inline-flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" /> 80%+ Ready
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-amber-500" /> 60–80% Progress
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-rose-500" /> &lt;60% Needs Work
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border shadow-sm">
          <div className="px-4 py-3 border-b flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Infrastructure Status</h3>
            <span className="text-xs text-gray-500">Schools · Health · Water · Roads</span>
          </div>
          <div className="p-6">
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={infraData} barCategoryGap={24} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                  <CartesianGrid stroke="#F1F5F9" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12, fill: "#64748B" }}
                    axisLine={{ stroke: "#E2E8F0" }}
                    tickLine={false}
                  />
                  <YAxis tick={{ fontSize: 12, fill: "#64748B" }} axisLine={{ stroke: "#E2E8F0" }} tickLine={false} />
                  <Tooltip
                    cursor={{ fill: "rgba(59,130,246,0.06)" }}
                    contentStyle={{ borderRadius: 12, border: "1px solid #E2E8F0" }}
                  />
                  <Bar dataKey="Current" fill="#2563EB" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="Target" fill="#CBD5E1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-3 text-xs text-gray-500">
              Current (blue) vs. target (gray). Replace with live data when available.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
          {loading ? (
            <div className="py-6 text-sm text-gray-500">Loading village data...</div>
          ) : (
            <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl border shadow-sm p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-900">Village Details</h3>
                  <div className="flex items-center gap-2">
                    {isVillageAdmin && (
                      <>
                        {!editingStats ? (
                          <button
                            className="px-3 py-1.5 rounded bg-indigo-600 text-white text-xs hover:bg-indigo-700"
                            onClick={() => setEditingStats(true)}
                          >
                            Edit Stats
                          </button>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setEditingStats(false)}
                              className="px-3 py-1.5 rounded border text-xs hover:bg-gray-50"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={saveStats}
                              className="px-3 py-1.5 rounded bg-emerald-600 text-white text-xs hover:bg-emerald-700"
                            >
                              Save Changes
                            </button>
                          </div>
                        )}
                        <button
                          className="px-3 py-1.5 rounded bg-blue-600 text-white text-xs hover:bg-blue-700"
                          onClick={() => navigate(`/village/${villageId}/add-event`)}
                        >
                          Post New Event
                        </button>
                      </>
                    )}
                    {!isVillageAdmin && (
                      <button
                        className="px-3 py-1.5 rounded bg-indigo-600 text-white text-xs hover:bg-indigo-700"
                        onClick={openAssignModal}
                      >
                        Assign Worker to Report
                      </button>
                    )}
                  </div>
                </div>

                {village ? (
                  !editingStats ? (
                    <div className="text-sm text-gray-700 space-y-1">
                      <p>
                        <b>Name:</b> {village.name}
                      </p>
                      <p>
                        <b>District:</b> {village.district}
                      </p>
                      <p>
                        <b>Population:</b> {village.population ?? "N/A"}
                      </p>
                      <p>
                        <b>Employment (%):</b> {village.meta?.employment ?? "N/A"}
                      </p>
                      <p>
                        <b>Literacy Rate (%):</b> {village.meta?.literacyRate ?? "N/A"}
                      </p>
                      <p>
                        <b>SC Households:</b> {village.meta?.scHouseholds ?? "N/A"}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-gray-600">Population</label>
                        <input
                          type="number"
                          value={populationInp}
                          onChange={(e) => setPopulationInp(e.target.value)}
                          className="mt-1 w-full h-10 rounded-xl border px-3 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-600">Employment (%)</label>
                        <input
                          type="number"
                          value={employmentInp}
                          onChange={(e) => setEmploymentInp(e.target.value)}
                          className="mt-1 w-full h-10 rounded-xl border px-3 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-600">Literacy Rate (%)</label>
                        <input
                          type="number"
                          value={literacyRateInp}
                          onChange={(e) => setLiteracyRateInp(e.target.value)}
                          className="mt-1 w-full h-10 rounded-xl border px-3 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-600">SC Households</label>
                        <input
                          type="number"
                          value={scHouseholdsInp}
                          onChange={(e) => setScHouseholdsInp(e.target.value)}
                          className="mt-1 w-full h-10 rounded-xl border px-3 text-sm"
                        />
                      </div>
                    </div>
                  )
                ) : (
                  <div className="text-sm text-gray-500">No details found.</div>
                )}
              </div>

              <div className="bg-white rounded-2xl border shadow-sm p-4">
                <h3 className="text-sm font-semibold mb-2">Workers in {villageId}</h3>
                {workers.length === 0 ? (
                  <p className="text-sm text-gray-500">No workers found for this village.</p>
                ) : (
                  <ul className="divide-y">
                    {workers.map((w) => (
                      <li key={w._id} className="py-2 flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{w.fullname}</div>
                          <div className="text-xs text-gray-500">
                            {w.department || "worker"} · {w.phone || w.email}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>

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

      <Footer />

      {assignOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-end md:items-center justify-center z-50">
          <div className="bg-white w-full md:w-[720px] max-h-[85vh] rounded-t-2xl md:rounded-2xl overflow-hidden shadow-xl">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h3 className="font-semibold">Assign Worker</h3>
              <button className="text-gray-600 hover:text-gray-900" onClick={() => setAssignOpen(false)}>
                Close
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-0">
              <div className="p-4 border-r">
                <h4 className="text-sm font-semibold mb-2">Unassigned Reports ({villageId})</h4>
                {loadingReports ? (
                  <p className="text-sm text-gray-500">Loading...</p>
                ) : unassignedReports.length === 0 ? (
                  <p className="text-sm text-gray-500">No pending unassigned reports.</p>
                ) : (
                  <ul className="divide-y">
                    {unassignedReports.map((r) => (
                      <li
                        key={r._id}
                        className={`py-2 cursor-pointer hover:bg-gray-50 px-2 ${selectedReport?._id === r._id ? "bg-gray-100" : ""}`}
                        onClick={() => setSelectedReport(r)}
                      >
                        <div className="text-sm font-medium">{r.category || "Issue"}</div>
                        <div className="text-xs text-gray-500 truncate">{r.description || r.location}</div>
                        <div className="text-xs text-gray-500">Urgency: {r.urgencylevel}</div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="p-4">
                <h4 className="text-sm font-semibold mb-2">Workers ({villageId})</h4>
                {selectedReport ? (
                  workers.length === 0 ? (
                    <p className="text-sm text-gray-500">No workers found.</p>
                  ) : (
                    <ul className="divide-y">
                      {workers.map((w) => (
                        <li key={w._id} className="py-2 flex items-center justify-between">
                          <div>
                            <div className="text-sm font-medium">{w.fullname}</div>
                            <div className="text-xs text-gray-500">
                              {w.department || "worker"} · {w.phone || w.email}
                            </div>
                          </div>
                          <button
                            disabled={assigning}
                            onClick={() => handleAssign(w._id)}
                            className={`px-3 py-1 rounded ${assigning ? "bg-gray-300" : "bg-emerald-600 hover:bg-emerald-700"} text-white`}
                          >
                            {assigning ? "Assigning..." : "Assign"}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )
                ) : (
                  <p className="text-sm text-gray-500">Select a report from the left to assign a worker.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
