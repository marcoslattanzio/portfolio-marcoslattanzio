"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useIsoLayoutEffect, prefersReducedMotion } from "@/lib/hooks";

// Pila de secciones "statement": el bloque se clava en pantalla (pin) y cada
// statement entra cubriendo al anterior en la misma posición, con una cortina
// (clip-path) ligada al scroll. Sin JS o con reduce-motion, las capas se
// muestran una debajo de otra en el flujo normal.
export default function StatementStack({ items }) {
  const ref = useRef(null);

  useIsoLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const container = ref.current;
    const slides = gsap.utils.toArray(container.querySelectorAll("[data-slide]"));
    if (slides.length < 2) return;

    const ctx = gsap.context(() => {
      // pasar del flujo normal a capas superpuestas en la misma posición
      gsap.set(container, { height: "100svh" });
      gsap.set(slides, { position: "absolute", inset: 0 });
      slides.forEach((s, i) => gsap.set(s, { zIndex: i + 1 }));
      gsap.set(slides.slice(1), { clipPath: "inset(100% 0% 0% 0%)" });

      // scrub suave + snap a etiquetas: un pequeño gesto de scroll basta para
      // que la transición al siguiente statement se complete sola, con easing,
      // en vez de ir pegada a la rueda del ratón.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: () => `+=${(slides.length - 1) * 100}%`,
          pin: true,
          scrub: 0.4,
          snap: {
            snapTo: "labelsDirectional",
            duration: { min: 0.6, max: 1.2 },
            delay: 0.02,
            ease: "power3.inOut",
          },
        },
      });

      tl.addLabel("slide-0", 0);
      slides.slice(1).forEach((slide, i) => {
        const bg = slide.querySelector("[data-slide-bg]");
        const title = slide.querySelector("[data-slide-title]");
        // easing dentro del timeline: aunque el usuario arrastre el scroll a
        // mano, la cortina arranca lenta, acelera y frena al final
        tl.fromTo(
          slide,
          { clipPath: "inset(100% 0% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "power3.inOut" },
          i,
        )
          .fromTo(
            bg,
            { scale: 1.12 },
            { scale: 1, duration: 1, ease: "power2.inOut" },
            i,
          )
          .fromTo(
            title,
            { yPercent: 45, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 0.55, ease: "power2.out" },
            i + 0.35,
          )
          .addLabel(`slide-${i + 1}`, i + 1);
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="relative overflow-hidden">
      {items.map((item, i) => (
        <div
          key={i}
          data-slide
          className="relative flex min-h-svh items-center justify-center overflow-hidden"
        >
          <img
            data-slide-bg
            src={item.background}
            alt=""
            className="absolute inset-0 h-full w-full object-cover will-change-transform"
          />
          {/* velo oscuro literal (no cambia con el tema: siempre va sobre foto) */}
          <div className="absolute inset-0 bg-black/45" />

          {/* imagen central */}
          <div className="relative z-10 w-[58vw] max-w-[420px] md:w-[26vw]">
            <img
              src={item.inset}
              alt=""
              loading="lazy"
              className="aspect-[3/4] w-full object-cover"
            />
          </div>

          {/* titular serif cruzando fondo e imagen */}
          <h2
            data-slide-title
            className="absolute z-20 px-5 text-center font-serif text-[11vw] font-light leading-[1.05] text-[#f2f1ec] md:text-[6.5vw]"
          >
            {item.title}
          </h2>

          {/* índice de la capa, estilo editorial */}
          <p className="absolute bottom-8 left-5 z-20 text-xs uppercase tracking-[0.2em] text-[#f2f1ec]/80 md:left-10">
            ({String(i + 1).padStart(2, "0")}/{String(items.length).padStart(2, "0")})
          </p>
        </div>
      ))}
    </section>
  );
}
