"use client"

import { useEffect, useMemo, useState } from "react"
import { NavLink } from "react-router-dom"
import { Plus, MessageSquare, MapPin, Calendar, ArrowRight } from "lucide-react"
import NavBar from "../components/miniComponents/NavBar"
import Footer from "../components/miniComponents/Footer"
import ViewMoreModal from "../components/miniComponents/ViewMoreModal"
import SearchAndFilter from "../components/miniComponents/SearchAndFilter"
import axios from "../config/axios"
import ContributorCard from "../components/miniComponents/ContributorCard"
import LeaderboardModal from "../components/miniComponents/LeaderboardModal"

export default function CitizenDashboard() {
  const [citizenData, setCitizenData] = useState(null)
  const [open, setOpen] = useState(false)
  const [openWeekly, setOpenWeekly] = useState(false)
  const [openMonthly, setOpenMonthly] = useState(false)

  // State for weekly/monthly leaderboards
  const [weeklyEntries, setWeeklyEntries] = useState([])
  const [monthlyEntries, setMonthlyEntries] = useState([])

  // Static mock data
  const staticData = {
    stats: [
      { label: "My Reports", value: 12, color: "text-blue-600" },
      { label: "Resolved Issues", value: 8, color: "text-green-600" },
      { label: "Avg Response Time", value: "2.5 days", color: "text-orange-600" },
    ],
    issues: [
      {
        id: "AGBP01",
        title: "Water supply interruption",
        desc: "No water supply for 3 days in Sonbarsa village",
        location: "Sonbarsa Village, Kanke Block",
        category: "Water Supply",
        status: "In Progress",
        updated: "2024-04-15",
      },
      {
        id: "AGBP02",
        title: "School building repair needed",
        desc: "Roof leakage in primary school during monsoon",
        location: "Sonbarsa Village Primary School",
        category: "Education",
        status: "Resolved",
        updated: "2024-04-12",
      },
      {
        id: "AGBP03",
        title: "Rural road condition",
        desc: "Village connecting road damaged, difficult access",
        location: "Sonbarsa Village Road",
        category: "Roads & Connectivity",
        status: "Open",
        updated: "2024-04-10",
      },
      {
        id: "AGBP04",
        title: "Health center equipment",
        desc: "Basic medical equipment missing in village health center",
        location: "Primary Health Center",
        category: "Healthcare",
        status: "Under Review",
        updated: "2024-04-08",
      },
      {
        id: "AGBP05",
        title: "Electricity supply issues",
        desc: "Frequent power cuts affecting entire village",
        location: "Entire Village",
        category: "Electricity",
        status: "In Progress",
        updated: "2024-04-06",
      },
    ],
  }

  // 🔹 API integration
  useEffect(() => {
    const token = localStorage.getItem("authToken")
    if (!token) return // fallback to static
    ;(async () => {
      try {
        const res = await axios.get(`/api/v1/citizen/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const payload = res.data?.data
        if (payload) {
          setCitizenData({
            stats: [
              { label: "My Reports", value: payload.stats.myReports, color: "text-blue-600" },
              { label: "Resolved Issues", value: payload.stats.resolved, color: "text-green-600" },
              { label: "Avg Response Time", value: `${payload.stats.avgResponseDays} days`, color: "text-orange-600" },
            ],
            issues: (payload.issues || []).map((i) => ({
              id: String(i.id).slice(-6).toUpperCase(),
              title: i.title,
              desc: i.desc,
              location: i.location,
              category: i.category,
              status: i.status,
              updated: i.updated,
            })),
          })
        } else {
          setCitizenData({ stats: [], issues: [] })
        }
      } catch (e) {
        setCitizenData({ stats: [], issues: [] })
        console.error("Failed to load citizen dashboard:", e)
      }
    })()
  }, [])

  // Load leaderboards dynamically
  useEffect(() => {
    const token = localStorage.getItem("authToken")
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined
    ;(async () => {
      try {
        // Prefer scoping by user's village (if known in localStorage)
        const village = localStorage.getItem("userVillage") || ""
        const qsVillage = village ? `&village=${encodeURIComponent(village)}` : ""
        const week = await axios.get(`/api/v1/leaderboards/citizens?period=week&scope=village${qsVillage}`, { headers })
        const month = await axios.get(`/api/v1/leaderboards/citizens?period=month&scope=village${qsVillage}`, {
          headers,
        })
        setWeeklyEntries(
          (week.data?.data || []).slice(0, 10).map((e) => ({
            rank: e.rank,
            name: e.name,
            avatar: "👤",
            issues: e.issues,
            points: e.points,
            highlight: e.rank === 1,
          })),
        )
        setMonthlyEntries(
          (month.data?.data || []).slice(0, 10).map((e) => ({
            rank: e.rank,
            name: e.name,
            avatar: "👤",
            issues: e.issues,
            points: e.points,
            highlight: e.rank === 1,
          })),
        )
      } catch (e) {
        console.log("[v0] Leaderboards not available:", e?.message)
        setWeeklyEntries([])
        setMonthlyEntries([])
      }
    })()
  }, [])

  const data = citizenData || staticData

  // Filter state (lifted to page)
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All Categories")

  // Derive categories from data
  const categories = useMemo(() => {
    const set = new Set(data.issues.map((i) => i.category).filter(Boolean))
    return ["All Categories", ...Array.from(set)]
  }, [data.issues])

  // Filter issues by search text and category
  const filteredIssues = useMemo(() => {
    const q = search.trim().toLowerCase()
    return data.issues.filter((i) => {
      const matchesText =
        !q ||
        (i.title && i.title.toLowerCase().includes(q)) ||
        (i.desc && i.desc.toLowerCase().includes(q)) ||
        (i.location && i.location.toLowerCase().includes(q)) ||
        (i.id && i.id.toLowerCase().includes(q))
      const matchesCat = category === "All Categories" || i.category === category
      return matchesText && matchesCat
    })
  }, [data.issues, search, category])

  // Preview first 3 of filtered results
  const visibleIssues = filteredIssues.slice(0, 3)

  // Blank state if no data
  const isBlank = !citizenData || !citizenData.issues || citizenData.issues.length === 0

  const statusColors = {
    "In Progress": "bg-blue-100 text-blue-600",
    Resolved: "bg-green-100 text-green-600",
    Open: "bg-red-100 text-red-600",
    "Under Review": "bg-yellow-100 text-yellow-600",
  }

  // Build contributor cards dynamically from weekly/monthly leaderboard
  const contributors = [
    weeklyEntries[0]
      ? {
          id: "weekly",
          period: "week",
          periodTag: "This Week",
          title: "Weekly Top Contributor",
          name: weeklyEntries[0].name,
          role: "Most Active Citizen",
          points: weeklyEntries[0].points,
          avatar: weeklyEntries[0].avatar,
          total: weeklyEntries[0].issues,
          unsolved: undefined,
          resolved: undefined,
          ctaText: "View Full Weekly Leaderboard",
        }
      : {
          id: "weekly",
          period: "week",
          periodTag: "This Week",
          title: "Weekly Top Contributor",
          name: "—",
          role: "Most Active Citizen",
          points: 0,
          avatar: "👤",
          total: 0,
          ctaText: "View Full Weekly Leaderboard",
        },
    monthlyEntries[0]
      ? {
          id: "monthly",
          period: "month",
          periodTag: "This Month",
          title: "Monthly Top Contributor",
          name: monthlyEntries[0].name,
          role: "Community Champion",
          points: monthlyEntries[0].points,
          avatar: monthlyEntries[0].avatar,
          total: monthlyEntries[0].issues,
          ctaText: "View Full Monthly Leaderboard",
        }
      : {
          id: "monthly",
          period: "month",
          periodTag: "This Month",
          title: "Monthly Top Contributor",
          name: "—",
          role: "Community Champion",
          points: 0,
          avatar: "👤",
          total: 0,
          ctaText: "View Full Monthly Leaderboard",
        },
  ]

  return (
    <div className="min-h-screen bg-gray-50 text-slate-800 pt-16">
      <NavBar />
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-6 space-y-6">
        {/* Top Contributors row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {contributors.map((c) => (
            <ContributorCard
              key={c.id}
              {...c}
              onCta={() => (c.id === "weekly" ? setOpenWeekly(true) : setOpenMonthly(true))}
            />
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.stats.map((s, idx) => (
            <div key={idx} className="bg-white shadow rounded-xl p-4 flex flex-col items-center justify-center">
              <h3 className={`text-xl font-bold ${s.color}`}>{s.value}</h3>
              <p className="text-gray-500 text-sm">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white border rounded-2xl p-4 md:p-6">
          <div className="flex items-center gap-2 mb-4 md:mb-6">
            <span className="text-blue-600">+</span>
            <h3 className="text-lg font-semibold text-gray-800">Quick Actions</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Report New Issue */}
            <NavLink
              to="/ReportNewIssue"
              className="group relative overflow-hidden rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:ring-offset-2"
            >
              <div className="flex items-center gap-4 rounded-xl px-5 py-6 md:py-7 shadow-sm bg-gradient-to-r from-blue-600 to-emerald-500 text-white group-hover:from-blue-700 group-hover:to-emerald-600">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white/15 ring-1 ring-white/20">
                  <Plus className="w-5 h-5" />
                </span>
                <div className="min-w-0">
                  <div className="text-base md:text-lg font-semibold leading-tight">Report New Issue</div>
                  <div className="text-white/85 text-sm leading-snug truncate">Submit problems or concerns</div>
                </div>
              </div>
            </NavLink>

            {/* Submit Feedback */}
            <NavLink
              to="/FeedbackForm"
              className="group rounded-xl border border-blue-200 bg-white text-blue-900 px-5 py-6 md:py-7 shadow-sm hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:ring-offset-2"
            >
              <div className="flex items-center gap-4">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-blue-300 text-blue-700 bg-blue-50">
                  <MessageSquare className="w-5 h-5" />
                </span>
                <div className="min-w-0">
                  <div className="text-base md:text-lg font-semibold leading-tight">Submit Feedback</div>
                  <div className="text-gray-600 text-sm leading-snug truncate">Share suggestions and ideas</div>
                </div>
              </div>
            </NavLink>
          </div>
        </div>

        {/* Search + Filter */}
        <SearchAndFilter
          categories={categories}
          onSearch={setSearch}
          onFilter={setCategory}
          onChange={({ search, category }) => {
            setSearch(search)
            setCategory(category)
          }}
        />

        {/* Reported Issues (preview from filtered) */}
        <div className="bg-white shadow rounded-xl p-4">
          <h2 className="font-semibold mb-4">My Reported Issues ({filteredIssues.length})</h2>
          {isBlank ? (
            <div className="text-center text-gray-400 py-12">
              <p>No reports or data found for your village yet.</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {visibleIssues.map((issue) => (
                  <div key={issue.id} className="border rounded-lg p-4 hover:shadow transition bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-bold text-blue-600">{issue.id}</span>
                        <h3 className="font-semibold text-gray-800">{issue.title}</h3>
                        <p className="text-sm text-gray-600">{issue.desc}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                          <MapPin className="w-4 h-4" />
                          <span>{issue.location}</span>
                          <span>•</span>
                          <span>{issue.category}</span>
                          <span>•</span>
                          <Calendar className="w-4 h-4" />
                          <span>Reported: {issue.updated}</span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[issue.status]}`}>
                        {issue.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              {/* Open modal to show all filtered results */}
              {filteredIssues.length > 3 && (
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={() => setOpen(true)}
                    className="group inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-200 bg-white text-blue-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:ring-offset-2 shadow-sm transition"
                  >
                    <span className="leading-none">View More</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
        <div className="flex flex-col md:flex-row gap-4 w-full mt-6">
          {/* Government Schemes */}
          <div className="flex flex-col justify-between p-6 rounded-2xl border border-green-200 bg-green-50 w-full md:w-1/2 shadow-sm transition-all duration-200 hover:shadow-md">
            <div>
              <h3 className="text-gray-900 font-semibold text-lg">Government Schemes</h3>
              <p className="text-gray-600 text-sm mt-2">Explore available schemes and benefits for your village</p>
            </div>
            <NavLink
              to="/GovernmentSchemes"
              className="mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold text-sm px-5 py-2 rounded-md w-fit transition-colors duration-200"
            >
              Explore Schemes
            </NavLink>
          </div>

          {/* Village Progress */}
          <div className="flex flex-col justify-between p-6 rounded-2xl border border-blue-200 bg-blue-50 w-full md:w-1/2 shadow-sm transition-all duration-200 hover:shadow-md">
            <div>
              <h3 className="text-gray-900 font-semibold text-lg">Village Progress</h3>
              <p className="text-gray-600 text-sm mt-2">
                Check your village’s development status and certification progress
              </p>
            </div>
            <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-2 rounded-md w-fit transition-colors duration-200">
              View Progress
            </button>
          </div>
        </div>
      </div>

      {/* Modal shows all filtered issues */}
      <ViewMoreModal
        open={open}
        onClose={() => setOpen(false)}
        title="All Reported Issues"
        description="Full list of reports"
        issues={filteredIssues}
        statusColors={statusColors}
      />

      {/* Weekly leaderboard modal */}
      <LeaderboardModal
        open={openWeekly}
        onClose={() => setOpenWeekly(false)}
        title="Weekly Leaderboard"
        subtitle="Top contributors for this week"
        entries={weeklyEntries}
        accent="blue"
      />

      {/* Monthly leaderboard modal */}
      <LeaderboardModal
        open={openMonthly}
        onClose={() => setOpenMonthly(false)}
        title="Monthly Leaderboard"
        subtitle="Top contributors for this month"
        entries={monthlyEntries}
        accent="fuchsia"
      />

      <Footer />
    </div>
  )
}
