export const NAV_ITEMS = [
  { href: "/", label: "冒険", icon: "⚔️" },
  { href: "/history", label: "記録", icon: "📜" },
  { href: "/status", label: "装備", icon: "🛡️" },
  { href: "/habits", label: "クエスト", icon: "📋" },
] as const;

export type AppRoute = (typeof NAV_ITEMS)[number]["href"];
