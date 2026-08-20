// ── Home Page Layout Utilities ────────────────────────────────────────────────
// Shared between SettingsPage (editing) and HomePage (reading).

import { storage } from "./storage";

export const HOME_ROWS = [
  { id: "continue", label: "Continue Watching" },
  { id: "recommended", label: "Recommended for You" },
  { id: "trendingMovies", label: "Trending Movies" },
  { id: "trendingTV", label: "Trending Series" },
  { id: "topRated", label: "Top Rated" },
];

const DEFAULT_ROW_ORDER = [
  "trendingMovies",
  "trendingTV",
  "topRated",
  "recommended",
  "continue",
];
const DEFAULT_ROW_VISIBLE = Object.fromEntries(
  HOME_ROWS.map((r) => [r.id, true]),
);

export function loadHomeLayout() {
  const savedOrder = storage.get("homeRowOrder");
  const savedVisible = storage.get("homeRowVisible");
  const knownIds = new Set(HOME_ROWS.map((r) => r.id));

  // One-time migration: make live content immediately visible on compact
  // screens even when an older saved layout put recommendations first.
  if (!storage.get("trendingFirstDefaultV1")) {
    const visible = { ...DEFAULT_ROW_VISIBLE, ...(savedVisible || {}) };
    visible.trendingMovies = true;
    visible.trendingTV = true;
    visible.topRated = true;
    storage.set("homeRowOrder", DEFAULT_ROW_ORDER);
    storage.set("homeRowVisible", visible);
    storage.set("trendingFirstDefaultV1", true);
    return { order: DEFAULT_ROW_ORDER, visible };
  }

  const order = savedOrder
    ? [
        ...savedOrder.filter((id) => knownIds.has(id)),
        ...DEFAULT_ROW_ORDER.filter((id) => !savedOrder.includes(id)),
      ]
    : DEFAULT_ROW_ORDER;

  const visible = savedVisible
    ? { ...DEFAULT_ROW_VISIBLE, ...savedVisible }
    : DEFAULT_ROW_VISIBLE;

  return { order, visible };
}

export function saveHomeLayout(order, visible) {
  storage.set("homeRowOrder", order);
  storage.set("homeRowVisible", visible);
}

/** "carousel" | "list" (default) */
export function loadHomeViewMode() {
  // One-time migration makes Grid Sections the default for existing visitors
  // while preserving any choice they make afterwards in Settings.
  if (!storage.get("gridSectionsDefaultV1")) {
    storage.set("homeViewMode", "list");
    storage.set("gridSectionsDefaultV1", true);
    return "list";
  }
  return storage.get("homeViewMode") || "list";
}

export function saveHomeViewMode(mode) {
  storage.set("homeViewMode", mode);
}

export function loadStartPage() {
  return storage.get("startPage") || "home";
}
