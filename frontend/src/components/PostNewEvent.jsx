"use client"

import { useMemo, useRef, useState, Fragment } from "react"
import axios from "../config/axios"
import { useParams } from "react-router-dom"
import {
  CalendarDays,
  MapPin,
  Tag,
  UploadCloud,
  Megaphone,
  Users,
  Check,
  ChevronDown,
  Trash2,
  ArrowLeft,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Listbox, Transition } from "@headlessui/react"
import Footer from "./miniComponents/Footer"
import NavBar from "./miniComponents/NavBar"

const CATEGORIES = [
  { id: "cultural", name: "Cultural Event", icon: "🎉" },
  { id: "sports", name: "Sports & Games", icon: "🏅" },
  { id: "educational", name: "Educational", icon: "📚" },
  { id: "health", name: "Health & Wellness", icon: "🩺" },
  { id: "agriculture", name: "Agriculture", icon: "🌾" },
  { id: "technology", name: "Technology", icon: "💻" },
  { id: "community", name: "Community Meeting", icon: "👥" },
  { id: "celebration", name: "Celebration", icon: "🎂" },
  { id: "awareness", name: "Awareness Campaign", icon: "📣" },
  { id: "other", name: "Other", icon: "📌" },
]

const AUDIENCE = [
  "All Villagers",
  "Youth (18-35)",
  "Senior Citizens",
  "Women",
  "Farmers",
  "Students",
  "Business Owners",
  "Specific Group",
]

export default function PostNewEvent() {
  // Floating-field helpers
  const [title, setTitle] = useState("")
  const [desc, setDesc] = useState("")
  const [category, setCategory] = useState(CATEGORIES[0])
  const [eventDate, setEventDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [location, setLocation] = useState("")
  const [audience, setAudience] = useState(AUDIENCE[0])
  const [regRequired, setRegRequired] = useState(false)
  const [maxParticipants, setMaxParticipants] = useState("")
  const [regDeadline, setRegDeadline] = useState("")
  const navigate = useNavigate()
  const [orgBody, setOrgBody] = useState("")
  const [contactPerson, setContactPerson] = useState("")
  const [contactPhone, setContactPhone] = useState("")
  const [contactEmail, setContactEmail] = useState("")

  const [tagInput, setTagInput] = useState("")
  const [tags, setTags] = useState([])
  const [banner, setBanner] = useState(null)
  const [bannerPreview, setBannerPreview] = useState("")

  const fileRef = useRef(null)

  const { villageId } = useParams()

  const canAddTag = useMemo(
    () => tagInput.trim().length > 0 && !tags.includes(tagInput.trim()) && tags.length < 5,
    [tagInput, tags],
  )

  const addTag = () => {
    if (!canAddTag) return
    setTags((t) => [...t, tagInput.trim()])
    setTagInput("")
  }

  const removeTag = (t) => {
    setTags((arr) => arr.filter((x) => x !== t))
  }

  const onPickBanner = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    if (!/^image\//.test(f.type)) {
      alert("Please select an image file (PNG or JPG).")
      return
    }
    if (f.size > 5 * 1024 * 1024) {
      alert("File too large. Max size is 5MB.")
      return
    }
    setBanner(f)
    setBannerPreview(URL.createObjectURL(f))
  }

  const resetForm = () => {
    setTitle("")
    setDesc("")
    setCategory(CATEGORIES[0])
    setEventDate("")
    setStartTime("")
    setEndTime("")
    setLocation("")
    setAudience(AUDIENCE[0])
    setRegRequired(false)
    setMaxParticipants("")
    setRegDeadline("")
    setOrgBody("")
    setContactPerson("")
    setContactPhone("")
    setContactEmail("")
    setTags([])
    setTagInput("")
    setBanner(null)
    setBannerPreview("")
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    // Basic client validation
    if (!title.trim()) return alert("Please enter Event Title")
    if (!desc.trim()) return alert("Please enter Event Description")
    if (!eventDate) return alert("Please select Event Date")
    if (!startTime || !endTime) return alert("Please select Start and End Time")
    if (!location.trim()) return alert("Please enter Event Location")
    if (regRequired) {
      if (!maxParticipants) return alert("Enter max participants")
      if (!regDeadline) return alert("Select a registration deadline")
    }

    const payload = {
      title: title.trim(),
      description: desc.trim(),
      category: category.id, // store the id; backend can map to display name
      eventDate,
      startTime,
      endTime,
      location: location.trim(),
      audience,
      registration: regRequired
        ? {
            required: true,
            maxParticipants: Number(maxParticipants),
            deadline: regDeadline,
          }
        : { required: false },
      contact: {
        organization: orgBody.trim(),
        person: contactPerson.trim(),
        phone: contactPhone.trim(),
        email: contactEmail.trim(),
      },
      tags,
    }

    const fd = new FormData()
    fd.append("data", JSON.stringify(payload))
    fd.append("village", villageId) // ensure backend gets village in req.body
    if (banner) fd.append("banner", banner)

    try {
      const token = localStorage.getItem("authToken")
      await axios.post("/api/v1/events", fd, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
      })
      alert("Event published!")
      resetForm()
      navigate(`/village/${villageId}/events&announcements`)
    } catch (err) {
      console.error(err)
      alert("Failed to publish event.")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <NavBar />
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-2 ml-14">
          <button
            onClick={() => navigate(`/village/${villageId}/events&announcements`)}
            className="flex items-center gap-1 px-3 py-2 border rounded-lg text-gray-600 bg-white shadow hover:bg-gray-50 text-sm font-bold"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-gray-800">Post New Event</h1>
            <p className="text-gray-500 text-sm">Create and publish a new village event</p>
          </div>
        </div>
        <form onSubmit={onSubmit} className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-6 space-y-5">
          {/* Basic Event Information */}
          <Card title="Basic Event Information" icon={<Megaphone className="w-4 h-4 text-blue-600" />}>
            <div className="grid grid-cols-1 gap-4">
              <FloatingInput
                label="Event Title *"
                placeholder="e.g., Annual Village Sports Day"
                value={title}
                onChange={setTitle}
              />

              <FloatingTextarea
                label="Event Description *"
                placeholder="Provide detailed information about the event..."
                value={desc}
                onChange={setDesc}
                maxLength={500}
                showCounter
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectListbox
                  label="Category *"
                  value={category}
                  onChange={setCategory}
                  options={CATEGORIES}
                  display={(o) => (
                    <span className="inline-flex items-center gap-2">
                      <span className="text-base leading-none">{o.icon}</span>
                      {o.name}
                    </span>
                  )}
                />

                {/* Priority Level intentionally omitted */}
              </div>
            </div>
          </Card>

          {/* Date, Time & Location */}
          <Card title="Date, Time & Location" icon={<CalendarDays className="w-4 h-4 text-sky-600" />}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FloatingInput
                type="date"
                label="Event Date *"
                placeholder="mm/dd/yyyy"
                value={eventDate}
                onChange={setEventDate}
              />
              <FloatingInput
                type="time"
                label="Start Time *"
                placeholder="--:--"
                value={startTime}
                onChange={setStartTime}
              />
              <FloatingInput type="time" label="End Time *" placeholder="--:--" value={endTime} onChange={setEndTime} />
            </div>
            <div className="mt-4">
              <FloatingInput
                label="Event Location *"
                placeholder="e.g., Village Community Center, Main Ground"
                value={location}
                onChange={setLocation}
                leftIcon={<MapPin className="w-4 h-4 text-gray-500" />}
              />
            </div>
          </Card>

          {/* Target Audience & Registration */}
          <Card title="Target Audience & Registration" icon={<Users className="w-4 h-4 text-emerald-600" />}>
            <div className="grid grid-cols-1 gap-4">
              <SimpleSelect label="Target Audience" value={audience} onChange={setAudience} options={AUDIENCE} />

              <div className="rounded-xl border bg-white p-3">
                <label className="inline-flex items-center gap-2 text-sm text-gray-800">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300"
                    checked={regRequired}
                    onChange={(e) => setRegRequired(e.target.checked)}
                  />
                  Registration Required
                </label>

                {regRequired && (
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FloatingInput
                      type="number"
                      label="Max Participants"
                      placeholder="e.g., 100"
                      value={maxParticipants}
                      onChange={setMaxParticipants}
                    />
                    <FloatingInput
                      type="date"
                      label="Registration Deadline"
                      placeholder="mm/dd/yyyy"
                      value={regDeadline}
                      onChange={setRegDeadline}
                    />
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Contact Information */}
          <Card title="Contact Information" icon={<Users className="w-4 h-4 text-amber-600" />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FloatingInput
                label="Organizing Body"
                placeholder="e.g., Village Panchayat"
                value={orgBody}
                onChange={setOrgBody}
              />
              <FloatingInput
                label="Contact Person"
                placeholder="e.g., Ramesh Kumar"
                value={contactPerson}
                onChange={setContactPerson}
              />
              <FloatingInput
                label="Contact Phone"
                placeholder="e.g., +91 98765 43210"
                value={contactPhone}
                onChange={setContactPhone}
              />
              <FloatingInput
                label="Contact Email"
                placeholder="e.g., panchayat@village.in"
                value={contactEmail}
                onChange={setContactEmail}
              />
            </div>
          </Card>

          {/* Tags & Media */}
          <Card title="Tags & Media" icon={<Tag className="w-4 h-4 text-indigo-600" />}>
            <div className="space-y-4">
              {/* Tags input */}
              <div>
                <label className="text-xs font-medium text-gray-700">Event Tags (Max 5)</label>
                <div className="mt-1 flex gap-2">
                  <input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addTag()
                      }
                    }}
                    placeholder="Add a tag..."
                    className="flex-1 h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    disabled={!canAddTag}
                    className={`h-10 rounded-xl px-3 text-sm font-medium border ${
                      canAddTag
                        ? "bg-white text-gray-800 hover:bg-gray-50"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Add
                  </button>
                </div>

                {tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {tags.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-2 rounded-full bg-gray-100 text-gray-700 px-3 py-1 text-[11px]"
                      >
                        #{t}
                        <button
                          type="button"
                          onClick={() => removeTag(t)}
                          className="text-gray-500 hover:text-gray-700"
                          aria-label={`Remove ${t}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Banner upload */}
              <div>
                <label className="text-xs font-medium text-gray-700">Event Banner Image</label>
                <div
                  onClick={() => fileRef.current?.click()}
                  className="mt-1 cursor-pointer rounded-2xl border border-dashed border-gray-300 bg-gray-50/60 p-6 text-center hover:bg-gray-50"
                >
                  {bannerPreview ? (
                    <div className="relative mx-auto max-w-lg">
                      <img
                        src={bannerPreview || "/placeholder.svg"}
                        alt="Event banner preview"
                        className="rounded-xl border object-cover w-full h-48"
                      />
                      <div className="mt-2 text-xs text-gray-500">
                        {banner?.name} · {(banner?.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-2 text-gray-600">
                      <UploadCloud className="w-7 h-7" />
                      <div className="text-sm">Click to upload event banner</div>
                      <div className="text-xs text-gray-500">PNG, JPG up to 5MB</div>
                    </div>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" onChange={onPickBanner} className="hidden" />
              </div>
            </div>
          </Card>

          {/* Bottom actions */}
          <div className="rounded-2xl border bg-blue-50/60">
            <div className="px-4 py-3 text-xs text-gray-600">All fields marked with * are required</div>
            <div className="px-4 py-3 border-t flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                <CalendarDays className="w-4 h-4" />
                Publish Event
              </button>
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  )
}

/* ---------------- Reusable UI ---------------- */

function Card({ title, icon, children }) {
  return (
    <div className="bg-white rounded-2xl border shadow-sm">
      <div className="px-4 py-3 border-b flex items-center gap-2">
        <span>{icon}</span>
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}

// Floating input with active label behavior (focus or has value -> floats)
function FloatingInput({ label, placeholder = "", value, onChange, type = "text", leftIcon = null }) {
  return (
    <div className="relative">
      {/* Label always above the field */}
      <span
        className={[
          "absolute -top-2 z-[1] bg-white px-1 text-[11px] text-gray-600",
          leftIcon ? "left-9" : "left-3",
        ].join(" ")}
      >
        {label}
      </span>

      {/* Optional left icon */}
      {leftIcon && <span className="absolute left-3 top-1/2 -translate-y-1/2">{leftIcon}</span>}

      <input
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className={[
          "w-full h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm shadow-sm",
          "placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40",
          leftIcon ? "pl-9" : "",
        ].join(" ")}
      />
    </div>
  )
}

function FloatingTextarea({
  label,
  placeholder = "",
  value,
  onChange,
  maxLength = 500,
  showCounter = false,
  rows = 5,
}) {
  return (
    <div className="relative">
      {/* Label always above the field */}
      <span className="absolute -top-2 left-3 z-[1] bg-white px-1 text-[11px] text-gray-600">{label}</span>

      <textarea
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={rows}
        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
      />
      {showCounter && (
        <div className="mt-1 text-[11px] text-gray-500">
          {value.length}/{maxLength} characters
        </div>
      )}
    </div>
  )
}

// Headless UI Listbox for category with icon content
function SelectListbox({ label, value, onChange, options, display }) {
  return (
    <div className="relative">
      <label className="mb-1 block text-xs font-medium text-gray-700">{label}</label>
      <Listbox value={value} onChange={onChange}>
        <Listbox.Button className="h-11 w-full rounded-xl border bg-white px-3 text-sm text-gray-900 shadow-sm flex items-center justify-between">
          <span className="truncate">{display ? display(value) : value?.name}</span>
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
            {options.map((opt) => (
              <Listbox.Option
                key={opt.id}
                value={opt}
                className={({ active, selected }) =>
                  [
                    "cursor-pointer select-none px-3 py-2 text-sm",
                    active ? "bg-gray-100" : "bg-white",
                    selected ? "text-gray-900" : "text-gray-700",
                  ].join(" ")
                }
              >
                {({ selected }) => (
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2">
                      <span className="text-base leading-none">{opt.icon}</span>
                      {opt.name}
                    </span>
                    {selected && <Check className="w-4 h-4 text-blue-600" />}
                  </div>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </Listbox>
    </div>
  )
}

// Simple Listbox for single string options
function SimpleSelect({ label, value, onChange, options }) {
  return (
    <div className="relative">
      <label className="mb-1 block text-xs font-medium text-gray-700">{label}</label>
      <Listbox value={value} onChange={onChange}>
        <Listbox.Button className="h-11 w-full rounded-xl border bg-white px-3 text-sm text-gray-900 shadow-sm flex items-center justify-between">
          <span className="truncate">{value}</span>
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
            {options.map((opt) => (
              <Listbox.Option
                key={opt}
                value={opt}
                className={({ active, selected }) =>
                  [
                    "cursor-pointer select-none px-3 py-2 text-sm",
                    active ? "bg-gray-100" : "bg-white",
                    selected ? "text-gray-900" : "text-gray-700",
                  ].join(" ")
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
      </Listbox>
    </div>
  )
}
