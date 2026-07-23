"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useIsoLayoutEffect, prefersReducedMotion } from "@/lib/hooks";
import PixelateImage from "@/components/PixelateImage";

// Icono "ampliar" (esquinas hacia fuera): señala claramente que abre la foto.
function ExpandIcon({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M9 4H4v5M15 4h5v5M9 20H4v-5M15 20h5v-5" />
    </svg>
  );
}

// Servicios: índice interactivo + marco sticky.
// Al pasar el ratón, el marco de la derecha hace crossfade a la imagen del
// servicio. Al hacer clic (fila o marco), la foto se amplía en un visor
// centrado con desenfoque detrás. En móvil se apila como tarjetas.
export default function ServicesList({ services }) {
  const rootRef = useRef(null);
  const overlayRef = useRef(null);
  const zoomImgRef = useRef(null);
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(null);

  useIsoLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const root = rootRef.current;
    if (!root.getClientRects().length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        root.querySelectorAll("[data-service-row]"),
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: root,
            start: "top 78%",
            toggleActions: "play none none none",
          },
        },
      );
    }, root);

    return () => ctx.revert();
  }, []);

  // el marco se despixela al cambiar de servicio (PixelateImage mode="key")
  const select = (i) => setActive(i);

  const open = (i) => setZoom(i);
  const close = () => setZoom(null);

  // Esc cierra el visor
  useEffect(() => {
    if (zoom === null) return;
    const onKey = (e) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoom]);

  // entrada animada del visor
  useIsoLayoutEffect(() => {
    if (zoom === null || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.35, ease: "power2.out" },
      );
      gsap.fromTo(
        zoomImgRef.current,
        { opacity: 0, scale: 0.9, y: 12 },
        { opacity: 1, scale: 1, y: 0, duration: 0.55, ease: "power3.out" },
      );
    });
    return () => ctx.revert();
  }, [zoom]);

  return (
    <div ref={rootRef} className="grid gap-10 md:grid-cols-12 md:gap-12">
      {/* índice */}
      <ul className="md:col-span-6 md:self-start">
        {services.map((service, i) => (
          <li
            key={service.title}
            data-service-row
            onMouseEnter={() => select(i)}
            className="group border-t border-line last:border-b"
          >
            <button
              type="button"
              onClick={() => open(i)}
              onFocus={() => select(i)}
              aria-label={`Ampliar imagen de ${service.title}`}
              className="flex w-full items-baseline gap-4 py-6 text-left md:gap-6 md:py-8"
            >
              <span
                aria-hidden
                className={`shrink-0 font-serif text-2xl font-light italic leading-none transition-colors duration-500 md:text-3xl ${
                  active === i ? "text-accent" : "text-muted"
                }`}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex-1">
                <span
                  className={`block text-2xl font-light leading-[1.05] tracking-tight transition-[color,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:text-4xl ${
                    active === i
                      ? "translate-x-2 text-accent md:translate-x-3"
                      : "text-ink"
                  }`}
                >
                  {service.title}
                </span>
                <span className="mt-2 block text-sm font-light leading-relaxed text-muted md:hidden">
                  {service.detail}
                </span>
              </span>
              {/* afordancia clara de "ampliar" (sustituye a la flecha) */}
              <span
                aria-hidden
                className={`hidden h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:flex ${
                  active === i
                    ? "border-accent/60 text-accent opacity-100"
                    : "border-line text-muted opacity-0"
                }`}
              >
                <ExpandIcon className="h-4 w-4" />
              </span>
            </button>

            {/* imagen apilada solo en móvil (tocar para ampliar) */}
            <button
              type="button"
              onClick={() => open(i)}
              aria-label={`Ampliar imagen de ${service.title}`}
              className="mb-6 block w-full md:hidden"
            >
              <PixelateImage
                src={service.image}
                mode="scroll"
                intensity={14}
                className="relative aspect-[4/3] w-full"
              />
            </button>
          </li>
        ))}
      </ul>

      {/* marco sticky (escritorio) — clic para ampliar */}
      <div className="hidden md:col-span-5 md:col-start-8 md:block">
        <div className="sticky top-24">
          <button
            type="button"
            onClick={() => open(active)}
            aria-label="Ampliar imagen"
            className="group/frame relative block aspect-[4/5] w-full overflow-hidden bg-ink/5"
          >
            <PixelateImage
              src={services[active].image}
              mode="key"
              intensity={16}
              duration={0.85}
              className="absolute inset-0 h-full w-full transition-transform duration-700 will-change-transform group-hover/frame:scale-[1.03]"
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,0.85),rgba(0,0,0,0.1)_52%)]" />
            {/* pista de ampliar al pasar por el marco */}
            <span className="pointer-events-none absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-white/30 text-white opacity-0 backdrop-blur-sm transition-opacity duration-500 group-hover/frame:opacity-100">
              <ExpandIcon className="h-4 w-4" />
            </span>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 p-6 text-left md:p-8">
              <p className="text-xs uppercase tracking-[0.22em] text-white/65">
                {String(active + 1).padStart(2, "0")} /{" "}
                {String(services.length).padStart(2, "0")}
              </p>
              <p className="mt-3 max-w-sm text-lg font-light leading-relaxed text-white md:text-xl">
                {services[active].detail}
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* visor ampliado con desenfoque detrás */}
      {zoom !== null && (
        <div
          ref={overlayRef}
          onClick={close}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 p-6 backdrop-blur-2xl"
        >
          <button
            type="button"
            onClick={close}
            aria-label="Cerrar"
            className="absolute right-6 top-6 flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-2xl font-light text-white/80 transition-colors hover:border-white/60 hover:text-white"
          >
            ×
          </button>
          <figure
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-full flex-col items-center"
          >
            <img
              ref={zoomImgRef}
              src={services[zoom].image}
              alt={services[zoom].title}
              className="max-h-[78vh] max-w-[86vw] object-contain shadow-[0_40px_120px_rgba(0,0,0,0.55)] md:max-w-[620px]"
            />
            <figcaption className="mt-5 text-center">
              <span className="font-serif text-lg font-light italic text-accent">
                {String(zoom + 1).padStart(2, "0")}
              </span>
              <span className="ml-3 text-lg font-light text-white md:text-xl">
                {services[zoom].title}
              </span>
              <span className="mt-1 block text-sm font-light text-white/60">
                {services[zoom].detail}
              </span>
            </figcaption>
          </figure>
        </div>
      )}
    </div>
  );
}
