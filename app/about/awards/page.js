"use client";

import ContentPage, { ABOUT_NAV, P, H2, H3 } from "@/components/ContentPage";
import { COLORS } from "@/lib/data";

const AWARDS_2024 = [
  ["Chairperson's Choice", "Marsha Weale"],
  ["Runner of the Year — Female", "Lizzie Jones"],
  ["Runner of the Year — Male", "John White"],
  ["Most Improved Female", "Deb Carter"],
  ["Most Improved Male", "Rishi Chauhan"],
  ["XC Female", "Jenni Newton"],
  ["XC Male", "Steve Bates"],
  ["Unsung Hero", "Garry Chapman"],
  ["Club Person", "Andy Carmichael"],
  ["Sports Performance", "George Seymour"],
  ["5k Track Handicap Race — Female", "Deb Carter"],
  ["5k Track Handicap Race — Male", "Rowan James"],
  ["Hall of Fame Award", "Ricky Aggarwal"],
  ["Charity Champion", "Craig Reast"],
];

const DESCRIPTIONS = [
  ["Chairperson's Choice", "Given to an individual in recognition of their personal achievements and/or services to the club during the year. Chosen by the Club Chair."],
  ["Most Improved (Male & Female)", "For individuals who have dramatically improved their race times, made progress with their running, and shown commitment and drive to succeed. Open to member nominations; final decision by the committee."],
  ["Unsung Hero", "For someone who goes above and beyond, supporting and helping clubmates on their running journeys without seeking recognition. Open to member nominations."],
  ["Club Person", "For someone who makes a real difference to the club, promoting the club and the sport in general. Does not need to be a committee member. Open to member nominations."],
  ["Runner of the Year", "For male and female individuals, based on any combination of: fastest performance, most improved, most consistent, most races competed, club-night attendance, or other running reasons. Open to member nominations."],
  ["Sports Performance", "For an outstanding performance through competitive events — ideally running, though athletic events and triathlons can be included. Open to member nominations."],
  ["5k Handicap (Male & Female)", "Decided during the 5k track event. Members submit a recent 5k time, then run a timed 5k with staggered starts. Winners beat their predicted time by the largest margin."],
  ["Cross Country (Male & Female)", "Based on performances during the year. The Cross Country Captains consider league and other XC performances, plus attendance, to choose the winners."],
];

export default function AwardsPage() {
  return (
    <ContentPage
      kicker="ABOUT US"
      title="Club Awards & Records"
      intro="Celebrating our members' achievements at our annual awards night."
      subnav={ABOUT_NAV}
    >
      <P>
        Each year, usually in February, we hold our annual Awards Night celebration
        party. Along with the Club Standards Certificates, we present a variety of awards
        to members — some voted for by members, some decided by the committee.
      </P>

      <H2>2024 winners</H2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12, marginBottom: 16 }}>
        {AWARDS_2024.map(([award, winner]) => (
          <div
            key={award}
            style={{
              background: "#fff",
              border: "1px solid " + COLORS.mist,
              borderRadius: 12,
              padding: 16,
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.teal, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 4 }}>
              {award}
            </div>
            <div style={{ fontSize: 17, fontWeight: 700 }}>{winner}</div>
          </div>
        ))}
      </div>

      <H2>About the awards</H2>
      {DESCRIPTIONS.map(([title, desc]) => (
        <div key={title} style={{ marginBottom: 16 }}>
          <H3>{title}</H3>
          <p style={{ margin: 0, fontSize: 16, lineHeight: 1.7 }}>{desc}</p>
        </div>
      ))}

      <H2>Club Records</H2>
      <P>
        Racing for Wreake Runners is about taking part, and every race is full of team
        camaraderie and encouragement. As a club we encourage all abilities, so no one
        should feel discouraged from entering. But if it's a PB you're chasing — or you're
        wondering if you could top the leaderboard — our all-time fastest runners' times
        are recorded in the Club Records.
      </P>
      <P>
        We also have a private Strava group, where members are regularly striving for
        glory to be at the top!
      </P>
    </ContentPage>
  );
}
