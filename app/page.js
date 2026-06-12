"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { styles } from "@/lib/styles";
import { fmtDate } from "@/lib/data";

export default function HomePage() {
  const router = useRouter();
  const { news } = useStore();
  const [open, setOpen] = useState(null);

  const published = news.filter((n) => n.status === "published");

  const stats = [
    ["40+", "years running"],
    ["2", "club nights / wk"],
    ["18+", "all abilities"],
    ["ARC", "& EA affiliated"],
  ];

  return (
    <main>
      <section style={styles.hero}>
        {/* Faded team photo background */}
        <div
          style={{
            position: "absolute", inset: 0,
            backgroundImage: "url('/home-hero-team.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center 35%",
            opacity: 0.2,
            mixBlendMode: "luminosity",
          }}
        />
        {/* Gradient scrim to keep text legible over the photo */}
        <div
          style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(120deg, " + "#1E2A6EF0" + " 0%, " + "#1E2A6EAA" + " 50%, transparent 110%)",
          }}
        />
        <div style={styles.heroGrain} />
        <div style={styles.heroInner}>
          <p style={styles.kicker}>EST. 1981 · SYSTON, LEICESTER</p>
          <h1 style={styles.heroH1}>
            Running better<br />
            <span style={{ color: "#5FD0E6" }}>together.</span>
          </h1>
          <p style={styles.heroSub}>
            A friendly, inclusive club for runners of every ability. Structured sessions
            Tuesdays &amp; Thursdays, track, strength &amp; conditioning, and a calendar packed
            with races and socials.
          </p>
          <div style={styles.heroBtns}>
            <button className="wr-hero-pill" onClick={() => router.push("/news")}>
              Latest News
            </button>
            <a className="wr-hero-pill" href="mailto:info@wreakerunners.co.uk">
              Get In Touch
            </a>
            <button className="wr-hero-pill" onClick={() => router.push("/join")}>
              Join Us
            </button>
          </div>
          <div style={styles.statRow}>
            {stats.map(([n, l]) => (
              <div key={l}>
                <div style={styles.statNum}>{n}</div>
                <div style={styles.statLabel}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={styles.section}>
        <div style={styles.sectionHead}>
          <h2 style={styles.h2}>Latest from the club</h2>
          <button style={styles.linkBtn} onClick={() => router.push("/news")}>
            View all news →
          </button>
        </div>
        <div style={styles.newsGrid}>
          {published.slice(0, 3).map((n) => (
            <article key={n.id} style={styles.card} className="wr-card" onClick={() => setOpen(n)}>
              <h3 style={styles.cardTitle}>{n.title}</h3>
              <p style={styles.cardExcerpt}>
                {n.body.slice(0, 140)}{n.body.length > 140 && "…"}
              </p>
              <div style={styles.cardMeta}>
                <span>{fmtDate(n.created_at)}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {open && (
        <div style={styles.overlay} onClick={() => setOpen(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button style={styles.closeBtn} onClick={() => setOpen(null)}>✕</button>
            <h2 style={{ ...styles.h2, marginTop: 12 }}>{open.title}</h2>
            <div style={{ ...styles.cardMeta, margin: "8px 0 20px" }}>
              <span>{fmtDate(open.created_at)}</span>
            </div>
            {open.image_url && (
              <img src={open.image_url} alt="" style={{ width: "100%", borderRadius: 12, marginBottom: 20 }} />
            )}
            <p style={{ lineHeight: 1.7, fontSize: 17, whiteSpace: "pre-wrap" }}>{open.body}</p>
          </div>
        </div>
      )}
    </main>
  );
}
