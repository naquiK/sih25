import React, { useEffect, useMemo, useState } from "react";
// import axios from "axios"; 
import {
  Building2,
  Home,
  Droplets,
  GraduationCap,
  Stethoscope,
  Wrench,
  Briefcase,
  ShieldCheck,
  Search,
  Info,
} from "lucide-react";
import NavBar from "../components/miniComponents/NavBar";
import Footer from "../components/miniComponents/Footer";
import { NavLink } from "react-router-dom";

// Category -> icon map
const CAT_ICON = {
  Infrastructure: <Building2 className="w-4 h-4" />,
  Housing: <Home className="w-4 h-4" />,
  "Water Supply": <Droplets className="w-4 h-4" />,
  Education: <GraduationCap className="w-4 h-4" />,
  Healthcare: <Stethoscope className="w-4 h-4" />,
  "Skill Development": <Wrench className="w-4 h-4" />,
  Employment: <Briefcase className="w-4 h-4" />,
};

// Mock schemes
const MOCK_SCHEMES = [
  {
    id: "GS-001",
    title: "PM-AJAY - Infrastructure Development",
    category: "Infrastructure",
    badge: "Applied",
    budget: "₹5 Cr+",
    deadline: "2025-06-30",
    eligibility: "Villages with 50%+ SC population",
    benefits: [
      "Road construction",
      "Water supply",
      "Electricity and sanitation",
    ],
    key: ["Infrastructure", "Village amenities", "Basic services"],
    applied: true,
  },
  {
    id: "GS-002",
    title: "Pradhan Mantri Awas Yojana (PMAY)",
    category: "Housing",
    badge: "",
    budget: "₹1.2 Lakhs per house",
    deadline: "2025-12-31",
    eligibility: "BPL families without pucca house",
    benefits: [
      "Financial assistance for house construction",
      "Technical guidance",
      "Quality materials subsidy",
    ],
    key: ["Housing upgrade", "Pucca houses", "Livability"],
    applied: false,
  },
  {
    id: "GS-003",
    title: "Swachh Bharat Mission - Gramin",
    category: "Sanitation",
    badge: "Applied",
    budget: "₹12,000 per toilet",
    deadline: "2025-09-15",
    eligibility: "All rural households without toilet",
    benefits: [
      "Toilet construction",
      "Awareness programs",
      "Community sanitation units",
    ],
    key: ["Sanitation", "Toilet access", "Cleanliness"],
    applied: true,
  },
  {
    id: "GS-004",
    title: "National Rural Livelihood Mission",
    category: "Employment",
    badge: "",
    budget: "₹2 Lakhs/SHG",
    deadline: "2025-10-30",
    eligibility: "SHGs and rural youth age 18–35",
    benefits: [
      "Skill training",
      "Seed funding for enterprises",
      "Market linkages",
    ],
    key: ["Livelihood", "Skill", "Entrepreneurship"],
    applied: false,
  },
  {
    id: "GS-005",
    title: "Ayushman Bharat - Health & Wellness",
    category: "Healthcare",
    badge: "Applied",
    budget: "₹5 Lakhs insurance cover",
    deadline: "2025-08-10",
    eligibility: "All eligible families as per SECC data",
    benefits: [
      "Cashless treatment",
      "Free medical checkups",
      "Medicine support",
    ],
    key: ["Health cover", "Insurance", "PHC"],
    applied: true,
  },
  {
    id: "GS-006",
    title: "Samagra Shiksha Abhiyan",
    category: "Education",
    badge: "",
    budget: "₹25 Lakhs/school (capex)",
    deadline: "2025-11-20",
    eligibility: "Govt. and aided schools in rural areas",
    benefits: [
      "School infrastructure",
      "Smart classrooms",
      "Teacher training",
    ],
    key: ["Education infra", "Quality learning", "Digital"],
    applied: false,
  },
];

export default function GovernmentSchemes() {
  // Page state
  const [query, setQuery] = useState("");
  const [activeCats, setActiveCats] = useState([]); // empty => all
  const [schemes, setSchemes] = useState(MOCK_SCHEMES);

  // Future backend integration
  /*
  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axios.get("/api/v1/state/schemes");
        setSchemes(data);
      } catch (e) {
        console.error("Failed to load schemes:", e);
      }
    };
    load();
  }, []);
  */

  // Derived categories from data
  const categories = useMemo(() => {
    const set = new Set(schemes.map((s) => s.category));
    return Array.from(set);
  }, [schemes]);

  // Summary tiles
  const total = schemes.length;
  const applied = schemes.filter((s) => s.applied).length;
  const activeNow = schemes.filter((s) => new Date(s.deadline) >= new Date()).length;
  const totalBenefits = "₹12.5 Lakhs"; // mock aggregate

  // Filtering
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return schemes.filter((s) => {
      const matchesText =
        !q ||
        s.title.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.benefits.some((b) => b.toLowerCase().includes(q));
      const matchesCat = activeCats.length === 0 || activeCats.includes(s.category);
      return matchesText && matchesCat;
    });
  }, [schemes, query, activeCats]);

  const toggleCat = (c) =>
    setActiveCats((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* <NavBar /> */}
      <NavBar/>  
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-6 space-y-6">
        {/* Breadcrumb */}
        <NavLink
          to="/CitizenDashboard" 
          className="text-xs text-gray-500 hover:underline inline-flex items-center gap-2">
          ← Back to Dashboard
        </NavLink>

        {/* Page title */}
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Government Schemes</h1>
          <p className="text-sm text-gray-500">
            Explore and apply for schemes available for your village
          </p>
        </div>

        {/* Summary tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <SummaryTile label="Total Schemes" value={total} ring="ring-gray-200" icon={<Info className="w-4 h-4 text-gray-600" />} />
          <SummaryTile label="Applied Schemes" value={applied} ring="ring-emerald-200" icon={<ShieldCheck className="w-4 h-4 text-emerald-600" />} />
          <SummaryTile label="Active Now" value={activeNow} ring="ring-blue-200" icon={<Info className="w-4 h-4 text-blue-600" />} />
          <SummaryTile label="Total Benefits" value={totalBenefits} ring="ring-amber-200" icon={<Info className="w-4 h-4 text-amber-600" />} stringValue />
        </div>

        {/* Search + Filters */}
        <div className="bg-white rounded-2xl border shadow-sm p-3 space-y-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search schemes by name or description..."
                className="w-full h-10 rounded-xl border border-gray-200 bg-white pl-9 pr-3 text-sm shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </div>
          </div>

          {/* Category chips */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => toggleCat(c)}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs ${
                  activeCats.includes(c)
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                {CAT_ICON[c] || <Info className="w-4 h-4" />}
                {c}
              </button>
            ))}
            {activeCats.length > 0 && (
              <button
                onClick={() => setActiveCats([])}
                className="text-xs text-blue-700 hover:underline ml-1"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Schemes grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((s) => (
            <SchemeCard key={s.id} scheme={s} />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-sm text-gray-500">
              No schemes match the current filters.
            </div>
          )}
        </div>
      </div>

      {/* <Footer /> */}
      <Footer/>
    </div>
  );
}

function SummaryTile({ label, value, ring, icon, stringValue = false }) {
  return (
    <div className={`bg-white rounded-2xl border shadow-sm px-4 py-3 ring-1 ${ring}`}>
      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-500">{label}</div>
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-gray-50">
          {icon}
        </span>
      </div>
      <div className="mt-1 text-xl font-semibold text-gray-900">
        {stringValue ? value : Number(value).toLocaleString()}
      </div>
    </div>
  );
}

function SchemeCard({ scheme }) {
  const {
    title,
    category,
    badge,
    budget,
    deadline,
    eligibility,
    benefits,
    key,
    applied,
  } = scheme;

  return (
    <div className="bg-white rounded-2xl border shadow-sm">
      <div className="p-4">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-50 border">
              {CAT_ICON[category] || <Info className="w-4 h-4" />}
            </span>
            <div className="min-w-0">
              <h3 className="font-medium text-gray-900 truncate">{title}</h3>
              <div className="text-[11px] text-gray-500 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-gray-600">
                  {CAT_ICON[category] || <Info className="w-3.5 h-3.5" />}
                  {category}
                </span>
              </div>
            </div>
          </div>
          {badge ? (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
              {badge}
            </span>
          ) : null}
        </div>

        {/* Body */}
        <div className="mt-3 grid grid-cols-1 gap-2 text-xs text-gray-700">
          <Row label="Budget" value={budget} />
          <Row label="Deadline" value={deadline} />
          <Row label="Eligibility" value={eligibility} />
          <div>
            <div className="text-gray-500">Key Benefits:</div>
            <ul className="mt-1 list-disc pl-5 space-y-0.5">
              {benefits.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </div>
          {key?.length ? (
            <div className="flex items-center gap-2 flex-wrap">
              {key.map((k) => (
                <span
                  key={k}
                  className="text-[11px] px-2 py-0.5 rounded-full border bg-gray-50 text-gray-700"
                >
                  {k}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        {/* Actions */}
        <div className="mt-3 flex items-center gap-2">
          <button
            className={`flex-1 rounded-xl px-3 py-2 text-xs font-medium shadow-sm ${
              applied
                ? "bg-gray-100 text-gray-700 border"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {applied ? "View Application" : "Apply Now"}
          </button>
          <button className="rounded-xl px-3 py-2 text-xs font-medium border bg-white text-gray-700 hover:bg-gray-50">
            Details
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="grid grid-cols-5 gap-2">
      <div className="col-span-2 text-gray-500">{label}:</div>
      <div className="col-span-3 text-gray-800">{value}</div>
    </div>
  );
}
