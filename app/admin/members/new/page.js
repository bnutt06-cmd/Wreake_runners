"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { styles } from "@/lib/styles";
import { COLORS, ALL_ROLES } from "@/lib/data";

function genPassword() {
  // Simple readable temp password: word-style + digits. Admin hands this to
  // the member, who can change it later via the reset-password flow.
  const a = "Wreake";
  const n = Math.floor(1000 + Math.random() * 9000);
  return a + "Run" + n;
}

export default function NewMemberPage() {
  const router = useRouter();
  const { loggedIn, accessResolved, isAdmin } = useStore();

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState(genPassword());
  const [role, setRole] = useState("Member");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (accessResolved && (!loggedIn || !isAdmin)) {
      router.replace(loggedIn ? "/dashboard" : "/login");
    }
  }, [accessResolved, loggedIn, isAdmin, router]);

  if (!accessResolved) return <p style={{ padding: 40 }}>Loading...</p>;
  if (!loggedIn || !isAdmin) return null;

  async function handleSubmit() {
    setBusy(true);
    setResult(null);
    try {
      const res = await fetch("/api/admin/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          first_name: firstName,
          last_name: lastName,
          role,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setResult({ ok: false, message: data.error || "Something went wrong" });
      } else {
        setResult({
          ok: true,
          message: "Member created successfully.",
          warning: data.warning,
          creds: { email, password },
        });
      }
    } catch (e) {
      setResult({ ok: false, message: "Network error: " + e.message });
    } finally {
      setBusy(false);
    }
  }

  function resetForm() {
    setEmail("");
    setFirstName("");
    setLastName("");
    setPassword(genPassword());
    setRole("Member");
    setResult(null);
  }

  const inputStyle = {
    width: "100%",
    padding: "11px 13px",
    border: "1px solid " + COLORS.mist,
    borderRadius: 9,
    fontSize: 15,
    fontFamily: "Archivo, sans-serif",
    marginTop: 6,
  };
  const labelStyle = { fontSize: 13, fontWeight: 700, color: COLORS.ink, display: "block" };

  return (
    <main style={{ maxWidth: 560, margin: "0 auto", padding: "40px 24px 80px" }}>
      <Link href="/admin" style={{ fontSize: 14, color: COLORS.teal, fontWeight: 600, textDecoration: "none" }}>
        &larr; Back to Admin
      </Link>
      <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 32, fontWeight: 800, margin: "12px 0 4px" }}>
        Add a new member
      </h1>
      <p style={{ color: "#6b7280", fontSize: 15, margin: "0 0 28px" }}>
        Creates a login the member can use straight away. Give them the email and
        temporary password &mdash; they can change the password later from their profile.
      </p>

      {result && result.ok ? (
        <div style={{ background: "#eafaf1", border: "1px solid #b8e6cd", borderRadius: 12, padding: 20, marginBottom: 24 }}>
          <div style={{ fontWeight: 700, color: "#1b7a4b", marginBottom: 10 }}>{result.message}</div>
          {result.warning ? (
            <div style={{ fontSize: 13, color: "#a15c00", marginBottom: 10 }}>{result.warning}</div>
          ) : null}
          <div style={{ background: "#fff", borderRadius: 8, padding: 14, fontSize: 14, lineHeight: 1.8 }}>
            <div><strong>Email:</strong> {result.creds.email}</div>
            <div><strong>Temporary password:</strong> <code style={{ background: COLORS.mist, padding: "2px 6px", borderRadius: 4 }}>{result.creds.password}</code></div>
          </div>
          <p style={{ fontSize: 13, color: "#6b7280", margin: "12px 0 0" }}>
            Make a note of these now &mdash; the password won&rsquo;t be shown again. Pass them to the new member.
          </p>
          <button onClick={resetForm} style={{ ...styles.cta, marginTop: 16 }}>Add another member</button>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 18 }}>
          <div>
            <label style={labelStyle}>First name</label>
            <input style={inputStyle} value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Jane" />
          </div>
          <div>
            <label style={labelStyle}>Last name</label>
            <input style={inputStyle} value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Smith" />
          </div>
          <div>
            <label style={labelStyle}>Email</label>
            <input style={inputStyle} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@example.com" />
          </div>
          <div>
            <label style={labelStyle}>Temporary password</label>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input style={{ ...inputStyle, flex: 1 }} value={password} onChange={(e) => setPassword(e.target.value)} />
              <button
                type="button"
                onClick={() => setPassword(genPassword())}
                style={{ marginTop: 6, padding: "11px 14px", border: "1px solid " + COLORS.mist, borderRadius: 9, background: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap" }}
              >
                Generate
              </button>
            </div>
            <p style={{ fontSize: 12, color: "#9ca3af", margin: "6px 0 0" }}>At least 8 characters.</p>
          </div>
          <div>
            <label style={labelStyle}>Role</label>
            <select style={inputStyle} value={role} onChange={(e) => setRole(e.target.value)}>
              {ALL_ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {result && !result.ok ? (
            <div style={{ background: "#fdecea", border: "1px solid #f5c2bb", borderRadius: 10, padding: 14, fontSize: 14, color: "#b3261e" }}>
              {result.message}
            </div>
          ) : null}

          <button style={{ ...styles.cta, opacity: busy ? 0.6 : 1 }} onClick={handleSubmit} disabled={busy}>
            {busy ? "Creating..." : "Create member"}
          </button>
        </div>
      )}
    </main>
  );
}
