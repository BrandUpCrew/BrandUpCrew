"use client";

import { useEffect, useState } from "react";

/**
 * Dispatched by the initial page loader the moment the brand curtain starts to
 * lift. Hero-level entrances wait for it so they play under the fade instead of
 * running their course behind the overlay and leaving a finished hero on screen.
 */
export const INITIAL_LOADER_EXIT_EVENT = "initial-loader-exit";

/**
 * Dead-man's switch. The loader always reports readiness within its own
 * readiness timeout, so this only fires if that component never mounted at all.
 * Without it a stalled loader would leave the hero parked at its hidden start
 * state forever.
 */
const LOADER_FAILSAFE_MS = 4200;

function curtainIsPending() {
  if (typeof document === "undefined") return false;
  return document.documentElement.dataset.initialLoader === "pending";
}

/**
 * Runs `onReady` once the curtain is out of the way — immediately when there is
 * no curtain to wait for (client-side navigation, reduced motion, a loader that
 * already finished), otherwise on the exit event. Returns an unsubscribe that is
 * safe to call at any point.
 */
export function subscribeToHeroEntrance(onReady: () => void) {
  if (!curtainIsPending()) {
    onReady();
    return () => {};
  }

  let settled = false;
  const finish = () => {
    if (settled) return;
    settled = true;
    window.clearTimeout(failsafe);
    window.removeEventListener(INITIAL_LOADER_EXIT_EVENT, finish);
    onReady();
  };
  const failsafe = window.setTimeout(finish, LOADER_FAILSAFE_MS);

  window.addEventListener(INITIAL_LOADER_EXIT_EVENT, finish);

  return () => {
    settled = true;
    window.clearTimeout(failsafe);
    window.removeEventListener(INITIAL_LOADER_EXIT_EVENT, finish);
  };
}

/** `false` while the curtain still covers the hero, `true` once it lifts. */
export function useHeroEntrance() {
  const [ready, setReady] = useState(false);

  useEffect(() => subscribeToHeroEntrance(() => setReady(true)), []);

  return ready;
}
