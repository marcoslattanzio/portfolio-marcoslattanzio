"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/hooks";

// Cursor personalizado: punto pequeño que sigue al ratón con retardo y crece
// sobre elementos clicables. En táctil (sin puntero fino) no se renderiza.
export default function CustomCursor() {
  const dotRef = useRef(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(
      !prefersReducedMotion() && window.matchMedia("(pointer: fine)").matches,
    );
  }, []);

  useEffect(() => {
    if (!enabled || !dotRef.current) return;

    const dot = dotRef.current;
    const xTo = gsap.quickTo(dot, "x", { duration: 0.35, ease: "power3.out" });
    const yTo = gsap.quickTo(dot, "y", { duration: 0.35, ease: "power3.out" });
    // ocultamos el cursor nativo: el punto verde es el único cursor.
    // Inyectamos la regla desde aquí (fuente única, junto al comportamiento).
    const root = document.documentElement;
    const style = document.createElement("style");
    style.setAttribute("data-cursor-dot", "");
    style.textContent =
      ".cursor-dot-active, .cursor-dot-active * { cursor: none !important; }";
    document.head.appendChild(style);
    root.classList.add("cursor-dot-active");

    let shown = false;
    let over = false;

    const onMove = (e) => {
      if (!shown) {
        shown = true;
        gsap.to(dot, {
          opacity: 1,
          duration: 0.3,
          ease: "power3.out",
          overwrite: "auto",
        });
      }
      xTo(e.clientX);
      yTo(e.clientY);
    };
    // sobre un enlace/botón el punto NO se retira (es el único cursor): crece
    // un poco como feedback
    const onOver = (e) => {
      const interactive = !!e.target.closest("a, button, [data-cursor-grow]");
      if (interactive === over) return;
      over = interactive;
      gsap.to(dot, {
        scale: interactive ? 2.6 : 1,
        duration: 0.3,
        ease: "power3.out",
        overwrite: "auto",
      });
    };
    const onLeave = () => {
      shown = false;
      gsap.to(dot, { opacity: 0, duration: 0.3, ease: "power3.out", overwrite: "auto" });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      root.classList.remove("cursor-dot-active");
      style.remove();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={dotRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[95] -ml-1 -mt-1 h-2 w-2 rounded-full bg-accent opacity-0"
    />
  );
}
