export const NAV_ITEMS = [
  { href: "/", label: "ダッシュボード", icon: "🏠" },
  { href: "/history", label: "履歴", icon: "📜" },
  { href: "/status", label: "ステータス", icon: "📊" },
  { href: "/habits", label: "習慣", icon: "📋" },
] as const;

export type AppRoute = (typeof NAV_ITEMS)[number]["href"];
