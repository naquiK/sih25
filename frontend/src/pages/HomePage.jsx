import { Link, NavLink } from "react-router-dom";
import { Shield, Users, Clock, CheckCircle } from "lucide-react";
import NavBar from "../components/miniComponents/NavBar.jsx";
import Footer from "../components/miniComponents/Footer.jsx";

export default function HomePage() {
  const stats = [
    { title: "Total Reports", value: "1,247", change: "+12%" },
    { title: "Resolved Issues", value: "892", change: "+9%" },
    { title: "Active Citizens", value: "3,456", change: "+25%" },
    { title: "Response Time", value: "4.2 hrs", change: "-13%" },
  ];

  const issues = [
    {
      title: "Pothole on Main Street",
      status: "High • In progress",
      statusColor: "text-red-600",
      location: "Ranchi, Main Street",
      time: "2 hours ago",
    },
    {
      title: "Streetlight not working",
      status: "Medium • Pending",
      statusColor: "text-yellow-600",
      location: "Dhanbad, Park Road",
      time: "5 hours ago",
    },
    {
      title: "Overflowing garbage bin",
      status: "Medium • Resolved",
      statusColor: "text-green-600",
      location: "Jamshedpur, Market Area",
      time: "1 day ago",
    },
  ];

  const howItWorks = [
    {
      icon: <CheckCircle className="w-10 h-10 text-green-600 mx-auto mb-3" />,
      title: "Report Issue",
      description:
        "Capture photos of civic issues with automatic location tagging and submit detailed reports.",
    },
    {
      icon: <Shield className="w-10 h-10 text-blue-600 mx-auto mb-3" />,
      title: "Auto Routing",
      description:
        "Issues are automatically routed to relevant departments based on type and location.",
    },
    {
      icon: <Clock className="w-10 h-10 text-purple-600 mx-auto mb-3" />,
      title: "Track Progress",
      description:
        "Receive real time updates and notifications as your reported issues are resolved.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* NavBar */}
      <NavBar/>
      {/* Hero Section */}
      <div className="bg-green-600 text-white py-12">
        <div className="max-w-6xl mx-auto text-center px-4">
          <h1 className="text-2xl font-bold mb-2">
            Report Civic Issues in Your Community
          </h1>
          <p className="text-base mb-6 max-w-2xl mx-auto">
            Help make Jharkhand better by reporting potholes, broken
            streetlights, garbage issues, and other civic problems. Our system
            ensures quick resolution and transparency.
          </p>
          <div className="flex justify-center gap-4">
            <NavLink
              to="/report"
              className="px-5 py-2 bg-white text-green-700 rounded-lg shadow hover:bg-gray-100"
            >
              Report an Issue
            </NavLink>
            <NavLink
              to="/map"
              className="px-5 py-2 bg-white text-green-700 rounded-lg shadow hover:bg-gray-100"
            >
              View Issues Map
            </NavLink>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-6xl mx-auto px-4 mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow p-4 text-center"
          >
            <h3 className="text-lg font-semibold">{s.title}</h3>
            <p className="text-2xl font-bold text-green-700">{s.value}</p>
            <p className="text-xs text-gray-500">{s.change}</p>
          </div>
        ))}
      </div>

      {/* Recent Issues */}
      <div className="max-w-4xl mx-auto mt-8 bg-white shadow rounded-lg p-6 w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Recent Civic Issues</h2>
          <div className="flex gap-2">
            <button className="px-3 py-1 border rounded hover:bg-gray-100">
              Filter
            </button>
            <button className="px-3 py-1 border rounded hover:bg-gray-100">
              Search
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {issues.map((issue, i) => (
            <div
              key={i}
              className="p-3 border rounded hover:bg-gray-50"
            >
              <p className="font-medium">
                {issue.title}{" "}
                <span className={`${issue.statusColor} text-xs ml-2`}>
                  {issue.status}
                </span>
              </p>
              <p className="text-sm text-gray-600">
                📍 {issue.location} • {issue.time}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-4">
          <NavLink
            to="/issues"
            className="px-4 py-2 border rounded-lg hover:bg-gray-100"
          >
            View All Issues
          </NavLink>
        </div>
      </div>

      {/* How it Works */}
      <div className="max-w-5xl mx-auto text-center py-12">
        <h2 className="text-lg font-bold mb-6">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {howItWorks.map((step, i) => (
            <div key={i}>
              {step.icon}
              <h3 className="font-semibold">{step.title}</h3>
              <p className="text-sm text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <Footer/>
    </div>
  );
}
