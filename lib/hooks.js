"use client";

import { useEffect, useLayoutEffect } from "react";

// useLayoutEffect lanza un warning en SSR; en servidor usamos useEffect.
export const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}
