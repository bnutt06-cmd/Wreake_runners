"use client";

import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { styles } from "@/lib/styles";
import { NewsCard, ArticleModal, useArticleModal } from "@/components/News";

export default function HomePage() {
  const router = useRouter();
  const { news } = useStore();
  const { open, setOpen } = useArticleModal();

  const stats = [
    ["40+", "years running"],
    ["2", "club nights / wk"],
    ["18+", "all abilities"],
    ["ARC", "& EA affiliated"],
  ];

  return (
    <main>
      <section style={styles.hero}>
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
            <button style={styles.cta} onClick={() => router.push("/races")}>
              See upcoming races →
            </button>
            <button style={styles.ghostBtn} onClick={() => router.push("/news")}>
              Latest news
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
          {news.slice(0, 3).map((n) => (
            <NewsCard key={n.id} n={n} onClick={() => setOpen(n)} />
          ))}
        </div>
      </section>

      <ArticleModal article={open} onClose={() => setOpen(null)} />
    </main>
  );
}
