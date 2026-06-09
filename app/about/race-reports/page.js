"use client";

import ContentPage, { ABOUT_NAV, P, H2, H3 } from "@/components/ContentPage";
import { COLORS } from "@/lib/data";

const REPORTS = [
  { title: "HO HO HOTH (a.k.a. Hell on the Humber)", date: "December 4, 2023", author: "Marsha and Michele", excerpt: "What a fantastic event! Who would have thought running back and forth over the Humber Bridge for up to 6 hours could be so much fun? The HO HO HOTH is the last in a yearly series of challenge events by HOTH run by a lovely chap named Karl Jackson." },
  { title: "Rabbit Run Trail Weekend", date: "August 1, 2023", author: "Simon", excerpt: "Something a bit different this one. It's a full weekend of trail running where you have the option of doing the whole lot ('The Quest') or one of three parts: a Trail Mix Challenge (5 x 5k different routes), a 10k Twilight trail run, and a Half Marathon Trail." },
  { title: "Outlaw 2023", date: "July 31, 2023", author: "Billy", excerpt: "Leading in to race day was 7 months of prep — 142km of swimming, 7,890km of cycling and 1,240km of running. But let's fast forward to the day. It was a 3am start, getting nutrition ready and following my meticulous planning lists." },
  { title: "100th Parkrun", date: "June 21, 2023", author: "Reb", excerpt: "My first parkrun was on 14/4/2018 at Braunstone Parkrun. I was inspired to run by my cousin Ash Payne, who ran London in 2hrs 48 minutes and got into the Guinness book of world records, as he happened to be dressed as a Christmas elf while doing it." },
  { title: "Rothley 10K", date: "June 6, 2023", author: "Reb", excerpt: "This lovely little local race is a real gem. Testing but a gem, and a real favourite of mine. It isn't a league race, but with so many runners from local clubs turning out it may as well be." },
  { title: "Great Bristol Run 2023", date: "May 23, 2023", author: "Simon", excerpt: "May 14th saw myself and Lyndsey flying the Wreake flag, and I was a little worried about doing back-to-back half marathons having not had the best time of it at Bosworth the week before." },
  { title: "Eyam Half Marathon 2023", date: "May 23, 2023", author: "Christian", excerpt: "I have had this race on my running 'to do' list for years, and this year was its 30th anniversary! It is well known for being popular, friendly, well-run, super-scenic and tough — and it did not disappoint." },
  { title: "Rob Burrow Leeds Half & Full Marathon", date: "May 15, 2023", author: "Catherine", excerpt: "While the Leeds marathon had existed from 1981 to 2003, Leeds is better known for the half marathon. Inspired by Kevin Sinfield's monumental events over the last 3 years, he has been the cornerstone of setting up this new marathon event for his rugby buddy Rob." },
  { title: "Wymeswold Waddle", date: "May 8, 2023", author: "Reb", excerpt: "Where to start? This is a race I have always wanted to do, but have always been put off by the hill. There is no getting away from the fact this 5 mile run has a hill as its centre piece, but it isn't actually as scary as I thought it would be." },
  { title: "London Marathon 2023", date: "April 24, 2023", author: "Wreake Runner", excerpt: "Wow, such a fantastic experience — the support of my friends and this club are massive parts of my running life. Having Alison, another Wreakie, there helped take the stress out of the journey." },
];

export default function RaceReportsPage() {
  return (
    <ContentPage
      kicker="ABOUT US"
      title="Race Reports"
      intro="First-hand stories from our members out on the roads, trails and cross-country."
      subnav={ABOUT_NAV}
    >
      <P>
        The club competes actively in the Leicestershire Road Running League (LRRL),
        which each year organises road races at different venues across the county. These
        races vary from 5 miles to half marathon, and usually begin in February and run
        through September. They are competitive — with some amazing talent — yet
        welcoming for any ability.
      </P>
      <P>
        For those who love the mud and cross-country, we compete in the Derby Runner
        Cross-Country league, with races ranging from 5 to approximately 7 miles. The
        terrain can be anything, including fields, forests and trails which make up the
        countryside around Leicestershire. Teams are usually entered every year for
        Leicestershire, Midlands and National Cross-Country championships.
      </P>
      <P>
        Club members also take part in a whole host of other local, regional and national
        events. Here are some recent reports from our runners.
      </P>

      <H2>Recent reports</H2>
      <div style={{ display: "grid", gap: 16, marginTop: 8 }}>
        {REPORTS.map((r) => (
          <div
            key={r.title + r.date}
            style={{
              background: "#fff",
              border: "1px solid " + COLORS.mist,
              borderRadius: 14,
              padding: 22,
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.teal, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 6 }}>
              {r.date} · by {r.author}
            </div>
            <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 700, margin: "0 0 8px" }}>
              {r.title}
            </h3>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, opacity: 0.85 }}>{r.excerpt}</p>
          </div>
        ))}
      </div>

      <p style={{ marginTop: 24, fontSize: 14, opacity: 0.6 }}>
        These are archive reports from the club. We'll be bringing race reports into the
        members' area so runners can post their own in future.
      </p>
    </ContentPage>
  );
}
