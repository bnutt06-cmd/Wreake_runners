"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { styles } from "@/lib/styles";
import { COLORS, ROLES, ALL_ROLES, fullName, fmtDate } from "@/lib/data";

export default function AdminPage() {
  const router = useRouter();
  const {
    loggedIn, loading, isAdmin, listAllProfiles, changeUserRole, removeProfile,
  } = useStore();

  const [members, setMembers] = useState([]);
  const [query, setQuery] = useState("");
  const [flash, setFlash] = useState("");
  const [forbidden, setForbidden] = useState(false);

  // Strict route guard.
  useEffect(() => {
    if (!loading) {
      if (!loggedIn) router.replace("/login");
      else if (!isAdmin) setForbidden(true);
    }
  }, [loading, loggedIn, isAdmin, router]);

  // Load member directory once Admin status is confirmed.
  useEffect(() => {
    (async () => {
      if (isAdmin) {
        const { data } = await listAllProfiles();
        setMembers(data);
      }
    })();
  }, [isAdmin, listAllProfiles]);

  if (loading) return <main style={styles.section}><p>Loading…</p></main>;
  if (!loggedIn) return null;

  if (forbidden) {
    return (
      <main style={{ ...styles.section, maxWidth: 540, textAlign: "center" }}>
        <h2 style={styles.h2}>403 — Forbidden</h2>
        <p style={{ opacity: 0.7, marginTop: 12, marginBottom: 24 }}>
          You don't have permission to access the admin area.
        </p>
        <button style={styles.cta} onClick={() => router.push("/dashboard")}>
          Back to Dashboard
        </button>
      </main>
    );
  }

  const filtered = members.filter((m) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      fullName(m).toLowerCase().includes(q) ||
      (m.role || "").toLowerCase().includes(q)
    );
  });

  async function onRoleChange(userId, newRole) {
    const { ok, error } = await changeUserRole(userId, newRole);
    if (ok) {
      setMembers((ms) => ms.map((m) => (m.id === userId ? { ...m, role: newRole } : m)));
      setFlash("Role updated.");
      setTimeout(() => setFlash(""), 3000);
    } else {
      setFlash(`Error: ${error}`);
    }
  }

  async function onDelete(userId, name) {
    if (!confirm(`Remove ${name}'s profile? This cannot be undone.\n\n(Note: to fully delete their login account, also remove them in Supabase → Authentication → Users.)`)) return;
    const { ok, error } = await removeProfile(userId);
    if (ok) {
      setMembers((ms) => ms.filter((m) => m.id !== userId));
      setFlash("Profile removed.");
      setTimeout(() => setFlash(""), 3000);
    } else {
      setFlash(`Error: ${error}`);
    }
  }

  const tableHeader = {
    textAlign: "left", padding: "12px 14px", borderBottom: `2px solid ${COLORS.mist}`,
    fontSize: 12, fontWeight: 700, letterSpacing: 1, color: COLORS.ink, textTransform: "uppercase",
  };
  const tableCell = {
    padding: "14px", borderBottom: `1px solid ${COLORS.mist}`, fontSize: 14, verticalAlign: "middle",
  };

  return (
    <main style={styles.section}>
      <p style={styles.kickerDark}>ADMIN</p>
      <h2 style={styles.h2}>Member Directory</h2>
      <p style={{ opacity: 0.7, marginTop: 8, marginBottom: 16 }}>
        Manage member roles and offboard users.
      </p>

      <div style={{ marginBottom: 24, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <a
          href="/admin/claims"
          style={{
            display: "inline-block",
            background: COLORS.ink,
            color: "#fff",
            padding: "10px 18px",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          Standards Claims Review →
        </a>
        <a
          href="/admin/races"
          style={{
            display: "inline-block",
            background: COLORS.ink,
            color: "#fff",
            padding: "10px 18px",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          Manage Races →
        </a>
      </div>

      {flash && <div style={{ ...styles.flash, marginBottom: 16 }}>{flash}</div>}

      <input
        style={{ ...styles.input, width: "100%", maxWidth: 400, marginBottom: 20 }}
        placeholder="Search by name or role…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div style={{ background: "#fff", borderRadius: 16, border: `1px solid ${COLORS.mist}`, overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
          <thead>
            <tr>
              <th style={tableHeader}>Name</th>
              <th style={tableHeader}>Role</th>
              <th style={tableHeader}>Joined</th>
              <th style={tableHeader}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m) => (
              <tr key={m.id}>
                <td style={tableCell}>
                  <strong>{fullName(m)}</strong>
                  <div style={{ fontSize: 12, opacity: 0.5, marginTop: 2 }}>
                    {m.id.slice(0, 8)}…
                  </div>
                </td>
                <td style={tableCell}>
                  <select
                    value={m.role || ROLES.MEMBER}
                    onChange={(e) => onRoleChange(m.id, e.target.value)}
                    style={{
                      padding: "6px 10px", borderRadius: 8, border: `1.5px solid ${COLORS.mist}`,
                      fontSize: 14, background: "#fff",
                    }}
                  >
                    {ALL_ROLES.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </td>
                <td style={tableCell}>{fmtDate(m.created_at)}</td>
                <td style={tableCell}>
                  <button
                    onClick={() => onDelete(m.id, fullName(m))}
                    style={{
                      background: "transparent", color: "#C0392B",
                      border: "1.5px solid #C0392B", padding: "6px 14px",
                      borderRadius: 8, fontSize: 13, fontWeight: 700,
                    }}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} style={{ ...tableCell, textAlign: "center", opacity: 0.6 }}>
                  No members match that search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={{
        marginTop: 24, padding: 16, background: COLORS.mist, borderRadius: 12,
        fontSize: 13, opacity: 0.8,
      }}>
        <strong>Note on user offboarding:</strong> "Remove" deletes the member's profile
        row. To fully delete the user's login account, also remove them in
        Supabase → Authentication → Users.
      </div>
    </main>
  );
}
