"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { createClient } from "./supabase/client";
import { ROLES } from "./data";

const StoreContext = createContext(null);

// safe(): wraps a loader so a failure in one does not poison Promise.all
// and freeze the app in loading. Logs errors but resolves either way.
async function safe(label, fn) {
  try {
    return await fn();
  } catch (e) {
    console.warn("[store] loader failed: " + label, e);
    return null;
  }
}

export function StoreProvider({ children }) {
  const [supabase] = useState(() => createClient());

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [news, setNews] = useState([]);
  const [signups, setSignups] = useState({});
  const [races, setRaces] = useState([]);
  const [raceRegs, setRaceRegs] = useState([]);
  const [standardsLookup, setStandardsLookup] = useState([]);
  const [myStandardsLogs, setMyStandardsLogs] = useState([]);
  const [clubEvents, setClubEvents] = useState([]);
  const [pinnedPost, setPinnedPost] = useState(null);
  const [loading, setLoading] = useState(true);
  // authReady becomes true once we've definitively resolved who the user is
  // (their profile has loaded, or we've confirmed there's no user). Admin
  // pages wait on this before deciding whether to allow access — this closes
  // the race where isAdmin is briefly false because the profile hasn't
  // arrived yet.
  const [authReady, setAuthReady] = useState(false);

  const loggedIn = !!user;
  const role = profile?.role || ROLES.MEMBER;
  const isAdmin = role === ROLES.ADMIN;
  const isContentAdmin = role === ROLES.CONTENT_ADMIN;
  const canCreateNews = isAdmin || isContentAdmin;
  // True once we can safely make an access decision: auth has resolved, and
  // either we have the profile loaded or we've confirmed there's no user.
  // Gating admin pages on this avoids both the "stuck on Loading" hang and
  // the "wrongly redirected while profile loads" flash.
  const accessResolved = authReady && (!!profile || !user);

  // ---- LOADERS ----
  const loadProfile = useCallback(async (uid) => {
    // No uid means we can't load a profile — but we must NOT clear an
    // existing one here. Clearing the profile is reserved for an explicit
    // sign-out (handled in onAuthStateChange). This prevents a stray call
    // with a missing uid from wiping a logged-in user's identity.
    if (!uid) return null;
    const { data, error } = await supabase.from("profiles").select("*").eq("id", uid).maybeSingle();
    if (error) {
      // A transient error (network blip, token mid-refresh, concurrent
      // request) must NOT wipe an already-loaded profile. Doing so would
      // flip isAdmin to false and lock an admin out of the page they're on.
      // Keep whatever profile we already have; just log and move on.
      console.warn("[store] loadProfile failed (keeping existing profile)", error);
      return null;
    }
    // Only a successful response is authoritative.
    if (data) setProfile(data);
    return data;
  }, [supabase]);

  const loadNews = useCallback(async (canSeeAll) => {
    let q = supabase.from("news_stories").select("*").order("created_at", { ascending: false });
    if (!canSeeAll) q = q.eq("status", "published");
    const { data, error } = await q;
    if (error) console.warn("[store] loadNews failed", error);
    setNews(data || []);
  }, [supabase]);

  const loadSignups = useCallback(async () => {
    const { data, error } = await supabase.from("signups").select("race_id, runner_name");
    if (error) console.warn("[store] loadSignups failed", error);
    const grouped = {};
    (data || []).forEach((s) => {
      grouped[s.race_id] = grouped[s.race_id] || [];
      grouped[s.race_id].push(s.runner_name);
    });
    setSignups(grouped);
  }, [supabase]);

  const loadRaces = useCallback(async () => {
    const { data, error } = await supabase
      .from("races")
      .select("*")
      .order("race_date", { ascending: true });
    if (error) console.warn("[store] loadRaces failed", error);
    setRaces(data || []);
  }, [supabase]);

  const loadRaceRegs = useCallback(async () => {
    const { data, error } = await supabase
      .from("race_registrations")
      .select("race_id, profile_id, profiles(first_name, last_name)");
    if (error) console.warn("[store] loadRaceRegs failed", error);
    setRaceRegs(data || []);
  }, [supabase]);

  const loadStandardsLookup = useCallback(async () => {
    const { data, error } = await supabase
      .from("standards_lookup")
      .select("category, distance, tier, target_time_seconds");
    if (error) console.warn("[store] loadStandardsLookup failed", error);
    setStandardsLookup(data || []);
  }, [supabase]);

  const loadMyStandardsLogs = useCallback(async (uid) => {
    if (!uid) { setMyStandardsLogs([]); return; }
    const { data, error } = await supabase
      .from("member_standards_log")
      .select("*")
      .eq("profile_id", uid)
      .order("race_date", { ascending: false });
    if (error) console.warn("[store] loadMyStandardsLogs failed", error);
    setMyStandardsLogs(data || []);
  }, [supabase]);

  const loadClubEvents = useCallback(async () => {
    const { data, error } = await supabase
      .from("club_events")
      .select("*")
      .order("event_timestamp", { ascending: true });
    if (error) console.warn("[store] loadClubEvents failed", error);
    setClubEvents(data || []);
  }, [supabase]);

  // Pin loader is defensive: fetches the pin without joins first, then
  // optionally enriches with author info. Stops the pin disappearing if
  // the author join fails for any reason.
  const loadPinnedPost = useCallback(async () => {
    const { data, error } = await supabase
      .from("pinned_posts")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) {
      console.warn("[store] loadPinnedPost failed", error);
      setPinnedPost(null);
      return;
    }
    if (!data) { setPinnedPost(null); return; }
    let author = null;
    if (data.author_id) {
      const { data: a } = await supabase
        .from("profiles")
        .select("first_name, last_name")
        .eq("id", data.author_id)
        .maybeSingle();
      author = a || null;
    }
    setPinnedPost({ ...data, author });
  }, [supabase]);

  // ---- ON MOUNT ----
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        console.log("[store] mount: getUser start");
        // getSession reads the local session WITHOUT a network round-trip,
        // unlike getUser which calls Supabase to validate. getSession is
        // both faster and can't hang on a slow network — which is what was
        // leaving the page stuck on "Loading...".
        const { data: { session } } = await supabase.auth.getSession();
        const u = session?.user || null;
        if (!active) return;
        console.log("[store] mount: session resolved, user?", !!u);
        setUser(u);
        const prof = await safe("loadProfile", () => loadProfile(u?.id));
        console.log("[store] mount: profile resolved, role?", prof?.role || "(none)");
        if (active) setAuthReady(true);
        const canSeeAll = prof?.role === ROLES.ADMIN || prof?.role === ROLES.CONTENT_ADMIN;
        await Promise.all([
          safe("loadNews", () => loadNews(canSeeAll)),
          safe("loadSignups", loadSignups),
          safe("loadRaces", loadRaces),
          safe("loadRaceRegs", loadRaceRegs),
          safe("loadStandardsLookup", loadStandardsLookup),
          safe("loadMyStandardsLogs", () => loadMyStandardsLogs(u?.id)),
          safe("loadClubEvents", loadClubEvents),
          safe("loadPinnedPost", loadPinnedPost),
        ]);
      } catch (e) {
        console.warn("[store] mount: unexpected error", e);
      } finally {
        // ALWAYS resolve auth state, even if everything above broke.
        if (active) { setLoading(false); setAuthReady(true); }
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("[store] onAuthStateChange:", event, "session?", !!session);
      // Ignore TOKEN_REFRESHED, which fires periodically.
      if (event === "TOKEN_REFRESHED") return;

      // Only an explicit sign-out clears auth state.
      if (event === "SIGNED_OUT") {
        setUser(null);
        setProfile(null);
        if (active) setAuthReady(true);
        return;
      }

      // CRITICAL: Supabase can fire events (e.g. INITIAL_SESSION racing the
      // storage read, or focus/navigation events) with a NULL session even
      // though the user is still genuinely signed in. Treating those as a
      // logout wiped the profile mid-session — flipping the user chip to
      // "Member" and locking admins out. If there's no session on a
      // non-signout event, ignore it entirely.
      if (!session?.user) {
        if (active) setAuthReady(true);
        return;
      }

      const u = session.user;
      setUser(u);
      // Mark auth resolved immediately from the session in hand.
      if (active) setAuthReady(true);
      // Profile loads in the background; a transient failure preserves the
      // existing profile (see loadProfile).
      const prof = await safe("loadProfile", () => loadProfile(u.id));
      const canSeeAll = prof?.role === ROLES.ADMIN || prof?.role === ROLES.CONTENT_ADMIN;
      await Promise.all([
        safe("loadNews", () => loadNews(canSeeAll)),
        safe("loadRaces", loadRaces),
        safe("loadRaceRegs", loadRaceRegs),
        safe("loadStandardsLookup", loadStandardsLookup),
        safe("loadMyStandardsLogs", () => loadMyStandardsLogs(u.id)),
        safe("loadClubEvents", loadClubEvents),
        safe("loadPinnedPost", loadPinnedPost),
      ]);
    });

    return () => { active = false; sub.subscription.unsubscribe(); };
  }, [supabase, loadProfile, loadNews, loadSignups, loadRaces, loadRaceRegs, loadStandardsLookup, loadMyStandardsLogs, loadClubEvents, loadPinnedPost]);

  // ---- AUTH ----
  async function login(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { ok: !error, error: error?.message };
  }

  async function logout() {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setMyStandardsLogs([]);
    await safe("loadNews(logout)", () => loadNews(false));
  }

  async function requestPasswordReset(email) {
    const redirectTo = window.location.origin + "/reset-password";
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    return { ok: !error, error: error?.message };
  }

  async function updatePassword(newPassword) {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    return { ok: !error, error: error?.message };
  }

  async function updateOwnProfile(fields) {
    if (!user) return { ok: false };
    const allowed = [
      "first_name", "last_name",
      "gender", "date_of_birth",
      "club_start_date", "bio",
      "avatar_url",
    ];
    const payload = { updated_at: new Date().toISOString() };
    for (const k of allowed) {
      if (k in fields) payload[k] = fields[k];
    }
    const { error } = await supabase
      .from("profiles")
      .update(payload)
      .eq("id", user.id);
    if (!error) await loadProfile(user.id);
    return { ok: !error, error: error?.message };
  }

  // ---- NEWS ----
  async function createStory({ title, body, image_url }) {
    if (!user || !canCreateNews) return { ok: false };
    const status = isAdmin ? "published" : "pending";
    const { error } = await supabase.from("news_stories").insert({
      title, body, image_url: image_url || null,
      author_id: user.id, status,
    });
    if (!error) {
      const canSeeAll = isAdmin || isContentAdmin;
      await loadNews(canSeeAll);
    }
    return { ok: !error, error: error?.message, status };
  }

  async function approveStory(id) {
    if (!isAdmin) return { ok: false };
    const { error } = await supabase.from("news_stories").update({ status: "published" }).eq("id", id);
    if (!error) await loadNews(true);
    return { ok: !error };
  }

  async function deleteStory(id) {
    if (!isAdmin) return { ok: false };
    const { error } = await supabase.from("news_stories").delete().eq("id", id);
    if (!error) await loadNews(true);
    return { ok: !error };
  }

  // ---- ADMIN ----
  async function listAllProfiles() {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("first_name", { ascending: true });
    return { data: data || [], error: error?.message };
  }

  async function changeUserRole(userId, newRole) {
    if (!isAdmin) return { ok: false };
    const { error } = await supabase
      .from("profiles")
      .update({ role: newRole, updated_at: new Date().toISOString() })
      .eq("id", userId);
    return { ok: !error, error: error?.message };
  }

  async function removeProfile(userId) {
    if (!isAdmin) return { ok: false };
    const { error } = await supabase.from("profiles").delete().eq("id", userId);
    return { ok: !error, error: error?.message };
  }

  // ---- LEGACY (v2) signups ----
  async function addSignup(raceId, name) {
    const { error } = await supabase.from("signups").insert({
      race_id: raceId, runner_name: name, user_id: user?.id || null,
    });
    if (!error) await loadSignups();
    return { ok: !error };
  }

  // ---- RACES ----
  async function createRace(payload) {
    if (!isAdmin) return { ok: false, error: "admin only" };
    const insert = sanitiseRace(payload);
    const { data, error } = await supabase.from("races").insert(insert).select().single();
    if (!error) await loadRaces();
    return { ok: !error, error: error?.message, race: data };
  }

  async function updateRace(id, payload) {
    if (!isAdmin) return { ok: false, error: "admin only" };
    const update = { ...sanitiseRace(payload), updated_at: new Date().toISOString() };
    const { error } = await supabase.from("races").update(update).eq("id", id);
    if (!error) await loadRaces();
    return { ok: !error, error: error?.message };
  }

  async function deleteRace(id) {
    if (!isAdmin) return { ok: false, error: "admin only" };
    const { error } = await supabase.from("races").delete().eq("id", id);
    if (!error) await Promise.all([loadRaces(), loadRaceRegs()]);
    return { ok: !error, error: error?.message };
  }

  async function uploadRaceGpx(raceId, file) {
    if (!isAdmin) return { ok: false, error: "admin only" };
    if (!file) return { ok: false, error: "no file" };
    const path = raceId + "-" + Date.now() + ".gpx";
    const { error: upErr } = await supabase.storage
      .from("race-gpx")
      .upload(path, file, { upsert: true, contentType: "application/gpx+xml" });
    if (upErr) return { ok: false, error: upErr.message };
    return { ok: true, storage_path: path };
  }

  async function toggleRaceRegistration(raceId) {
    if (!user) return { ok: false, error: "not logged in" };
    const existing = raceRegs.find(
      (r) => r.race_id === raceId && r.profile_id === user.id
    );
    if (existing) {
      const { error } = await supabase
        .from("race_registrations")
        .delete()
        .eq("race_id", raceId)
        .eq("profile_id", user.id);
      if (!error) await loadRaceRegs();
      return { ok: !error, removed: true };
    } else {
      const { error } = await supabase
        .from("race_registrations")
        .insert({ race_id: raceId, profile_id: user.id });
      if (!error) await loadRaceRegs();
      return { ok: !error, added: true };
    }
  }

  // ---- STANDARDS ----
  async function submitStandard(payload) {
    if (!user) return { ok: false, error: "not logged in" };
    const insert = {
      profile_id: user.id,
      distance: payload.distance,
      achieved_time_seconds: payload.achieved_time_seconds,
      formatted_time: payload.formatted_time,
      race_name: payload.race_name,
      race_date: payload.race_date,
      is_virtual: !!payload.is_virtual,
      is_leicestershire_region: !!payload.is_leicestershire_region,
      is_valid_lrrl_5k: payload.is_valid_lrrl_5k !== false,
      proof_url: payload.proof_url || null,
    };
    const { error } = await supabase.from("member_standards_log").insert(insert);
    if (!error) await loadMyStandardsLogs(user.id);
    return { ok: !error, error: error?.message };
  }

  async function deleteStandardLog(id) {
    if (!user) return { ok: false };
    const { error } = await supabase
      .from("member_standards_log")
      .delete()
      .eq("id", id);
    if (!error) await loadMyStandardsLogs(user.id);
    return { ok: !error, error: error?.message };
  }

  async function listAllStandardsLogs() {
    if (!isAdmin) return { data: [], error: "admin only" };
    const { data, error } = await supabase
      .from("member_standards_log")
      .select("*, profiles(first_name, last_name, gender, date_of_birth)")
      .order("race_date", { ascending: false });
    return { data: data || [], error: error?.message };
  }

  async function verifyStandardLog(id, verified) {
    if (!isAdmin) return { ok: false };
    const { error } = await supabase
      .from("member_standards_log")
      .update({ is_verified_by_admin: verified })
      .eq("id", id);
    return { ok: !error, error: error?.message };
  }

  // ---- EVENTS ----
  async function createEvent(payload) {
    if (!isAdmin) return { ok: false, error: "admin only" };
    const insert = sanitiseEvent(payload);
    const { error } = await supabase.from("club_events").insert(insert);
    if (!error) await loadClubEvents();
    return { ok: !error, error: error?.message };
  }

  async function updateEvent(id, payload) {
    if (!isAdmin) return { ok: false, error: "admin only" };
    const update = { ...sanitiseEvent(payload), updated_at: new Date().toISOString() };
    const { error } = await supabase.from("club_events").update(update).eq("id", id);
    if (!error) await loadClubEvents();
    return { ok: !error, error: error?.message };
  }

  async function deleteEvent(id) {
    if (!isAdmin) return { ok: false, error: "admin only" };
    const { error } = await supabase.from("club_events").delete().eq("id", id);
    if (!error) await loadClubEvents();
    return { ok: !error, error: error?.message };
  }

  // ---- PINNED POST ----
  // Strict ordering: AWAIT deactivate, AWAIT insert, then optimistic update
  // followed by full reload. Previous version's chain was loose.
  async function setPinnedPostAction(payload) {
    if (!isAdmin) return { ok: false, error: "admin only" };

    const { error: deactivateError } = await supabase
      .from("pinned_posts")
      .update({ is_active: false })
      .eq("is_active", true);
    if (deactivateError) {
      console.warn("[store] deactivating existing pins failed", deactivateError);
      return { ok: false, error: deactivateError.message };
    }

    const { data, error } = await supabase
      .from("pinned_posts")
      .insert({
        title: payload.title,
        body: payload.body,
        author_id: user?.id || null,
        is_active: true,
      })
      .select()
      .single();
    if (error) {
      console.warn("[store] inserting pin failed", error);
      return { ok: false, error: error.message };
    }

    // Optimistic state update for instant UI feedback.
    setPinnedPost({
      ...data,
      author: profile ? { first_name: profile.first_name, last_name: profile.last_name } : null,
    });
    // Then a full reload to catch the RLS-correct version.
    await loadPinnedPost();
    return { ok: true };
  }

  async function clearPinnedPost() {
    if (!isAdmin) return { ok: false };
    const { error } = await supabase
      .from("pinned_posts")
      .update({ is_active: false })
      .eq("is_active", true);
    if (error) return { ok: false, error: error.message };
    setPinnedPost(null);
    await loadPinnedPost();
    return { ok: true };
  }

  return (
    <StoreContext.Provider
      value={{
        user, profile, role, loggedIn, isAdmin, isContentAdmin, canCreateNews, loading, authReady, accessResolved,
        news, signups, races, raceRegs, standardsLookup, myStandardsLogs,
        clubEvents, pinnedPost,
        loadRaces, loadRaceRegs, loadStandardsLookup, loadMyStandardsLogs,
        loadClubEvents, loadPinnedPost,
        login, logout, requestPasswordReset, updatePassword, updateOwnProfile,
        createStory, approveStory, deleteStory,
        listAllProfiles, changeUserRole, removeProfile,
        addSignup,
        createRace, updateRace, deleteRace, uploadRaceGpx, toggleRaceRegistration,
        submitStandard, deleteStandardLog, listAllStandardsLogs, verifyStandardLog,
        createEvent, updateEvent, deleteEvent,
        setPinnedPost: setPinnedPostAction, clearPinnedPost,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

function sanitiseRace(payload) {
  const allowed = [
    "name", "race_date", "type", "location", "distance_text",
    "blurb", "description", "course_notes", "external_signup_url",
    "route", "distance_m", "elevation_gain_m", "elevation_loss_m",
    "start_lat", "start_lon", "gpx_storage_path",
  ];
  const out = {};
  for (const k of allowed) {
    if (k in payload) out[k] = payload[k] ?? null;
  }
  return out;
}

function sanitiseEvent(payload) {
  const allowed = ["title", "description", "event_timestamp", "end_timestamp", "event_type", "location"];
  const out = {};
  for (const k of allowed) {
    if (k in payload) out[k] = payload[k] ?? null;
  }
  return out;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
