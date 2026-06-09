"use client";

import ContentPage, { ABOUT_NAV, P, H2, ImagePlaceholder } from "@/components/ContentPage";
import { COLORS } from "@/lib/data";

export default function WelfarePage() {
  return (
    <ContentPage
      kicker="ABOUT US"
      title="Welfare & Wellbeing"
      intro="A welcoming, supportive and safe space — because health is more than physical fitness."
      subnav={ABOUT_NAV}
    >
      <H2>Welfare</H2>
      <P>
        Our aim as a club is to create a welcoming and supportive setting for our members
        to enjoy being part of the club and, most of all, feel safe. We want members to
        know that there is a safe space to talk if they have any concerns about their own
        welfare within the club.
      </P>
      <P>
        The Club Welfare Lead Officer is <strong>Anna Boyce</strong>. They can listen to
        any issue that may arise, and endeavour to support your individual needs and
        wellbeing.
      </P>
      <P>
        It is everyone's responsibility to ensure the safety and enjoyment of all those who
        participate in club activities. If you deem the actions of a member towards another
        member to be inappropriate, please discuss your concerns with a member of the
        committee, or contact the Club Welfare Officer directly so the committee can discuss
        any action that may need to be taken.
      </P>
      <P>
        We also have mental health first aiders: <strong>Andrew Roberts, Jenny Hurst and
        Anna Boyce</strong>. Mental health first-aiders are trained to recognise
        mental-health issues, to listen, and to offer appropriate support options.
      </P>

      <H2>Wellbeing</H2>
      <P>
        We launched 'Wellbeing Wednesdays' as a way of engaging with our members on matters
        other than just physical fitness. Our health is made up of more than just our
        physical fitness. Connecting with those around us, taking notice of the simple
        things that give you joy, eating and sleeping well, looking after your environment,
        learning new things or having new experiences, giving to charity, or simple acts of
        kindness — all help, along with physical activity, to improve your wellbeing.
      </P>

      <ImagePlaceholder label="Wheel of Well-being diagram" />

      <P>
        These dimensions are often referred to as the 'wellness wheel'. Neglecting any one
        of these can, over time, affect the others and lead to a dip in your overall
        wellbeing and quality of life. Through Wellbeing Wednesdays, we aim to redress the
        balance of these elements through a series of tips, useful articles and discussions.
      </P>

      <H2>Mental Health</H2>
      <P>
        As well as the enjoyment of running and improving your fitness, Wreake Runners
        understand the importance of looking after the mental health and wellbeing of our
        members. Mental health problems affect one in four people, and yet some of us are
        still afraid to talk about it. We want to help change that.
      </P>
      <P>
        We are looking to recruit a Mental Health Champion in order to better support our
        members. For more information on the role, please look at the England Athletics
        website and get in touch with a committee member to discuss in more detail. Andrew
        Roberts, Jenny Hurst and Anna Boyce are all trained mental health first aiders and
        available as a point of contact within the club should you wish to talk to them or
        seek some advice.
      </P>

      <div
        style={{
          background: COLORS.mist,
          borderLeft: "4px solid " + COLORS.teal,
          padding: 16,
          borderRadius: 10,
          marginTop: 8,
          fontSize: 15,
          lineHeight: 1.6,
        }}
      >
        <strong>If you need support now:</strong> there are many free resources available.
        The Mental Health Foundation publishes top tips for mental wellbeing, and there are
        national helplines and listening services available 24/7. Please reach out to a
        committee member or one of our mental health first aiders if you'd like to talk.
      </div>
    </ContentPage>
  );
}
