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

// Móvil: la misma idea editorial del escritorio (anchos desiguales, nada
// alineado con nada) pero en columna. Antes esto era otro scroll horizontal,
// que con el del hero justo encima hacía la página repetitiva; aquí se
// descubre al bajar, que es el gesto que ya estás haciendo.
// Los márgenes no son decorativos: cada uno cubre lo que su pareja puede
// acercarse con el parallax (28 px en el peor caso, entre la primera y la
// segunda), para que dos fotos nunca lleguen a tocarse.
const MOBILE_LAYOUT = [
  "w-[70%] mr-auto aspect-[3/4]",
  "w-[52%] ml-auto mt-14 aspect-[3/2]",
  "w-[60%] ml-[9%] mt-10 aspect-[4/5]",
  "w-[46%] ml-auto mr-[8%] mt-10 aspect-[4/5]",
  "w-[76%] mr-auto mt-12 aspect-[14/9]",
];

export default function Collage({ images }) {
  const ref = useRef(null);
  const mobileRef = useRef(null);

  useIsoLayoutEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const mq = gsap.matchMedia();

      // cada foto avanza a su propio ritmo mientras pasas por delante: es lo
      // que separa las unas de las otras y evita que se lea como una lista.
      // `sameWay` descarta el signo de la velocidad: las del dato alternan
      // (1.4, -0.8, 0.6…), y en la columna del móvil eso pone a cada foto a ir
      // al encuentro de su vecina — hasta 101 px de acercamiento entre dos que
      // además se solapan en horizontal, o sea, tapándose. En el escritorio no
      // pasa porque van en columnas distintas de la rejilla.
      const drift = (container, amount, sameWay) => {
        container.querySelectorAll("[data-speed]").forEach((el) => {
          const raw = parseFloat(el.dataset.speed) || 1;
          const speed = sameWay ? Math.abs(raw) : raw;
          gsap.to(el, {
            y: () => speed * amount,
            ease: "none",
            scrollTrigger: {
              trigger: container,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
        });
      };

      mq.add("(min-width: 768px)", () => {
        if (ref.current) drift(ref.current, -110);
      });
      // en móvil las fotos son más pequeñas y están más juntas: con la
      // amplitud del escritorio el desfase se comería los márgenes
      mq.add("(max-width: 767px)", () => {
        if (mobileRef.current) drift(mobileRef.current, -46, true);
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* Desktop: grid asimétrico con parallax */}
      <div ref={ref} className="hidden grid-cols-12 gap-x-4 md:grid md:gap-x-6">
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

      {/* Mobile: columna editorial, cada foto a su propia velocidad */}
      <div ref={mobileRef} className="md:hidden">
        {images.map((img, i) => (
          <div
            key={img.src + i}
            data-speed={img.speed}
            className={`${MOBILE_LAYOUT[i % MOBILE_LAYOUT.length]} will-change-transform`}
          >
            <ImageReveal src={img.src} alt={img.alt} className="h-full w-full" />
          </div>
        ))}
      </div>
    </>
  );
}
