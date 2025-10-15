import React, { Fragment, useMemo, useState } from "react";
// import axios from "axios";
import {
  Filter,
  ChevronDown,
  Check,
  CalendarDays,
  Clock5,
  MapPin,
  Tag as TagIcon,
  BellRing,
  Megaphone,
  FileText,
  Plus,
} from "lucide-react";
import { Listbox, Transition } from "@headlessui/react";
import VillageDashboardHero from "./VillageDashboardHero";
import Footer from "../components/miniComponents/Footer";
import { NavLink } from "react-router-dom";

const TYPE_OPTIONS = [
  "All Types",
  "Health",
  "Education",
  "Cultural",
  "Environment",
  "Sanitation",
  "Training",
];

const MONTH_OPTIONS = [
  "All Months",
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// Mock data
const MOCK_EVENTS = [
  {
    id: "e1",
    title: "Tree Plantation Drive",
    date: "2025-10-20",
    time: "8:00 AM – 12:00 PM",
    location: "Village Community Ground",
    category: "Environment",
    tags: ["Environment", "Community"],
    img: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "e2",
    title: "Free Health Checkup Camp",
    date: "2025-10-25",
    time: "9:00 AM – 5:00 PM",
    location: "Primary Health Centre",
    category: "Health",
    tags: ["Health", "Wellness"],
    img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "e3",
    title: "Cleanliness Drive",
    date: "2025-10-28",
    time: "9:00 AM – 1:00 PM",
    location: "Main Road stretch",
    category: "Sanitation",
    tags: ["Sanitation", "Community"],
    img: "https://images.unsplash.com/photo-1493815793585-d94ccbc86df8?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "e4",
    title: "Education Fair & Career Guidance",
    date: "2025-11-05",
    time: "10:00 AM – 4:00 PM",
    location: "Govt. Senior Secondary School",
    category: "Education",
    tags: ["Education", "Youth"],
    img: "https://images.unsplash.com/photo-1584697964190-ffcd50b2b7d4?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "e5",
    title: "Annual Cultural Festival",
    date: "2025-11-16",
    time: "5:00 PM – 9:00 PM",
    location: "Panchayat Bhavan",
    category: "Cultural",
    tags: ["Culture", "Community"],
    img: "https://images.unsplash.com/photo-1520101242229-4e6d5f7ff91c?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "e6",
    title: "Skill Development Workshop",
    date: "2025-12-02",
    time: "10:00 AM – 3:00 PM",
    location: "Community Hall",
    category: "Training",
    tags: ["Skills", "Employment"],
    img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop",
  },
];

const MOCK_ANNOUNCEMENTS = [
  {
    id: "a1",
    title: "New Water Pipeline Installation",
    desc:
      "Work will begin on installing new water pipelines in Ward 3 and Ward 4. Temporary water supply disruption expected.",
    date: "2025-10-12",
    tone: "Update",
  },
  {
    id: "a2",
    title: "Ration Card Verification Drive",
    desc:
      "All residents must verify their ration cards at the Panchayat office by 31st October 2025.",
    date: "2025-10-10",
    tone: "Urgent",
  },
  {
    id: "a3",
    title: "Solar Street Light Installation",
    desc:
      "50 new solar-powered street lights have been installed across the village main roads.",
    date: "2025-10-08",
    tone: "General",
  },
  {
    id: "a4",
    title: "Scholarship Application Open",
    desc:
      "Government scholarship applications are now open for SC/ST students. Apply before 15th November.",
    date: "2025-10-05",
    tone: "Notice",
  },
];

const MOCK_NOTICES = [
  { id: "n1", title: "Property Tax Payment Notice", issuer: "Gram Panchayat", date: "2025-10-01" },
  { id: "n2", title: "Road Construction Notice", issuer: "Public Works Department", date: "2025-09-28" },
  { id: "n3", title: "Electricity Maintenance Schedule", issuer: "State Electricity Board", date: "2025-09-25" },
  { id: "n4", title: "Voter ID Update Camp", issuer: "District Election Office", date: "2025-09-20" },
];

export default function VDEnA() {
  const [tab, setTab] = useState("events"); // events | announcements | notices
  const [type, setType] = useState(TYPE_OPTIONS[0]);
  // Default to "All Months" 
  const [month, setMonth] = useState(MONTH_OPTIONS[0]);
  const [showEvents, setShowEvents] = useState(2);
  const [showAnns, setShowAnns] = useState(2);
  const [showNotices, setShowNotices] = useState(2);

  // Filter helpers
  const monthMatches = (iso) => {
    if (month === "All Months") return true;
    const m = new Date(iso).toLocaleString("en-US", { month: "short" });
    return m === month;
  };
  const typeMatches = (cat) => (type === "All Types" ? true : cat === type);

  // Derived filtered lists
  const filteredEvents = useMemo(
    () =>
      MOCK_EVENTS.filter((e) => monthMatches(e.date) && typeMatches(e.category)).sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      ),
    [type, month]
  );
  const upcoming3 = useMemo(() => filteredEvents.slice(0, 3), [filteredEvents]);
  const stats = useMemo(
    () => ({
      totalEvents: filteredEvents.length,
      totalAnnouncements: MOCK_ANNOUNCEMENTS.filter((a) => monthMatches(a.date)).length,
      totalNotices: MOCK_NOTICES.filter((n) => monthMatches(n.date)).length,
    }),
    [filteredEvents, month]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header only (keeps layout consistent with other village pages) */}
      <VillageDashboardHero />

      {/* Page body */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-6 space-y-4">
        {/* Filters row */}
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl border bg-white">
            <Filter className="w-4 h-4 text-gray-600" />
          </span>

          {/* Type filter */}
          <Listbox value={type} onChange={setType}>
            <div className="relative">
              <Listbox.Button className="h-9 min-w-[150px] inline-flex items-center justify-between gap-2 rounded-xl border bg-white px-3 text-sm text-gray-900 shadow-sm">
                <span className="truncate">{type}</span>
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
                <Listbox.Options className="absolute z-40 mt-2 w-full overflow-hidden rounded-xl border bg-white shadow-lg">
                  {TYPE_OPTIONS.map((opt) => (
                    <Listbox.Option
                      key={opt}
                      value={opt}
                      className={({ active }) =>
                        `cursor-pointer select-none px-3 py-2 text-sm ${active ? "bg-gray-100" : "bg-white"}`
                      }
                    >
                      {({ selected }) => (
                        <div className="flex items-center justify-between">
                          <span>{opt}</span>
                          {selected && <Check className="w-4 h-4 text-blue-600" />}
                        </div>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>

          {/* Month filter */}
          <Listbox value={month} onChange={setMonth}>
            <div className="relative">
              <Listbox.Button className="h-9 min-w-[150px] inline-flex items-center justify-between gap-2 rounded-xl border bg-white px-3 text-sm text-gray-900 shadow-sm">
                <span className="truncate">{month}</span>
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
                <Listbox.Options className="absolute z-40 mt-2 w-full overflow-hidden rounded-xl border bg-white shadow-lg">
                  {MONTH_OPTIONS.map((opt) => (
                    <Listbox.Option
                      key={opt}
                      value={opt}
                      className={({ active }) =>
                        `cursor-pointer select-none px-3 py-2 text-sm ${active ? "bg-gray-100" : "bg-white"}`
                      }
                    >
                      {({ selected }) => (
                        <div className="flex items-center justify-between">
                          <span>{opt}</span>
                          {selected && <Check className="w-4 h-4 text-blue-600" />}
                        </div>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-center gap-2 w-full md:w-[520px]
                rounded-full bg-gray-100 p-1
                border border-gray-200 shadow-inner">
          <TabButton icon={<CalendarDays className="w-4 h-4" />} active={tab === "events"} onClick={() => setTab("events")}>
            Events
          </TabButton>
          <TabButton icon={<BellRing className="w-4 h-4" />} active={tab === "announcements"} onClick={() => setTab("announcements")}>
            Announcements
          </TabButton>
          <TabButton icon={<FileText className="w-4 h-4" />} active={tab === "notices"} onClick={() => setTab("notices")}>
            Notices
          </TabButton>
        </div>

        {/* Content + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            {tab === "events" && (
              <EventsSection
                events={filteredEvents.slice(0, showEvents)}
                total={filteredEvents.length}
                onViewMore={() => setShowEvents((v) => Math.min(v + 2, filteredEvents.length))}
                onViewLess={() => setShowEvents(2)}
              />
            )}

            {tab === "announcements" && (
              <AnnouncementsSection
                items={MOCK_ANNOUNCEMENTS.filter((a) => monthMatches(a.date)).slice(0, showAnns)}
                total={MOCK_ANNOUNCEMENTS.filter((a) => monthMatches(a.date)).length}
                onViewMore={() =>
                  setShowAnns((v) => Math.min(v + 2, MOCK_ANNOUNCEMENTS.filter((a) => monthMatches(a.date)).length))
                }
                onViewLess={() => setShowAnns(2)}
              />
            )}

            {tab === "notices" && (
              <NoticesSection
                items={MOCK_NOTICES.filter((n) => monthMatches(n.date)).slice(0, showNotices)}
                total={MOCK_NOTICES.filter((n) => monthMatches(n.date)).length}
                onViewMore={() =>
                  setShowNotices((v) => Math.min(v + 2, MOCK_NOTICES.filter((n) => monthMatches(n.date)).length))
                }
                onViewLess={() => setShowNotices(2)}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <NextEventsSidebar items={upcoming3} />
            <StatsSidebar stats={stats} />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

/* ---------- UI Pieces ---------- */

function TabButton({ active, onClick, icon, children }) {
  return (
    <button
      onClick={onClick}
      className={[
        "inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/40",
        active
          ? "bg-white text-gray-900 border border-gray-300 shadow-[0_0_0_3px_#E5E7EB]"
          : "text-gray-700 hover:text-gray-900"
      ].join(" ")}
    >
      {icon}
      <span className="whitespace-nowrap">{children}</span>
    </button>
  );
}


function EventsSection({ events, total, onViewMore, onViewLess }) {
  return (
    <div className="bg-white rounded-2xl border shadow-sm">
      <div className="px-4 py-3 border-b flex items-center justify-between">
        <div className="text-sm font-semibold text-gray-800">
          Upcoming Events <span className="text-gray-400">· {total} Total</span>
        </div>
        <NavLink
          to="/village/add-event" 
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 text-white px-3 py-1.5 text-xs font-medium hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          Post New Event
        </NavLink>
      </div>

      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.map((e) => (
          <EventCard key={e.id} e={e} />
        ))}
      </div>

      <div className="px-4 pb-4">
        {events.length < total ? (
          <button
            onClick={onViewMore}
            className="mx-auto block rounded-xl border bg-white px-3 py-2 text-xs text-gray-700 hover:bg-gray-50"
          >
            View More Events ({total - events.length} more)
          </button>
        ) : total > 2 ? (
          <button
            onClick={onViewLess}
            className="mx-auto block rounded-xl border bg-white px-3 py-2 text-xs text-gray-700 hover:bg-gray-50"
          >
            View Less Events
          </button>
        ) : null}
      </div>
    </div>
  );
}

function EventCard({ e }) {
  return (
    <div className="rounded-2xl border overflow-hidden bg-white shadow-sm">
      <div className="relative h-36 w-full bg-gray-100">
        <img src={e.img} alt={e.title} className="h-full w-full object-cover" />
        <span className="absolute top-2 right-2 text-[10px] px-2 py-0.5 rounded-full bg-emerald-600 text-white">
          {e.category}
        </span>
      </div>
      <div className="p-4 space-y-2">
        <div className="font-medium text-gray-900">{e.title}</div>
        <div className="text-xs text-gray-600 space-y-1">
          <div className="inline-flex items-center gap-2">
            <CalendarDays className="w-3.5 h-3.5 text-gray-500" />
            {new Date(e.date).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </div>
          <div className="inline-flex items-center gap-2 ml-4">
            <Clock5 className="w-3.5 h-3.5 text-gray-500" />
            {e.time}
          </div>
          <div className="mt-1 inline-flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-gray-500" />
            {e.location}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          {e.tags.map((t) => (
            <span
              key={t}
              className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 inline-flex items-center gap-1"
            >
              <TagIcon className="w-3 h-3 text-gray-500" />
              {t}
            </span>
          ))}
        </div>

        <div className="pt-2">
          <button className="w-full rounded-xl bg-emerald-600 text-white text-xs font-medium py-2 hover:bg-emerald-700">
            Register / View More
          </button>
        </div>
      </div>
    </div>
  );
}

function AnnouncementsSection({ items, total, onViewMore, onViewLess }) {
  return (
    <div className="bg-white rounded-2xl border shadow-sm">
      <div className="px-4 py-3 border-b flex items-center gap-2">
        <Megaphone className="w-4 h-4 text-purple-600" />
        <div className="text-sm font-semibold text-gray-800">
          Important Announcements <span className="text-gray-400">· {total} Total</span>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {items.map((a) => (
          <AnnouncementCard key={a.id} a={a} />
        ))}
      </div>

      <div className="px-4 pb-4">
        {items.length < total ? (
          <button
            onClick={onViewMore}
            className="mx-auto block rounded-xl border bg-white px-3 py-2 text-xs text-gray-700 hover:bg-gray-50"
          >
            View More Announcements ({total - items.length} more)
          </button>
        ) : total > 2 ? (
          <button
            onClick={onViewLess}
            className="mx-auto block rounded-xl border bg-white px-3 py-2 text-xs text-gray-700 hover:bg-gray-50"
          >
            View Less Announcements
          </button>
        ) : null}
      </div>
    </div>
  );
}

function tonePill(t) {
  if (t === "Urgent") return "bg-rose-100 text-rose-700";
  if (t === "Update") return "bg-amber-100 text-amber-700";
  if (t === "Notice") return "bg-yellow-100 text-yellow-700";
  return "bg-blue-100 text-blue-700"; // General
}

function AnnouncementCard({ a }) {
  return (
    <div className="rounded-2xl border bg-white shadow-sm p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-medium text-gray-900">{a.title}</div>
          <p className="text-xs text-gray-600 mt-1">{a.desc}</p>
          <div className="text-[11px] text-gray-500 mt-2 inline-flex items-center gap-2">
            <CalendarDays className="w-3.5 h-3.5 text-gray-500" />
            {new Date(a.date).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </div>
        </div>
        <span className={`text-[10px] px-2 py-0.5 rounded-full ${tonePill(a.tone)}`}>{a.tone}</span>
      </div>
    </div>
  );
}

function NoticesSection({ items, total, onViewMore, onViewLess }) {
  return (
    <div className="bg-white rounded-2xl border shadow-sm">
      <div className="px-4 py-3 border-b flex items-center gap-2">
        <FileText className="w-4 h-4 text-amber-600" />
        <div className="text-sm font-semibold text-gray-800">
          Official Notices <span className="text-gray-400">· {total} Total</span>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {items.map((n) => (
          <div key={n.id} className="rounded-2xl border bg-white shadow-sm p-4">
            <div className="font-medium text-gray-900">{n.title}</div>
            <div className="text-[11px] text-gray-500">
              Issued by: {n.issuer} · {new Date(n.date).toLocaleDateString("en-GB")}
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 pb-4">
        {items.length < total ? (
          <button
            onClick={onViewMore}
            className="mx-auto block rounded-xl border bg-white px-3 py-2 text-xs text-gray-700 hover:bg-gray-50"
          >
            View More Notices ({total - items.length} more)
          </button>
        ) : total > 2 ? (
          <button
            onClick={onViewLess}
            className="mx-auto block rounded-xl border bg-white px-3 py-2 text-xs text-gray-700 hover:bg-gray-50"
          >
            View Less Notices
          </button>
        ) : null}
      </div>
    </div>
  );
}

function NextEventsSidebar({ items }) {
  return (
    <div className="rounded-2xl border bg-white shadow-sm">
      <div className="px-4 py-3 border-b text-sm font-semibold text-gray-800">Next 3 Events</div>
      <div className="p-4 space-y-3">
        {items.map((e, idx) => (
          <div key={e.id} className="rounded-xl border bg-white p-3 flex items-start gap-3">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
              {idx + 1}
            </span>
            <div className="min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">{e.title}</div>
              <div className="text-[11px] text-gray-500 flex items-center gap-2">
                <CalendarDays className="w-3.5 h-3.5 text-gray-500" />
                {new Date(e.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatsSidebar({ stats }) {
  const rows = [
    { label: "Total Events", value: stats.totalEvents, color: "bg-blue-100 text-blue-700" },
    { label: "Announcements", value: stats.totalAnnouncements, color: "bg-purple-100 text-purple-700" },
    { label: "Active Notices", value: stats.totalNotices, color: "bg-amber-100 text-amber-700" },
  ];
  return (
    <div className="rounded-2xl border bg-white shadow-sm">
      <div className="px-4 py-3 border-b text-sm font-semibold text-gray-800">Event Statistics</div>
      <div className="p-4 space-y-2">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2">
            <span className="text-sm text-gray-700">{r.label}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${r.color}`}>{r.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
