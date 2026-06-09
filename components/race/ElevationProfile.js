"use client";

// components/race/ElevationProfile.js
// =================================================================
// Lightweight SVG elevation chart. No charting library — the data
// is simple (one line) and a custom SVG is < 2KB vs 50KB+ for Recharts.
// =================================================================

import { COLORS } from "@/lib/data";

export default function ElevationProfile({ profile, height = 100 }) {
  if (!profile || profile.length < 2) return null;
  // Filter out null elevations.
  const pts = profile.filter((p) => p.ele != null);
  if (pts.length < 2) return null;

  const maxKm = pts[pts.length - 1].km;
  const eles = pts.map((p) => p.ele);
  const minEle = Math.min(...eles);
  const maxEle = Math.max(...eles);
  const range = Math.max(1, maxEle - minEle);

  const W = 500; // viewBox width — SVG scales to container
  const H = height;
  const padY = 8;
  const drawH = H - padY * 2;

  const xFor = (km) => (km / maxKm) * W;
  const yFor = (ele) => H - padY - ((ele - minEle) / range) * drawH;

  let path = "";
  pts.forEach((p, i) => {
    const cmd = i === 0 ? "M" : "L";
    path += `${cmd}${xFor(p.km).toFixed(1)},${yFor(p.ele).toFixed(1)} `;
  });

  // Filled area under the line
  const fill = `${path} L${W},${H} L0,${H} Z`;

  return (
    <div style={{ background: "#fafafa", borderRadius: 12, padding: 12, border: `1px solid ${COLORS.mist}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, opacity: 0.65, marginBottom: 6 }}>
        <span>{Math.round(minEle)} m</span>
        <span style={{ fontWeight: 700 }}>Elevation profile</span>
        <span>{Math.round(maxEle)} m</span>
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        style={{ width: "100%", height, display: "block" }}
      >
        <path d={fill} fill={COLORS.teal} fillOpacity="0.18" />
        <path d={path} fill="none" stroke={COLORS.teal} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, opacity: 0.6, marginTop: 4 }}>
        <span>0 km</span>
        <span>{maxKm.toFixed(2)} km</span>
      </div>
    </div>
  );
}
