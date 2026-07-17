"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useIsoLayoutEffect, prefersReducedMotion } from "@/lib/hooks";
import ImageReveal from "@/components/ImageReveal";

// Collage de imágenes flotantes: rejilla asimétrica donde cada imagen se mueve
// a una velocidad distinta ligada al scroll (parallax por elemento).
const LAYOUT = [
  "col-span-5 md:col-span-3 md:col-start-1 aspect-[3/4]",
  "col-span-6 col-start-7 md:col-span-4 md:col-start-6 mt-16 md:mt-32 aspect-[3/2]",
  "col-span-5 col-start-2 md:col-span-3 md:col-start-10 mt-10 md:-mt-10 aspect-[4/5]",
  "col-span-6 col-start-6 md:col-span-3 md:col-start-3 mt-14 md:mt-24 aspect-[4/5]",
  "col-span-7 col-start-3 md:col-span-4 md:col-start-8 mt-12 md:mt-40 aspect-[14/9]",
];

export default function Collage({ images }) {
  const ref = useRef(null);

  useIsoLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const container = ref.current;

    const ctx = gsap.context(() => {
      container.querySelectorAll("[data-speed]").forEach((el) => {
        const speed = parseFloat(el.dataset.speed) || 1;
        gsap.to(el, {
          y: () => speed * -110,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="grid grid-cols-12 gap-x-4 md:gap-x-6">
      {images.map((img, i) => (
        <div
          key={img.src + i}
          data-speed={img.speed}
          className={`${LAYOUT[i % LAYOUT.length]} will-change-transform`}
        >
          <ImageReveal src={img.src} alt={img.alt} className="h-full w-full" />
        </div>
      ))}
    </div>
  );
}
