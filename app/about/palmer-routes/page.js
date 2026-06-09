"use client";

import ContentPage, { ABOUT_NAV, P, H2, ImagePlaceholder } from "@/components/ContentPage";
import { COLORS } from "@/lib/data";

export default function PalmerRoutesPage() {
  return (
    <ContentPage
      kicker="ABOUT US"
      title="President Palmer's Routes"
      intro="Great running and walking routes across Leicestershire, from our club President."
      subnav={ABOUT_NAV}
    >
      <P>
        We often run routes featured in Club President Dave Palmer's book{" "}
        <em>Great Running and Walking Routes in Leicestershire</em>. It contains routes
        in Leicestershire which are suitable for running or walking. Some of them start
        and finish at a local pub, which is a bonus! There is a longer and shorter option
        for each route.
      </P>

      <ImagePlaceholder label="Book cover: Great Running and Walking Routes in Leicestershire" />

      <P>
        It is spirally bound and A5 size for ease of use and contains maps, photos and
        interesting facts along your way. You can even call up an interactive map and/or
        download it to your GPS, phone, etc.
      </P>

      <H2>Get your copy</H2>
      <P>
        To buy your copy, visit{" "}
        <a href="https://www.runwalk.co.uk" target="_blank" rel="noopener noreferrer" style={{ color: COLORS.teal, fontWeight: 700 }}>
          www.runwalk.co.uk
        </a>
        .
      </P>
    </ContentPage>
  );
}
