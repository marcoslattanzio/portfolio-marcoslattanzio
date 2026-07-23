"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useIsoLayoutEffect, prefersReducedMotion } from "@/lib/hooks";

// Portada de "Sobre mí": declaración grande centrada con un chip de retrato
// inline, al estilo de una apertura editorial. Entrada suave palabra a palabra.
export default function AboutHero({ statement, badge, city, claim }) {
  const ref = useRef(null);

  useIsoLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const section = ref.current;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-hero-fade]",
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: "power3.out",
          stagger: 0.12,
          delay: 0.15,
        },
      );
      gsap.fromTo(
        "[data-hero-chip]",
        { opacity: 0, scale: 0.7, rotate: -8 },
        {
          opacity: 1,
          scale: 1,
          rotate: 0,
          duration: 1,
          ease: "back.out(1.7)",
          delay: 0.1,
        },
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      className="relative flex min-h-svh w-full flex-col items-center justify-center px-5 py-32 text-center md:px-10"
    >
      <p
        data-hero-fade
        className="mb-10 text-xs uppercase tracking-[0.24em] text-muted"
      >
        Sobre mí — {city}
      </p>

      <h1 className="mx-auto max-w-5xl text-4xl font-light leading-[1.05] tracking-tight md:text-7xl">
        <span
          data-hero-chip
          className="mr-3 inline-block h-12 w-12 translate-y-1 overflow-hidden rounded-2xl align-middle md:mr-5 md:h-20 md:w-20"
        >
          <img src={badge} alt="" className="h-full w-full object-cover" />
        </span>
        <span data-hero-fade>{statement}</span>
      </h1>

      <p
        data-hero-fade
        className="mt-12 font-serif text-xl font-light italic text-muted md:text-2xl"
      >
        {claim}
      </p>

      <div
        data-hero-fade
        className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3"
      >
        <span className="text-xs uppercase tracking-[0.24em] text-muted">
          Desliza
        </span>
        <span className="block h-10 w-px bg-line" />
      </div>
    </section>
  );
}
