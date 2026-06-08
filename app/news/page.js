"use client";

import { useStore } from "@/lib/store";
import { styles } from "@/lib/styles";
import { NewsCard, ArticleModal, useArticleModal } from "@/components/News";

export default function NewsPage() {
  const { news } = useStore();
  const { open, setOpen } = useArticleModal();

  return (
    <main style={styles.section}>
      <p style={styles.kickerDark}>THE NOTICEBOARD</p>
      <h2 style={styles.h2}>Club News &amp; Race Reports</h2>
      <div style={{ ...styles.newsGrid, marginTop: 32 }}>
        {news.map((n) => (
          <NewsCard key={n.id} n={n} onClick={() => setOpen(n)} />
        ))}
      </div>
      <ArticleModal article={open} onClose={() => setOpen(null)} />
    </main>
  );
}
