"use client";

import { useEffect, useState } from "react";

// Interruptor claro/oscuro. El modo se guarda en localStorage y lo aplica
// antes de pintar el script inline del layout (sin flash). El botón muestra
// el modo al que vas a cambiar.
export default function ThemeToggle({ className = "" }) {
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme || "light");
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    const root = document.documentElement;
    const apply = () => {
      root.dataset.theme = next;
      try {
        localStorage.setItem("theme", next);
      } catch {}
      setTheme(next);
    };

    // View Transitions: el navegador funde un fotograma de la página entera
    // (imágenes incluidas) — mucho más limpio que transicionar color a color
    if (document.startViewTransition) {
      document.startViewTransition(apply);
      return;
    }
    // respaldo: fundido global de colores
    root.classList.add("theme-anim");
    window.setTimeout(() => root.classList.remove("theme-anim"), 600);
    apply();
  };

  // hasta hidratar no sabemos el modo: reservamos el hueco para no mover el layout
  if (!theme) return <span className={`inline-block w-14 ${className}`} />;

  return (
    <button
      type="button"
      onClick={toggle}
      className={`u-line text-sm font-light tracking-wide ${className}`}
      aria-label={`Cambiar a modo ${theme === "dark" ? "claro" : "oscuro"}`}
    >
      <span className="mr-1.5 text-[0.65rem] text-muted" aria-hidden>
        (◐)
      </span>
      {theme === "dark" ? "Claro" : "Oscuro"}
    </button>
  );
}
