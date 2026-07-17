"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useIsoLayoutEffect, prefersReducedMotion } from "@/lib/hooks";

// Reveal de imagen al hacer scroll: máscara (clip-path que se abre de arriba
// abajo) + scale 1.15 → 1.0 con easing power3.out.
export default function ImageReveal({
  src,
  alt = "",
  className = "",
  imgClassName = "",
}) {
  const wrapRef = useRef(null);

  useIsoLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const wrap = wrapRef.current;
    // elemento oculto (ej. fallback móvil con display:none): sin trigger —
    // un ScrollTrigger sobre un elemento sin medidas corrompe el refresh global
    if (!wrap.offsetParent) return;
    const img = wrap.querySelector("img");

    const ctx = gsap.context(() => {
      gsap.set(wrap, { clipPath: "inset(0% 0% 100% 0%)" });
      gsap.set(img, { scale: 1.15 });
      gsap
        .timeline({
          // toggleActions en vez de once: un trigger con "once" se autodestruye
          // al dispararse y, si eso ocurre mientras GSAP recorre su lista de
          // triggers (al crear otros), la lista se encoge a media iteración y
          // rompe la página. Así entra una vez igual, pero sin eliminarse.
          scrollTrigger: {
            trigger: wrap,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        })
        .to(wrap, {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.2,
          ease: "power3.out",
        })
        .to(img, { scale: 1, duration: 1.6, ease: "power3.out" }, 0);
    }, wrap);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapRef} className={`overflow-hidden ${className}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={`h-full w-full object-cover ${imgClassName}`}
      />
    </div>
  );
}
