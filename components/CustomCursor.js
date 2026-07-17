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
    // el punto se oculta sobre clicables: la opacidad la gobierna SOLO onOver
    // (si onMove la forzara a 1 en cada gesto, pisaría ese desvanecido)
    let over = false;

    const show = (visible) =>
      gsap.to(dot, {
        opacity: visible ? 1 : 0,
        scale: visible ? 1 : 0.4,
        duration: 0.3,
        ease: "power3.out",
        overwrite: "auto",
      });

    const onMove = (e) => {
      if (!over) show(true);
      xTo(e.clientX);
      yTo(e.clientY);
    };
    // sobre un enlace/botón el punto se retira: el propio elemento ya da
    // feedback (subrayado, verde…) y el cursor nativo basta
    const onOver = (e) => {
      const interactive = !!e.target.closest("a, button, [data-cursor-grow]");
      if (interactive === over) return;
      over = interactive;
      show(!interactive);
    };
    const onLeave = () => show(false);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
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
