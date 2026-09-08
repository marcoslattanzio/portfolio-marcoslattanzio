"use client";

import { useState } from "react";

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

  const handleTimeSelect = (slot) => {
    onSelect(slot);
  };

  return (
    <div className="border-t border-line pt-5">
      <p className="mb-4 text-sm font-light text-muted">Hora de la llamada</p>

      <div className="grid grid-cols-4 gap-2 md:gap-3">
        {slots.map((slot) => (
          <button
            key={`${slot.hour}-${slot.minute}`}
            onClick={() => handleTimeSelect(slot)}
            className={`py-3 px-2 md:py-4 md:px-3 text-sm md:text-base font-light rounded-lg transition-all duration-200 backdrop-blur-md border ${
              selected &&
              selected.hour === slot.hour &&
              selected.minute === slot.minute
                ? "bg-accent text-black border-accent shadow-lg shadow-accent/30"
                : "bg-white/10 hover:bg-white/20 text-cream border-white/20 hover:border-white/40"
            }`}
          >
            {formatTime(slot.hour, slot.minute)}
          </button>
        ))}
      </div>

      <p className="mt-4 min-h-5 text-sm font-light text-muted">
        {selected
          ? `Hora propuesta: ${formatTime(selected.hour, selected.minute)}`
          : "Selecciona una hora"}
      </p>
    </div>
  );
}
