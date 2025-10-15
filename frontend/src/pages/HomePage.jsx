import React, { useEffect, useState } from "react";
import {
  MapPin,
  ClipboardList,
  Users,
  UserPlus,
  Eye,
  LogIn,
  ArrowRight,
  Award,
  Clock,
  TrendingUp,
  Target,
  BookOpen,
} from "lucide-react";
import NavBar from "../components/miniComponents/NavBar";
import Footer from "../components/miniComponents/Footer";
import { NavLink } from "react-router-dom";

export default function HomePage() {
  const stats = [
    { id: 1, value: 234, label: "Villages Certified", icon: Award, color: "bg-emerald-50 text-emerald-600" },
    { id: 2, value: 3420, label: "Active Projects", icon: Clock, color: "bg-blue-50 text-blue-600" },
    { id: 3, value: 12500, suffix: " Cr", label: "Budget Allocated", icon: TrendingUp, color: "bg-purple-50 text-purple-600" },
    { id: 4, value: 8450, label: "Total Villages", icon: Target, color: "bg-orange-50 text-orange-600" },
  ];

  const features = [
    {
      title: "Easy Issue Reporting",
      desc: "Report infrastructure gaps with GPS tags and photo uploads.",
      icon: MapPin,
      color: "bg-sky-100 text-sky-600",
    },
    {
      title: "Real-time Project Tracking",
      desc: "Monitor development projects and their progress.",
      icon: ClipboardList,
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      title: "Community Engagement",
      desc: "Participate in village decisions and provide feedback.",
      icon: Users,
      color: "bg-violet-100 text-violet-600",
    },
    {
      title: "Transparent Governance",
      desc: "Access budget, project details and certification progress.",
      icon: Eye,
      color: "bg-rose-100 text-rose-600",
    },
  ];

  const progressItems = [
    { value: "28", label: "States Covered", color: "text-blue-600" },
    { value: "450", label: "Districts", color: "text-green-600" },
    { value: "8450", label: "Villages", color: "text-purple-600" },
    { value: "234", label: "Certified", color: "text-orange-600" },
    { value: "3420", label: "Active Projects", color: "text-red-600" },
    { value: "₹12,500 Cr", label: "Budget Allocated", color: "text-teal-600" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-slate-800 pt-16">
      <NavBar />
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* HERO */}
        <div className="relative">
          <div className="bg-gradient-to-r from-sky-600 to-emerald-500 rounded-2xl shadow-lg p-8 text-white overflow-hidden">
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1">
                <span className="inline-flex items-center bg-white/20 border border-white/30 text-xs font-semibold px-3 py-1 rounded-full">
                  PM-AJAY Initiative
                </span>

                <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold leading-tight">
                  Adarsh Gram Development Portal
                </h1>
                <p className="mt-3 max-w-2xl text-sm opacity-90">
                  Empowering SC-majority villages through transparent governance,
                  community participation, and data-driven development monitoring
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <NavLink
                    to="/Signup" 
                    className="inline-flex items-center gap-2 bg-white text-sky-700 font-semibold px-4 py-2 rounded-lg shadow-sm hover:shadow-md">
                    Get Started Today
                    <ArrowRight className="w-4 h-4" />
                  </NavLink>

                  <NavLink
                    to="/Login" 
                    className="inline-flex items-center gap-2 bg-white text-sky-700 font-semibold px-4 py-2 rounded-lg shadow-sm hover:shadow-md">
                    <LogIn className="w-4 h-4" />
                    Already a member? Login
                  </NavLink>
                </div>
              </div>
            </div>
          </div>

          {/* STAT CARDS */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s) => (
              <StatCard key={s.id} {...s} />
            ))}
          </div>
        </div>
        {/* 2cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Government Schemes */}
      <NavLink
        to="/GovernmentSchemes"  
        className="group border-2 border-green-400 hover:border-green-600 bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center gap-4 w-full">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-600 to-teal-600 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
            <BookOpen className="w-8 h-8 text-white transition-transform duration-300 group-hover:scale-125" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              Government Schemes
            </h3>
            <p className="text-gray-600">
              Explore available schemes and benefits for your village
            </p>
          </div>
          <ArrowRight className="w-6 h-6 text-green-600 transition-transform duration-300 group-hover:scale-125" />
        </div>
      </NavLink>

      {/* Village Progress */}
      <NavLink
        to="/Login" 
        className="group border-2 border-blue-300 hover:border-blue-600 bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center gap-4 w-full">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
            <TrendingUp className="w-8 h-8 text-white transition-transform duration-300 group-hover:scale-125" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              Village Progress
            </h3>
            <p className="text-gray-600">
              Track development projects and infrastructure growth
            </p>
          </div>
          <ArrowRight className="w-6 h-6 text-blue-600 transition-transform duration-300 group-hover:scale-125" />
        </div>
      </NavLink>
    </div>

        {/* FEATURES */}
        <section className="mt-12">
          <h2 className="text-center text-lg font-semibold">Portal Features</h2>
          <p className="text-center text-sm text-slate-500 mt-1">
            Comprehensive tools for village development and monitoring
          </p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="bg-white rounded-xl shadow p-4 flex gap-4 items-start hover:shadow-md transition"
                >
                  <div className={`p-3 rounded-lg ${f.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800">{f.title}</div>
                    <div className="text-sm text-slate-500 mt-1">{f.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* CURRENT DEVELOPMENT PROGRESS */}
        <section className="mt-12">
          <div className="rounded-xl border border-emerald-200 bg-gradient-to-b from-emerald-50 to-white p-8 shadow-sm">
            <h3 className="text-center font-semibold text-lg">
              Current Development Progress
            </h3>
            <p className="text-center text-sm text-slate-600 mt-1">
              Real-time updates on village transformation across India
            </p>

            <div className="mt-6 grid grid-cols-2 md:grid-cols-6 gap-6 text-center">
              {progressItems.map((it, i) => (
                <div key={i}>
                  <div
                    className={`text-xl font-extrabold ${
                      it.color // <-- assign Tailwind text color dynamically
                    }`}
                  >
                    {it.value}
                  </div>
                  <div className="text-sm text-slate-600">{it.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
            

        {/* ABOUT & KEY FOCUS */}
        <section className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-emerald-200 bg-gradient-to-b from-emerald-50 to-white p-8 shadow-sm">
            <h4 className="font-semibold text-lg">About PM-AJAY</h4>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              Pradhan Mantri Anusuchit Jaati Abhyudaya Yojana aims to holistically
              develop SC-majority villages into Adarsh Grams by addressing gaps in
              infrastructure and services. This portal enables real-time monitoring,
              gap identification, and data-driven decision making for transforming
              villages across India.
            </p>
          </div>

          <div className="rounded-xl border border-emerald-200 bg-gradient-to-b from-emerald-50 to-white p-8 shadow-sm">
            <h4 className="font-semibold text-lg">Key Focus Areas</h4>
            <ul className="mt-3 grid grid-cols-2 gap-2 text-sm text-slate-700">
              {[
                "Education",
                "Healthcare",
                "Sanitation",
                "Water Supply",
                "Connectivity",
                "Electricity",
                "Skill Development",
                "Livelihood",
              ].map((f, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-12 bg-white rounded-xl p-6 shadow text-center">
          <h4 className="font-semibold text-lg">Join the Digital Transformation</h4>
          <p className="text-sm text-slate-600 mt-2">
            Be part of India’s largest rural development initiative. Register today
            to start contributing to your village’s progress.
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <NavLink
                to="/Signup"   
                className="flex items-center gap-2 px-5 py-2 rounded-lg text-white font-medium 
                 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 
                 transition">
              <UserPlus className="w-4 h-4" />
              Create Account
            </NavLink>
            <NavLink
                to="/Login"   
                className="flex items-center gap-2 px-5 py-2 rounded-lg border border-gray-400 
                 text-black font-medium bg-white hover:bg-gray-100 transition">
              <LogIn className="w-4 h-4" />
              Login
            </NavLink>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="mt-12 text-center text-sm text-slate-500">
          Ministry of Social Justice & Empowerment, Government of India
        </footer>
      </div>
      <Footer />
    </div>
  );
}

/*Stat Card Component*/
function StatCard({ value, label, icon: Icon, color, suffix = "" }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 1000;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = end / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        start = end;
        clearInterval(timer);
      }
      setCount(Math.floor(start));
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col items-center text-center hover:shadow-md transition">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="text-2xl font-bold text-slate-800">
        {count.toLocaleString()} {suffix}
      </div>
      <div className="text-sm text-slate-500 mt-1">{label}</div>
    </div>
  );
}
