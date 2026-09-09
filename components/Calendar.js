"use client";

import { useMemo, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useIsoLayoutEffect, prefersReducedMotion } from "@/lib/hooks";

// Calendario de un mes con navegación. Al cambiar de mes el título entra en la
// dirección del gesto y los días aparecen escalonados; la selección se rellena
// con un círculo que hace un pequeño rebote.

const MONTHS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];
const WEEKDAYS = ["L", "M", "X", "J", "V", "S", "D"];

// "miércoles, 30 de septiembre" — solo se usa en cliente, sin riesgo de
// desajuste de hidratación.
export function formatLongDate(d) {
  return new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(d);
}

export function formatShortDate(d) {
  return `${String(d.getDate()).padStart(2, "0")}/${String(
    d.getMonth() + 1,
  ).padStart(2, "0")}/${d.getFullYear()}`;
}

const isSameDay = (a, b) =>
  !!a &&
  !!b &&
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

function Chevron({ dir }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="15"
      height="15"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d={dir === "left" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} />
    </svg>
  );
}

export default function Calendar({ selected, onSelect }) {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [view, setView] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );
  // dirección del último salto de mes: alimenta la animación de entrada
  const dirRef = useRef(0);
  const rootRef = useRef(null);

  const year = view.getFullYear();
  const month = view.getMonth();
  const offset = (new Date(year, month, 1).getDay() + 6) % 7; // lunes primero
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const canGoBack =
    year > today.getFullYear() ||
    (year === today.getFullYear() && month > today.getMonth());

  useIsoLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const root = rootRef.current;
    if (!root) return;

    const dir = dirRef.current;
    const label = root.querySelector("[data-cal-label]");
    const cells = root.querySelectorAll("[data-cal-day]");
    const tweens = [];

    if (dir !== 0 && label) {
      tweens.push(
        gsap.fromTo(
          label,
          { opacity: 0, x: dir * 18 },
          { opacity: 1, x: 0, duration: 0.5, ease: "power3.out", clearProps: "all" },
        ),
      );
    }
    if (cells.length) {
      tweens.push(
        gsap.fromTo(
          cells,
          { opacity: 0, y: 12, scale: 0.85 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            ease: "power3.out",
            stagger: { each: 0.013, from: dir < 0 ? "end" : "start" },
            clearProps: "transform,opacity",
          },
        ),
      );
    }

    return () => tweens.forEach((t) => t.kill());
  }, [view]);

  const go = (delta) => {
    dirRef.current = delta;
    setView(new Date(year, month + delta, 1));
  };

  return (
    <div
      ref={rootRef}
      className="rounded-2xl border border-line bg-ink/[0.03] p-4 backdrop-blur-xl md:p-5"
    >
      <div className="flex items-center justify-between">
        <p
          data-cal-label
          className="text-base font-light tracking-tight md:text-lg"
        >
          {MONTHS[month]} <span className="text-muted">{year}</span>
        </p>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => go(-1)}
            disabled={!canGoBack}
            aria-label="Mes anterior"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-ink/70 transition-all duration-300 hover:scale-110 hover:border-accent hover:text-accent active:scale-95 disabled:pointer-events-none disabled:opacity-25"
          >
            <Chevron dir="left" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Mes siguiente"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-ink/70 transition-all duration-300 hover:scale-110 hover:border-accent hover:text-accent active:scale-95"
          >
            <Chevron dir="right" />
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-0.5 text-center md:gap-1">
        {WEEKDAYS.map((d) => (
          <span
            key={d}
            className="pb-2 text-[0.6rem] uppercase tracking-[0.14em] text-muted"
          >
            {d}
          </span>
        ))}

        {Array.from({ length: offset }).map((_, i) => (
          <span key={`pad-${i}`} aria-hidden />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const date = new Date(year, month, i + 1);
          const past = date < today;
          const isSel = isSameDay(date, selected);
          const isToday = isSameDay(date, today);

          return (
            <button
              key={date.getTime()}
              data-cal-day
              type="button"
              disabled={past}
              aria-pressed={isSel}
              aria-label={formatLongDate(date)}
              onClick={() => onSelect(isSel ? null : date)}
              className="group relative aspect-square w-full text-sm font-light disabled:pointer-events-none"
            >
              {/* aro que aparece al pasar el cursor */}
              <span
                aria-hidden
                className={`absolute inset-[3px] rounded-full border border-line transition-all duration-300 ${
                  past || isSel
                    ? "opacity-0"
                    : "scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100"
                }`}
              />
              {/* relleno de selección con rebote */}
              <span
                aria-hidden
                className={`absolute inset-[3px] rounded-full bg-accent transition-transform duration-500 [transition-timing-function:cubic-bezier(.34,1.56,.64,1)] ${
                  isSel ? "scale-100" : "scale-0"
                }`}
              />
              <span
                className={`relative z-10 transition-colors duration-300 ${
                  isSel
                    ? "text-black"
                    : past
                      ? "text-line"
                      : "text-ink group-hover:text-accent"
                }`}
              >
                {i + 1}
              </span>
              {/* punto discreto marcando hoy */}
              {isToday && !isSel && (
                <span
                  aria-hidden
                  className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
