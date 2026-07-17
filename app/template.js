"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useIsoLayoutEffect, prefersReducedMotion } from "@/lib/hooks";
// import por efecto: registra el listener de "atrás" que reproduce la
// transición inversa (portada → se contrae hasta su tarjeta)
import "@/lib/transition";

// Transición de página: fade + ligero desplazamiento al entrar en cada ruta.
// (template.js se vuelve a montar en cada navegación, a diferencia de layout.js)
export default function Template({ children }) {
  const ref = useRef(null);

  useIsoLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    // el header funde <main> al navegar: al montar la página nueva se limpia
    const main = document.querySelector("main");
    if (main) gsap.set(main, { clearProps: "opacity,transform" });

    // llegando con la transición de proyecto (ida o vuelta): la página debe
    // aterrizar ya asentada bajo el overlay — si se fundiera a la vez que él,
    // se verían dos capas semitransparentes y asomaría el fondo
    if (window.__skipPageFade) {
      window.__skipPageFade = false;
      gsap.set(ref.current, { opacity: 1, y: 0, clearProps: "all" });
      return;
    }

    const anim = gsap.fromTo(
      ref.current,
      { opacity: 0, y: 24 },
      // clearProps: un transform residual convertiría este wrapper en el
      // contenedor de los position:fixed hijos y rompería el pin de ScrollTrigger
      { opacity: 1, y: 0, duration: 0.55, ease: "power3.out", clearProps: "all" },
    );
    return () => anim.kill();
  }, []);

  return <div ref={ref}>{children}</div>;
}
