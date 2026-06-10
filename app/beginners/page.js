"use client";

import ContentPage, { P, H2, ImagePlaceholder } from "@/components/ContentPage";
import { COLORS } from "@/lib/data";

export default function BeginnersPage() {
  return (
    <ContentPage
      kicker="NEW TO RUNNING?"
      title="Beginners"
      intro="Whether you're starting from scratch or coming back after a break, there's a place for you at Wreake."
    >
      <div
        style={{
          background: "linear-gradient(135deg, " + COLORS.teal + " 0%, " + COLORS.sky + " 100%)",
          color: "#fff",
          borderRadius: 16,
          padding: 28,
          marginBottom: 32,
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 2, opacity: 0.9, textTransform: "uppercase" }}>
          Coming April 2026
        </div>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 800, margin: "8px 0 0" }}>
          Couch to 5K — Get Into Running
        </h2>
      </div>

      <H2>Our Couch to 5K course</H2>
      <P>
        We are looking at delivering a spring/summer 'Get Into Running' Couch to 5K-type
        course, starting on <strong>Tuesday 7th April</strong> and running for 10 weeks,
        with a Watermead Parkrun to 'graduate' on <strong>Saturday 20th June</strong>.
      </P>
      <P>
        You will be well supported by a variety of qualified run leaders and experienced
        volunteers. We will set up a dedicated group to allow you to communicate with the
        other runners and organise other meet-ups outside of the Tuesday sessions if
        required. Please get in touch at{" "}
        <a href="mailto:info@wreakerunners.co.uk" style={{ color: COLORS.teal, fontWeight: 700 }}>
          info@wreakerunners.co.uk
        </a>{" "}
        for details.
      </P>

      <ImagePlaceholder label="December 2021 5K graduates" />

      <H2>Lapsed runner? Come for a free trial</H2>
      <P>
        If you are a lapsed runner and want to come down for a run, get in touch and come
        along to one of our club nights for a free trial. We offer a 4-week (or 4-session)
        trial so you can see if this is the right club for you.
      </P>
      <P>
        We ask that you are comfortable running for about an hour at roughly 12 min/mile
        pace, and that you complete a trial membership form before you come.
      </P>

      <div
        style={{
          background: COLORS.mist,
          borderRadius: 14,
          padding: 24,
          marginTop: 16,
          display: "flex",
          gap: 16,
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <strong style={{ fontSize: 18, fontFamily: "'Fraunces', serif" }}>Ready to give it a go?</strong>
          <p style={{ margin: "4px 0 0", fontSize: 15, opacity: 0.8 }}>
            Drop us a line and we'll help you take the first step.
          </p>
        </div>
        <a
          href="mailto:info@wreakerunners.co.uk"
          style={{
            background: COLORS.ink,
            color: "#fff",
            padding: "12px 22px",
            borderRadius: 10,
            fontWeight: 700,
            fontSize: 15,
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          Get in touch
        </a>
      </div>
    </ContentPage>
  );
}
