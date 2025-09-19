import { useState, useEffect, useRef, Fragment } from "react";
import {ArrowLeft, MapPin, FileImage, Type, AlertCircle, Mic, Crosshair, Check, ChevronDown} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Listbox, Transition } from "@headlessui/react";
import NavBar from "./miniComponents/NavBar";
import Footer from "./miniComponents/Footer";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function ReportNewIssue() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    category: "",
    address: "",
    latitude: "",
    longitude: "",
    urgency: "",
    description: "",
    photo: null,
  });
  const [error, setError] = useState("");
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  // Dropdown data
  const categories = [
    { name: "Potholes", description: "Road damage, cracks, and holes" },
    { name: "Malfunctioning Streetlights", description: "Broken or non-working street lighting" },
    { name: "Overflowing Trash Bins", description: "Waste management issues" },
    { name: "Water Supply Issues", description: "Broken pipes, water shortage" },
    { name: "Drainage Problems", description: "Blocked drains, waterlogging" },
    { name: "Traffic Signals", description: "Malfunctioning traffic lights" },
    { name: "Others", description: "Other civic issues requiring attention" },
  ];

  const urgencyLevels = [
    { name: "Low", color: "bg-green-100 text-green-700" },
    { name: "Medium", color: "bg-yellow-100 text-yellow-700" },
    { name: "High", color: "bg-orange-100 text-orange-700" },
    { name: "Critical", color: "bg-red-100 text-red-700" },
  ];

  // ✅ Reverse Geocode function (using OpenStreetMap Nominatim)
  const reverseGeocode = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await res.json();
      return data.display_name || `Lat: ${lat}, Lng: ${lng}`;
    } catch {
      return `Lat: ${lat}, Lng: ${lng}`;
    }
  };

  // ✅ Auto-detect location on mount
  useEffect(() => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported by your browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const address = await reverseGeocode(lat, lng);

        setForm((prev) => ({
          ...prev,
          latitude: lat.toFixed(6),
          longitude: lng.toFixed(6),
          address,
        }));

        if (!mapRef.current) {
          mapRef.current = L.map("map-preview").setView([lat, lng], 15);

          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
          }).addTo(mapRef.current);

          markerRef.current = L.marker([lat, lng], { draggable: true }).addTo(
            mapRef.current
          );

          markerRef.current.on("dragend", async () => {
            const { lat, lng } = markerRef.current.getLatLng();
            const address = await reverseGeocode(lat, lng);
            setForm((prev) => ({
              ...prev,
              latitude: lat.toFixed(6),
              longitude: lng.toFixed(6),
              address,
            }));
          });
        } else {
          mapRef.current.setView([lat, lng], 15);
          markerRef.current.setLatLng([lat, lng]);
        }
      },
      () => alert("Unable to fetch your location")
    );
  }, []);
  const compressImage = (file, maxSize, quality) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // ✅ Keep aspect ratio
        if (width > height) {
          if (width > maxSize) {
            height = Math.round((height *= maxSize / width));
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = Math.round((width *= maxSize / height));
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            resolve(new File([blob], file.name, { type: "image/jpeg" }));
          },
          "image/jpeg",
          quality // compression quality (0.7 = 70%)
        );
      };
    };
  });
};

  // ✅ Handle "Detect My Location"
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const address = await reverseGeocode(lat, lng);

        setForm((prev) => ({
          ...prev,
          latitude: lat.toFixed(6),
          longitude: lng.toFixed(6),
          address,
        }));

        mapRef.current.setView([lat, lng], 15);
        markerRef.current.setLatLng([lat, lng]);
      },
      () => alert("Unable to fetch location")
    );
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !form.category ||
      !form.latitude ||
      !form.longitude ||
      !form.urgency ||
      !form.description
    ) {
      setError(
        "Please fill in all required fields: category, location, description, and urgency level"
      );
      return;
    }
    setError("");
    console.log("Submitting form:", form);
    // axios.post("/api/report", form)
    //   .then(() => navigate("/CitizenDashboard"))
    navigate("/CitizenDashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50 ">
      <NavBar />
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col gap-2 mb-6">
            <div className="flex items-center gap-4">
                <button
                onClick={() => navigate("/CitizenDashboard")}
                className="flex items-center gap-1 px-3 py-2 border rounded-lg text-gray-600 bg-white shadow hover:bg-gray-50 text-sm font-bold"
                >
                <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                </button>
                <div>
                <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
                    Report New Issue
                </h1>
                <p className="text-gray-500 text-sm">
                    Help us improve your community by reporting civic issues
                </p>
                </div>
            </div>
        </div>


        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Category */}
          <div className="bg-white rounded-xl shadow p-5 border">
            <h3 className="flex items-center gap-2 font-semibold text-gray-700">
              <Type className="w-5 h-5 text-green-600" /> Issue Category
            </h3>

            <Listbox
              value={form.category}
              onChange={(val) => setForm((prev) => ({ ...prev, category: val }))}
            >
              <div className="relative mt-3">
                <Listbox.Button className="relative w-full cursor-default rounded-lg border bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 sm:text-sm">
                  <span className="block truncate">
                    {form.category || "Select the type of issue"}
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </span>
                </Listbox.Button>

                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
                    {categories.map((cat, idx) => (
                      <Listbox.Option
                        key={idx}
                        value={cat.name}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-3 pr-9 ${
                            active
                              ? "bg-green-50 text-green-700"
                              : "text-gray-900"
                          }`
                        }
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className={`block font-medium ${
                                selected ? "text-green-600" : ""
                              }`}
                            >
                              {cat.name}
                            </span>
                            <span className="block text-xs text-gray-500">
                              {cat.description}
                            </span>
                            {selected ? (
                              <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-green-600">
                                <Check className="h-4 w-4" />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
          </div>

          {/* Photo */}
          {/* Photo */}
<div className="bg-white rounded-xl shadow p-5 border">
  <h3 className="flex items-center gap-2 font-semibold text-gray-700">
    <FileImage className="w-5 h-5 text-green-600" /> Photo Evidence
  </h3>
  <label className="mt-3 flex flex-col items-center justify-center border-2 border-dashed rounded-lg h-32 text-gray-400 cursor-pointer hover:bg-gray-50 hover:border-green-500 relative">
    <input
      type="file"
      name="photo"
      accept="image/*"
      capture="environment" // ✅ Open rear camera
      className="hidden"
      onChange={(e) => {
        const file = e.target.files[0];
        if (file) {
          compressImage(file, 800, 0.7).then((compressedFile) => {
            if (compressedFile.size > 2 * 1024 * 1024) {
              // ❌ Reject if > 2MB
              setError("Compressed photo is too large (must be under 2 MB). Please retake a smaller photo.");
              setForm((prev) => ({ ...prev, photo: null }));
            } else {
              setError("");
              setForm((prev) => ({ ...prev, photo: compressedFile }));
            }
          });
        }
      }}
    />
    {form.photo ? (
      <img
        src={URL.createObjectURL(form.photo)}
        alt="Preview"
        className="absolute inset-0 h-full w-full object-cover rounded-lg"
      />
    ) : (
      <>
        <FileImage className="w-8 h-8 mb-2" />
        <span>Tap to capture a photo</span>
      </>
    )}
  </label>

  {/* Show file size if valid */}
  {form.photo && (
    <p className="text-xs text-gray-500 mt-2">
      Photo captured (compressed) –{" "}
      <span className="font-medium text-gray-700">
        {Math.round(form.photo.size / 1024) > 1024
          ? (form.photo.size / 1024 / 1024).toFixed(2) + " MB"
          : Math.round(form.photo.size / 1024) + " KB"}
      </span>
    </p>
  )}
</div>


          {/* Location */}
          <div className="bg-white rounded-xl shadow p-5 border col-span-2">
            <h3 className="flex items-center gap-2 font-semibold text-gray-700">
              <MapPin className="w-5 h-5 text-green-600" /> Location Details
            </h3>
            <input
              type="text"
              name="address"
              value={form.address}
              readOnly
              placeholder="Detecting your location..."
              className="w-full mt-3 border rounded-lg px-3 py-2 bg-gray-100 text-gray-600"
            />
            <p className="text-sm text-gray-500 mt-1">
              Please provide as much detail as possible to help our teams locate
              the issue quickly
            </p>

            {/* Lat/Lng + Button */}
            <div className="flex flex-wrap gap-3 mt-3">
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
                <Crosshair className="w-4 h-4 text-green-600" /> Detect My
                Location
              </button>
            </div>

            {/* Map Preview */}
            <div
              id="map-preview"
              className="mt-4 h-56 w-full rounded-lg border shadow-sm"
            ></div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl shadow p-5 border">
            <h3 className="flex items-center gap-2 font-semibold text-gray-700">
              <Mic className="w-5 h-5 text-green-600" /> Description
            </h3>
            <textarea
              name="description"
              rows="4"
              placeholder="Describe the issue in detail..."
              value={form.description}
              onChange={handleChange}
              className="w-full mt-3 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          {/* Urgency */}
          <div className="bg-white rounded-xl shadow p-5 border">
            <h3 className="flex items-center gap-2 font-semibold text-gray-700">
              <AlertCircle className="w-5 h-5 text-green-600" /> Urgency Level
            </h3>
            <Listbox
              value={form.urgency}
              onChange={(val) => setForm((prev) => ({ ...prev, urgency: val }))}
            >
              <div className="relative mt-3">
                <Listbox.Button className="relative w-full cursor-default rounded-lg border bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 sm:text-sm">
                  <span className="block truncate">
                    {form.urgency || "How urgent is this issue?"}
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </span>
                </Listbox.Button>

                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
                    {urgencyLevels.map((level, idx) => (
                      <Listbox.Option
                        key={idx}
                        value={level.name}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-3 pr-9 ${
                            active
                              ? "bg-green-50 text-green-700"
                              : "text-gray-900"
                          }`
                        }
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-md text-sm font-medium ${level.color}`}
                            >
                              {level.name}
                            </span>
                            {selected ? (
                              <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-green-600">
                                <Check className="h-4 w-4" />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
          </div>
        </form>

        {/* Submit Section */}
        <div className="bg-white rounded-xl shadow p-5 border mt-6">
          <h3 className="font-semibold text-gray-700">Ready to Submit?</h3>
          <p className="text-gray-500 text-sm mb-3">
            Please review your information before submitting the report
          </p>
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-2 mb-3">
              {error}
            </div>
          )}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/CitizenDashboard")}
              className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow"
            >
              Submit Report
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
