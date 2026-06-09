"use client";

import ContentPage, { ABOUT_NAV, P, H2 } from "@/components/ContentPage";

export default function CovidPage() {
  return (
    <ContentPage
      kicker="ABOUT US"
      title="COVID-19 Regulations"
      intro="How we continue to run responsibly in the 'Living with COVID-19' phase."
      subnav={ABOUT_NAV}
    >
      <P>
        Since the end of February 2022, the UK has been in the 'Living with COVID-19' phase
        of the Government's response to the pandemic. This means that there are now no
        coronavirus-related legal restrictions in place. As a club we continue to act
        responsibly, to protect our members and the community that we run in. We continue
        to monitor any updates, including England Athletics guidelines, as well as those
        from other relevant governing bodies.
      </P>

      <P>
        Anyone wishing to run with the club and at organised events should not turn up to an
        activity if displaying any of the COVID-19 symptoms. It is also your responsibility
        to assess personal risk at an event and be aware that clubs and competition
        providers may impose local restrictions for health, safety and COVID-19 reasons.
      </P>

      <P>
        All club running sessions currently meet and run outside, however some social events
        do take place indoors. We are happy to say most of our members are now back at club
        nights, but we understand that some still feel nervous about the changes. Members of
        the club have been brilliant at supporting each other through the pandemic and we're
        confident this will continue under our 'running better together' mantra.
      </P>

      <H2>Thank you</H2>
      <P>
        Thank you to all our members who kept the club up and running during this time, and
        those who continue to do so by offering support in various ways.
      </P>
    </ContentPage>
  );
}
