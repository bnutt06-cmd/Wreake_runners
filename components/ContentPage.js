"use client";

// components/ContentPage.js
// Shared layout for static content pages (About Us sub-pages, Beginners, etc.)
// Provides a consistent hero header, an optional sub-navigation strip, and a
// centred content column. Pass children for the body content.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { COLORS } from "@/lib/data";

const display = "'Fraunces', serif";

// Sub-navigation for the About Us section. Shown on every About page so
// visitors can move between them without going back to the dropdown.
export const ABOUT_NAV = [
  ["/about", "Overview"],
  ["/about/history", "Club History"],
  ["/about/club-nights", "Club Nights"],
  ["/about/palmer-routes", "President Palmer's Routes"],
  ["/about/race-reports", "Race Reports"],
  ["/about/awards", "Club Awards & Records"],
  ["/about/socials", "Club Socials"],
  ["/about/charity", "Club Charity"],
  ["/about/welfare", "Welfare & Wellbeing"],
  ["/about/trained-members", "Trained Members"],
  ["/about/talented-members", "Talented Members"],
  ["/about/covid", "COVID-19 Regulations"],
];

export default function ContentPage({ kicker, title, intro, subnav, children }) {
  const pathname = usePathname();

  return (
    <main>
      {/* Hero header */}
      <div
        style={{
          background: "linear-gradient(135deg, " + COLORS.ink + " 0%, #1d3a8c 55%, " + COLORS.sky + " 110%)",
          color: "#fff",
          padding: "64px 40px 56px",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          {kicker ? (
            <p style={{ letterSpacing: 3, fontSize: 13, fontWeight: 700, color: COLORS.cyan, margin: 0 }}>
              {kicker}
            </p>
          ) : null}
          <h1 style={{ fontFamily: display, fontSize: "clamp(36px, 6vw, 60px)", lineHeight: 1.05, margin: "12px 0 0", fontWeight: 800 }}>
            {title}
          </h1>
          {intro ? (
            <p style={{ fontSize: 19, lineHeight: 1.6, maxWidth: 680, opacity: 0.92, margin: "18px 0 0" }}>
              {intro}
            </p>
          ) : null}
        </div>
      </div>

      {/* Optional sub-navigation strip */}
      {subnav ? (
        <div style={{ borderBottom: "1px solid " + COLORS.mist, background: "#fff", position: "sticky", top: 92, zIndex: 40 }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "10px 32px", display: "flex", gap: 4, flexWrap: "wrap" }}>
            {subnav.map(([href, label]) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={"wr-subnav-item" + (active ? " wr-subnav-item-active" : "")}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* Content body */}
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "48px 40px 80px" }}>
        {children}
      </div>
    </main>
  );
}

// ---- Content building blocks (consistent typography) ----

export function Prose({ children }) {
  return <div style={{ fontSize: 17, lineHeight: 1.75, color: "#1f2433" }}>{children}</div>;
}

export function H2({ children }) {
  return (
    <h2 style={{ fontFamily: display, fontSize: 30, fontWeight: 800, margin: "40px 0 16px", lineHeight: 1.15 }}>
      {children}
    </h2>
  );
}

export function H3({ children }) {
  return (
    <h3 style={{ fontFamily: display, fontSize: 22, fontWeight: 700, margin: "28px 0 12px" }}>
      {children}
    </h3>
  );
}

export function P({ children }) {
  return <p style={{ margin: "0 0 18px", fontSize: 17, lineHeight: 1.75 }}>{children}</p>;
}

// Placeholder where an image will eventually go.
export function ImagePlaceholder({ label }) {
  return (
    <div
      style={{
        background: "#eef2f7",
        border: "2px dashed " + COLORS.mist,
        borderRadius: 14,
        padding: "48px 24px",
        textAlign: "center",
        color: "#9ca3af",
        fontSize: 14,
        fontWeight: 600,
        margin: "24px 0",
      }}
    >
      {label || "Image coming soon"}
    </div>
  );
}
