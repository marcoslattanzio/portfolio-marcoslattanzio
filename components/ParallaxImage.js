"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useIsoLayoutEffect, prefersReducedMotion } from "@/lib/hooks";

// Parallax sutil: la imagen (algo más alta que su contenedor) se desplaza
// verticalmente ligada al scroll. "speed" controla la intensidad.
// Nota: el caller debe aportar la clase de posición ("relative" o "absolute").
export default function ParallaxImage({
  src,
  alt = "",
  speed = 1,
  className = "",
}) {
  const wrapRef = useRef(null);

  useIsoLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const wrap = wrapRef.current;
    const img = wrap.querySelector("img");

    const ctx = gsap.context(() => {
      gsap.fromTo(
        img,
        { yPercent: -7 * speed },
        {
          yPercent: 7 * speed,
          ease: "none",
          scrollTrigger: {
            trigger: wrap,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    }, wrap);

    return () => ctx.revert();
  }, [speed]);

  return (
    <div ref={wrapRef} className={`overflow-hidden ${className}`}>
      <img
        src={src}
        alt={alt}
        className="absolute left-0 top-[-8%] h-[116%] w-full object-cover will-change-transform"
      />
    </div>
  );
}
