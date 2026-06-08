"use client";

// ============================================================
// lib/store.js
// Holds shared client state (news, sign-ups, auth) across pages.
// In-memory for the POC — state resets on full page reload.
//
// PRODUCTION: replace setNews/addSignup/login with Supabase
// reads & writes; replace context with server data + revalidation.
// ============================================================

import { createContext, useContext, useState } from "react";
import { SEED_NEWS, SEED_RACES, DEMO_MEMBER } from "./data";

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [news, setNews] = useState(SEED_NEWS);
  const [races] = useState(SEED_RACES);
  const [signups, setSignups] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);

  function addSignup(raceId, name) {
    setSignups((s) => ({ ...s, [raceId]: [...(s[raceId] || []), name] }));
  }

  function publishPost(post) {
    setNews((n) => [post, ...n]);
  }

  function login(username, password) {
    if (username === DEMO_MEMBER.username && password === DEMO_MEMBER.password) {
      setLoggedIn(true);
      return true;
    }
    return false;
  }

  function logout() {
    setLoggedIn(false);
  }

  return (
    <StoreContext.Provider
      value={{ news, races, signups, loggedIn, addSignup, publishPost, login, logout }}
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
