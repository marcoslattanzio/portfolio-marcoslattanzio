"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useIsoLayoutEffect, prefersReducedMotion } from "@/lib/hooks";

// Capa con deriva: el contenido se desplaza verticalmente a su propia
// velocidad mientras cruza el viewport. Repartiendo velocidades distintas
// entre bloques vecinos se consigue el parallax de página completa.
// speed > 0 sube más rápido que el scroll; speed < 0 se queda atrás.
export default function Drift({
  speed = 0.3,
  distance = 0.72,
  className = "",
  children,
}) {
  const ref = useRef(null);

  useIsoLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const el = ref.current;
    if (!el.getClientRects().length) return; // oculto: sin trigger

    const ctx = gsap.context(() => {
      // Deriva proporcional a la altura del viewport para que el parallax sea
      // evidente durante todo el recorrido de la pieza.
      gsap.fromTo(
        el,
        { y: () => speed * window.innerHeight * distance },
        {
          y: () => speed * -window.innerHeight * distance,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [distance, speed]);

  return (
    <div ref={ref} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
}
