"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIsoLayoutEffect, prefersReducedMotion } from "@/lib/hooks";

// Sección "carrete": la sección se clava en pantalla y una tira horizontal de
// fotos desfila ligada al scroll vertical, como fotogramas de una película.
// Una línea fina de progreso indica cuánto carrete queda. En móvil se usa
// scroll horizontal nativo (sin pin).
const HEIGHTS = [
  "h-[52vh] md:h-[56vh]",
  "h-[38vh] md:h-[42vh]",
  "h-[46vh] md:h-[62vh]",
  "h-[40vh] md:h-[46vh]",
];

export default function FilmstripSection({ title, images }) {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const progressRef = useRef(null);

  useIsoLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    if (window.innerWidth < 768) return; // móvil: scroll horizontal nativo
    const section = sectionRef.current;
    const track = trackRef.current;
    const dist = () => track.scrollWidth - window.innerWidth;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => "+=" + dist(),
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });
      tl.to(track, { x: () => -dist(), ease: "none" }, 0).fromTo(
        progressRef.current,
        { scaleX: 0 },
        { scaleX: 1, ease: "none" },
        0,
      );
    }, section);

    // El recorrido depende del ancho de la tira, que no se conoce hasta que
    // cargan las fotos. Al navegar dentro de la web no hay evento "load" que
    // refresque ScrollTrigger, así que el pin se quedaba con distancia ~0 (el
    // carrete no avanzaba). Refrescamos en cuanto cada foto está lista —
    // con un pelín de retardo: refrescar antes del primer tick de GSAP
    // corrompe los triggers aún no inicializados (página rota).
    const safeRefresh = () =>
      gsap.delayedCall(0.1, () => {
        if (section.isConnected) ScrollTrigger.refresh();
      });
    const imgs = Array.from(track.querySelectorAll("img"));
    let pending = imgs.filter((img) => !img.complete).length;
    const onImgReady = () => {
      if (--pending <= 0) safeRefresh();
    };
    if (pending > 0) {
      imgs.forEach((img) => {
        if (img.complete) return;
        img.addEventListener("load", onImgReady, { once: true });
        img.addEventListener("error", onImgReady, { once: true });
      });
    } else {
      safeRefresh();
    }

    return () => {
      imgs.forEach((img) => {
        img.removeEventListener("load", onImgReady);
        img.removeEventListener("error", onImgReady);
      });
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="overflow-hidden border-t border-line bg-cream"
    >
      <div className="mx-auto max-w-[1600px] px-5 pt-16 md:px-10 md:pt-24">
        <h2 className="text-[9vw] font-light leading-none tracking-tight md:text-[5vw]">
          {title}
          <span className="ml-4 align-super font-serif text-[0.28em] italic text-muted">
            ({String(images.length).padStart(2, "0")})
          </span>
        </h2>
        {/* línea de progreso del carrete */}
        <div className="relative mt-6 hidden h-px w-full bg-line md:block">
          <div
            ref={progressRef}
            className="absolute inset-0 origin-left scale-x-0 bg-ink"
          />
        </div>
      </div>

      {/* tira: en móvil se desliza con el dedo; en escritorio la mueve el scroll */}
      <div className="mt-10 overflow-x-auto pb-8 md:mt-14 md:overflow-visible md:pb-24">
        <div
          ref={trackRef}
          className="flex w-max items-end gap-4 px-5 will-change-transform md:gap-6 md:px-10"
        >
          {images.map((img, i) => (
            <figure key={img.src + i} className="shrink-0">
              {/* carga inmediata: con lazy, las fotos fuera de pantalla no
                  cargan y la distancia del carrete se calcula mal */}
              <img
                src={img.src}
                alt={img.alt}
                className={`${HEIGHTS[i % HEIGHTS.length]} w-auto object-cover`}
                style={{
                  aspectRatio: img.aspect,
                  objectPosition: img.objectPosition || 'center'
                }}
              />
              <figcaption className="mt-3 text-xs font-light text-muted">
                ({String(i + 1).padStart(2, "0")})
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
