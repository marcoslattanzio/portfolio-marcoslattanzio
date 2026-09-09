"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useIsoLayoutEffect, prefersReducedMotion } from "@/lib/hooks";

// Rejilla de horas de 8:00 a 20:00 en tramos de 30 min. Las horas en punto se
// escriben sin minutos (8, 9, 10…) y las medias con ellos (8:30, 9:30…).

const SLOTS = (() => {
  const out = [];
  for (let h = 8; h <= 20; h++) {
    out.push({ hour: h, minute: 0 });
    if (h < 20) out.push({ hour: h, minute: 30 });
  }
  return out;
})();

export function formatSlot(hour, minute) {
  return minute === 0 ? `${hour}` : `${hour}:${String(minute).padStart(2, "0")}`;
}

export function formatClock(hour, minute) {
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

export default function TimePicker({ selected, onSelect }) {
  const rootRef = useRef(null);

  // entrada escalonada: las horas caen en cascada al abrirse el bloque
  useIsoLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const chips = rootRef.current?.querySelectorAll("[data-slot]");
    if (!chips?.length) return;

    const tw = gsap.fromTo(
      chips,
      { opacity: 0, y: 10, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.45,
        ease: "power3.out",
        stagger: 0.016,
        clearProps: "transform,opacity",
      },
    );
    return () => tw.kill();
  }, []);

  return (
    <div ref={rootRef}>
      <p className="mb-3 text-[0.65rem] uppercase tracking-[0.22em] text-muted">
        Hora
      </p>

      <div className="grid grid-cols-4 gap-1.5 md:gap-2">
        {SLOTS.map((slot) => {
          const isSel =
            !!selected &&
            selected.hour === slot.hour &&
            selected.minute === slot.minute;

          return (
            <button
              key={`${slot.hour}-${slot.minute}`}
              data-slot
              type="button"
              aria-pressed={isSel}
              aria-label={`Las ${formatClock(slot.hour, slot.minute)}`}
              onClick={() => onSelect(isSel ? null : slot)}
              className={`group relative overflow-hidden rounded-xl border py-2.5 text-sm font-light backdrop-blur-md transition-colors duration-300 md:py-3 ${
                isSel
                  ? "border-accent"
                  : "border-line bg-ink/[0.03] hover:border-accent/50"
              }`}
            >
              {/* relleno "líquido": crece desde el centro al seleccionar */}
              <span
                aria-hidden
                className={`absolute inset-0 bg-accent transition-transform duration-500 [transition-timing-function:cubic-bezier(.34,1.56,.64,1)] ${
                  isSel ? "scale-100" : "scale-0"
                }`}
              />
              <span
                className={`relative z-10 transition-colors duration-300 ${
                  isSel ? "text-black" : "text-ink group-hover:text-accent"
                }`}
              >
                {formatSlot(slot.hour, slot.minute)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
