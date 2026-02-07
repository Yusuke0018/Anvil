import { ImageResponse } from "next/og";
import AppIconArtwork from "@/lib/appIconArtwork";

export const contentType = "image/png";
export const size = {
  width: 180,
  height: 180,
};

export default function AppleIcon() {
  return new ImageResponse(<AppIconArtwork size={size.width} />, size);
}
