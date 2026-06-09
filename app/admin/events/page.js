"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { COLORS } from "@/lib/data";
import { styles } from "@/lib/styles";

const TYPES = ["Training", "Social", "Meeting", "Other"];

export default function AdminEventsPage() {
  return (
    <Suspense fallback={<p style={{ padding: 40 }}>Loading...</p>}>
      <AdminEventsInner />
    </Suspense>
  );
}

function AdminEventsInner() {
  const router = useRouter();
  const {
    loggedIn, loading, isAdmin,
    clubEvents, createEvent, updateEvent, deleteEvent,
  } = useStore();

  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useState("");

  useEffect(() => {
    if (!loading && (!loggedIn || !isAdmin)) {
      router.replace(loggedIn ? "/dashboard" : "/login");
    }
  }, [loading, loggedIn, isAdmin, router]);

  if (loading) return <p style={{ padding: 40 }}>Loading...</p>;
  if (!loggedIn || !isAdmin) return null;

  // Sort: upcoming first (ascending), then past (descending)
  const now = new Date();
  const upcoming = (clubEvents || [])
    .filter((e) => new Date(e.event_timestamp) >= now)
    .sort((a, b) => new Date(a.event_timestamp) - new Date(b.event_timestamp));
  const past = (clubEvents || [])
    .filter((e) => new Date(e.event_timestamp) < now)
    .sort((a, b) => new Date(b.event_timestamp) - new Date(a.event_timestamp));

  function startNew() {
    setEditing({
      id: null,
      title: "",
      description: "",
      event_date: "",
      event_time: "",
      event_type: TYPES[0],
      location: "",
      _isNew: true,
    });
  }

  function startEdit(e) {
    // Split the timestamp into date + time for the form inputs.
    const dt = new Date(e.event_timestamp);
    const pad = (n) => String(n).padStart(2, "0");
    setEditing({
      id: e.id,
      title: e.title,
      description: e.description || "",
      event_date: dt.getFullYear() + "-" + pad(dt.getMonth() + 1) + "-" + pad(dt.getDate()),
      event_time: pad(dt.getHours()) + ":" + pad(dt.getMinutes()),
      event_type: e.event_type || TYPES[0],
      location: e.location || "",
    });
  }

  async function saveEditing() {
    if (!editing.title.trim() || !editing.event_date || !editing.event_time) {
      setFlash("Title, date and time are required.");
      return;
    }
    setSaving(true);
    setFlash("");

    // Combine date + time into a timestamp (interpreted in the browser's timezone).
    const ts = new Date(editing.event_date + "T" + editing.event_time).toISOString();

    const payload = {
      title: editing.title.trim(),
      description: editing.description.trim() || null,
      event_timestamp: ts,
      event_type: editing.event_type,
      location: editing.location.trim() || null,
    };

    const result = editing.id
      ? await updateEvent(editing.id, payload)
      : await createEvent(payload);

    setSaving(false);
    if (!result.ok) {
      setFlash("Error: " + (result.error || "could not save"));
      return;
    }
    setEditing(null);
    setFlash("");
  }

  async function handleDelete(e) {
    if (!confirm('Delete "' + e.title + '"?')) return;
    const { ok, error } = await deleteEvent(e.id);
    if (!ok) setFlash("Error: " + (error || "could not delete"));
  }

  return (
    <main style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 32px 64px" }}>
      <div style={{ marginBottom: 8, fontSize: 13 }}>
        <Link href="/admin" style={{ color: COLORS.teal, fontWeight: 600 }}>Back to Admin</Link>
      </div>
      <p style={styles.kickerDark}>ADMIN - EVENTS</p>
      <h2 style={styles.h2}>Manage Events</h2>
      <p style={{ opacity: 0.7, marginTop: 8, marginBottom: 24, maxWidth: 720 }}>
        Add training sessions, socials and meetings. Events show up on the
        dashboard calendar and the Club Events tab.
      </p>

      {flash ? <div style={{ ...styles.flash, marginBottom: 16 }}>{flash}</div> : null}

      {!editing ? (
        <>
          <button onClick={startNew} style={{ ...styles.cta, marginBottom: 20 }}>
            + New event
          </button>

          <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 18, margin: "24px 0 12px" }}>
            Upcoming ({upcoming.length})
          </h3>
          {upcoming.length === 0 ? (
            <p style={{ opacity: 0.6, fontSize: 14 }}>No upcoming events. Click + New event above.</p>
          ) : (
            <div style={{ display: "grid", gap: 12 }}>
              {upcoming.map((e) => <EventRow key={e.id} event={e} onEdit={startEdit} onDelete={handleDelete} />)}
            </div>
          )}

          {past.length > 0 ? (
            <>
              <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 18, margin: "32px 0 12px", opacity: 0.6 }}>
                Past ({past.length})
              </h3>
              <div style={{ display: "grid", gap: 12, opacity: 0.7 }}>
                {past.slice(0, 10).map((e) => <EventRow key={e.id} event={e} onEdit={startEdit} onDelete={handleDelete} />)}
              </div>
            </>
          ) : null}
        </>
      ) : null}

      {editing ? (
        <EventEditor
          event={editing}
          onChange={setEditing}
          onSave={saveEditing}
          onCancel={() => setEditing(null)}
          saving={saving}
        />
      ) : null}
    </main>
  );
}

function EventRow({ event, onEdit, onDelete }) {
  const dt = new Date(event.event_timestamp);
  const date = dt.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
  const time = dt.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid " + COLORS.mist,
        borderRadius: 14,
        padding: 16,
        display: "flex",
        gap: 16,
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <div style={{ flex: 1, minWidth: 240 }}>
        <strong style={{ fontSize: 16 }}>{event.title}</strong>
        <p style={{ margin: "2px 0 0", fontSize: 13, opacity: 0.7 }}>
          {date} - {time}
          {event.location ? " - " + event.location : ""}
        </p>
        <span style={{ display: "inline-block", marginTop: 6, padding: "2px 8px", borderRadius: 12, fontSize: 11, fontWeight: 700, background: COLORS.mist, color: COLORS.ink }}>
          {event.event_type}
        </span>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => onEdit(event)} style={ghostStyle}>Edit</button>
        <button onClick={() => onDelete(event)} style={dangerStyle}>Delete</button>
      </div>
    </div>
  );
}

function EventEditor({ event, onChange, onSave, onCancel, saving }) {
  const set = (k, v) => onChange({ ...event, [k]: v });

  return (
    <div style={{ background: "#fff", border: "1px solid " + COLORS.mist, borderRadius: 16, padding: 24 }}>
      <h3 style={{ margin: "0 0 16px", fontFamily: "'Fraunces', serif" }}>
        {event._isNew ? "New event" : "Editing: " + event.title}
      </h3>

      <div style={{ display: "grid", gap: 14 }}>
        <Field label="Title">
          <input style={inputStyle} value={event.title} onChange={(e) => set("title", e.target.value)} />
        </Field>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
          <Field label="Date">
            <input type="date" style={inputStyle} value={event.event_date} onChange={(e) => set("event_date", e.target.value)} />
          </Field>
          <Field label="Time">
            <input type="time" style={inputStyle} value={event.event_time} onChange={(e) => set("event_time", e.target.value)} />
          </Field>
          <Field label="Type">
            <select style={inputStyle} value={event.event_type} onChange={(e) => set("event_type", e.target.value)}>
              {TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </Field>
        </div>

        <Field label="Location">
          <input style={inputStyle} value={event.location} onChange={(e) => set("location", e.target.value)} placeholder="e.g. Club Hall, Broad Street" />
        </Field>

        <Field label="Description">
          <textarea
            style={{ ...inputStyle, minHeight: 80, resize: "vertical" }}
            value={event.description}
            onChange={(e) => set("description", e.target.value)}
          />
        </Field>
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
        <button style={styles.cta} onClick={onSave} disabled={saving}>
          {saving ? "Saving..." : "Save event"}
        </button>
        <button style={ghostStyle} onClick={onCancel} disabled={saving}>Cancel</button>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 12, fontWeight: 700, letterSpacing: 0.5, opacity: 0.7, marginBottom: 6 }}>
        {label.toUpperCase()}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  padding: "10px 12px",
  borderRadius: 8,
  border: "1.5px solid " + COLORS.mist,
  fontSize: 14,
  background: "#fff",
  width: "100%",
  outline: "none",
  fontFamily: "inherit",
};

const ghostStyle = {
  background: "transparent",
  color: COLORS.ink,
  border: "1.5px solid " + COLORS.ink,
  padding: "10px 18px",
  borderRadius: 8,
  fontSize: 14,
  fontWeight: 700,
  cursor: "pointer",
};

const dangerStyle = {
  background: "transparent",
  color: "#C0392B",
  border: "1.5px solid #C0392B",
  padding: "10px 18px",
  borderRadius: 8,
  fontSize: 14,
  fontWeight: 700,
  cursor: "pointer",
};
