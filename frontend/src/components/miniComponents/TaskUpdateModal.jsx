import React, { useEffect, useMemo, useRef, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import {
  X,
  CheckCircle2,
  MapPin,
  Clock,
  ClipboardList,
  Camera,
  Send,
  ShieldCheck,
  Target,
  Navigation,
} from "lucide-react";
// import axios from "axios"; // Uncomment when backend is ready

export default function TaskUpdateModal({
  open,
  onClose,
  task = {
    id: "TSK001",
    title: "Primary Health Center Construction",
    type: "Inspection",
    village: "Sonbarsa",
    assignedBy: "District Coordinator",
    gps: "23.3441, 85.3096",
    progress: 50,
  },
}) {
  // Checklist mock; replace from API if needed
  const [checks, setChecks] = useState([
    { id: "c1", label: "Verify foundation depth", done: true },
    { id: "c2", label: "Check material quality certificates", done: true },
    { id: "c3", label: "Document progress with photos", done: false },
    { id: "c4", label: "Update timeline estimates", done: false },
  ]);
  const [status, setStatus] = useState("In Progress");
  const [notes, setNotes] = useState("");
  const [location, setLocation] = useState("");
  const [files, setFiles] = useState([]);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (open) {
      // reset on open if desired
      // setNotes(""); setFiles([]);
    }
  }, [open]);

  const completedCount = useMemo(
    () => checks.filter((c) => c.done).length,
    [checks]
  );

  const toggleCheck = (id) =>
    setChecks((prev) =>
      prev.map((c) => (c.id === id ? { ...c, done: !c.done } : c))
    );

  const onPickFiles = (e) => {
    const picked = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...picked]);
  };

  const captureGPS = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported on this device.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
      },
      (err) => {
        console.error(err);
        alert("Unable to fetch GPS location.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      taskId: task.id,
      status,
      notes,
      location,
      checklist: checks,
    };

    // Build multipart when sending photos
    // const fd = new FormData();
    // fd.append("taskId", task.id);
    // fd.append("status", status);
    // fd.append("notes", notes);
    // fd.append("location", location);
    // fd.append("checklist", JSON.stringify(checks));
    // files.forEach((f) => fd.append("photos", f));
    // try {
    //   await axios.post("/api/v1/worker/tasks/update", fd, {
    //     headers: { "Content-Type": "multipart/form-data" },
    //   });
    //   onClose?.();
    // } catch (err) {
    //   console.error("Update failed:", err);
    //   alert("Failed to submit update.");
    // }

    console.log("Submitting payload (stub):", payload, files);
    onClose?.();
  };

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/40" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-white shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <div>
              <DialogTitle className="text-sm font-semibold text-gray-900">
                {task.title}
              </DialogTitle>
              <p className="text-[11px] text-gray-500">
                Update task progress, complete checklist items, and upload geo-tagged photos
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded hover:bg-gray-100"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Meta */}
          <div className="p-4 grid grid-cols-2 gap-3 rounded-b-xl">
            <MetaItem icon={<Target className="w-4 h-4" />} label="Task ID" value={task.id} />
            <MetaItem icon={<ShieldCheck className="w-4 h-4" />} label="Type" value={task.type} />
            <MetaItem icon={<MapPin className="w-4 h-4" />} label="Village" value={task.village} />
            <MetaItem icon={<CheckCircle2 className="w-4 h-4" />} label="Assigned By" value={task.assignedBy} />
            <MetaItem icon={<Navigation className="w-4 h-4" />} label="GPS" value={task.gps} />
          </div>

          <form onSubmit={onSubmit} className="px-4 pb-4 space-y-4">
            {/* Checklist */}
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">
                Task Checklist
                <span className="ml-2 text-[11px] text-gray-500">
                  {completedCount}/{checks.length} done
                </span>
              </label>
              <div className="space-y-2">
                {checks.map((c) => (
                  <label
                    key={c.id}
                    className="flex items-center gap-2 rounded-lg border px-3 py-2 bg-white"
                  >
                    <input
                      type="checkbox"
                      checked={c.done}
                      onChange={() => toggleCheck(c.id)}
                      className="h-4 w-4 rounded"
                    />
                    <span className={`text-sm ${c.done ? "line-through text-gray-500" : "text-gray-800"}`}>
                      {c.label}
                    </span>
                    <span className="ml-auto text-emerald-600">
                      {c.done ? <CheckCircle2 className="w-4 h-4" /> : null}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Status select */}
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">
                Update Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              >
                <option>Pending</option>
                <option>In Progress</option>
                <option>Completed</option>
                <option>On Hold</option>
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">
                Work Notes
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add detailed notes about your field visit…"
                className="w-full h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </div>

            {/* Current Location */}
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">
                Current Location
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="No location captured"
                  className="flex-1 h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
                <button
                  type="button"
                  onClick={captureGPS}
                  className="inline-flex items-center gap-1 rounded-xl border bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  GPS
                </button>
              </div>
              <p className="mt-1 text-[11px] text-gray-500">
                GPS location will be automatically attached to your update
              </p>
            </div>

            {/* Photo upload */}
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">
                Upload Geo‑Tagged Photos
              </label>
              <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50/60 p-5 text-center">
                <div className="flex flex-col items-center justify-center gap-2">
                  <Camera className="w-6 h-6 text-gray-500" />
                  <p className="text-sm text-gray-600">
                    Take photos with automatic GPS tagging
                  </p>
                  <div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg border bg-white text-gray-700 shadow-sm hover:bg-gray-50"
                    >
                      Take Photo
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={onPickFiles}
                      className="hidden"
                    />
                  </div>
                </div>

                {files.length > 0 && (
                  <ul className="mt-4 grid sm:grid-cols-2 gap-2 text-left">
                    {files.map((f, idx) => (
                      <li
                        key={`${f.name}-${idx}`}
                        className="flex items-center justify-between gap-2 rounded-lg bg-white border px-3 py-2"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm text-gray-800">{f.name}</p>
                          <p className="text-xs text-gray-500">
                            {(f.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setFiles((prev) => prev.filter((_, i) => i !== idx))
                          }
                          className="text-xs text-gray-500 hover:underline"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <p className="mt-1 text-[11px] text-gray-500">
                Photos will include GPS coordinates, timestamp, and task reference
              </p>
            </div>

            {/* Submit */}
            <div className="pt-1">
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-white text-sm font-medium hover:bg-emerald-700"
              >
                <Send className="w-4 h-4" />
                Update with GPS
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

function MetaItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-2 text-[11px] text-gray-700">
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-gray-50 border">
        {icon}
      </span>
      <div>
        <div className="text-gray-500">{label}</div>
        <div className="font-medium text-gray-800">{value}</div>
      </div>
    </div>
  );
}
