"use client";

import { useEffect, useSyncExternalStore } from "react";
import { SunIcon, MoonIcon, AutoIcon } from "./icons";

type Mode = "light" | "dark" | "auto";

/** Shared with the pre-paint script in layout.tsx. Keep the literals in sync. */
const STORAGE_KEY = "zf-theme-mode";
const CHANGE_EVENT = "zf-theme-mode-change";

function readMode(): Mode {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "light" || v === "dark" || v === "auto") return v;
  } catch {
    /* storage unavailable */
  }
  return "auto";
}

function prefersDark(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}

/** Resolve a mode to a concrete theme and write it to <html>. */
function applyTheme(mode: Mode): void {
  const dark = mode === "dark" || (mode === "auto" && prefersDark());
  document.documentElement.dataset.theme = dark ? "dark" : "light";
}

// External store: the persisted mode. Reading client-only state through
// useSyncExternalStore keeps SSR/hydration consistent without a setState-in-effect.
function subscribe(onChange: () => void): () => void {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/**
 * Visitor-facing colour-mode control cycling auto → light → dark. `auto` tracks
 * the OS preference live. The chosen mode persists to localStorage; the matching
 * pre-paint script in layout.tsx reads it before first paint to avoid a flash.
 */
export function ThemeToggle() {
  const mode = useSyncExternalStore<Mode>(subscribe, readMode, () => "auto");

  // Sync <html data-theme> to the mode, and — while in auto — follow OS changes
  // live. These update an external system (the DOM) from state, which is the
  // intended use of an effect; no React state is set here.
  useEffect(() => {
    applyTheme(mode);
    if (mode !== "auto") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme("auto");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [mode]);

  const next: Mode = mode === "auto" ? "light" : mode === "light" ? "dark" : "auto";
  const label = `Theme: ${mode} — switch to ${next}`;
  const Icon = mode === "light" ? SunIcon : mode === "dark" ? MoonIcon : AutoIcon;

  const cycle = () => {
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
    applyTheme(next);
    window.dispatchEvent(new Event(CHANGE_EVENT));
  };

  return (
    <button
      type="button"
      className="zf-theme-toggle"
      onClick={cycle}
      aria-label={label}
      title={label}
    >
      <Icon />
    </button>
  );
}
