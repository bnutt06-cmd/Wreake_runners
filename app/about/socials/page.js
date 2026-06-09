"use client";

import ContentPage, { ABOUT_NAV, P, ImagePlaceholder } from "@/components/ContentPage";

export default function SocialsPage() {
  return (
    <ContentPage
      kicker="ABOUT US"
      title="Club Socials"
      intro="We like to let our hair down too — pub runs, parties and plenty of laughs."
      subnav={ABOUT_NAV}
    >
      <P>
        Running is only half the story at Wreake. Alongside our club nights and races, we
        run a busy social calendar — regular pub runs, our annual awards night celebration,
        seasonal get-togethers and plenty of spontaneous coffee and cake stops.
      </P>
      <P>
        There is a members-only Facebook forum providing all the latest information on
        routes, races and socials, and we feature all the latest news on our Facebook and
        Instagram pages.
      </P>

      <ImagePlaceholder label="Club social photos" />

      <p style={{ marginTop: 8, fontSize: 14, opacity: 0.6 }}>
        This page is being expanded with details and photos of our upcoming socials. Check
        the Club Events section once you're a member for the full calendar.
      </p>
    </ContentPage>
  );
}
