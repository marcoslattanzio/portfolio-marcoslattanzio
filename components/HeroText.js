"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useIsoLayoutEffect, prefersReducedMotion } from "@/lib/hooks";
import TextReveal from "@/components/TextReveal";

export default function HeroText({ title, subtitle }) {
  const containerRef = useRef(null);

  useIsoLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      // Después de 3 segundos: anima el contenedor a la izquierda y pequeño
      gsap.to(container, {
        x: -120,
        scale: 0.5,
        duration: 1,
        delay: 3,
        ease: "power2.inOut",
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative z-10 flex h-full flex-col justify-end px-5 pb-16 md:px-10 md:pb-20 will-change-transform"
    >
      <TextReveal
        as="h2"
        text={title}
        className="text-[13vw] font-light leading-[0.95] tracking-tight md:text-[9vw]"
        delay={0.2}
      />
      <TextReveal
        as="p"
        text={subtitle}
        className="mt-6 max-w-md text-sm font-light leading-relaxed text-ink/80 md:text-base"
        delay={0.5}
      />
    </div>
  );
}
