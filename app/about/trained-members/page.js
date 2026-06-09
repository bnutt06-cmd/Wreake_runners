"use client";

import ContentPage, { ABOUT_NAV, P, H3 } from "@/components/ContentPage";
import { COLORS } from "@/lib/data";

const GROUPS = [
  { role: "First Aiders", people: ["Lizzie Jones", "Phill Wilson", "Marsha Weale"] },
  { role: "LiRF — Leader in Running Fitness", people: ["Lorraine Isaac", "Lyndsey Parsons", "Andrew Carmichael", "Deb Carter"] },
  { role: "Mental Health First Aiders", people: ["Jenny Hurst", "Anna Boyce", "Andrew Roberts"] },
  { role: "Race Director", people: ["David Isaac"] },
];

export default function TrainedMembersPage() {
  return (
    <ContentPage
      kicker="ABOUT US"
      title="Trained Members"
      intro="The qualified people who keep our club running safely and well."
      subnav={ABOUT_NAV}
    >
      <P>
        We have a number of trained members within the club, and we are always looking to
        add to our club skill set. So if you have a specific and relevant set of skills, let
        us know!
      </P>

      <div style={{ display: "grid", gap: 16, marginTop: 8 }}>
        {GROUPS.map((g) => (
          <div
            key={g.role}
            style={{
              background: "#fff",
              border: "1px solid " + COLORS.mist,
              borderRadius: 14,
              padding: 20,
            }}
          >
            <H3>{g.role}</H3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
              {g.people.map((p) => (
                <span
                  key={p}
                  style={{
                    background: COLORS.mist,
                    color: COLORS.ink,
                    padding: "6px 14px",
                    borderRadius: 20,
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ContentPage>
  );
}
