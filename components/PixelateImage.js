"use client";

import { useEffect, useId, useRef } from "react";
import { useIsoLayoutEffect, prefersReducedMotion } from "@/lib/hooks";

// easeInOut
const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

/**
 * Imagen que se revela despixelándose (filtro SVG, adaptado de "Pixelate Image"
 * de Originkit/Framer a React puro, sin framer-motion). La animación es
 * IMPERATIVA: el rAF toca los atributos del filtro y la opacidad por refs, sin
 * re-render de React → fluido incluso con varias instancias.
 *
 *  - mode="scroll": despixela una vez al entrar en viewport.
 *  - mode="key": despixela al montar y cada vez que cambia `src`.
 * `className` define la caja y su POSICIÓN (incluye `relative` o `absolute inset-0`).
 */
export default function PixelateImage({
  src,
  alt = "",
  className = "",
  mode = "scroll",
  intensity = 12,
  duration = 1,
}) {
  const rawId = useId();
  const filterId = `px-${rawId.replace(/[^a-zA-Z0-9]/g, "")}`;
  const ref = useRef(null);
  const overlayRef = useRef(null);
  const compRef = useRef(null);
  const morphRef = useRef(null);
  const rafRef = useRef(null);
  const playedRef = useRef(false);

  const strength = Math.max(1, Math.min(200, intensity * 2));
  const minP = 1;
  const maxP = Math.max(minP + 1, Math.floor(1 + (strength / 100) * 127));

  const applyPx = (raw) => {
    const px = Math.max(minP, Math.min(maxP, raw));
    if (compRef.current) {
      compRef.current.setAttribute("width", String(px));
      compRef.current.setAttribute("height", String(px));
    }
    if (morphRef.current) {
      morphRef.current.setAttribute("radius", String(px / 2));
    }
    const el = overlayRef.current;
    if (el) {
      if (px <= 1.02) {
        el.style.opacity = "0";
        el.style.display = "none";
      } else {
        el.style.display = "";
        el.style.opacity = String(Math.min(1, (px - 1) / 8));
      }
    }
  };

  const tween = (from, to) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const durMs = duration * 1000;
    const start = performance.now();
    const tick = (now) => {
      const t = durMs > 0 ? Math.min(1, (now - start) / durMs) : 1;
      applyPx(from + (to - from) * easeInOut(t));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  // estado inicial (pixelado, o limpio si reduce-motion)
  useIsoLayoutEffect(() => {
    applyPx(prefersReducedMotion() ? minP : maxP);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // modo scroll: despixela una vez al entrar en viewport
  useEffect(() => {
    if (mode !== "scroll") return;
    if (prefersReducedMotion()) {
      applyPx(minP);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !playedRef.current) {
            playedRef.current = true;
            tween(maxP, minP);
          }
        });
      },
      { threshold: 0, rootMargin: "0px 0px -12% 0px" },
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  // modo key: despixela en cada cambio de src
  useEffect(() => {
    if (mode !== "key") return;
    if (prefersReducedMotion()) {
      applyPx(minP);
      return;
    }
    applyPx(maxP);
    tween(maxP, minP);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, src]);

  // Sobreescaneo: la imagen sobresale de la caja para que los bordes dilatados
  // del filtro no dejen huecos transparentes. El contenedor recorta.
  const inset = `${-(strength / 100) * 50}px`;
  const grow = `calc(100% + ${(strength / 100) * 100}px)`;
  const media = {
    position: "absolute",
    top: inset,
    left: inset,
    width: grow,
    height: grow,
    objectFit: "cover",
    objectPosition: "center center",
    userSelect: "none",
  };

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <svg aria-hidden style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
            <feConvolveMatrix kernelMatrix="1 1 1 1 1 1 1 1 1" result="AVG" />
            <feFlood x="1" y="1" width="1" height="1" />
            <feComposite
              ref={compRef}
              operator="arithmetic"
              k1="0"
              k2="1"
              k3="0"
              k4="0"
              width={maxP}
              height={maxP}
            />
            <feTile result="TILE" />
            <feComposite
              in="AVG"
              in2="TILE"
              operator="in"
              k1="0"
              k2="1"
              k3="0"
              k4="0"
            />
            <feMorphology
              ref={morphRef}
              operator="dilate"
              radius={maxP / 2}
              result="NORMAL"
            />
            <feOffset dx="0" dy="0" />
            <feMerge>
              <feMergeNode in="NORMAL" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      <img
        src={src}
        alt={alt}
        draggable={false}
        style={{ ...media, zIndex: 1 }}
      />
      <img
        ref={overlayRef}
        src={src}
        alt=""
        aria-hidden
        draggable={false}
        style={{ ...media, zIndex: 2, filter: `url(#${filterId})` }}
      />
    </div>
  );
}
