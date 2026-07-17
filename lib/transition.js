"use client";

import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/hooks";

// Transición inmersiva compartida.
//
// IDA: clona la portada desde el rectángulo del elemento de origen, la expande
// hasta llenar la pantalla, navega y se retira en silencio cuando la página
// nueva (que abre con esa misma portada a sangre) ya ha aterrizado debajo.
//
// VUELTA (botón atrás): al salir se recuerda de dónde vino; al volver, la
// portada aparece a pantalla completa y se contrae hasta su tarjeta.
//
// Clave para que no se vea "doble imagen": la página que aterriza NO debe
// fundirse a la vez que el overlay (dos capas semitransparentes dejarían ver
// el fondo). Por eso avisamos al template con window.__skipPageFade.

const KEY = "projectOrigin";
const EASE = "power2.inOut"; // aceleración y frenada suaves, sin tirones

// con trailingSlash, la misma ruta puede aparecer como "/proyectos" o
// "/proyectos/": se comparan siempre normalizadas
const norm = (p) => (p || "/").replace(/\/+$/, "") || "/";

// solo puede haber un overlay en pantalla: si llega otra transición, el
// anterior se retira en el acto (evita superposiciones al entrar y salir rápido)
let current = null;

function clearCurrent() {
  if (current) {
    current.tl?.kill();
    current.overlay.remove();
    current = null;
  }
  // el scroll se pausa durante las transiciones: nunca debe quedarse bloqueado
  window.__lenis?.start();
}

// La vuelta se lanza desde popstate y no desde un efecto de React: el
// template no vuelve a montarse en las navegaciones "atrás", y además aquí
// el overlay se crea antes de que React repinte, así que tapa el salto.
if (typeof window !== "undefined" && !window.__backNavInit) {
  window.__backNavInit = true;
  window.addEventListener("popstate", () => {
    const origin = takeProjectOrigin();
    // solo si volvemos justo a la página desde la que se entró
    if (!origin || norm(origin.from) !== norm(window.location.pathname)) return;
    if (prefersReducedMotion()) return;
    // (en la vuelta el template no se vuelve a montar: no hay fundido que
    // saltarse, el overlay ya tapa el cambio)
    playReturnToGrid(origin);
  });
}

export function rememberProjectOrigin(slug, cover) {
  try {
    sessionStorage.setItem(
      KEY,
      JSON.stringify({ slug, cover, from: norm(location.pathname) }),
    );
  } catch {}
}

export function takeProjectOrigin() {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    sessionStorage.removeItem(KEY);
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function makeOverlay(coverSrc, rect) {
  clearCurrent();
  const overlay = document.createElement("div");
  overlay.style.cssText = `position:fixed;left:${rect.left}px;top:${rect.top}px;width:${rect.width}px;height:${rect.height}px;z-index:90;overflow:hidden;`;
  const img = document.createElement("img");
  img.src = coverSrc;
  img.alt = "";
  img.style.cssText = "width:100%;height:100%;object-fit:cover;";
  overlay.appendChild(img);
  document.body.appendChild(overlay);
  current = { overlay, img, tl: null };
  return { overlay, img };
}

export function expandIntoProject(sourceEl, coverSrc, navigate, slug) {
  const rect =
    sourceEl && sourceEl.getBoundingClientRect
      ? sourceEl.getBoundingClientRect()
      : {
          left: window.innerWidth / 2 - 150,
          top: window.innerHeight / 2 - 190,
          width: 300,
          height: 380,
        };

  if (slug) rememberProjectOrigin(slug, coverSrc);

  const { overlay, img } = makeOverlay(coverSrc, rect);
  const ref = current;
  // el clon arranca con un micro-zoom que se resuelve al expandirse
  gsap.set(img, { scale: 1.06 });
  // la página de destino aparece ya asentada bajo el overlay
  window.__skipPageFade = true;
  // sin scroll durante el vuelo: nada compite con la animación
  window.__lenis?.stop();

  const tl = gsap.timeline();
  ref.tl = tl;
  tl.to(overlay, {
    left: 0,
    top: 0,
    width: window.innerWidth,
    height: window.innerHeight,
    duration: 1,
    ease: EASE,
  })
    .to(img, { scale: 1, duration: 1, ease: EASE }, 0)
    .add(() => navigate())
    // margen para que la página nueva pinte bajo el overlay (opaco) y luego
    // un fundido corto: como debajo está la misma portada, es imperceptible
    .to(overlay, {
      opacity: 0,
      duration: 0.45,
      ease: "power1.out",
      delay: 0.45,
      onComplete: () => {
        if (current === ref) clearCurrent();
        else overlay.remove();
      },
    });
}

// Reproduce la vuelta: pantalla completa → se contrae hasta la tarjeta del
// proyecto del que veníamos.
export function playReturnToGrid(origin) {
  const { overlay, img } = makeOverlay(origin.cover, {
    left: 0,
    top: 0,
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const ref = current;
  // sin scroll durante la contracción (se reactiva en clearCurrent)
  window.__lenis?.stop();

  // esperamos a que React repinte y el scroll se restaure antes de medir
  // (todo ocurre tapado por el overlay a pantalla completa).
  // setTimeout y no requestAnimationFrame: el rAF se congela en pestañas en
  // segundo plano y el overlay se quedaría clavado con el scroll bloqueado.
  window.setTimeout(() => {
    {
      if (current !== ref) return; // otra transición tomó el relevo
      // primera coincidencia VISIBLE: la misma tarjeta existe dos veces
      // (acordeón de escritorio + tarjeta móvil) y una siempre está oculta
      const target = [
        ...document.querySelectorAll(
          `[data-project-slug="${origin.slug}"] img`,
        ),
      ].find((el) => el.offsetParent && el.getBoundingClientRect().width > 5);
      const rect = target ? target.getBoundingClientRect() : null;
      const done = () => {
        if (current === ref) clearCurrent();
        else overlay.remove();
      };

      if (!rect || rect.width < 5) {
        // la tarjeta no está en esta página: simple fundido
        gsap.to(overlay, {
          opacity: 0,
          duration: 0.5,
          ease: "power1.out",
          onComplete: done,
        });
        return;
      }

      const tl = gsap.timeline();
      ref.tl = tl;
      tl.to(overlay, {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
        duration: 0.9,
        ease: EASE,
      })
        .to(img, { scale: 1.06, duration: 0.9, ease: EASE }, 0)
        // el fundido arranca cuando ya está encajada en la tarjeta
        .to(overlay, {
          opacity: 0,
          duration: 0.3,
          ease: "power1.out",
          onComplete: done,
        });
    }
  }, 90);
}
