"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/hooks";

// Smooth scroll con inercia en toda la web. La instancia se guarda en
// window.__lenis para poder pararla desde el menú móvil.
export default function LenisProvider({ children }) {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      lerp: 0.08, // cuanto más bajo, más "pesado" e inercial
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    });
    window.__lenis = lenis;

    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, []);

  return children;
}
