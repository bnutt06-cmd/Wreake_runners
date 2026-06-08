"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { styles } from "@/lib/styles";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useStore();
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState("");

  return (
    <main style={{ ...styles.section, maxWidth: 440 }}>
      <div style={styles.loginCard}>
        <p style={styles.kickerDark}>MEMBERS AREA</p>
        <h2 style={{ ...styles.h2, fontSize: 30 }}>Member Login</h2>
        <p style={{ opacity: 0.7, fontSize: 14, marginBottom: 24 }}>
          Demo credentials — username <strong>member</strong>, password <strong>wreake</strong>
        </p>
        <input
          style={{ ...styles.input, width: "100%", marginBottom: 12 }}
          placeholder="Username"
          value={u}
          onChange={(e) => setU(e.target.value)}
        />
        <input
          style={{ ...styles.input, width: "100%", marginBottom: 16 }}
          type="password"
          placeholder="Password"
          value={p}
          onChange={(e) => setP(e.target.value)}
        />
        {err && <p style={{ color: "#C0392B", fontSize: 14, margin: "0 0 12px" }}>{err}</p>}
        <button
          style={{ ...styles.cta, width: "100%" }}
          onClick={() => {
            if (login(u, p)) router.push("/members");
            else setErr("Incorrect details — try member / wreake");
          }}
        >
          Log in
        </button>
      </div>
    </main>
  );
}
