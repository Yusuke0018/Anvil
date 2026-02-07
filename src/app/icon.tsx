import { ImageResponse } from "next/og";
import AppIconArtwork from "@/lib/appIconArtwork";

export const contentType = "image/png";
export const size = {
  width: 512,
  height: 512,
};

export default function Icon() {
  return new ImageResponse(<AppIconArtwork size={size.width} />, size);
}
