type AppIconArtworkProps = {
  size: number;
};

export default function AppIconArtwork({ size }: AppIconArtworkProps) {
  const borderRadius = Math.round(size * 0.22);
  const rim = Math.max(4, Math.round(size * 0.03));
  const heroWidth = Math.round(size * 0.48);
  const heroHeight = Math.round(size * 0.58);
  const faceSize = Math.round(size * 0.2);
  const eyeSize = Math.max(2, Math.round(size * 0.016));
  const swordBladeWidth = Math.max(8, Math.round(size * 0.07));
  const swordBladeHeight = Math.round(size * 0.44);
  const swordGuardWidth = Math.round(size * 0.14);
  const swordGuardHeight = Math.max(8, Math.round(size * 0.03));
  const swordHandleWidth = Math.max(8, Math.round(size * 0.045));
  const swordHandleHeight = Math.round(size * 0.12);
  const shieldSize = Math.round(size * 0.27);
  const sparkleSize = Math.max(8, Math.round(size * 0.1));

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
        overflow: "hidden",
        background:
          "radial-gradient(circle at 24% 16%, #a7d7ff 0%, #56a7ff 35%, #2567d1 68%, #0e245f 100%)",
        border: `${rim}px solid #f8df8a`,
        boxSizing: "border-box",
        boxShadow:
          "inset 0 12px 18px rgba(255,255,255,0.3), inset 0 -22px 24px rgba(5,10,40,0.38)",
      }}
    >
      <div
        style={{
          position: "absolute",
          bottom: -Math.round(size * 0.08),
          left: 0,
          right: 0,
          height: Math.round(size * 0.32),
          background:
            "radial-gradient(ellipse at 50% 20%, #2f7a3c 0%, #1f552b 65%, #12311a 100%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          right: Math.round(size * 0.2),
          top: Math.round(size * 0.15),
          width: swordBladeWidth,
          height: swordBladeHeight,
          borderRadius: Math.round(swordBladeWidth / 2),
          background:
            "linear-gradient(90deg, #f9fdff 0%, #ccdef5 45%, #94b0d9 100%)",
          transform: "rotate(26deg)",
          boxShadow: "0 0 14px rgba(160, 210, 255, 0.55)",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: Math.round(size * 0.16),
          top: Math.round(size * 0.38),
          width: swordGuardWidth,
          height: swordGuardHeight,
          borderRadius: Math.round(swordGuardHeight / 2),
          background: "linear-gradient(90deg, #ffe999 0%, #d49e2b 100%)",
          transform: "rotate(26deg)",
          boxShadow: "0 2px 6px rgba(0,0,0,0.28)",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: Math.round(size * 0.13),
          top: Math.round(size * 0.43),
          width: swordHandleWidth,
          height: swordHandleHeight,
          borderRadius: Math.round(swordHandleWidth / 2),
          background: "linear-gradient(180deg, #8c4f1f 0%, #4f2813 100%)",
          transform: "rotate(26deg)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: Math.round(size * 0.16),
          top: Math.round(size * 0.4),
          width: shieldSize,
          height: shieldSize,
          display: "flex",
          borderRadius: Math.round(shieldSize * 0.32),
          background:
            "linear-gradient(160deg, #d8ecff 0%, #8eb6e7 45%, #5c84b8 100%)",
          border: `${Math.max(2, Math.round(size * 0.012))}px solid #ffe18f`,
          transform: "rotate(-16deg)",
          boxShadow: "0 8px 14px rgba(0,0,0,0.24)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: Math.round(shieldSize * 0.22),
            borderRadius: Math.round(shieldSize * 0.18),
            border: `${Math.max(2, Math.round(size * 0.01))}px solid #f5cc58`,
          }}
        />
      </div>

      <div
        style={{
          width: heroWidth,
          height: heroHeight,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: "translateY(5%)",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: Math.round(heroWidth * 0.86),
            height: Math.round(heroHeight * 0.5),
            top: Math.round(heroHeight * 0.5),
            borderRadius: Math.round(heroWidth * 0.2),
            background:
              "linear-gradient(180deg, #4d7ee7 0%, #2e4aa6 55%, #1b2f72 100%)",
            boxShadow: "0 10px 18px rgba(0,0,0,0.26)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: Math.round(heroHeight * 0.5),
            width: Math.round(heroWidth * 0.48),
            height: Math.round(heroHeight * 0.34),
            borderRadius: Math.round(heroWidth * 0.12),
            background:
              "linear-gradient(180deg, #f8fbff 0%, #d8e4f8 55%, #99acd2 100%)",
            border: `${Math.max(2, Math.round(size * 0.012))}px solid #f0d379`,
            boxSizing: "border-box",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: Math.round(heroHeight * 0.14),
            width: Math.round(faceSize * 1.24),
            height: Math.round(faceSize * 0.88),
            borderRadius: Math.round(faceSize * 0.44),
            background:
              "linear-gradient(180deg, #2b64d6 0%, #2755b0 58%, #1a3577 100%)",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: Math.round(heroHeight * 0.2),
            width: faceSize,
            height: faceSize,
            display: "flex",
            borderRadius: Math.round(faceSize / 2),
            background:
              "linear-gradient(180deg, #ffe1c2 0%, #f4bc8d 68%, #d58e60 100%)",
            border: `${Math.max(2, Math.round(size * 0.01))}px solid #e6c5a0`,
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: Math.round(faceSize * 0.16),
              right: Math.round(faceSize * 0.16),
              top: Math.round(faceSize * 0.22),
              height: Math.max(4, Math.round(faceSize * 0.16)),
              borderRadius: Math.round(faceSize * 0.08),
              background: "#f2383f",
              border: `${Math.max(1, Math.round(size * 0.005))}px solid #ffccd2`,
              boxSizing: "border-box",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: Math.round(faceSize * 0.3),
              top: Math.round(faceSize * 0.5),
              width: eyeSize,
              height: eyeSize,
              borderRadius: Math.round(eyeSize / 2),
              background: "#1b2352",
            }}
          />
          <div
            style={{
              position: "absolute",
              right: Math.round(faceSize * 0.3),
              top: Math.round(faceSize * 0.5),
              width: eyeSize,
              height: eyeSize,
              borderRadius: Math.round(eyeSize / 2),
              background: "#1b2352",
            }}
          />
        </div>

        <div
          style={{
            position: "absolute",
            top: Math.round(heroHeight * 0.64),
            width: Math.round(heroWidth * 0.15),
            height: Math.round(heroWidth * 0.15),
            borderRadius: Math.round(heroWidth * 0.08),
            border: `${Math.max(1, Math.round(size * 0.006))}px solid #e0a91b`,
            background: "radial-gradient(circle, #fff7cc 0%, #f0bd37 100%)",
            boxSizing: "border-box",
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: Math.round(size * 0.15),
          top: Math.round(size * 0.14),
          width: sparkleSize,
          height: sparkleSize,
          transform: "rotate(45deg)",
          background: "linear-gradient(135deg, #fff8da 0%, #ffe182 100%)",
          boxShadow: "0 0 12px rgba(255,245,180,0.75)",
          borderRadius: Math.round(sparkleSize * 0.22),
        }}
      />
      <div
        style={{
          position: "absolute",
          right: Math.round(size * 0.14),
          top: Math.round(size * 0.24),
          width: Math.round(sparkleSize * 0.66),
          height: Math.round(sparkleSize * 0.66),
          transform: "rotate(45deg)",
          background: "linear-gradient(135deg, #fff8da 0%, #ffd56a 100%)",
          boxShadow: "0 0 9px rgba(255,245,180,0.65)",
          borderRadius: Math.round(sparkleSize * 0.22),
        }}
      />
    </div>
  );
}
