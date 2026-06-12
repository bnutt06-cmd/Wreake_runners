"use client";

import { COLORS } from "@/lib/data";

export default function Wreake45Page() {
  return (
    <main style={{ background: "#EAF4FB" }}>
      {/* Hero */}
      <section
        style={{
          background: "linear-gradient(135deg, " + COLORS.ink + " 0%, #1d3a8c 55%, " + COLORS.sky + " 120%)",
          color: "#fff",
          padding: "64px 32px 56px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "relative", maxWidth: 760, margin: "0 auto" }}>
          <div style={{ display: "inline-block", background: "#fff", borderRadius: 16, padding: "16px 26px", marginBottom: 26 }}>
            <img src="/wreake45-logo.png" alt="Wreake 45" style={{ height: 60, width: "auto", display: "block" }} />
          </div>
          <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: COLORS.cyan, margin: "0 0 12px" }}>
            Our 45th Anniversary
          </p>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(36px, 6vw, 60px)", fontWeight: 800, lineHeight: 1.05, margin: "0 0 16px" }}>
            The Wreake 45 Day Out
          </h1>
          <p style={{ fontSize: 19, opacity: 0.92, lineHeight: 1.5, margin: 0 }}>
            Sunday 30th August 2026 &middot; 8am&ndash;6pm &middot; Watermead Park
          </p>
        </div>
      </section>

      {/* Body */}
      <section style={{ maxWidth: 820, margin: "0 auto", padding: "48px 24px 72px" }}>
        <div style={cardStyle}>
          <h2 style={h2Style}>Come and celebrate with us</h2>
          <p style={pStyle}>
            We're turning 45, and we'd love as many of you as possible to come and mark it
            with a full day (or part of one!) running around Watermead, followed by a picnic
            at the picnic field. Whether you fancy the full challenge or just want to come
            along for one lap and the social, there's a place for everyone.
          </p>
        </div>

        <div style={cardStyle}>
          <h2 style={h2Style}>The format &mdash; a Backyard Ultra (ish)</h2>
          <p style={pStyle}>
            From <strong>8am to 6pm</strong>, the challenge runs in a Backyard Ultra style:
          </p>
          <ul style={{ ...pStyle, paddingLeft: 22, display: "grid", gap: 8 }}>
            <li>Run <strong>4.5 miles every hour, on the hour, for 10 hours</strong> &mdash; that's 45 miles.</li>
            <li>Prefer something shorter? You can do <strong>4.5km every hour</strong> instead.</li>
            <li>Or simply do a few &lsquo;yards&rsquo; &mdash; or even just one!</li>
            <li>Take part as an <strong>individual, in pairs, or as a team</strong>.</li>
          </ul>
          <div style={{ background: "#EAF4FB", borderRadius: 12, padding: "16px 18px", marginTop: 16, fontSize: 15, color: COLORS.ink, fontWeight: 600 }}>
            We'd love as many people as possible to join us for the final &lsquo;yard&rsquo;,
            starting at <strong>5pm</strong> &mdash; then it's on to the picnic.
          </div>
        </div>

        {/* Save the date image */}
        <img
          src="/wreake45-savethedate.jpg"
          alt="Save the date: Sunday 30 August 2026"
          style={{ width: "100%", borderRadius: 16, display: "block", margin: "8px 0 24px", border: "1px solid " + COLORS.mist }}
        />

        <div style={cardStyle}>
          <h2 style={h2Style}>More details to follow</h2>
          <p style={pStyle}>
            This is a save-the-date for now &mdash; full details on how to take part, sign up
            for &lsquo;yards&rsquo;, and the picnic will follow soon. For now, pop it in your
            calendar as the <strong>&lsquo;Wreake 45 Day Out&rsquo;</strong> and keep the
            whole day free.
          </p>
        </div>

        {/* Full flyer */}
        <h2 style={{ ...h2Style, textAlign: "center", marginTop: 8 }}>The full details</h2>
        <img
          src="/wreake45-watermead.jpg"
          alt="Wreake 45 Day Out at Watermead Park, full event details"
          style={{ width: "100%", borderRadius: 16, display: "block", marginTop: 12, border: "1px solid " + COLORS.mist }}
        />
      </section>
    </main>
  );
}

const cardStyle = {
  background: "#fff",
  border: "1px solid " + COLORS.mist,
  borderRadius: 16,
  padding: "28px 28px",
  marginBottom: 24,
};
const h2Style = {
  fontFamily: "'Fraunces', serif",
  fontSize: 24,
  fontWeight: 800,
  color: COLORS.ink,
  margin: "0 0 12px",
};
const pStyle = {
  fontSize: 16,
  lineHeight: 1.65,
  color: "#374151",
  margin: "0 0 4px",
};
