"use client"

import { useState, useRef } from "react"
import { Upload, X, ChevronLeft } from "lucide-react"
import NavBar from "./miniComponents/NavBar"
import Footer from "./miniComponents/Footer"
import { NavLink } from "react-router-dom"
import axios from "../config/axios"

export default function FeedbackForm() {
  const [form, setForm] = useState({
    category: "",
    title: "",
    description: "",
    files: [],
  })

  const [submitting, setSubmitting] = useState(false)
  const inputRef = useRef(null)

  const categories = [
    "Select a category",
    "Water Supply",
    "Education",
    "Healthcare",
    "Roads & Connectivity",
    "Electricity",
    "Sanitation",
    "Other",
  ]

  const onFilePick = (e) => {
    const files = Array.from(e.target.files || [])
    setForm((s) => ({ ...s, files: [...s.files, ...files] }))
  }

  const removeFile = (idx) => {
    setForm((s) => ({ ...s, files: s.files.filter((_, i) => i !== idx) }))
  }

  const disabled =
    !form.category ||
    form.category === "Select a category" ||
    !form.title.trim() ||
    form.description.trim().length < 20 ||
    submitting

  const handleSubmit = async (e) => {
    e.preventDefault()

    const fd = new FormData()
    fd.append("category", form.category)
    fd.append("title", form.title.trim())
    fd.append("description", form.description.trim())
    form.files.forEach((file) => fd.append("files", file))

    try {
      setSubmitting(true)
      const token = localStorage.getItem("authToken")
      await axios.post("/api/v1/feedback", fd, {
        headers: {
          "Content-Type": "multipart/form-data",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      })
      setForm({ category: "", title: "", description: "", files: [] })
      alert("Feedback submitted successfully.")
    } catch (err) {
      if (err.response) {
        console.error("Server error:", err.response.status, err.response.data)
        alert(`Error: ${err.response.status} — ${err.response.data?.message || "Submission failed"}`)
      } else if (err.request) {
        console.error("No response received:", err.request)
        alert("Network or server unreachable. Please try again.")
      } else {
        console.error("Request setup error:", err.message)
        alert("Unexpected error. Please try again.")
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-14 w-full bg-gradient-to-r from-blue-50 via-cyan-50 to-emerald-50" />
      <NavBar />
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        <div className="flex items-start justify-between gap-3 mt-4">
          {/* Left: back + titles */}
          <div className="flex items-start gap-2">
            <NavLink
              to="/CitizenDashboard"
              aria-label="Go back"
              className="mt-0.5 p-1 rounded hover:bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            >
              <ChevronLeft className="w-5 h-5" />
            </NavLink>

            <div>
              <h1 className="text-xl font-semibold text-gray-900 leading-none">Submit Feedback</h1>
              <p className="text-sm text-gray-500">Share your suggestions and feedback for village development</p>
            </div>
          </div>

          {/* Right: pill badge */}
          <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium text-white bg-gradient-to-r from-blue-600 to-emerald-500">
            Community Feedback
          </span>
        </div>
        <div className="bg-white rounded-2xl border shadow-sm">
          <div className="px-4 py-3 border-b bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-2xl">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <h2 className="font-semibold text-gray-900">Feedback Form</h2>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-6">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Feedback Category <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={form.category}
                  onChange={(e) => setForm((s) => ({ ...s, category: e.target.value }))}
                  className="w-full h-11 rounded-xl border border-gray-200 bg-white appearance-none pl-4 pr-10 shadow-sm text-gray-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-300 transition"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Feedback Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Brief title for your feedback"
                value={form.title}
                onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
                className="w-full h-11 rounded-xl border border-gray-200 bg-white px-4 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-300 transition"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Detailed Description <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={5}
                placeholder="Provide detailed feedback, suggestions, or concerns..."
                value={form.description}
                onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-300 transition"
              />
              <p className="mt-1 text-xs text-gray-500">
                Minimum 20 characters ({Math.min(form.description.trim().length, 20)}/20)
              </p>
            </div>

            {/* Uploads */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Supporting Documents (Optional)</label>

              <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50/60 p-6 text-center">
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-white shadow-sm border flex items-center justify-center">
                    <Upload className="w-5 h-5 text-gray-500" />
                  </div>
                  <p className="text-sm text-gray-600">Upload photos, PDFs, or documents</p>
                  <div>
                    <button
                      type="button"
                      onClick={() => inputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg border bg-white text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    >
                      Choose Files
                    </button>
                    <input
                      ref={inputRef}
                      type="file"
                      multiple
                      onChange={onFilePick}
                      className="hidden"
                      accept=".pdf,.png,.jpg,.jpeg"
                    />
                  </div>
                  <p className="text-xs text-gray-400">Max file size: 5MB (PDF, JPG, PNG)</p>
                </div>

                {form.files.length > 0 && (
                  <ul className="mt-4 grid sm:grid-cols-2 gap-2 text-left">
                    {form.files.map((f, idx) => (
                      <li
                        key={`${f.name}-${idx}`}
                        className="flex items-center justify-between gap-2 rounded-lg bg-white border px-3 py-2"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm text-gray-800">{f.name}</p>
                          <p className="text-xs text-gray-500">{(f.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(idx)}
                          className="p-1 rounded hover:bg-gray-100 text-gray-500"
                          aria-label={`Remove ${f.name}`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                className="px-4 py-2 rounded-xl border bg-white text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                onClick={() => setForm({ category: "", title: "", description: "", files: [] })}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={disabled}
                className={`w-48 rounded-xl px-4 py-2.5 text-white font-medium shadow-sm transition ${
                  disabled
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-500 hover:opacity-95"
                }`}
              >
                {submitting ? "Submitting..." : "Submit Feedback"}
              </button>
            </div>
          </form>
        </div>

        {/* Guidelines */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
          <h3 className="font-semibold text-gray-800 mb-3">Feedback Guidelines</h3>
          <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
            <li>Provide constructive feedback that can help improve village services.</li>
            <li>Be specific about the issue or suggestion being shared.</li>
            <li>Attach relevant documents or photos to support the feedback.</li>
            <li>Feedback is typically reviewed within 5–7 working days.</li>
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  )
}
