"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger } from "@/lib/gsap";

// Memoria de scroll entre rutas.
//
// Next intenta llevarte arriba al navegar, pero Lenis conserva su posición
// interna y la vuelve a aplicar: por eso al pulsar un enlace aterrizabas a
// media página. Aquí lo gobernamos a mano:
//   · navegación normal (pulsar un enlace) → arriba del todo
//   · navegación "atrás" → se restaura la posición exacta que tenías
//
// La posición de cada ruta se CONGELA en el instante del clic: el scroll-a-
// arriba que hace Next al navegar dispara un evento de scroll que, según el
// timing, podía llegar con el listener viejo aún puesto y machacar la
// posición guardada con un 0 (por eso "a veces" la vuelta te dejaba arriba).
const positions = new Map();
const norm = (p) => (p || "/").replace(/\/+$/, "") || "/";
let locked = false;

function lockScrollMemory() {
  positions.set(norm(window.location.pathname), window.scrollY);
  locked = true;
}

if (typeof window !== "undefined" && !window.__navBackInit) {
  window.__navBackInit = true;
  // atrás/adelante: marca la vuelta y congela la memoria (popstate llega con
  // la URL ya cambiada, así que aquí NO se guarda nada — solo se bloquea)
  window.addEventListener("popstate", () => {
    window.__navBack = true;
    locked = true;
  });
  // cualquier clic en un enlace interno congela la posición de la página
  // actual ANTES de que la navegación pueda ensuciarla (cubre menú, footer,
  // tarjetas… sin depender de handlers propios)
  document.addEventListener(
    "click",
    (e) => {
      const a = e.target?.closest?.("a[href]");
      const href = a?.getAttribute("href");
      if (href && href.startsWith("/")) lockScrollMemory();
    },
    true,
  );
}

export default function ScrollManager() {
  const pathname = usePathname();

  // La restauración de scroll la hacemos NOSOTROS. Si la hiciera el navegador,
  // al volver atrás el scroll saltaría a media página ANTES de que React
  // remonte: los reveals de arriba nacerían ya "completados", se
  // auto-eliminarían en plena creación de triggers y corromperían
  // ScrollTrigger (la página rota que salía al salir de un proyecto).
  // Se reafirma en cada ruta porque el router de Next lo resetea a "auto".
  useEffect(() => {
    try {
      history.scrollRestoration = "manual";
    } catch {}
  }, [pathname]);

  // va guardando la posición de la ruta actual mientras se hace scroll
  // (salvo con la memoria congelada por una navegación en curso)
  useEffect(() => {
    const save = () => {
      if (!locked) positions.set(norm(pathname), window.scrollY);
    };
    window.addEventListener("scroll", save, { passive: true });
    return () => window.removeEventListener("scroll", save);
  }, [pathname]);

  // al entrar en una ruta: atrás → restaura · adelante → arriba
  useEffect(() => {
    const back = window.__navBack;
    window.__navBack = false;
    const y = back ? (positions.get(norm(pathname)) ?? 0) : 0;
    // la ruta nueva ya está activa: se reabre la memoria de scroll
    locked = false;

    // si el usuario ya está scrolleando, no le arrebatamos el control
    let userMoved = false;
    const markUser = () => (userMoved = true);
    window.addEventListener("wheel", markUser, { passive: true, once: true });
    window.addEventListener("touchstart", markUser, {
      passive: true,
      once: true,
    });

    const apply = () => {
      if (userMoved) return;
      // ScrollTrigger memoriza posiciones y las re-aplica en cada refresh
      // (y refresca solo al cargar las imágenes): se limpia siempre.
      // El argumento es obligatorio: sin él GSAP deja scrollRestoration en
      // "auto" y el navegador volvería a restaurar el scroll por su cuenta.
      ScrollTrigger.clearScrollMemory("manual");
      // force: Lenis está pausado durante las transiciones de proyecto y sin
      // él ignoraría esta llamada (la página aterrizaría con el scroll viejo)
      if (window.__lenis)
        window.__lenis.scrollTo(y, { immediate: true, force: true });
      else window.scrollTo(0, y);
    };

    apply();
    // recalcular los pins con las medidas nuevas, pero con un pelín de margen:
    // los triggers con scrub se inicializan en el primer tick de GSAP, y
    // refrescar ANTES de eso corrompe su registro interno (página rota)
    const call = gsap.delayedCall(0.1, () => {
      ScrollTrigger.refresh();
      apply();
    });

    // las imágenes externas terminan de cargar más tarde y disparan otro
    // refresh: hay que reafirmar la posición cuando eso ocurra
    const late = window.setTimeout(apply, 650);

    return () => {
      call.kill();
      clearTimeout(late);
      window.removeEventListener("wheel", markUser);
      window.removeEventListener("touchstart", markUser);
    };
  }, [pathname]);

  return null;
}
