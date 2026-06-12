"use client";

import ContentPage, { P, H2 } from "@/components/ContentPage";
import { COLORS } from "@/lib/data";

export default function JoinPage() {
  return (
    <ContentPage
      kicker="JOIN US"
      title="Join Wreake Runners"
      intro="Whatever your pace or experience, there's a place for you at Team Wreake."
    >
      <P>
        We're a friendly, inclusive club based in Syston, welcoming runners of every
        ability — from complete beginners to seasoned club racers. We'd love to have you
        come along.
      </P>

      <H2>Come for a free trial</H2>
      <P>
        New runners are welcome to a 4-week (or 4-session) trial so you can see if the club
        is right for you, before committing to membership. We ask that you're comfortable
        running for about an hour at roughly 12 min/mile pace. If you're not quite there
        yet, take a look at our Beginners page and our Couch to 5K course.
      </P>

      <H2>Get in touch</H2>
      <P>
        Ready to come down, or just want to ask a question? Drop us a line and we'll help
        you take the first step.
      </P>

      <div
        style={{
          background: COLORS.mist,
          borderRadius: 14,
          padding: 24,
          marginTop: 8,
          display: "flex",
          gap: 16,
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <strong style={{ fontSize: 18, fontFamily: "'Fraunces', serif" }}>Say hello</strong>
          <p style={{ margin: "4px 0 0", fontSize: 15, opacity: 0.8 }}>
            We'll point you to the next club night and a trial membership form.
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
          Email the club
        </a>
      </div>

      <p style={{ marginTop: 24, fontSize: 14, opacity: 0.6 }}>
        Full membership details and our online join form are coming soon to this page.
      </p>
    </ContentPage>
  );
}
