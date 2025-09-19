import { useState } from "react";
import { NavLink,useNavigate } from "react-router-dom";
import { MapPin, PlusCircle, Info, CheckCircle, Clock } from "lucide-react";
import NavBar from "../components/miniComponents/NavBar.jsx";
import Footer from "../components/miniComponents/Footer.jsx";
import SearchAndFilter from "../components/miniComponents/SearchAndFilter.jsx";


export default function CitizenDashboard() {
  // Example report data (can be fetched later via API)
  const reports = [
    {
      id: "REP001",
      title: "Pothole near Kanke Road",
      description: "Large pothole causing traffic issues during monsoon",
      location: "Kanke Road, Ranchi",
      status: "In Progress",
      date: "1/15/2024",
    },
    {
      id: "REP002",
      title: "Streetlight at Harmu",
      description: "Street light not working for past 2 weeks",
      location: "Harmu Housing Colony",
      status: "Resolved",
      date: "1/12/2024",
    },
    {
      id: "REP003",
      title: "Trash overflow at Bariatu",
      description: "Garbage bin overflowing, creating hygiene issues",
      location: "Bariatu Market Area",
      status: "Urgent",
      date: "1/16/2024",
    },
  ];
  const navigate = useNavigate();
  // Status color mapper
  const getStatusColor = (status) => {
    switch (status) {
      case "Resolved":
        return "bg-green-100 text-green-700";
      case "In Progress":
        return "bg-blue-100 text-blue-700";
      case "Urgent":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <NavBar />

      <main className="flex-1 max-w-6xl mx-auto px-6 py-8 space-y-8 w-full">
        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Total Reports */}
          <div className="bg-white p-6 rounded-xl shadow hover:-translate-y-1 hover:shadow-md transition-transform border-l-4 border-green-600 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Total Reports</p>
              <h3 className="text-2xl font-bold text-gray-800">42</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
              <Info className="w-6 h-6 text-green-600" />
            </div>
          </div>

          {/* Resolved Issues */}
          <div className="bg-white p-6 rounded-xl shadow hover:-translate-y-1 hover:shadow-md transition-transform border-l-4 border-green-600 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Resolved Issues</p>
              <h3 className="text-2xl font-bold text-gray-800">28</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>

          {/* Avg Response Time */}
          <div className="bg-white p-6 rounded-xl shadow hover:-translate-y-1 hover:shadow-md transition-transform border-l-4 border-green-600 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Avg Response Time</p>
              <h3 className="text-2xl font-bold text-gray-800">3.2 days</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h4 className="font-semibold flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-green-600" /> Quick Actions
          </h4>
          <button
           onClick={() => navigate("/ReportNewIssue")}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700">
            + Report New Issue
          </button>
        </div>

        {/* Search & Filter */}
        <SearchAndFilter/>

        {/* My Recent Reports */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h4 className="font-semibold mb-4">My Recent Reports</h4>
          {reports.map((report) => (
            <div
              key={report.id}
              className="bg-white border rounded-xl p-4 mb-4 shadow-sm hover:-translate-y-1 hover:shadow-md transition-transform"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h5 className="font-semibold text-gray-800 flex items-center gap-1">
                    {report.title} <span className="text-gray-400 text-sm">📷</span>
                  </h5>
                  <p className="text-sm text-gray-600">{report.description}</p>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <MapPin className="w-4 h-4 mr-1" /> {report.location}
                  </div>
                  <p className="text-xs text-gray-400">Report ID: {report.id}</p>
                </div>
                <span
                  className={`inline-block px-3 py-1 text-xs rounded-full ${getStatusColor(
                    report.status
                  )}`}
                >
                  {report.status}
                </span>
              </div>
              <p className="text-xs text-gray-400 text-right mt-2">
                Reported: {report.date}
              </p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
