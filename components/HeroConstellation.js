"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useIsoLayoutEffect, prefersReducedMotion } from "@/lib/hooks";
import TextReveal from "@/components/TextReveal";

// Apertura "constelación": frase grande centrada y fotos pequeñas dispersas
// alrededor con sensación de profundidad. Cada foto tiene un factor "depth"
// (0–1): las cercanas son más grandes, opacas y se mueven más; las lejanas,
// tenues y más lentas. Tres movimientos combinados en capas anidadas:
//   exterior → parallax de scroll · medio → parallax de ratón ·
//   interior → aproximación: cada foto viene hacia el espectador en bucle
//   (crece, se separa del centro acelerando y se funde al "pasar de largo")
// Posición (left/top en %), ancho y profundidad de cada hueco se ajustan aquí:
// Nube compacta y homogénea alrededor del titular: retícula de 4 bandas
// concentrada en el centro del lienzo (10%–78%), tamaños en un rango estrecho
// (110–200) para que ninguna foto domine y el conjunto se lea como un todo.
const LAYOUT = [
  { left: "12%", top: "10%", w: 205, depth: 0.8 },
  { left: "28%", top: "9%", w: 170, depth: 0.5 },
  { left: "45%", top: "11%", w: 145, depth: 0.35 },
  { left: "60%", top: "8%", w: 180, depth: 0.6 },
  { left: "74%", top: "12%", w: 205, depth: 0.85 },
  { left: "6%", top: "31%", w: 240, depth: 1 },
  { left: "24%", top: "29%", w: 145, depth: 0.3 },
  { left: "43%", top: "30%", w: 130, depth: 0.25 },
  { left: "61%", top: "28%", w: 150, depth: 0.35 },
  { left: "78%", top: "32%", w: 240, depth: 1 },
  { left: "27%", top: "58%", w: 170, depth: 0.55 },
  { left: "38%", top: "54%", w: 150, depth: 0.4 },
  { left: "50%", top: "52%", w: 160, depth: 0.45 },
  { left: "65%", top: "54%", w: 175, depth: 0.55 },
  { left: "74%", top: "60%", w: 190, depth: 0.7 },
  { left: "8%", top: "66%", w: 200, depth: 0.75 },
  { left: "26%", top: "70%", w: 210, depth: 0.85 },
  { left: "48%", top: "72%", w: 220, depth: 0.9 },
  { left: "66%", top: "68%", w: 205, depth: 0.8 },
  { left: "82%", top: "66%", w: 180, depth: 0.6 },
];

// Móvil: solo se ven las fotos con depth >= 0.5 (9 de las 15). En pantallas
// estrechas el LAYOUT de escritorio las deja pegadas a los bordes con huecos
// enormes entre ellas — aquí van posiciones propias, más juntas y centradas.
// Solo hacen falta entradas para los índices visibles en móvil; el resto
// copia el valor de escritorio (da igual, quedan ocultas).
const MOBILE_LAYOUT = LAYOUT.map((slot, i) => {
  const compact = {
    0: { left: "6%", top: "5%" },
    1: { left: "30%", top: "9%" },
    3: { left: "54%", top: "5%" },
    4: { left: "72%", top: "17%" },
    5: { left: "4%", top: "31%" },
    9: { left: "58%", top: "29%" },
    10: { left: "14%", top: "64%" },
    13: { left: "38%", top: "60%" },
    14: { left: "58%", top: "72%" },
  };
  return compact[i] ? { ...slot, ...compact[i] } : slot;
});

export default function HeroConstellation({ name, role, images }) {
  const sectionRef = useRef(null);

  useIsoLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const section = sectionRef.current;
    const items = gsap.utils.toArray(section.querySelectorAll("[data-const-item]"));
    let onMove = null;
    const dragCleanups = [];

    const ctx = gsap.context(() => {
      // entrada: aparecen escalonadas mientras se retira el preloader
      // (fromTo con final explícito — from() puede capturar 0 con StrictMode)
      items.forEach((el) => {
        const baseOpacity = parseFloat(el.dataset.opacity) || 1;
        gsap.fromTo(
          el,
          { opacity: 0 },
          {
            opacity: baseOpacity,
            duration: 1.2,
            ease: "power2.out",
            delay: 1.1 + gsap.utils.random(0, 0.7),
          },
        );
      });

      // en pantallas pequeñas los ciclos van más lentos: menos frenesí
      const slowdown = window.innerWidth < 768 ? 1.4 : 1;

      items.forEach((el, i) => {
        // fotos ocultas en móvil (display:none): sin animaciones ni triggers
        if (!el.offsetParent) return;
        const depth = parseFloat(el.dataset.depth) || 0.5;
        const motion = el.querySelector("[data-const-motion]");

        // FLOTADO PERPETUO en su sitio (como Floema): la foto no nace ni sale,
        // siempre está ahí y deriva muy suavemente alrededor de su posición
        // "base", con amplitud proporcional a su profundidad. La base puede
        // cambiar: si el usuario arrastra la foto, el vaivén continúa alrededor
        // del punto donde la haya soltado.
        const amp = 10 + depth * 22; // px de deriva (las cercanas se mueven más)
        const makeFloat = (baseX, baseY) => {
          const tl = gsap.timeline({ repeat: -1, yoyo: true });
          tl.fromTo(
            motion,
            { x: baseX, y: baseY },
            {
              x: baseX + gsap.utils.random(-amp, amp),
              y: baseY + gsap.utils.random(-amp, amp),
              rotation: gsap.utils.random(-3, 3),
              duration: gsap.utils.random(7, 11) * slowdown,
              ease: "sine.inOut",
            },
          );
          return tl;
        };
        let float = makeFloat(0, 0);
        // cada foto arranca en una fase distinta de su vaivén
        float.progress(gsap.utils.random(0, 1));

        // arrastre con el ratón: mata su flotado, la foto sigue al cursor y al
        // soltarla SE QUEDA donde el usuario la deje — el vaivén se reanuda
        // alrededor de esa nueva posición
        if (window.matchMedia("(pointer: fine)").matches) {
          let dragging = false;
          let sx = 0, sy = 0, bx = 0, by = 0, px = 0, py = 0;
          const origZ = el.style.zIndex;
          // seguimiento elástico: se crean FRESCOS en cada agarre — matar el
          // tween interno de un quickTo lo inutiliza para siempre, y eso
          // impedía volver a mover una foto ya soltada
          let followX = null;
          let followY = null;

          const down = (e) => {
            e.preventDefault();
            dragging = true;
            float.kill(); // el vaivén actual muere: se recreará donde la suelte
            try {
              el.setPointerCapture(e.pointerId);
            } catch {}
            gsap.set(el, { zIndex: 15 });
            // "levantar" la foto: crece un pelín al agarrarla
            gsap.to(el, { scale: 1.08, duration: 0.45, ease: "power3.out" });
            followX = gsap.quickTo(motion, "x", {
              duration: 0.35,
              ease: "power3.out",
            });
            followY = gsap.quickTo(motion, "y", {
              duration: 0.35,
              ease: "power3.out",
            });
            sx = px = e.clientX;
            sy = py = e.clientY;
            bx = gsap.getProperty(motion, "x");
            by = gsap.getProperty(motion, "y");
          };
          const move = (e) => {
            if (!dragging || !followX) return;
            px = e.clientX;
            py = e.clientY;
            followX(bx + e.clientX - sx);
            followY(by + e.clientY - sy);
          };
          const up = () => {
            if (!dragging) return;
            dragging = false;
            if (followX) {
              followX.tween && followX.tween.kill();
              followY.tween && followY.tween.kill();
              followX = followY = null;
            }
            gsap.to(el, { scale: 1, duration: 0.6, ease: "power3.out" });
            gsap.set(el, { zIndex: origZ });
            // la foto se queda aquí: nuevo vaivén alrededor de este punto
            float = makeFloat(
              gsap.getProperty(motion, "x"),
              gsap.getProperty(motion, "y"),
            );
          };

          el.addEventListener("pointerdown", down);
          el.addEventListener("pointermove", move);
          el.addEventListener("pointerup", up);
          el.addEventListener("pointercancel", up);
          dragCleanups.push(() => {
            el.removeEventListener("pointerdown", down);
            el.removeEventListener("pointermove", move);
            el.removeEventListener("pointerup", up);
            el.removeEventListener("pointercancel", up);
          });
        }

        // parallax de scroll al abandonar la sección (capa exterior)
        gsap.to(el, {
          y: () => depth * -90,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      // parallax de ratón (capa media): las cercanas siguen más al cursor
      if (window.matchMedia("(pointer: fine)").matches) {
        const movers = items.map((el) => {
          const wrap = el.querySelector("[data-const-mouse]");
          const depth = parseFloat(el.dataset.depth) || 0.5;
          return {
            depth,
            xTo: gsap.quickTo(wrap, "x", { duration: 1, ease: "power3.out" }),
            yTo: gsap.quickTo(wrap, "y", { duration: 1, ease: "power3.out" }),
          };
        });
        onMove = (e) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          movers.forEach(({ depth, xTo, yTo }) => {
            xTo(-nx * 44 * depth);
            yTo(-ny * 32 * depth);
          });
        };
        window.addEventListener("mousemove", onMove, { passive: true });
      }
    }, section);

    return () => {
      if (onMove) window.removeEventListener("mousemove", onMove);
      dragCleanups.forEach((fn) => fn());
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="w-full">
      {/* DESKTOP: constelación flotante (h-svh) */}
      <div className="relative hidden h-svh w-full overflow-hidden md:block">
        {images.map((img, i) => {
        const slot = LAYOUT[i % LAYOUT.length];
        const mobileSlot = MOBILE_LAYOUT[i % MOBILE_LAYOUT.length];
        return (
          <div
            key={img.src + i}
            data-const-item
            data-depth={slot.depth}
            data-opacity={(0.22 + slot.depth * 0.78).toFixed(2)}
            className={`const-item absolute cursor-grab select-none will-change-transform active:cursor-grabbing ${
              slot.depth < 0.5 ? "hidden md:block" : ""
            }`}
            style={{
              "--m-left": mobileSlot.left,
              "--m-top": mobileSlot.top,
              "--d-left": slot.left,
              "--d-top": slot.top,
              width: `clamp(70px, ${(slot.w / 14.4).toFixed(2)}vw, ${slot.w}px)`,
              opacity: 0.22 + slot.depth * 0.78,
              // las fotos se apilan entre sí por profundidad, pero SIEMPRE
              // por debajo del titular (z-20); al arrastrar suben a 15
              zIndex: Math.round(slot.depth * 10),
            }}
          >
            <div data-const-mouse className="will-change-transform">
              <div data-const-motion className="will-change-transform">
                <img
                  src={img.src}
                  alt={img.alt}
                  draggable={false}
                  className="pointer-events-none h-auto w-full"
                />
              </div>
            </div>
          </div>
        );
      })}

        {/* nombre + rol centrados */}
        <div className="pointer-events-none relative z-20 flex h-full flex-col items-center justify-center px-5 text-center">
          <TextReveal
            as="h1"
            text={name}
            className="max-w-5xl text-4xl font-light leading-[1.15] tracking-tight md:text-6xl"
            delay={0.9}
          />
          <TextReveal
            as="p"
            text={role}
            className="mt-4 max-w-2xl text-base font-light tracking-tight text-ink/70 md:mt-6 md:text-xl"
            delay={1.05}
          />
        </div>
      </div>

      {/* MOBILE: cuadrícula simple de fotos + nombre y claim */}
      <div className="flex flex-col md:hidden">
        {/* nombre + rol */}
        <div className="flex h-48 flex-col items-center justify-center px-5 text-center">
          <TextReveal
            as="h1"
            text={name}
            className="max-w-5xl text-3xl font-light leading-[1.15] tracking-tight"
            delay={0.9}
          />
          <TextReveal
            as="p"
            text={role}
            className="mt-3 max-w-2xl text-sm font-light tracking-tight text-ink/70"
            delay={1.05}
          />
        </div>

        {/* cuadrícula 2 columnas */}
        <div className="grid grid-cols-2 gap-3 px-5 pb-8">
          {images.map((img, i) => (
            <div key={img.src + i} className="aspect-square overflow-hidden rounded-sm">
              <img
                src={img.src}
                alt={img.alt}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
