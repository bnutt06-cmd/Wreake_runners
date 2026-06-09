"use client";

import ContentPage, { ABOUT_NAV, P, H2, ImagePlaceholder } from "@/components/ContentPage";
import { COLORS } from "@/lib/data";

const PAST = [
  ["2022", "£1,400 raised for LOROS"],
  ["2023", "£1,900 raised, split between The Brain Tumour Charity and Wishes for Kids"],
  ["2024", "£2,371 raised for Breast Cancer Now"],
  ["2025", "£3,262.59 split between Dementia UK and Parkinson's UK (over £1,600 per charity)"],
];

export default function CharityPage() {
  return (
    <ContentPage
      kicker="ABOUT US"
      title="Club Charity"
      intro="Each year we rally behind one main charity, chosen by our members."
      subnav={ABOUT_NAV}
    >
      <H2>2026: Blood Cancer UK</H2>
      <P>
        For 2026, we are fundraising for Blood Cancer UK, chosen by our members at the
        November 2025 AGM. One of our long-standing members is currently receiving cancer
        treatment, and this charity was suggested by another member.
      </P>
      <P>
        Blood cancer is a term used to describe many different types of cancer that can
        affect your blood, bone marrow or lymphatic system. It happens when something goes
        wrong with the development of your blood cells. Leukaemia, lymphoma and myeloma are
        some of the most common types. Around 40,000 people are diagnosed with a blood
        cancer each year in the UK, and about 280,000 people are currently living with blood
        cancer. The Blood Cancer UK community is funding 360 researchers and staff across
        the UK who are searching for the next breakthrough.
      </P>

      <ImagePlaceholder label="Charity fundraising photo" />

      <H2>What we've raised before</H2>
      <div style={{ display: "grid", gap: 10, marginBottom: 16 }}>
        {PAST.map(([year, detail]) => (
          <div
            key={year}
            style={{
              display: "flex",
              gap: 16,
              background: "#fff",
              border: "1px solid " + COLORS.mist,
              borderRadius: 12,
              padding: "14px 18px",
              alignItems: "center",
            }}
          >
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 800, color: COLORS.teal, minWidth: 60 }}>
              {year}
            </div>
            <div style={{ fontSize: 16 }}>{detail}</div>
          </div>
        ))}
      </div>

      <P>
        If you have any ideas, want to donate prizes, or offer sponsorship, please get in
        touch.
      </P>
    </ContentPage>
  );
}
