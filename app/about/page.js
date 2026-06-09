"use client";

import ContentPage, { ABOUT_NAV, P, H2, ImagePlaceholder } from "@/components/ContentPage";

export default function AboutPage() {
  return (
    <ContentPage
      kicker="ABOUT US"
      title="About Wreake Runners"
      intro="A small, friendly and inclusive club based in Syston, Leicestershire — with you every step of your running journey."
      subnav={ABOUT_NAV}
    >
      <P>
        We are a small, friendly and inclusive club meeting at the Catholic Church
        Hall on Broad Street in Syston, LE7 1GH. Our location attracts runners from
        Syston, Thurmaston, Queniborough and surrounding villages, out to Scraptoft,
        Sileby and Melton Mowbray.
      </P>

      <P>
        We know that runners come in all different forms and with a variety of running
        needs. Whether you are a seasoned club runner constantly striving for your next
        PB or a social runner wanting to enjoy planned group runs, Team Wreake will be
        with you every step of your running journey with the club.
      </P>

      <ImagePlaceholder label="Club group photo (Broad Street)" />

      <H2>Our club nights</H2>
      <P>
        We organise some great routes for our club nights on Tuesdays and Thursdays,
        fortnightly Ratcliffe College track sessions and coaching sessions either by
        trained club members or qualified coaches. We ask that new runners are
        comfortable running for about 1 hour duration at 12 min/mile pace. Please get
        in touch with us if you want to discuss this in more detail.
      </P>

      <P>
        We are always developing as a club, investing in run leaders and coaches of the
        future. We have regular sessions to improve speed and endurance during our club
        nights and enjoy competing. Of course, we also like to let our hair down too and
        have regular social events and pub runs. There is a members-only Facebook forum
        providing all the latest information on routes, races and socials, and we feature
        all the latest news and information on our Facebook and Instagram pages.
      </P>

      <H2>A proud history</H2>
      <P>
        During 2021, we proudly celebrated our 40th anniversary. Our President, Dave
        Palmer, one of the club's founding members, is still an active member within the
        club. Find out more in our Club History.
      </P>

      <P>
        We also co-host the LRRL Rotherby 8 road race with Team Anstey, which took place
        on October 12th 2025 this year.
      </P>
    </ContentPage>
  );
}
