import React from "react";
import VillageDashboardHero from "../components/VillageDashboardHero";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Basic Leaflet default icon fix for Vite builds
const DefaultIcon = L.icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function VDMap() {
  // Example center (Ranchi)
  const center = [23.3441, 85.3096];

  // Example data (replace with API data)
  const schools = [
    { id: 1, name: "Govt. Primary School", pos: [23.346, 85.305] },
    { id: 2, name: "Middle School", pos: [23.343, 85.312] },
  ];
  const health = [
    { id: 1, name: "Primary Health Center", pos: [23.341, 85.307] },
  ];
  const waterPoints = [
    { id: 1, name: "Hand Pump", pos: [23.347, 85.309] },
    { id: 2, name: "Tube Well", pos: [23.345, 85.315] },
  ];
  const roads = [
    // Polyline between two points just for demo
    [
      [23.342, 85.304],
      [23.346, 85.316],
    ],
  ];
  const electricity = [
    { id: 1, name: "Transformer", pos: [23.343, 85.305] },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <VillageDashboardHero />

      {/* Body */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-6 space-y-6">
        <div className="bg-white rounded-2xl border shadow-sm">
          <div className="px-4 py-3 border-b">
            <h3 className="text-sm font-semibold text-gray-900">Village Infrastructure Map</h3>
          </div>

          {/* Map area */}
          <div className="p-4">
            <div className="h-[460px] w-full rounded-xl overflow-hidden bg-gray-100">
              <MapContainer
                center={center}
                zoom={13}
                scrollWheelZoom={true}
                className="h-full w-full"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Schools (blue) */}
                {schools.map((s) => (
                  <CircleMarker
                    key={`school-${s.id}`}
                    center={s.pos}
                    radius={8}
                    color="#2563EB"
                    fillColor="#2563EB"
                    fillOpacity={0.8}
                  >
                    <Popup>
                      <div className="text-sm">
                        <div className="font-medium">School</div>
                        <div className="text-gray-600">{s.name}</div>
                      </div>
                    </Popup>
                  </CircleMarker>
                ))}

                {/* Health centers (red) */}
                {health.map((h) => (
                  <CircleMarker
                    key={`health-${h.id}`}
                    center={h.pos}
                    radius={8}
                    color="#EF4444"
                    fillColor="#EF4444"
                    fillOpacity={0.85}
                  >
                    <Popup>
                      <div className="text-sm">
                        <div className="font-medium">Health Center</div>
                        <div className="text-gray-600">{h.name}</div>
                      </div>
                    </Popup>
                  </CircleMarker>
                ))}

                {/* Water points (green) */}
                {waterPoints.map((w) => (
                  <CircleMarker
                    key={`water-${w.id}`}
                    center={w.pos}
                    radius={8}
                    color="#10B981"
                    fillColor="#10B981"
                    fillOpacity={0.85}
                  >
                    <Popup>
                      <div className="text-sm">
                        <div className="font-medium">Water Point</div>
                        <div className="text-gray-600">{w.name}</div>
                      </div>
                    </Popup>
                  </CircleMarker>
                ))}

                {/* Roads (amber) */}
                {roads.map((r, idx) => (
                  <Polyline key={`road-${idx}`} positions={r} color="#F59E0B" weight={5} />
                ))}

                {/* Electricity nodes (purple) */}
                {electricity.map((e) => (
                  <Marker key={`elec-${e.id}`} position={e.pos}>
                    <Popup>
                      <div className="text-sm">
                        <div className="font-medium">Electricity</div>
                        <div className="text-gray-600">{e.name}</div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>

            {/* Legend */}
            <div className="mt-4 flex flex-wrap items-center gap-5 text-sm">
              <LegendDot color="#2563EB" label="Schools" />
              <LegendDot color="#EF4444" label="Health Centers" />
              <LegendDot color="#10B981" label="Water Points" />
              <LegendDot color="#F59E0B" label="Roads" />
              <LegendDot color="#8B5CF6" label="Electricity" />
            </div>

            <p className="mt-2 text-xs text-gray-500">
              Interactive GIS map showing village infrastructure. Map will display schools, health centers,
              water points, roads, and electricity coverage.
            </p>
          </div>
        </div>

        {/* Bottom quick links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="group flex items-center justify-between rounded-2xl border bg-white shadow-sm hover:bg-emerald-50 px-4 py-4 transition">
            <div className="flex items-center gap-3">
              <span className="inline-flex w-8 h-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                🏛️
              </span>
              <div className="text-left">
                <div className="font-medium text-gray-900">Government Schemes</div>
                <div className="text-xs text-gray-600">Explore available schemes and benefits</div>
              </div>
            </div>
            <span className="text-emerald-600 group-hover:translate-x-0.5 transition">›</span>
          </button>

          <button className="group flex items-center justify-between rounded-2xl border bg-white shadow-sm hover:bg-blue-50 px-4 py-4 transition">
            <div className="flex items-center gap-3">
              <span className="inline-flex w-8 h-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                📈
              </span>
              <div className="text-left">
                <div className="font-medium text-gray-900">Village Progress</div>
                <div className="text-xs text-gray-600">Track development projects and growth</div>
              </div>
            </div>
            <span className="text-blue-600 group-hover:translate-x-0.5 transition">›</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Small legend item
function LegendDot({ color, label }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-gray-700 text-xs">{label}</span>
    </span>
  );
}
