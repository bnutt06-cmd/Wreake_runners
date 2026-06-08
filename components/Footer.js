import { styles } from "@/lib/styles";

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div>
        <strong style={{ letterSpacing: 1 }}>WREAKE RUNNERS</strong>
        <p style={{ opacity: 0.7, margin: "6px 0 0", fontSize: 14 }}>
          Catholic Church Hall, Broad Street, Syston, LE7 1GH · Running better together
        </p>
      </div>
      <div style={{ opacity: 0.6, fontSize: 13 }}>© {new Date().getFullYear()} Wreake Runners</div>
    </footer>
  );
}
