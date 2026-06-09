"use client";

import ContentPage, { ABOUT_NAV, P, H2 } from "@/components/ContentPage";
import { COLORS } from "@/lib/data";

export default function ClubNightsPage() {
  return (
    <ContentPage
      kicker="ABOUT US"
      title="Club Nights"
      intro="Tuesdays and Thursdays, 6:45pm for a 7pm start — everyone welcome."
      subnav={ABOUT_NAV}
    >
      <P>
        We meet every Tuesday and Thursday evening at 6:45pm for a 7pm start. Fortnightly on
        Tuesdays we have all-inclusive interval training on the fab running track at Ratcliffe
        College — no extra charge, it's included in your membership!
      </P>

      <H2>Where we meet</H2>
      <P>
        <strong>Route nights:</strong> Catholic Church of the Divine Infant, 63 Broad Street,
        Syston, Leicester LE7 1GH.
      </P>
      <P>
        <strong>Track nights:</strong> Ratcliffe College, Fosse Way, Ratcliffe on the Wreake,
        Leicester LE7 4SG.
      </P>

      <H2>Before you attend</H2>
      <P>
        If you attend club nights, it is presumed that you agree to follow the guidelines
        below (following England Athletics guidance and the Wreake Runners Risk Assessments).
        Please note: the club, and any of its officers, are not responsible for any claim of
        accident, injury, damage, illness or loss sustained by members during any club
        activity. You attend at your own risk.
      </P>

      <ul style={{ fontSize: 16, lineHeight: 1.9, paddingLeft: 22 }}>
        <li>Do not attend if you are showing signs of sickness.</li>
        <li>Check the latest England Athletics guidance and read the Wreake Runners Risk Assessments.</li>
        <li>Follow the venue and public health guidance.</li>
        <li>Maintain personal hygiene (sanitise hands before and after your workout).</li>
        <li>Take personal responsibility for knowing the route. Learn it, print it or have it on your phone, and stay aware of where you're going and the people around you.</li>
        <li>Use the time before we set off for a group or individual warm-up.</li>
        <li>Organise yourselves into groups on the night, and re-group during the run.</li>
        <li>If leading a group, please lead from the back and leave no one behind.</li>
        <li>Wear high-visibility clothing on dark evenings and bring a head torch or chest torch.</li>
        <li>Carry a phone for emergencies.</li>
        <li>Be considerate to members of the public.</li>
        <li>If finishing early, ensure you let someone know you have arrived home safely.</li>
        <li>It is the responsibility of the individual to perform their own cool-down.</li>
        <li>Enjoy your run, have fun!</li>
      </ul>

      <div
        style={{
          background: COLORS.mist,
          borderLeft: "4px solid " + COLORS.teal,
          padding: 16,
          borderRadius: 10,
          marginTop: 16,
          fontSize: 15,
          fontWeight: 600,
        }}
      >
        Run together, run safely. Logged-in members can see the latest route schedule in the
        Club Area.
      </div>
    </ContentPage>
  );
}
