"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useIsoLayoutEffect, prefersReducedMotion } from "@/lib/hooks";
import Drift from "@/components/Drift";

// Servicios: filas grandes con el número gigante en serif cursiva y el título
// enorme. Cada fila deriva a su propia velocidad al hacer scroll (alternadas),
// y en hover el número se enciende en verde y el título se desliza.
export default function ServicesList({ services }) {
  const listRef = useRef(null);

  useIsoLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const list = listRef.current;
    if (!list.offsetParent) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        list.children,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: list,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        },
      );
    }, list);
    return () => ctx.revert();
  }, []);

  return (
    <ul ref={listRef}>
      {services.map((service, i) => (
        <li key={service.title} className="border-t border-line last:border-b">
          <Drift speed={i % 2 ? -0.12 : 0.12}>
            <div className="group grid grid-cols-12 items-center gap-3 py-8 md:gap-6 md:py-12">
              <span
                aria-hidden
                className="col-span-3 font-serif text-5xl font-light italic leading-none text-line transition-colors duration-500 group-hover:text-accent md:col-span-2 md:text-8xl"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="col-span-9 md:col-span-8">
                <h3 className="text-2xl font-light leading-tight tracking-tight transition-[transform,color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-3 group-hover:text-accent md:text-5xl">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm font-light text-muted md:mt-3">
                  {service.detail}
                </p>
              </div>
              <span className="hidden shrink-0 justify-self-end text-3xl font-light opacity-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0 group-hover:opacity-100 md:col-span-2 md:block md:-translate-x-3">
                →
              </span>
            </div>
          </Drift>
        </li>
      ))}
    </ul>
  );
}
