"use client";

import { useEffect, useRef, useState } from "react";
import { useIsoLayoutEffect, prefersReducedMotion } from "@/lib/hooks";

/**
 * Imagen que se revela con un desenfoque suave (blur → nítido), pensada como
 * alternativa al pixelado de PixelateImage (misma API, intercambiable).
 *  - mode="scroll": se revela una vez al entrar en viewport.
 *  - mode="key": se revela al montar y cada vez que cambia `src`.
 */
export default function BlurImage({
  src,
  alt = "",
  className = "",
  mode = "scroll",
  intensity = 12,
  duration = 1,
  objectPosition = "center center",
}) {
  const ref = useRef(null);
  const [revealed, setRevealed] = useState(false);
  const playedRef = useRef(false);

  const blurPx = Math.max(2, Math.min(60, intensity));

  useIsoLayoutEffect(() => {
    if (prefersReducedMotion()) setRevealed(true);
  }, []);

  useEffect(() => {
    if (mode !== "scroll" || prefersReducedMotion()) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !playedRef.current) {
            playedRef.current = true;
            setRevealed(true);
          }
        });
      },
      { threshold: 0, rootMargin: "0px 0px -12% 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [mode]);

  useEffect(() => {
    if (mode !== "key") return;
    if (prefersReducedMotion()) {
      setRevealed(true);
      return;
    }
    setRevealed(false);
    const raf = requestAnimationFrame(() => setRevealed(true));
    return () => cancelAnimationFrame(raf);
  }, [mode, src]);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <img
        src={src}
        alt={alt}
        draggable={false}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition,
          userSelect: "none",
          filter: revealed ? "blur(0px)" : `blur(${blurPx}px)`,
          transform: revealed ? "scale(1)" : "scale(1.1)",
          transition: `filter ${duration}s cubic-bezier(0.22,1,0.36,1), transform ${duration}s cubic-bezier(0.22,1,0.36,1)`,
          willChange: "filter, transform",
        }}
      />
    </div>
  );
}
