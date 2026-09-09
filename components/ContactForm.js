"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/hooks";
import Calendar, { formatLongDate } from "@/components/Calendar";
import TimePicker, { formatClock } from "@/components/TimePicker";

// Formulario maquetado sin backend. A la derecha, un calendario + selector de
// hora para proponer llamada (opcional): al elegir día y hora el bloque se
// pliega en un resumen con botón de editar.

export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [editing, setEditing] = useState(false);

  // El calendario depende de la fecha ACTUAL: si se prerenderiza en el build
  // con otro mes, la hidratación no cuadra. Se monta solo en cliente.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const rootRef = useRef(null);
  const anchorRef = useRef(0);
  const firstRun = useRef(true);

  const complete = !!date && !!time;
  const showPicker = !complete || editing;

  // ---------------------------------------------------------------------
  // Envío: el bloque pasa de formulario (alto) a mensaje de gracias (bajo).
  // La página pierde altura de golpe, el navegador recorta el scroll al nuevo
  // final y aterrizabas en el footer. Guardamos el borde superior del bloque
  // ANTES de cambiar de estado y volvemos ahí una vez repintado.
  // ---------------------------------------------------------------------
  const handleSubmit = (e) => {
    e.preventDefault();
    anchorRef.current = rootRef.current
      ? rootRef.current.getBoundingClientRect().top + window.scrollY
      : window.scrollY;
    setSent(true);
  };

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }

    const settle = () => {
      const lenis = window.__lenis;
      // Lenis cachea la altura del documento: sin resize() sigue creyendo que
      // la página es la larga y el scroll queda descolocado.
      lenis?.resize();
      if (sent) {
        const target = Math.max(0, anchorRef.current - 120);
        if (lenis) lenis.scrollTo(target, { immediate: true, force: true });
        else window.scrollTo(0, target);
      }
      ScrollTrigger.refresh();
    };

    settle();
    const id = requestAnimationFrame(settle); // 2ª pasada tras el layout final
    return () => cancelAnimationFrame(id);
  }, [sent]);

  // El bloque de fecha/hora también cambia de alto al plegarse o desplegarse
  useEffect(() => {
    if (!mounted) return;
    const id = requestAnimationFrame(() => {
      window.__lenis?.resize();
      ScrollTrigger.refresh();
    });
    return () => cancelAnimationFrame(id);
  }, [showPicker, date, mounted]);

  // Entrada del mensaje de gracias
  useEffect(() => {
    if (!sent || prefersReducedMotion()) return;
    const items = rootRef.current?.querySelectorAll("[data-ok]");
    if (!items?.length) return;
    const tw = gsap.fromTo(
      items,
      { opacity: 0, y: 22 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.08,
        clearProps: "all",
      },
    );
    return () => tw.kill();
  }, [sent]);

  // Entrada del resumen plegado
  useEffect(() => {
    if (showPicker || !mounted || prefersReducedMotion()) return;
    const el = rootRef.current?.querySelector("[data-summary]");
    if (!el) return;
    const tw = gsap.fromTo(
      el,
      { opacity: 0, y: 16, scale: 0.97 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: "power3.out",
        clearProps: "all",
      },
    );
    return () => tw.kill();
  }, [showPicker, mounted]);

  const handleDate = (d) => {
    setDate(d);
    if (!d) setTime(null); // quitar el día también descarta la hora
  };

  const handleTime = (slot) => {
    setTime(slot);
    // elegir la hora es el último gesto: se pliega solo en el resumen
    if (slot && date) setEditing(false);
  };

  const reset = () => {
    setSent(false);
    setDate(null);
    setTime(null);
    setEditing(false);
  };

  // -------------------------------------------------------------------------
  // Estado enviado
  // -------------------------------------------------------------------------
  if (sent) {
    return (
      <div
        ref={rootRef}
        className="flex min-h-[340px] flex-col justify-center border-t border-line py-14 md:min-h-[420px] md:py-20"
      >
        <div data-ok>
          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-accent/40 bg-accent/10">
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-accent"
              aria-hidden
            >
              <path d="M4 12.5l5.2 5.2L20 7" />
            </svg>
          </span>
        </div>

        <p
          data-ok
          className="mt-7 text-3xl font-light leading-tight tracking-tight md:text-4xl"
        >
          Mensaje enviado
        </p>

        {date && (
          <div
            data-ok
            className="mt-6 inline-flex w-fit flex-wrap items-center gap-x-3 gap-y-1 rounded-2xl border border-accent/30 bg-accent/[0.06] px-5 py-4 backdrop-blur-xl"
          >
            <span className="text-[0.65rem] uppercase tracking-[0.22em] text-muted">
              Llamada
            </span>
            <span className="text-base font-light first-letter:uppercase">
              {formatLongDate(date)}
            </span>
            {time && (
              <span className="text-base font-light text-accent">
                {formatClock(time.hour, time.minute)}
              </span>
            )}
          </div>
        )}

        <p data-ok className="mt-6 max-w-md text-sm font-light text-muted">
          Este formulario es solo maqueta. Conéctalo a tu servicio favorito
          (Formspree, Resend, Basin…) cuando quieras recibir mensajes reales.
        </p>

        <button
          data-ok
          type="button"
          onClick={reset}
          className="u-line mt-8 w-fit text-sm uppercase tracking-[0.18em]"
        >
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Formulario
  // -------------------------------------------------------------------------
  return (
    <form ref={rootRef} onSubmit={handleSubmit}>
      <div className="grid gap-14 md:grid-cols-2 md:gap-20">
        {/* campos */}
        <div className="space-y-10">
          <div className="field">
            <label htmlFor="cf-name" className="sr-only">
              Nombre
            </label>
            <input id="cf-name" type="text" placeholder="Nombre" required />
          </div>
          <div className="field">
            <label htmlFor="cf-email" className="sr-only">
              Email
            </label>
            <input id="cf-email" type="email" placeholder="Email" required />
          </div>
          <div className="field">
            <label htmlFor="cf-message" className="sr-only">
              Mensaje
            </label>
            <textarea
              id="cf-message"
              rows={6}
              placeholder="Cuéntame tu proyecto"
              required
            />
          </div>
        </div>

        {/* fecha + hora de la llamada (opcional) */}
        <div>
          <p className="mb-5 text-xs uppercase tracking-[0.18em] text-muted">
            ¿Te viene bien un día para una llamada? (opcional)
          </p>

          {!mounted ? (
            <div className="h-[300px] animate-pulse rounded-2xl border border-line bg-ink/[0.03]" />
          ) : showPicker ? (
            <div className="space-y-5">
              <Calendar selected={date} onSelect={handleDate} />

              {date && <TimePicker selected={time} onSelect={handleTime} />}

              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-light text-muted">
                  {!date
                    ? "Elige un día para proponer una llamada."
                    : !time
                      ? "Ahora elige una hora."
                      : "Todo listo."}
                </p>
                {complete && editing && (
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="shrink-0 rounded-full border border-accent bg-accent px-5 py-2 text-[0.7rem] uppercase tracking-[0.18em] text-black transition-transform duration-300 hover:scale-105 active:scale-95"
                  >
                    Listo
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* resumen plegado */
            <div
              data-summary
              className="rounded-2xl border border-accent/30 bg-accent/[0.06] p-5 backdrop-blur-xl md:p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[0.65rem] uppercase tracking-[0.22em] text-muted">
                    Llamada propuesta
                  </p>
                  <p className="mt-2.5 text-lg font-light leading-tight tracking-tight first-letter:uppercase md:text-xl">
                    {formatLongDate(date)}
                  </p>
                  <p className="mt-1 text-4xl font-light tracking-tight text-accent md:text-5xl">
                    {formatClock(time.hour, time.minute)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="group flex shrink-0 items-center gap-2 rounded-full border border-line px-4 py-2.5 text-[0.7rem] uppercase tracking-[0.18em] text-ink transition-all duration-300 hover:border-accent hover:text-accent"
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="13"
                    height="13"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="M4 20h4L20 8a2.8 2.8 0 0 0-4-4L4 16v4z" />
                  </svg>
                  Editar
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setDate(null);
                  setTime(null);
                  setEditing(false);
                }}
                className="mt-5 text-xs font-light text-muted underline-offset-4 transition-colors duration-300 hover:text-ink hover:underline"
              >
                Quitar propuesta de llamada
              </button>
            </div>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="u-line mt-12 text-sm uppercase tracking-[0.18em]"
      >
        Enviar mensaje
      </button>
    </form>
  );
}
