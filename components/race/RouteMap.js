"use client";

// components/race/RouteMap.js
// =================================================================
// Leaflet-based map showing a GPX route polyline.
// Leaflet touches `window` at module load, so this file only ever
// runs in the browser — see RaceDetailModal.js for the next/dynamic import.
// =================================================================

import { useEffect, useRef } from "react";
import { COLORS } from "@/lib/data";

export default function RouteMap({ points, bounds, height = 280 }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !points || points.length < 2) return;

    let cancelled = false;

    // Dynamic import so Leaflet's window references happen client-side only.
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled) return;

      // Load Leaflet's CSS once. (Easier than wiring it into globals.css.)
      const cssId = "leaflet-css";
      if (!document.getElementById(cssId)) {
        const link = document.createElement("link");
        link.id = cssId;
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        link.integrity =
          "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
        link.crossOrigin = "";
        document.head.appendChild(link);
      }

      // Tear down any previous map on this container.
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }

      const map = L.map(containerRef.current, {
        zoomControl: true,
        attributionControl: true,
      });
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      const latlngs = points.map((p) => [p.lat, p.lon]);

      // Route line
      L.polyline(latlngs, {
        color: COLORS.teal,
        weight: 4,
        opacity: 0.85,
      }).addTo(map);

      // Start / finish markers
      const startIcon = L.divIcon({
        className: "wr-pin",
        html: `<div style="
          background:${COLORS.green}; width:14px; height:14px; border-radius:50%;
          border:3px solid #fff; box-shadow:0 0 0 1px rgba(0,0,0,.3);
        "></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });
      const endIcon = L.divIcon({
        className: "wr-pin",
        html: `<div style="
          background:${COLORS.ink}; width:14px; height:14px; border-radius:50%;
          border:3px solid #fff; box-shadow:0 0 0 1px rgba(0,0,0,.3);
        "></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });
      L.marker(latlngs[0], { icon: startIcon }).addTo(map).bindPopup("Start");
      L.marker(latlngs[latlngs.length - 1], { icon: endIcon })
        .addTo(map)
        .bindPopup("Finish");

      // Fit to route bounds (with padding)
      if (bounds) {
        map.fitBounds(
          [
            [bounds.minLat, bounds.minLon],
            [bounds.maxLat, bounds.maxLon],
          ],
          { padding: [20, 20] }
        );
      } else {
        map.fitBounds(latlngs, { padding: [20, 20] });
      }
    })();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [points, bounds]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height,
        borderRadius: 12,
        overflow: "hidden",
        background: "#e5e7eb",
        border: `1px solid ${COLORS.mist}`,
      }}
    />
  );
}
