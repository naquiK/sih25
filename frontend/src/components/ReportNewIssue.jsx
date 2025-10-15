"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowLeft, FileImage, Mic, Crosshair, FileText } from "lucide-react"
import { useNavigate } from "react-router-dom"
import axios from "../config/axios"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import NavBar from "./miniComponents/NavBar"
import Footer from "./miniComponents/Footer"
import { toast } from "react-toastify"

export default function ReportVillageIssue() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    title: "",
    category: "",
    village: "",
    latitude: "",
    longitude: "",
    urgency: "",
    description: "",
    photos: [],
    address: "",
  })

  const [villages, setVillages] = useState([])
  const [loadingVillages, setLoadingVillages] = useState(true)
  const [errorVillages, setErrorVillages] = useState(null)
  const [error, setError] = useState("")

  const mapInstance = useRef(null)
  const markerInstance = useRef(null)

  // === Fetch Villages ===
  useEffect(() => {
    const fetchVillages = async () => {
      try {
        setLoadingVillages(true)
        const baseURL = "" // same origin by default
        const res = await axios.get('/api/v1/villages')
        const dataArr = Array.isArray(res.data?.data) ? res.data.data : Array.isArray(res.data) ? res.data : []
        // Map to shape {name}
        const data = dataArr.map((v) => ({ name: v.name }))
        setVillages(data)
      } catch (err) {
        console.error("Error fetching villages:", err)
        setErrorVillages("Failed to load village list.")
      } finally {
        setLoadingVillages(false)
      }
    }
    fetchVillages()
  }, [])

  // === Reverse Geocode ===
  const reverseGeocode = async (lat, lng) => {
    try {
      const res = await axios.get("https://nominatim.openstreetmap.org/reverse", {
        params: { format: "json", lat, lon: lng },
      })
      return res.data.display_name || `Lat: ${lat}, Lng: ${lng}`
    } catch {
      return `Lat: ${lat}, Lng: ${lng}`
    }
  }

  // === Auto Detect Location ===
  useEffect(() => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported by your browser")
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude
        const lng = pos.coords.longitude
        const address = await reverseGeocode(lat, lng)

        setForm((prev) => ({
          ...prev,
          latitude: lat.toFixed(6),
          longitude: lng.toFixed(6),
          address,
        }))

        if (!mapInstance.current) {
          const map = L.map("map-preview").setView([lat, lng], 15)
          mapInstance.current = map

          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; OpenStreetMap contributors",
          }).addTo(map)

          markerInstance.current = L.marker([lat, lng], { draggable: true }).addTo(map)

          markerInstance.current.on("dragend", async () => {
            const { lat, lng } = markerInstance.current.getLatLng()
            const address = await reverseGeocode(lat, lng)
            setForm((prev) => ({
              ...prev,
              latitude: lat.toFixed(6),
              longitude: lng.toFixed(6),
              address,
            }))
          })
        } else {
          mapInstance.current.setView([lat, lng], 15)
          markerInstance.current.setLatLng([lat, lng])
        }
      },
      (err) => toast.error("Unable to fetch your location: " + err.message),
    )

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove()
        mapInstance.current = null
        markerInstance.current = null
      }
    }
  }, [])

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) return toast.error("Geolocation not supported")
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude
        const lng = pos.coords.longitude
        const address = await reverseGeocode(lat, lng)
        setForm((prev) => ({
          ...prev,
          latitude: lat.toFixed(6),
          longitude: lng.toFixed(6),
          address,
        }))
        if (mapInstance.current && markerInstance.current) {
          mapInstance.current.setView([lat, lng], 15)
          markerInstance.current.setLatLng([lat, lng])
        }
      },
      (err) => toast.error("Unable to fetch location: " + err.message),
    )
  }

  const categories = [
    "watersupply",
        "streetlight",
        "garbage",
        "water-leakage",
        "traficlight",
        "road-damage",
        "sewerage",
        "electricity-outage",
        "public-transport",
        "healthcare",
        "education",
        "law-order",
        "fire-emergency",
        "building-permit",
        "other",
  ]

  const urgencyLevels = ["low", "medium", "high", "critical"]

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files)
    setForm((prev) => ({ ...prev, photos: files }))
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (
      !form.title ||
      !form.category ||
      !form.village ||
      !form.latitude ||
      !form.longitude ||
      !form.urgency ||
      !form.description
    ) {
      setError("Please fill in all required fields before submitting.")
      return
    }
    setError("")

    try {
      const fd = new FormData()
      fd.append("title", form.title)
      fd.append("category", form.category)
      fd.append("village", form.village)
      fd.append("latitude", form.latitude)
      fd.append("longitude", form.longitude)
      fd.append("urgency", form.urgency)
      fd.append("description", form.description)
      // optional: district placeholder to satisfy backend model default
      fd.append("district", "Unknown")
      fd.append(
        "location",
        form.address ||
          (form.village
            ? `Village: ${form.village} (${form.latitude}, ${form.longitude})`
            : `${form.latitude}, ${form.longitude}`),
      )
      form.photos.forEach((p) => fd.append("photos", p))

      const token = localStorage.getItem("authToken")
      await axios.post(`/api/v1/reports`, fd, {
        headers: {
          "Content-Type": "multipart/form-data",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      })

      toast.success("Issue submitted successfully!")
      navigate("/CitizenDashboard")
    } catch (err) {
      console.error("Submit issue failed:", err)
      toast.error("Failed to submit the issue. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <div className="max-w-6xl mx-auto px-6 py-8 pt-20">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/CitizenDashboard")}
            className="flex items-center gap-1 px-3 py-2 border rounded-lg text-gray-600 bg-white shadow hover:bg-gray-50 text-sm font-bold"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-gray-800">Report Village Issue</h1>
            <p className="text-gray-500 text-sm">Help us monitor and improve rural development initiatives</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LEFT PANEL */}
          <form onSubmit={handleSubmit} className="space-y-5 bg-white rounded-xl shadow p-5 border">
            {/* Title */}
            <div>
              <label className="block font-semibold text-gray-700">Issue Title</label>
              <input
                type="text"
                name="title"
                placeholder="Enter issue title"
                value={form.title}
                onChange={handleChange}
                className="w-full mt-2 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block font-semibold text-gray-700">Issue Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full mt-2 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              >
                <option value="">Select category</option>
                {categories.map((c, i) => (
                  <option key={i} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Village */}
            <div>
              <label className="block font-semibold text-gray-700">Village</label>
              {loadingVillages ? (
                <p className="text-sm text-gray-500 mt-2">Loading villages...</p>
              ) : errorVillages ? (
                <p className="text-sm text-red-500 mt-2">{errorVillages}</p>
              ) : (
                <select
                  name="village"
                  value={form.village}
                  onChange={handleChange}
                  className="w-full mt-2 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                >
                  <option value="">Select village</option>
                  {villages.map((v, i) => (
                    <option key={i} value={v.name}>
                      {v.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="block font-semibold text-gray-700">Location</label>
              <div className="flex flex-wrap gap-3 mt-2">
                <input
                  type="text"
                  value={form.latitude}
                  readOnly
                  placeholder="Latitude"
                  className="flex-1 border rounded-lg px-3 py-2 bg-gray-100 text-gray-600"
                />
                <input
                  type="text"
                  value={form.longitude}
                  readOnly
                  placeholder="Longitude"
                  className="flex-1 border rounded-lg px-3 py-2 bg-gray-100 text-gray-600"
                />
                <button
                  type="button"
                  onClick={handleUseMyLocation}
                  className="flex items-center gap-1 px-4 py-2 border rounded-lg text-sm bg-green-50 hover:bg-green-100"
                >
                  <Crosshair className="w-4 h-4 text-green-600" /> Locate Me
                </button>
              </div>

              <div
                id="map-preview"
                className="mt-3 h-48 w-full rounded-lg border shadow-sm z-0 relative overflow-hidden"
              ></div>
            </div>

            {/* Urgency */}
            <div>
              <label className="block font-semibold text-gray-700">Urgency Level</label>
              <select
                name="urgency"
                value={form.urgency}
                onChange={handleChange}
                className="w-full mt-2 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              >
                <option value="">Select urgency</option>
                {urgencyLevels.map((u, i) => (
                  <option key={i} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block font-semibold text-gray-700">Description</label>
              <textarea
                name="description"
                rows="4"
                placeholder="Describe the issue in detail..."
                value={form.description}
                onChange={handleChange}
                className="w-full mt-2 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
              {/* Separate Voice Input button */}
              <button
                type="button"
                onClick={() => toast.info("Voice input coming soon!")}
                className="mt-3 inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg shadow hover:bg-gray-200 transition"
              >
                <Mic className="w-4 h-4 mr-2" />
                Voice Input
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-2">{error}</div>
            )}
          </form>

          {/* RIGHT PANEL */}
          <div className="space-y-5">
            {/* Photo Upload */}
            <div className="bg-white rounded-xl shadow p-5 border">
              <h3 className="flex items-center gap-2 font-semibold text-gray-700 mb-3">
                <FileImage className="w-5 h-5 text-green-600" /> Photo Evidence
              </h3>
              <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg h-32 text-gray-400 cursor-pointer hover:bg-gray-50 hover:border-green-500 relative">
                <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoChange} />
                <FileImage className="w-8 h-8 mb-1" />
                <span>Click or tap to upload</span>
              </label>
              {form.photos.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {form.photos.map((photo, idx) => (
                    <img
                      key={idx}
                      src={URL.createObjectURL(photo) || "/placeholder.svg"}
                      alt="Preview"
                      className="h-24 w-full object-cover rounded-lg border"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Live Preview */}
            <div>
              <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200 mt-6">
                <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-green-600" /> Live Preview
                </h3>

                <div className="border rounded-xl p-6 bg-gray-50 space-y-4">
                  {/* Title */}
                  <div>
                    <h4 className="text-lg font-bold text-gray-800">{form.title || "Issue title will appear here"}</h4>
                  </div>

                  {/* Category and Village */}
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold text-gray-700">Category:</span>{" "}
                      {form.category || "No category selected"}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold text-gray-700">Village:</span>{" "}
                      {form.village || "No village selected"}
                    </p>
                  </div>

                  {/* Urgency */}
                  <div>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold text-gray-700">Urgency:</span> {form.urgency || "N/A"}
                    </p>
                  </div>

                  {/* Description */}
                  <div>
                    <h5 className="font-semibold text-gray-700 mb-1">Description</h5>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {form.description || "Description will appear here..."}
                    </p>
                  </div>

                  {/* Photos */}
                  {form.photos.length > 0 && (
                    <div>
                      <h5 className="font-semibold text-gray-700 mb-2">Attached Photos</h5>
                      <div className="flex flex-wrap gap-3">
                        {form.photos.map((p, i) => (
                          <img
                            key={i}
                            src={URL.createObjectURL(p) || "/placeholder.svg"}
                            alt=""
                            className="h-24 w-24 object-cover rounded-lg border border-gray-300 shadow-sm"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Submit */}
        <div className="flex justify-end mb-10 mt-6">
          <button
            onClick={handleSubmit}
            type="button"
            className="w-full justify-center flex items-center gap-2 px-5 py-2 rounded-lg text-white font-medium 
             bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 
             transition"
          >
            Submit Issue
          </button>
        </div>
      </div>

      <Footer />
    </div>
  )
}
