"use client"

import { useEffect, useState } from "react"
import VillageDashboardHero from "../components/VillageDashboardHero"
import { MapPin, ThumbsUp, MessageSquarePlus, TrendingUp, Landmark } from "lucide-react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "../config/axios"

export default function VDCommunity() {
  const { villageId } = useParams()
  const navigate = useNavigate()
  const [village, setVillage] = useState(null)
  const [commTitle, setCommTitle] = useState("")
  const [commDesc, setCommDesc] = useState("")
  const [editing, setEditing] = useState(false)

  const storedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null
  const user = storedUser ? JSON.parse(storedUser) : null
  const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null
  const isVillageAdmin = user?.role === "village-admin"

  useEffect(() => {
    let active = true
    async function load() {
      try {
        const { data } = await axios.get(`/api/v1/villages/${encodeURIComponent(villageId)}`)
        if (!active) return
        setVillage(data?.data || null)
        const meta = data?.data?.meta || {}
        setCommTitle(meta.communityTitle || "")
        setCommDesc(meta.communityDescription || "")
      } catch (e) {
        console.log("[v0] VDCommunity fetch error:", e?.message)
      }
    }
    if (villageId) load()
    return () => {
      active = false
    }
  }, [villageId])

  const saveCommunity = async () => {
    try {
      await axios.post(
        `/api/v1/villages/${encodeURIComponent(villageId)}/details`,
        { meta: { communityTitle: commTitle, communityDescription: commDesc } },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} },
      )
      alert("Community details updated.")
      setEditing(false)
    } catch (e) {
      console.log("[v0] VDCommunity save error:", e?.message)
      alert(e?.response?.data?.message || "Failed to update community details.")
    }
  }

  const statusPill = (s) => {
    if (s === "Acknowledged") return "bg-emerald-100 text-emerald-700"
    if (s === "Under Review") return "bg-amber-100 text-amber-700"
    return "bg-gray-100 text-gray-700"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <VillageDashboardHero />

      {/* Body */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-6 space-y-6">
        <div className="bg-white rounded-2xl border shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-gray-800">Community Details</h2>
            {isVillageAdmin &&
              (!editing ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditing(true)}
                    className="px-3 py-1.5 rounded bg-indigo-600 text-white text-xs hover:bg-indigo-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => navigate(`/village/${villageId}/add-event`)}
                    className="px-3 py-1.5 rounded bg-blue-600 text-white text-xs hover:bg-blue-700"
                  >
                    Post New Event
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditing(false)}
                    className="px-3 py-1.5 rounded border text-xs hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveCommunity}
                    className="px-3 py-1.5 rounded bg-emerald-600 text-white text-xs hover:bg-emerald-700"
                  >
                    Save
                  </button>
                </div>
              ))}
          </div>
          {!editing ? (
            <div className="text-sm text-gray-700 space-y-1">
              <p>
                <b>{commTitle || "—"}</b>
              </p>
              <p className="text-gray-600">{commDesc || "No community description yet."}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="text-xs text-gray-600">Title</label>
                <input
                  value={commTitle}
                  onChange={(e) => setCommTitle(e.target.value)}
                  className="mt-1 w-full h-10 rounded-xl border px-3 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600">Description</label>
                <textarea
                  rows={4}
                  value={commDesc}
                  onChange={(e) => setCommDesc(e.target.value)}
                  className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
                />
              </div>
            </div>
          )}
        </div>

        {/* Page heading + submit */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-800">Community Issues & Feedback</h2>
          <button
            onClick={() => navigate("/ReportNewIssue")}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700"
          >
            <MessageSquarePlus className="w-4 h-4" />
            Submit Issue
          </button>
        </div>

        {/* Issue list */}
        <div className="space-y-4">
          {village?.issues?.map((t) => (
            <div key={t.id} className="bg-white rounded-2xl border shadow-sm">
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900 truncate">{t.title}</h3>
                      <span className={`text-[11px] px-2 py-0.5 rounded-full ${statusPill(t.status)}`}>{t.status}</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-600">{t.description}</p>

                    <div className="mt-2 flex items-center gap-6 text-xs text-gray-700">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-500" />
                        {t.location}
                      </span>
                    </div>

                    <div className="mt-2 text-[11px] text-gray-500">
                      by <span className="text-gray-700">{t.author}</span>
                      <span className="mx-2">•</span>
                      {t.date}
                    </div>
                  </div>

                  {/* Upvotes */}
                  <button
                    className="inline-flex items-center gap-1 rounded-full border bg-white px-2 py-1 text-xs text-gray-700 hover:bg-gray-50"
                    aria-label="Upvote"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span className="font-medium">{t.votes}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom quick links */}
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
  )
}
