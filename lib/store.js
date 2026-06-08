"use client";

// ============================================================
// lib/store.js
// Real data layer backed by Supabase.
//  - auth state + member role
//  - published news feed (public)
//  - committee sees pending drafts too
//  - publish creates a 'pending' post; committee approves it
//  - race sign-ups read/write to the signups table
// ============================================================

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { createClient } from "./supabase/client";

const StoreContext = createContext(null);
const supabase = createClient();

export function StoreProvider({ children }) {
  const [user, setUser] = useState(null);       // Supabase auth user, or null
  const [role, setRole] = useState("member");    // 'member' | 'committee'
  const [news, setNews] = useState([]);          // published (+ pending if committee)
  const [signups, setSignups] = useState({});    // { raceId: [name, ...] }
  const [loading, setLoading] = useState(true);

  const loggedIn = !!user;
  const isCommittee = role === "committee";

  // ---- load the signed-in user's profile (role) ----
  const loadProfile = useCallback(async (uid) => {
    if (!uid) { setRole("member"); return; }
    const { data } = await supabase
      .from("profiles").select("role").eq("id", uid).single();
    setRole(data?.role || "member");
  }, []);

  // ---- load news: published for everyone, all rows for committee ----
  const loadNews = useCallback(async (committee) => {
    let q = supabase.from("news").select("*").order("created_at", { ascending: false });
    if (!committee) q = q.eq("status", "published");
    const { data } = await q;
    setNews(
      (data || []).map((n) => ({
        id: n.id,
        title: n.title,
        excerpt: n.excerpt,
        body: n.body,
        tag: n.tag,
        status: n.status,
        author: n.author_name || "Member",
        date: n.created_at?.slice(0, 10),
      }))
    );
  }, []);

  // ---- load race sign-ups, grouped by race ----
  const loadSignups = useCallback(async () => {
    const { data } = await supabase.from("signups").select("race_id, runner_name");
    const grouped = {};
    (data || []).forEach((s) => {
      grouped[s.race_id] = grouped[s.race_id] || [];
      grouped[s.race_id].push(s.runner_name);
    });
    setSignups(grouped);
  }, []);

  // ---- on mount: get session, then load everything ----
  useEffect(() => {
    let active = true;
    (async () => {
      const { data: { user: u } } = await supabase.auth.getUser();
      if (!active) return;
      setUser(u);
      await loadProfile(u?.id);
      const committee = await isUserCommittee(u?.id);
      await Promise.all([loadNews(committee), loadSignups()]);
      setLoading(false);
    })();

    // react to login/logout
    const { data: sub } = supabase.auth.onAuthStateChange(async (_e, session) => {
      const u = session?.user || null;
      setUser(u);
      await loadProfile(u?.id);
      const committee = await isUserCommittee(u?.id);
      await loadNews(committee);
    });

    return () => { active = false; sub.subscription.unsubscribe(); };
  }, [loadProfile, loadNews, loadSignups]);

  async function isUserCommittee(uid) {
    if (!uid) return false;
    const { data } = await supabase.from("profiles").select("role").eq("id", uid).single();
    return data?.role === "committee";
  }

  // ---- actions ----
  async function login(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return !error;
  }

  async function logout() {
    await supabase.auth.signOut();
    setUser(null);
    setRole("member");
    await loadNews(false);
  }

  async function publishPost({ title, excerpt, body, tag }) {
    if (!user) return false;
    const { error } = await supabase.from("news").insert({
      title, excerpt, body, tag,
      status: "pending",
      author_id: user.id,
      author_name: user.user_metadata?.full_name || user.email,
    });
    if (!error) await loadNews(isCommittee);
    return !error;
  }

  async function approvePost(id) {
    const { error } = await supabase.from("news").update({ status: "published" }).eq("id", id);
    if (!error) await loadNews(isCommittee);
    return !error;
  }

  async function addSignup(raceId, name) {
    const { error } = await supabase.from("signups").insert({
      race_id: raceId,
      runner_name: name,
      user_id: user?.id || null,
    });
    if (!error) await loadSignups();
    return !error;
  }

  return (
    <StoreContext.Provider
      value={{
        user, loggedIn, isCommittee, role, loading,
        news, signups,
        login, logout, publishPost, approvePost, addSignup,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
