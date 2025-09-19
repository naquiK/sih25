// src/pages/DepartmentDashboard.jsx
import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line
} from "recharts";
import { Filter, Search, Users, Wrench, Clock, CheckCircle, Calendar, Eye, UserPlus } from "lucide-react";
import { Listbox, Transition } from "@headlessui/react";
import { Fragment } from "react";
import NavBar from "../components/miniComponents/NavBar";
import Footer from "../components/miniComponents/Footer";

// 🔹 Static Data
const stats = [
  { id: 1, title: "Roads Maintained", value: 847, change: "+23", icon: Wrench },
  { id: 2, title: "Repairs Completed", value: 156, change: "+12", icon: CheckCircle },
  { id: 3, title: "Pending Repairs", value: 34, change: "+8", icon: Clock },
  { id: 4, title: "Active Technicians", value: 89, change: "+4", icon: Users },
];

const repairProgress = [
  { month: "Jan", completed: 120, pending: 30 },
  { month: "Feb", completed: 150, pending: 40 },
  { month: "Mar", completed: 198, pending: 45 },
  { month: "Apr", completed: 220, pending: 30 },
];

const repairTrends = [
  { month: "Jan", pothole: 90, road: 50, crack: 20 },
  { month: "Feb", pothole: 75, road: 52, crack: 18 },
  { month: "Mar", pothole: 80, road: 38, crack: 15 },
  { month: "Apr", pothole: 65, road: 40, crack: 10 },
];

// NOTE: "severity" replaced with "urgency" and values mapped to Low/Medium/High/Critical
const reports = [
  { id: "PND001", location: "Main Road, Sector 15", type: "Pothole", urgency: "High", status: "Pending", priority: "High", assigned: "Rajesh Kumar", date: "2024-01-16" },
  { id: "PND002", location: "Sector 14, School Street", type: "Road Damage", urgency: "Low", status: "Resolved", priority: "Medium", assigned: "Suresh Sharma", date: "2024-01-15" },
  { id: "PND003", location: "Bridge 4, Highway Connect", type: "Crack", urgency: "Critical", status: "In Progress", priority: "High", assigned: "Mohan Singh", date: "2024-01-14" },
  { id: "PND004", location: "Park Avenue Junction", type: "Pothole", urgency: "Low", status: "Pending", priority: "Low", assigned: "Ramesh Gupta", date: "2024-01-13" },
  { id: "PND005", location: "Industrial Area, Gate 2", type: "Road Damage", urgency: "Medium", status: "In Progress", priority: "Medium", assigned: "Vikash Kumar", date: "2024-01-12" },
];

const statusOptions = ["All Status", "Pending", "In Progress", "Resolved"];

export default function DepartmentDashboard() {
  const [selectedStatus, setSelectedStatus] = useState(statusOptions[0]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredReports = reports.filter((r) =>
    (selectedStatus === "All Status" || r.status === selectedStatus) &&
    (r.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
     r.type.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50 space-y-8">
      <NavBar />
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Header + Assign button */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Public Works Department</h1>
            <p className="text-sm text-gray-500 mt-1">Manage road maintenance, infrastructure repairs, and construction projects</p>
          </div>

          {/* Assign Technician button (top-right) */}
          <div className="shrink-0">
            <button
              type="button"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-300"
              // you can change this to navigate or open modal as needed
              onClick={() => alert("Assign Technician action - wire this to your modal / route")}
            >
              <UserPlus className="w-4 h-4" />
              Assign Technician
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.id} className="bg-white p-5 rounded-xl shadow hover:-translate-y-1 hover:shadow-md transition">
              <div className="flex items-center gap-3">
                <stat.icon className="w-6 h-6 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-gray-600 text-sm">{stat.title}</p>
                </div>
              </div>
              <p className="text-xs text-green-600 mt-2">{stat.change}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-xl shadow border">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">Monthly Repair Progress</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={repairProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" fill="#3b82f6" name="Completed Repairs" />
                <Bar dataKey="pending" fill="#f59e0b" name="Pending Repairs" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-5 rounded-xl shadow border">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">Repair Type Trends</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={repairTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="pothole" stroke="#3b82f6" />
                <Line type="monotone" dataKey="road" stroke="#f59e0b" />
                <Line type="monotone" dataKey="crack" stroke="#ef4444" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Reports Table */}
        <div className="bg-white rounded-xl shadow border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">🛠 Infrastructure Repair Reports</h2>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Search */}
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-md bg-gray-50 border border-gray-200 text-sm placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              {/* Status Filter */}
              <div className="w-44">
                <Listbox value={selectedStatus} onChange={setSelectedStatus}>
                  <div className="relative">
                    <Listbox.Button className="relative w-full cursor-default rounded-md border bg-white py-2 pl-9 pr-8 text-left shadow-sm focus:ring-2 focus:ring-blue-500 text-sm">
                      <span className="absolute left-2 inset-y-0 flex items-center">
                        <Filter className="h-4 w-4 text-gray-400" />
                      </span>
                      <span className="block truncate">{selectedStatus}</span>
                      <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">▼</span>
                    </Listbox.Button>
                    <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                      <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg border focus:outline-none z-10">
                        {statusOptions.map((status, idx) => (
                          <Listbox.Option
                            key={idx}
                            value={status}
                            className={({ active }) => `cursor-default select-none py-2 pl-3 pr-4 ${active ? "bg-blue-100 text-blue-700" : "text-gray-900"}`}
                          >
                            {status}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </Listbox>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="p-3 text-left">Report ID</th>
                  <th className="p-3 text-left">Location</th>
                  <th className="p-3 text-left">Type</th>
                  <th className="p-3 text-left">Urgency</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Priority</th>
                  <th className="p-3 text-left">Assigned To</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((r) => (
                  <tr key={r.id} className="border-t hover:bg-gray-50">
                    <td className="p-3 font-medium text-blue-600">{r.id}</td>
                    <td className="p-3">{r.location}</td>
                    <td className="p-3">{r.type}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium 
                        ${r.urgency === "Critical" ? "bg-red-100 text-red-700" :
                          r.urgency === "High" ? "bg-orange-100 text-orange-700" :
                          r.urgency === "Medium" ? "bg-yellow-100 text-yellow-700" :
                          "bg-green-100 text-green-700"}`}>
                        {r.urgency}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium 
                        ${r.status === "Pending" ? "bg-red-100 text-red-700" :
                          r.status === "In Progress" ? "bg-blue-100 text-blue-700" :
                          "bg-green-100 text-green-700"}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium 
                        ${r.priority === "High" ? "bg-red-100 text-red-700" :
                          r.priority === "Medium" ? "bg-yellow-100 text-yellow-700" :
                          "bg-green-100 text-green-700"}`}>
                        {r.priority}
                      </span>
                    </td>
                    <td className="p-3">{r.assigned}</td>
                    <td className="p-3 flex items-center gap-1 text-gray-600"><Calendar className="w-4 h-4 text-gray-400" /> {r.date}</td>
                    <td className="p-3">
                      <button className="p-2 rounded-full hover:bg-blue-50 text-blue-600"><Eye className="w-5 h-5" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
