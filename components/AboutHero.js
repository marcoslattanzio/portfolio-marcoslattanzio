"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useIsoLayoutEffect, prefersReducedMotion } from "@/lib/hooks";

// Apertura de "Sobre mí": el retrato a pantalla completa EN MEDIO del nombre —
// la primera línea ("Marcos") queda DETRÁS de la foto y la segunda
// ("Lattanzio") pasa POR DELANTE. Al hacer scroll, cada capa se despega a su
// velocidad: la trasera sube, la delantera baja y la foto se queda rezagada.
export default function AboutHero({ name, image, claim, city }) {
  const ref = useRef(null);
  const [first, ...rest] = name.split(" ");
  const last = rest.join(" ") || first;

  useIsoLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const section = ref.current;

    const ctx = gsap.context(() => {
      // entrada: foto y líneas del nombre aparecen escalonadas
      gsap.fromTo(
        "[data-hero-img]",
        { opacity: 0, scale: 1.06 },
        { opacity: 1, scale: 1, duration: 1.5, ease: "power3.out", delay: 0.1 },
      );
      gsap.fromTo(
        "[data-hero-line] span",
        { yPercent: 55, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          stagger: 0.16,
          delay: 0.35,
        },
      );

      // parallax al salir: tres capas, tres velocidades
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
      tl.to("[data-hero-img]", { yPercent: 16, ease: "none" }, 0)
        .to("[data-line-back]", { yPercent: -60, ease: "none" }, 0)
        .to("[data-line-front]", { yPercent: 70, ease: "none" }, 0);
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      className="relative flex h-svh w-full items-center justify-center overflow-hidden"
    >
      <p className="absolute left-5 top-24 z-30 text-xs uppercase tracking-[0.18em] text-muted md:left-10">
        Sobre mí — {city}
      </p>

      {/* línea trasera: queda DETRÁS del retrato */}
      <div
        data-hero-line
        data-line-back
        className="absolute top-[10%] z-0 w-full overflow-hidden text-center will-change-transform md:top-[19%]"
      >
        <span className="inline-block text-[20vw] font-light leading-none tracking-tight">
          {first}
        </span>
      </div>

      {/* retrato en medio (más contenido en pantallas estrechas para que el
          nombre asome por los lados) */}
      <img
        data-hero-img
        src={image}
        alt={`Retrato de ${name}`}
        className="relative z-10 h-[52svh] w-auto max-w-[72vw] object-cover will-change-transform sm:h-[62svh] md:h-[76svh] md:max-w-[46vw]"
      />

      {/* línea delantera: pasa POR ENCIMA del retrato */}
      <div
        data-hero-line
        data-line-front
        className="absolute bottom-[12%] z-20 w-full overflow-hidden text-center will-change-transform"
      >
        <span className="inline-block text-[20vw] font-light leading-none tracking-tight">
          {last}
        </span>
      </div>

      <p className="absolute bottom-8 left-1/2 z-30 -translate-x-1/2 whitespace-nowrap font-serif text-sm font-light italic text-muted md:text-base">
        {claim}
      </p>
    </section>
  );
}
