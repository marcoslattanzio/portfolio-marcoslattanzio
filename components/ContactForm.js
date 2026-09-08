"use client";

import { useEffect, useState } from "react";
import TimePicker from "@/components/TimePicker";

// Formulario maquetado sin backend, con estados de focus elegantes y un
// calendario para proponer día de llamada (opcional). El calendario es
// funcional: navega por meses y guarda el día elegido; los días pasados
// quedan deshabilitados. También incluye selector de hora con rueda vertical.

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

function formatDate(d) {
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

function Calendar({ selected, onSelect }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [view, setView] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );

  const year = view.getFullYear();
  const month = view.getMonth();
  // lunes como primer día de la semana
  const offset = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const canGoBack =
    year > today.getFullYear() ||
    (year === today.getFullYear() && month > today.getMonth());

  return (
    <div className="border-t border-line pt-5">
      <div className="flex items-baseline justify-between">
        <p className="text-sm font-light">
          {MONTHS[month]}{" "}
          <span className="text-muted">{year}</span>
        </p>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setView(new Date(year, month - 1, 1))}
            disabled={!canGoBack}
            aria-label="Mes anterior"
            className="text-lg font-light transition-colors hover:text-accent disabled:pointer-events-none disabled:opacity-30"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => setView(new Date(year, month + 1, 1))}
            aria-label="Mes siguiente"
            className="text-lg font-light transition-colors hover:text-accent"
          >
            →
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((d) => (
          <span
            key={d}
            className="pb-2 text-[0.65rem] uppercase tracking-[0.15em] text-muted"
          >
            {d}
          </span>
        ))}
        {Array.from({ length: offset }).map((_, i) => (
          <span key={`pad-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const date = new Date(year, month, i + 1);
          const past = date < today;
          const isSelected =
            selected && date.getTime() === selected.getTime();
          return (
            <button
              key={i}
              type="button"
              disabled={past}
              onClick={() => onSelect(isSelected ? null : date)}
              className={`aspect-square rounded-full text-sm font-light transition-colors duration-200 ${
                isSelected
                  ? "bg-accent text-black"
                  : past
                    ? "pointer-events-none text-line"
                    : "hover:bg-ink hover:text-cream"
              }`}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const [selected, setSelected] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  // el calendario depende de la fecha ACTUAL: si se prerenderiza en el build
  // con otro mes, la hidratación no cuadra y puede tirar la página al recargar.
  // Se monta solo en cliente.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (sent) {
    return (
      <div className="border-t border-line py-16">
        <p className="text-2xl font-light">
          Gracias - este formulario es solo maqueta.
        </p>
        {selected && (
          <p className="mt-3 text-base font-light">
            Día propuesto: <span className="text-accent">{formatDate(selected)}</span>
            {selectedTime && (
              <> a las <span className="text-accent">{String(selectedTime.hour).padStart(2, "0")}:{String(selectedTime.minute).padStart(2, "0")}</span></>
            )}
          </p>
        )}
        <p className="mt-3 text-sm text-muted">
          Conéctalo a tu servicio favorito (Formspree, Resend, Basin…) cuando
          quieras recibir mensajes reales.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      {/* campos a la izquierda, calendario a la derecha */}
      <div className="grid gap-14 md:grid-cols-2 md:gap-20">
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

        {/* calendario: proponer un día para hablar (opcional) */}
        <div>
          <p className="mb-5 text-xs uppercase tracking-[0.18em] text-muted">
            ¿Te viene bien un día para una llamada? (opcional)
          </p>
          {mounted ? (
            <>
              <Calendar selected={selected} onSelect={setSelected} />
              {selected && (
                <TimePicker selected={selectedTime} onSelect={setSelectedTime} />
              )}
            </>
          ) : (
            <div className="border-t border-line pt-5 text-sm font-light text-muted">
              Cargando calendario…
            </div>
          )}
          <p className="mt-4 min-h-5 text-sm font-light text-muted">
            {selected
              ? `Día propuesto: ${formatDate(selected)} - vuelve a pulsarlo para quitarlo`
              : "Elige un día en el calendario si quieres proponer una llamada"}
          </p>
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
