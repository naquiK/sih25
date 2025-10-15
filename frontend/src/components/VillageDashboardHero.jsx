"use client"

import { useEffect, useState } from "react"
import { NavLink, useParams } from "react-router-dom"
import { MapPin, ArrowRight, Users, HomeIcon, GraduationCap, TrendingUp } from "lucide-react"
import NavBar from "./miniComponents/NavBar"
import axios from "../config/axios"

export default function VillageDashboardHero({
  villageName = "Sonbarsa Village",
  location = "Ranchi, Jharkhand · Kanke Block",
  readiness = 67,
}) {
  const { villageId } = useParams()
  const [summary, setSummary] = useState(null)

  useEffect(() => {
    if (!villageId) return
    ;(async () => {
      try {
        const { data } = await axios.get(`/api/v1/villages/${encodeURIComponent(villageId)}/summary`)
        setSummary(data)
      } catch (e) {
        console.log("[v0] VillageDashboardHero fallback to props:", e?.message)
      }
    })()
  }, [villageId])

  const effective = {
    villageName: summary?.villageName || villageName,
    location: summary?.location || location,
    readiness: typeof summary?.readiness === "number" ? summary?.readiness : readiness,
    population: summary?.population,
    households: summary?.households,
    scHouseholds: summary?.scHouseholds,
    literacyRate: summary?.literacyRate,
    employment: summary?.employment,
  }

  const kpis = [
    {
      label: "Population",
      value: effective.population ?? 2450,
      sub: `${effective.households ?? 470} households`,
      ring: "border-blue-400",
      glow: "shadow-[0_0_0_3px_rgba(59,130,246,0.10)]",
      iconBg: "bg-blue-50",
      icon: <Users className="w-5 h-5 text-blue-600" />,
    },
    {
      label: "SC Households",
      value: effective.scHouseholds ?? 320,
      sub: "68% of total",
      ring: "border-fuchsia-400",
      glow: "shadow-[0_0_0_3px_rgba(217,70,239,0.10)]",
      iconBg: "bg-fuchsia-50",
      icon: <HomeIcon className="w-5 h-5 text-fuchsia-600" />,
    },
    {
      label: "Literacy Rate",
      value: effective.literacyRate ?? "72%",
      sub: "Above district avg",
      ring: "border-emerald-400",
      glow: "shadow-[0_0_0_3px_rgba(16,185,129,0.10)]",
      iconBg: "bg-emerald-50",
      icon: <GraduationCap className="w-5 h-5 text-emerald-600" />,
    },
    {
      label: "Employment",
      value: effective.employment ?? "58%",
      sub: "Economically active",
      ring: "border-orange-400",
      glow: "shadow-[0_0_0_3px_rgba(249,115,22,0.10)]",
      iconBg: "bg-orange-50",
      icon: <TrendingUp className="w-5 h-5 text-orange-600" />,
    },
  ]

  return (
    <div className="pt-16 bg-gray-50">
      {/* Top Nav */}
      <NavBar />

      {/* Hero + KPIs + Tabs */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-6 space-y-6">
        {/* Gradient hero */}
        <div className="rounded-2xl overflow-hidden border shadow-sm">
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 text-white p-5 md:p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-2xl font-semibold drop-shadow-sm">{effective.villageName}</h1>
                <div className="flex items-center gap-2 text-sm text-emerald-50/90">
                  <MapPin className="w-4 h-4" />
                  <span>{effective.location}</span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-[11px] text-emerald-50/80">Adarsh Gram Readiness</div>
                <div className="mt-1 inline-flex items-center gap-2 rounded-full bg-white/20 px-2 py-1 backdrop-blur-sm">
                  <span className="text-sm font-semibold">{effective.readiness}%</span>
                  <span className="text-[10px] bg-white/30 rounded px-1 py-0.5">Progressing</span>
                </div>
              </div>
            </div>

            {/* subtle divider */}
            <div className="mt-4 h-[2px] w-full rounded bg-white/15 backdrop-blur-[1px]" />

            <div className="mt-4">
              <button className="inline-flex items-center gap-2 rounded-lg border border-white/25 bg-white/15 px-3 py-1.5 text-sm font-medium hover:bg-white/20 hover:border-white/30 backdrop-blur-sm transition">
                View Community Suggestions
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* KPI tiles */}
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((k) => (
              <div
                key={k.label}
                className={`rounded-2xl border ${k.ring} ${k.glow} bg-white p-4 transition hover:shadow-md`}
              >
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">{k.label}</div>
                  <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${k.iconBg}`}>
                    {k.icon}
                  </div>
                </div>
                <div className="mt-1 text-2xl font-semibold text-gray-900">{k.value}</div>
                <div className="text-xs text-gray-500">{k.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs rail */}
        <div className="rounded-2xl border bg-gray-200 shadow-sm">
          <div className="p-1">
            <div className="grid grid-cols-5 gap-2">
              <NavLink
                to={`/village/${encodeURIComponent(villageId || "")}/overview`}
                end
                className={({ isActive }) =>
                  isActive
                    ? "w-full text-center rounded-full bg-white text-gray-900 shadow-sm px-6 py-2 text-sm font-medium"
                    : "w-full text-center rounded-full px-6 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
                }
              >
                Overview
              </NavLink>

              <NavLink
                to={`/village/${encodeURIComponent(villageId || "")}/projects`}
                className={({ isActive }) =>
                  isActive
                    ? "w-full text-center rounded-full bg-white text-gray-900 shadow-sm px-6 py-2 text-sm font-medium"
                    : "w-full text-center rounded-full px-6 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
                }
              >
                Projects
              </NavLink>

              <NavLink
                to={`/village/${encodeURIComponent(villageId || "")}/events&announcements`}
                end
                className={({ isActive }) =>
                  isActive
                    ? "w-full text-center rounded-full bg-white text-gray-900 shadow-sm px-6 py-2 text-sm font-medium"
                    : "w-full text-center rounded-full px-6 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
                }
              >
                Events / Announcements
              </NavLink>

              <NavLink
                to={`/village/${encodeURIComponent(villageId || "")}/community`}
                className={({ isActive }) =>
                  isActive
                    ? "w-full text-center rounded-full bg-white text-gray-900 shadow-sm px-6 py-2 text-sm font-medium"
                    : "w-full text-center rounded-full px-6 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
                }
              >
                Community
              </NavLink>

              <NavLink
                to={`/village/${encodeURIComponent(villageId || "")}/map`}
                className={({ isActive }) =>
                  isActive
                    ? "w-full text-center rounded-full bg-white text-gray-900 shadow-sm px-6 py-2 text-sm font-medium"
                    : "w-full text-center rounded-full px-6 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
                }
              >
                Infrastructure Map
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
