import { ImageResponse } from "next/og";
import { createElement } from "react";
import AppIconArtwork from "@/lib/appIconArtwork";

export const runtime = "nodejs";

export async function GET() {
  const size = 512;
  return new ImageResponse(createElement(AppIconArtwork, { size }), {
    width: size,
    height: size,
  });
}
