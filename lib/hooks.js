"use client";

import { useEffect, useLayoutEffect } from "react";

// useLayoutEffect lanza un warning en SSR; en servidor usamos useEffect.
export const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

// La web se carga dentro del panel de /admin (con ?cms=1) para servir de vista
// previa. Ahí interesa verla quieta: los textos animados se trocean en spans
// para poder entrar línea a línea, y sobre eso no se puede sustituir el texto
// en vivo. Sin animación, TextReveal deja el texto tal cual y el panel puede
// cambiarlo mientras escribes.
export function isCmsPreview() {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).get("cms") === "1";
}

export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return (
    isCmsPreview() ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}
