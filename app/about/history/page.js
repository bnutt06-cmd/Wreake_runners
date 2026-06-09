"use client";

import ContentPage, { ABOUT_NAV, P } from "@/components/ContentPage";
import { COLORS } from "@/lib/data";

const display = "'Fraunces', serif";

const TIMELINE = [
  { year: "1981", text: "In September 1981, three Wreake Valley School teachers put an ad in the local paper, asking if anyone was interested in meeting up and running together. Approximately ten people met up. 'Wreake Wrunners' was formed! First Committee — Chairman: Stuart Mensley, Secretary: Helen Agger, Events Secretary: Steve Armstrong, Social Secretary: Lyn Palmer, Treasurer: Dave Palmer." },
  { year: "1982", text: "First ran a 2-club challenge: Stilton v Wreake (Stilton Striders Challenge Trophy)." },
  { year: "1983", text: "Wreake held their first club Cross Country (XC) handicap." },
  { year: "1984", text: "Club started printing a monthly newsletter. Wreake organised the first Hungarton 7, part of the LRRL Summer league. 240 entries." },
  { year: "1985", text: "Organised the Wreake 10K, part of the LRRL Winter League. Start/finish where ASDA at Thurmaston is now, with 2 loops round Barkby. First 3 Club Challenge — started off as Wreake, Stilton & Huncote (replaced by Barrow when Huncote numbers depleted). Clubs took it in turns to host the event, and supplied the refreshments and raffle prizes." },
  { year: "1986", text: "Wreake hits 42 members! Wreake held their first club Road handicap, 7.5 miles." },
  { year: "1987", text: "Wreake organised the Wreake Stomp, a true XC course with stream crossings over 6 grueling miles across fields beyond Queniborough towards South Croxton." },
  { year: "1988", text: "Wreake Mens Vets team come 2nd in the British Vets Marathon Championships at Stone in Staffordshire, with President Dave Palmer completing his marathon in 2:50:19, 12th position overall." },
  { year: "1990", text: "Wreake men's team win Huntingdon Marathon (team included Ashley Hollis with a time of 2:46:14)." },
  { year: "1992", text: "Stone Marathon — Dave Palmer runs his best marathon time, 2:45:23." },
  { year: "1994", text: "Wreake Mens Vets team come 1st in the British Vets Marathon Championships at Stone in Staffordshire." },
  { year: "1999", text: "Dave Palmer runs his 14th and final marathon in Manchester, aged 53. He finished 48th in a time of 2:53." },
  { year: "2002", text: "Charity relay for LOROS, from Syston to Hebden Bridge in Yorkshire. Each member ran for 5 or 6 miles before handing over to the next runner. A distance of 115 miles was covered." },
  { year: "2005", text: "24hr relay around Syston to commemorate 24 years of the club, 3 mile legs round Syston. Started 2pm Friday afternoon and finished at 2pm on Saturday at Central Park to coincide with the Syston Carnival. Next year we did 25 hours!" },
  { year: "2009", text: "Mens team winners at Ashby 20: Ashley Hollis, Richard Bettsworth, Mark Bush and Matthew Noble." },
  { year: "2017", text: "Mens Team and VET Mens Team both LRRL Division 1 Runners-up." },
  { year: "2020", text: "Leicester marathon virtual event 'Run the World'. As a team we finished 1st in the 'Top 25 runners' category, and 2nd overall, running over 8,000km!" },
  { year: "2021", text: "We joined Instagram — @wreake_runners. Club begins 40th year celebrations with awards evening in Quorn. Co-hosted LRRL race Rotherby 8 with Team Anstey." },
];

export default function HistoryPage() {
  return (
    <ContentPage
      kicker="ABOUT US"
      title="Club History"
      intro="From a newspaper ad in 1981 to 40+ years of running together."
      subnav={ABOUT_NAV}
    >
      <P>
        In September 1981, three Wreake Valley School teachers put an ad in the local
        paper asking if anyone fancied running together. Around ten people turned up —
        and the club was born. Here's how the story has unfolded since.
      </P>

      <div style={{ position: "relative", marginTop: 40, paddingLeft: 28 }}>
        {/* Vertical line */}
        <div style={{ position: "absolute", left: 7, top: 8, bottom: 8, width: 2, background: COLORS.mist }} />

        {TIMELINE.map((item) => (
          <div key={item.year} style={{ position: "relative", marginBottom: 32 }}>
            {/* Dot */}
            <div
              style={{
                position: "absolute",
                left: -28,
                top: 4,
                width: 16,
                height: 16,
                borderRadius: "50%",
                background: COLORS.teal,
                border: "3px solid #fff",
                boxShadow: "0 0 0 1px " + COLORS.mist,
              }}
            />
            <div style={{ fontFamily: display, fontSize: 24, fontWeight: 800, color: COLORS.ink, lineHeight: 1 }}>
              {item.year}
            </div>
            <p style={{ margin: "8px 0 0", fontSize: 16, lineHeight: 1.7 }}>{item.text}</p>
          </div>
        ))}
      </div>
    </ContentPage>
  );
}
