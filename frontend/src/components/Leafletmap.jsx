import { useEffect } from "react";
import L from "leaflet";

export default function LeafletMap() {
  useEffect(() => {
    const map = L.map("map").setView([23.3441, 85.3096], 13); // Default: Ranchi coords

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    }).addTo(map);

    L.marker([23.3441, 85.3096]).addTo(map)
      .bindPopup("Issue Location")
      .openPopup();
  }, []);

  return <div id="map" style={{ height: "400px", width: "100%" }}></div>;
}
