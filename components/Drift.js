"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useIsoLayoutEffect, prefersReducedMotion } from "@/lib/hooks";

// Capa con deriva: el contenido se desplaza verticalmente a su propia
// velocidad mientras cruza el viewport. Repartiendo velocidades distintas
// entre bloques vecinos se consigue el parallax de página completa.
// speed > 0 sube más rápido que el scroll; speed < 0 se queda atrás.
export default function Drift({ speed = 0.3, className = "", children }) {
  const ref = useRef(null);

  useIsoLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const el = ref.current;
    if (!el.offsetParent) return; // oculto: sin trigger

    const ctx = gsap.context(() => {
      gsap.to(el, {
        y: () => speed * -120,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, el);

    return () => ctx.revert();
  }, [speed]);

  return (
    <div ref={ref} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
}
