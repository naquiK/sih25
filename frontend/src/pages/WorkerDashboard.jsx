import { useState, Fragment } from "react";
import { Clock, CheckCircle, Calendar, MapPin, Filter, ChevronDown, Check } from "lucide-react";
import { Listbox, Transition } from "@headlessui/react";
import NavBar from "../components/miniComponents/NavBar";
import Footer from "../components/miniComponents/Footer.jsx";

export default function WorkerDashboard() {
  // 🔹 Stats
  const stats = [
    { id: 1, title: "Active Tasks", value: 3, icon: Clock, border: "border-orange-500", iconBg: "bg-orange-100 text-orange-600", hover: "hover:shadow-orange-400" },
    { id: 2, title: "Completed Today", value: 2, icon: CheckCircle, border: "border-green-500", iconBg: "bg-green-100 text-green-600", hover: "hover:shadow-green-400" },
    { id: 3, title: "Avg Completion", value: "1.8 days", icon: Calendar, border: "border-orange-500", iconBg: "bg-orange-100 text-orange-600", hover: "hover:shadow-orange-400" },
  ];

  // 🔹 Task Data
  const allTasks = [
    { id: "TSK001", type: "Pothole Repair", location: "Kanke Road Junction", status: "In Progress", priority: "High", progress: 60, dueDate: "1/20/2024" },
    { id: "TSK002", type: "Water Supply Fix", location: "Doranda Residential Block A", status: "Pending", priority: "High", progress: 0, dueDate: "1/19/2024" },
    { id: "TSK003", type: "Street Cleaning", location: "HEC Township Main Road", status: "In Progress", priority: "Medium", progress: 80, dueDate: "1/18/2024" },
  ];

  const completedTasks = [
    { id: 1, type: "Streetlight Replacement", location: "Harmu Colony Main Road", completedDate: "1/12/2024", duration: "2 hours" },
    { id: 2, type: "Drain Cleaning", location: "Ashok Nagar Market", completedDate: "1/10/2024", duration: "4 hours" },
  ];

  // 🔹 Filters
  const statusOptions = ["All Status", "Pending", "In Progress", "Resolved"];
  const priorityOptions = ["All Priority", "High", "Medium", "Low"];

  const [statusFilter, setStatusFilter] = useState(statusOptions[0]);
  const [priorityFilter, setPriorityFilter] = useState(priorityOptions[0]);

  const filteredTasks = allTasks.filter(
    (task) =>
      (statusFilter === "All Status" || task.status === statusFilter) &&
      (priorityFilter === "All Priority" || task.priority === priorityFilter)
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />
      <main className="flex-1 max-w-6xl mx-auto px-6 py-8 space-y-8 w-full">

        {/* Top Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className={`flex justify-between items-center border ${stat.border} rounded-xl bg-white p-5 transition-transform transform hover:-translate-y-1 hover:shadow-lg ${stat.hover}`}
            >
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.iconBg}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
          ))}
        </div>

        {/* Assigned Tasks */}
        <div className="bg-white rounded-xl border p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-700">
              <Clock className="w-5 h-5 text-orange-500" /> My Assigned Tasks
            </h2>

            {/* Filters */}
            <div className="flex items-center gap-3">
              {/* Status Filter */}
              <Listbox value={statusFilter} onChange={setStatusFilter}>
                <div className="relative">
                  <Listbox.Button className="flex items-center gap-2 border rounded-md px-3 py-1.5 text-sm bg-white shadow-sm cursor-pointer">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <span>{statusFilter}</span>
                    <ChevronDown className="w-4 h-4 text-gray-400 ml-auto" />
                  </Listbox.Button>
                  <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <Listbox.Options className="absolute right-0 mt-1 w-40 bg-white border rounded-md shadow-lg z-10">
                      {statusOptions.map((status, idx) => (
                        <Listbox.Option
                          key={idx}
                          value={status}
                          className={({ active }) =>
                            `cursor-pointer select-none px-3 py-2 text-sm ${
                              active ? "bg-green-100 text-green-700" : "text-gray-700"
                            }`
                          }
                        >
                          {({ selected }) => (
                            <div className="flex justify-between items-center">
                              <span>{status}</span>
                              {selected && <Check className="w-4 h-4 text-green-600" />}
                            </div>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>

              {/* Priority Filter */}
              <Listbox value={priorityFilter} onChange={setPriorityFilter}>
                <div className="relative">
                  <Listbox.Button className="flex items-center gap-2 border rounded-md px-3 py-1.5 text-sm bg-white shadow-sm cursor-pointer">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <span>{priorityFilter}</span>
                    <ChevronDown className="w-4 h-4 text-gray-400 ml-auto" />
                  </Listbox.Button>
                  <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <Listbox.Options className="absolute right-0 mt-1 w-40 bg-white border rounded-md shadow-lg z-10">
                      {priorityOptions.map((priority, idx) => (
                        <Listbox.Option
                          key={idx}
                          value={priority}
                          className={({ active }) =>
                            `cursor-pointer select-none px-3 py-2 text-sm ${
                              active ? "bg-green-100 text-green-700" : "text-gray-700"
                            }`
                          }
                        >
                          {({ selected }) => (
                            <div className="flex justify-between items-center">
                              <span>{priority}</span>
                              {selected && <Check className="w-4 h-4 text-green-600" />}
                            </div>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
            </div>
          </div>

          {/* Task Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="p-3">Task ID</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Priority</th>
                  <th className="p-3">Progress</th>
                  <th className="p-3">Due Date</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task) => (
                  <tr key={task.id} className="border-t hover:bg-orange-50">
                    <td className="p-3 font-medium">{task.id}</td>
                    <td className="p-3">{task.type}</td>
                    <td className="p-3 text-gray-600">{task.location}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          task.status === "In Progress"
                            ? "bg-blue-100 text-blue-700"
                            : task.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {task.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          task.priority === "High"
                            ? "bg-red-500 text-white"
                            : task.priority === "Medium"
                            ? "bg-yellow-400 text-white"
                            : "bg-green-500 text-white"
                        }`}
                      >
                        {task.priority}
                      </span>
                    </td>
                    <td className="p-3 w-36">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded h-2">
                          <div
                            className={`h-2 rounded ${
                              task.progress >= 80
                                ? "bg-green-500"
                                : task.progress >= 50
                                ? "bg-orange-500"
                                : "bg-red-500"
                            }`}
                            style={{ width: `${task.progress}%` }}
                          ></div>
                        </div>
                        <span
                          className={`text-xs font-medium ${
                            task.progress >= 80
                              ? "text-green-600"
                              : task.progress >= 50
                              ? "text-orange-600"
                              : "text-red-600"
                          }`}
                        >
                          {task.progress}%
                        </span>
                      </div>
                    </td>
                    <td className="p-3">{task.dueDate}</td>
                    <td className="p-3">
                      <button className="px-3 py-1 text-xs border rounded text-orange-600 border-orange-400 hover:bg-orange-50">
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredTasks.length === 0 && (
              <p className="text-center text-sm text-gray-500 py-4">
                No tasks match the selected filters.
              </p>
            )}
          </div>
        </div>

        {/* Recently Completed */}
        <div className="bg-white rounded-xl border p-5">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-700 mb-4">
            <CheckCircle className="w-5 h-5 text-green-500" /> Recently Completed Tasks
          </h2>
          <div className="space-y-4">
            {completedTasks.map((task) => (
              <div key={task.id} className="border rounded-lg p-4 hover:shadow hover:-translate-y-1 transition-transform">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium text-gray-800">{task.type}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-gray-400" /> {task.location}
                    </p>
                    <p className="text-xs text-gray-400">Completed: {task.completedDate}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700">
                      Completed
                    </span>
                    <span className="text-xs text-gray-500">Duration: {task.duration}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-24 flex items-center justify-center bg-gray-100 rounded-lg text-gray-400 text-sm">
                    Before 📷
                  </div>
                  <div className="h-24 flex items-center justify-center bg-gray-100 rounded-lg text-gray-400 text-sm">
                    After 📷
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
