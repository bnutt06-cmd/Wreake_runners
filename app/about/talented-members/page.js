"use client";

import ContentPage, { ABOUT_NAV, P, ImagePlaceholder } from "@/components/ContentPage";
import { COLORS } from "@/lib/data";

export default function TalentedMembersPage() {
  return (
    <ContentPage
      kicker="ABOUT US"
      title="Talented Members"
      intro="Our club is made up of lots of talented individuals — on and off the road."
      subnav={ABOUT_NAV}
    >
      <P>
        Here at Wreake Runners, our club is made up of lots of talented individuals.
        Without them, we wouldn't be such a brilliant club. Many are excellent runners,
        leaders, organisers and club supporters — but we also have a wealth of talent
        outside of club activities too.
      </P>

      <ImagePlaceholder label="Member spotlight photo" />

      <div
        style={{
          background: "#fff",
          border: "1px solid " + COLORS.mist,
          borderRadius: 14,
          padding: 22,
          marginTop: 8,
        }}
      >
        <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 700, margin: "0 0 10px" }}>
          Lizzie Jones
        </h3>
        <p style={{ margin: "0 0 12px", fontSize: 16, lineHeight: 1.7 }}>
          Lizzie is a qualified run leader, personal trainer, gym instructor, Ante and
          Postnatal Exercise Advisor, and first aider. She regularly leads the Run Mummy Run
          Leicestershire group, and has previously held fortnightly strength and conditioning
          boot camps for our club members. Why not recruit her as your PT with personalised
          training plans to support your fitness journey?
        </p>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          <a href="https://lizziejones-pt.com" target="_blank" rel="noopener noreferrer" style={{ color: COLORS.teal, fontWeight: 700, fontSize: 15 }}>
            lizziejones-pt.com
          </a>
          <a href="https://instagram.com/lizziejones_pt" target="_blank" rel="noopener noreferrer" style={{ color: COLORS.teal, fontWeight: 700, fontSize: 15 }}>
            @lizziejones_pt
          </a>
        </div>
      </div>

      <p style={{ marginTop: 24, fontSize: 14, opacity: 0.6 }}>
        Are you a talented member with something to share? Let a committee member know and
        we'll feature you here.
      </p>
    </ContentPage>
  );
}
