"use client";

// Vuelve al inicio de la página con el scroll suave de Lenis.
export default function BackToTop() {
  return (
    <button
      type="button"
      onClick={() => {
        if (window.__lenis) window.__lenis.scrollTo(0);
        else window.scrollTo({ top: 0, behavior: "smooth" });
      }}
      className="u-line text-sm font-light"
    >
      Volver arriba ↑
    </button>
  );
}
