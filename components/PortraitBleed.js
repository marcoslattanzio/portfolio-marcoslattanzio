"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useIsoLayoutEffect, prefersReducedMotion } from "@/lib/hooks";
import BlurImage from "@/components/BlurImage";

// Retrato vertical enmarcado sobre banda oscura (cinematográfica, siempre
// oscura para no invertirse con el tema). La imagen escala con un parallax
// contenido y el pie funde con un degradado. Pensado para tu retrato en pie.
export default function PortraitBleed({ image, name, role }) {
  const ref = useRef(null);

  useIsoLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const section = ref.current;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-bleed-img]",
        { scale: 1.16 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
      gsap.fromTo(
        "[data-bleed-caption]",
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 55%",
            toggleActions: "play none none reverse",
          },
        },
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="py-16 md:py-28">
      <div className="mx-auto flex max-w-[1600px] flex-col items-center px-5 md:px-10">
        <div className="relative w-full max-w-[540px] overflow-hidden rounded-lg">
          <div data-bleed-img className="will-change-transform">
            <BlurImage
              src={image}
              alt={`Retrato de ${name}`}
              mode="scroll"
              intensity={14}
              className="relative aspect-[4/5] w-full"
              objectPosition="center 75%"
            />
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,0.72),transparent_42%)]"
          />
          <div
            data-bleed-caption
            className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6 md:p-8"
          >
            <p className="text-2xl font-light leading-none tracking-tight text-white md:text-3xl">
              {name}
            </p>
            <p className="text-[0.65rem] uppercase tracking-[0.22em] text-white/65">
              {role}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
