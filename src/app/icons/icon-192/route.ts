import { ImageResponse } from "next/og";
import { createElement } from "react";
import AppIconArtwork from "@/lib/appIconArtwork";

export const runtime = "nodejs";

export async function GET() {
  const size = 192;
  return new ImageResponse(createElement(AppIconArtwork, { size }), {
    width: size,
    height: size,
  });
}
