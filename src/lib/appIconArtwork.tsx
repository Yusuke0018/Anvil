type AppIconArtworkProps = {
  size: number;
};

export default function AppIconArtwork({ size }: AppIconArtworkProps) {
  const borderRadius = Math.round(size * 0.22);
  const rim = Math.max(4, Math.round(size * 0.03));
  const badgeSize = Math.round(size * 0.56);
  const badgeRadius = Math.round(badgeSize * 0.28);
  const logoFontSize = Math.round(size * 0.34);
  const sparkleSize = Math.round(size * 0.13);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius,
        position: "relative",
        background:
          "radial-gradient(circle at 16% 18%, #ffc07e 0%, #ff8d44 35%, #e25d1d 68%, #8f2f08 100%)",
        border: `${rim}px solid #ffd9b2`,
        boxSizing: "border-box",
        boxShadow:
          "inset 0 12px 18px rgba(255,255,255,0.28), inset 0 -20px 24px rgba(0,0,0,0.28)",
      }}
    >
      <div
        style={{
          width: badgeSize,
          height: badgeSize,
          borderRadius: badgeRadius,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at 30% 24%, #fff1cf 0%, #ffd589 46%, #e99b3e 72%, #9a4f00 100%)",
          boxShadow:
            "0 10px 20px rgba(0,0,0,0.25), inset 0 6px 12px rgba(255,255,255,0.25)",
          transform: "translateY(2%)",
        }}
      >
        <span
          style={{
            fontSize: logoFontSize,
            color: "#2f1703",
            fontWeight: 900,
            letterSpacing: "-0.06em",
            fontFamily: "Arial, sans-serif",
            textShadow: "0 2px 0 rgba(255,255,255,0.35)",
            transform: "translateY(-4%)",
          }}
        >
          A
        </span>
      </div>

      <div
        style={{
          position: "absolute",
          right: Math.round(size * 0.18),
          top: Math.round(size * 0.16),
          width: sparkleSize,
          height: sparkleSize,
          transform: "rotate(45deg)",
          background: "linear-gradient(135deg, #fff8da 0%, #ffd76d 100%)",
          boxShadow: "0 0 10px rgba(255,235,170,0.8)",
          borderRadius: Math.round(sparkleSize * 0.22),
        }}
      />
    </div>
  );
}
