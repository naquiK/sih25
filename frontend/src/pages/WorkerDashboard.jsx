"use client"

import { useEffect, useState } from "react"
import axios from "../config/axios"
import {
  Bell,
  AlertTriangle,
  MapPin,
  Clock,
  Gauge,
  Activity,
  CheckCircle2,
  BellIcon,
  TrendingUp,
  Landmark,
} from "lucide-react"
import NavBar from "../components/miniComponents/NavBar"
import Footer from "../components/miniComponents/Footer"
import TaskUpdateModal from "../components/miniComponents/TaskUpdateModal"

export default function WorkerDashboard() {
  const [open, setOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)

  // State for live data with fallback
  const [summary, setSummary] = useState({ activeTasks: 0, overdue: 0, villagesAssigned: 0, syncStatus: "Offline" })
  const [notifications, setNotifications] = useState([])
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    if (!token) return // stay on mock if not logged in
    ;(async () => {
      try {
        const [s, n, t] = await Promise.all([
          axios.get("/api/v1/worker/summary", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("/api/v1/worker/notifications", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("/api/v1/worker/tasks", { headers: { Authorization: `Bearer ${token}` } }),
        ])
        setSummary(s.data?.data || summary)
        setNotifications(
          (n.data?.data || []).map((x, i) => ({
            id: x.id || `N-${i}`,
            icon: <Bell className="w-4 h-4 text-blue-600" />,
            title: x.title,
            time: x.time,
          })),
        )
        setTasks(t.data?.data || [])
      } catch (err) {
        console.error("Failed to fetch worker dashboard:", err)
      }
    })()
  }, [])

  const priorityBadge = (p) =>
    p === "High"
      ? "bg-rose-100 text-rose-700"
      : p === "Medium"
        ? "bg-amber-100 text-amber-700"
        : "bg-emerald-100 text-emerald-700"

  const statusBadge = (s) =>
    s === "In Progress"
      ? "bg-blue-100 text-blue-700"
      : s === "Pending"
        ? "bg-gray-100 text-gray-700"
        : s === "Overdue"
          ? "bg-rose-100 text-rose-700"
          : "bg-emerald-100 text-emerald-700"

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="pt-16">
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-6 space-y-6">
          {/* Summary KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard
              label="Active Tasks"
              value={summary.activeTasks}
              ring="ring-amber-200"
              icon={<Activity className="w-4 h-4 text-amber-600" />}
            />
            <KpiCard
              label="Overdue"
              value={summary.overdue}
              ring="ring-rose-300"
              icon={<AlertTriangle className="w-4 h-4 text-rose-600" />}
            />
            <KpiCard
              label="Villages Assigned"
              value={summary.villagesAssigned}
              ring="ring-emerald-300"
              icon={<MapPin className="w-4 h-4 text-emerald-600" />}
            />
            <KpiCard
              label="Sync Status"
              value={summary.syncStatus}
              ring="ring-blue-300"
              icon={<CheckCircle2 className="w-4 h-4 text-blue-600" />}
              stringValue
            />
          </div>

          {/* Recent Notifications */}
          <div className="bg-white border rounded-2xl shadow-sm">
            <div className="px-4 py-3 border-b text-sm font-semibold text-gray-800">
              <BellIcon className="w-4 h-4 inline-block mr-2" />
              Recent Notifications
            </div>
            <div className="divide-y">
              {notifications.map((n) => (
                <div key={n.id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50">
                  <span className="shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-lg bg-gray-100">
                    {n.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-800 truncate">{n.title}</div>
                    <div className="text-[11px] text-gray-500">{n.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* My Tasks */}
          <div className="bg-white border rounded-2xl shadow-sm">
            <div className="px-4 py-3 border-b flex items-center justify-between">
              <div className="text-sm font-semibold text-gray-800">
                <AlertTriangle className="w-4 h-4 inline-block mr-2" />
                My Tasks
              </div>
            </div>

            <div className="p-4 space-y-4">
              {tasks.map((t) => (
                <div key={t.id} className={`rounded-2xl border shadow-sm`}>
                  <div className="p-4">
                    {/* Heading with chips */}
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900">{t.title}</h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${priorityBadge(t.priority)}`}>
                        {t.priority}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${statusBadge(t.status)}`}>
                        {t.status}
                      </span>
                    </div>

                    {/* Meta row */}
                    <div className="mt-2 flex flex-wrap items-center gap-4 text-[11px] text-gray-600">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-500" />
                        {t.village}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Gauge className="w-3.5 h-3.5 text-gray-500" />
                        {t.distanceKm} km
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-gray-500" />
                        Due: {t.due}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="mt-2 text-xs text-gray-600">{t.description}</p>

                    {/* Progress */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>Progress</span>
                        <span>{t.progress}%</span>
                      </div>
                      <div className="mt-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className={`h-full ${t.progress > 0 ? "bg-gray-900" : "bg-gray-300"} rounded-full`}
                          style={{ width: `${t.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Update button */}
                    <div className="mt-3">
                      <button
                        onClick={() => {
                          setSelectedTask(t)
                          setOpen(true)
                        }}
                        className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Update Task
                        <span aria-hidden>›</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom quick links (optional) */}
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
      </div>
      <TaskUpdateModal open={open} onClose={() => setOpen(false)} task={selectedTask || {}} />
      <Footer />
    </div>
  )
}

function KpiCard({ label, value, ring, icon, stringValue = false }) {
  return (
    <div className={`bg-white rounded-2xl border shadow-sm px-4 py-3 flex items-center justify-between ring-1 ${ring}`}>
      <div>
        <div className="text-xs text-gray-500">{label}</div>
        <div className="text-xl font-semibold text-gray-900">
          {stringValue ? value : Number(value).toLocaleString()}
        </div>
      </div>
      <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-50">{icon}</span>
    </div>
  )
}
