"use client";

import { useRef, useState } from "react";

function generateTimeSlots() {
  const slots = [];
  for (let hour = 8; hour <= 20; hour++) {
    slots.push({ hour, minute: 0 });
    if (hour < 20) {
      slots.push({ hour, minute: 30 });
    }
  }
  return slots;
}

function formatTime(hour, minute) {
  if (minute === 0) {
    return `${hour}`;
  }
  return `${hour}:${String(minute).padStart(2, "0")}`;
}

export default function TimePicker({ selected, onSelect }) {
  const slots = generateTimeSlots();
  const [scrollIndex, setScrollIndex] = useState(1);
  const wheelRef = useRef(null);

  const handleWheel = (e) => {
    const direction = e.deltaY > 0 ? 1 : -1;
    const newIndex = Math.max(0, Math.min(scrollIndex + direction, slots.length - 1));
    setScrollIndex(newIndex);
    onSelect(slots[newIndex]);
  };

  const handleTimeSelect = (slot) => {
    onSelect(slot);
  };

  return (
    <div className="border-t border-line pt-5">
      <p className="mb-4 text-sm font-light text-muted">Hora de la llamada</p>

      {/* DESKTOP: Botones simples */}
      <div className="hidden md:block">
        <div className="grid grid-cols-4 gap-2">
          {slots.map((slot) => (
            <button
              key={`${slot.hour}-${slot.minute}`}
              onClick={() => handleTimeSelect(slot)}
              className={`py-3 px-2 text-sm font-light rounded transition-colors ${
                selected &&
                selected.hour === slot.hour &&
                selected.minute === slot.minute
                  ? "bg-accent text-black"
                  : "bg-ink/30 hover:bg-ink/50 text-cream"
              }`}
            >
              {formatTime(slot.hour, slot.minute)}
            </button>
          ))}
        </div>
      </div>

      {/* MOBILE: Wheel picker tipo iPhone */}
      <div
        className="md:hidden relative flex h-[240px] flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-cream via-cream to-cream/50 rounded-lg"
        ref={wheelRef}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-cream to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-cream to-transparent" />
        <div className="pointer-events-none absolute top-1/2 left-0 right-0 -translate-y-1/2 border-t border-b border-ink/30 py-3" />

        <div
          className="select-none"
          onWheel={handleWheel}
          style={{ cursor: "grab" }}
        >
          {/* Mostrar items arriba del seleccionado */}
          {scrollIndex > 0 && (
            <div className="text-center py-2 text-muted/40">
              {formatTime(slots[scrollIndex - 1].hour, slots[scrollIndex - 1].minute)}
            </div>
          )}

          {/* Item seleccionado */}
          <div className="text-center py-4">
            <p className="text-5xl font-light text-ink">
              {formatTime(slots[scrollIndex].hour, slots[scrollIndex].minute)}
            </p>
          </div>

          {/* Mostrar items abajo del seleccionado */}
          {scrollIndex < slots.length - 1 && (
            <div className="text-center py-2 text-muted/40">
              {formatTime(slots[scrollIndex + 1].hour, slots[scrollIndex + 1].minute)}
            </div>
          )}
        </div>

        <p className="absolute bottom-4 text-xs text-muted/60">Rueda para cambiar</p>
      </div>

      <p className="mt-4 min-h-5 text-sm font-light text-muted">
        {selected
          ? `Hora propuesta: ${formatTime(selected.hour, selected.minute)}`
          : "Selecciona una hora"}
      </p>
    </div>
  );
}
