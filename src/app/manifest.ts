import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Anvil - 習慣化RPG",
    short_name: "Anvil",
    description: "毎日の習慣達成をRPG的な成長体験に変換するアプリ",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0f0f13",
    theme_color: "#ff6b2b",
    icons: [
      {
        src: "/icons/icon-192",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-512",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
