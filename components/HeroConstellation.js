"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useIsoLayoutEffect, prefersReducedMotion } from "@/lib/hooks";
import TextReveal from "@/components/TextReveal";

// Apertura: el nombre y, debajo, las fotos en una sola tira.
//
// Antes esto era una "constelación" de fotos dispersas flotando alrededor del
// titular, arrastrables y con parallax de ratón. Se retiró: con 20 fotos la
// nube tapaba el nombre y ninguna se veía a un tamaño decente.
//
// La tira funciona distinto según el dispositivo, a propósito:
//   · móvil     → se desliza con el dedo, con imán de encuadre
//   · escritorio → avanza sola y en continuo, porque no hay dedo que deslizar
// El aspecto es el mismo en ambos; lo único que cambia es quién la mueve.

// píxeles por segundo del avance automático. Lento a propósito: es un fondo
// del que se mira una foto al pasar, no un carrusel que exige atención.
const SPEED = 46;

export default function HeroConstellation({ name, role, images }) {
  const sectionRef = useRef(null);

  /* ---------------------------------------------------- móvil: se desliza */
  // Va en su propio efecto porque el desplazamiento es nativo: el enfoque y el
  // progreso deben seguir funcionando aunque el sistema pida menos animación
  // — lo único que se salta entonces es la entrada.
  useIsoLayoutEffect(() => {
    const strip = sectionRef.current?.querySelector("[data-hero-strip]");
    if (!strip) return;

    const cards = gsap.utils.toArray(strip.querySelectorAll("[data-hero-card]"));
    const bar = sectionRef.current.querySelector("[data-hero-progress]");
    if (!cards.length) return;

    const pictures = cards.map((card) => card.querySelector("[data-hero-img]"));

    // Se escribe el estilo a mano en vez de usar GSAP: esto corre en cada
    // fotograma del desplazamiento y son 20 fotos, así que cuanto menos haya
    // por medio, mejor. (Y gsap.quickSetter no aplica transformaciones sobre
    // elementos que GSAP no ha tocado antes: dejaba el scale sin efecto.)
    let queued = 0;
    const update = () => {
      queued = 0;

      // Se mide con coordenadas de pantalla y no con offsetLeft/scrollLeft:
      // el offsetParent de las tarjetas es el body, no la tira, así que
      // mezclarlos compara dos orígenes distintos. Hoy cuadra de casualidad
      // porque la tira empieza en el borde; con cualquier margen lateral el
      // foco se descolocaría en silencio.
      // El ancho se toma de offsetWidth a propósito: getBoundingClientRect
      // devuelve el ancho YA escalado por esta misma función, y usarlo se
      // realimentaría. El centro sí es fiable, porque la escala es central.
      const stripRect = strip.getBoundingClientRect();
      const middle = stripRect.left + stripRect.width / 2;

      // primero todas las lecturas y luego todas las escrituras: intercalarlas
      // obliga al navegador a recalcular la maquetación en cada vuelta
      const offsets = cards.map((card) => {
        const rect = card.getBoundingClientRect();
        // desvío con signo: -1 a la izquierda del centro, +1 a la derecha
        return Math.max(
          -1,
          Math.min(
            1,
            (rect.left + rect.width / 2 - middle) / card.offsetWidth,
          ),
        );
      });

      offsets.forEach((offset, i) => {
        const away = Math.abs(offset);
        cards[i].style.opacity = 1 - away * 0.55;
        cards[i].style.transform = `scale(${1 - away * 0.07})`;

        // la foto se retrasa respecto a su marco: da sensación de mirar por
        // una ventana en vez de arrastrar una lámina plana
        if (pictures[i]) {
          pictures[i].style.transform = `translateX(${offset * -5}%)`;
        }
      });

      // el pulgar mide un cuarto de la barra, así que puede recorrer tres
      // veces su propio ancho de un extremo al otro
      if (bar) {
        const room = strip.scrollWidth - strip.clientWidth;
        const progress = room > 0 ? strip.scrollLeft / room : 0;
        bar.style.transform = `translateX(${progress * 300}%)`;
      }
    };

    const onScroll = () => {
      if (!queued) queued = requestAnimationFrame(update);
    };
    strip.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    update();

    let entrance = null;
    if (!prefersReducedMotion()) {
      // entran escalonadas desde la derecha, ya con el preloader fuera: el
      // propio movimiento insinúa que la tira se desliza
      entrance = gsap.fromTo(
        cards.map((c) => c.querySelector("[data-hero-inner]")),
        { opacity: 0, xPercent: 14 },
        {
          opacity: 1,
          xPercent: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.06,
          delay: 1.15,
        },
      );
    }

    return () => {
      strip.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
      if (queued) cancelAnimationFrame(queued);
      entrance?.kill();
    };
  }, []);

  /* ------------------------------------------- escritorio: avanza sola */
  useIsoLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const track = sectionRef.current?.querySelector("[data-hero-track]");
    if (!track) return;

    const ctx = gsap.context(() => {
      const mq = gsap.matchMedia();

      mq.add("(min-width: 768px)", () => {
        let tween = null;
        let pending = 0;

        const build = () => {
          tween?.kill();
          gsap.set(track, { x: 0 });

          // La tira lleva el juego de fotos dos veces: hay que recorrer
          // exactamente un juego para que la copia quede donde estaba el
          // original y la repetición no se note.
          //
          // Ese recorrido NO es la mitad de scrollWidth. Con 40 fotos y 20
          // separaciones, la mitad vale 20 anchos + 19,5 separaciones, pero un
          // juego avanza 20 anchos + 20 separaciones: media separación de
          // menos, 8 px que se traducirían en un tirón en cada vuelta. Medir
          // de una foto a su copia da el valor exacto (la resta entre dos
          // offsetLeft es válida porque ambas cuelgan del mismo padre).
          const cards = track.children;
          const step =
            cards[cards.length / 2].offsetLeft - cards[0].offsetLeft;

          tween = gsap.to(track, {
            x: -step,
            duration: step / SPEED,
            ease: "none",
            repeat: -1,
          });
        };
        build();

        // el ancho de las tarjetas va en vw: si cambia la ventana, la mitad
        // que se recorre deja de ser la mitad y el bucle daría un tirón
        const onResize = () => {
          clearTimeout(pending);
          pending = setTimeout(build, 200);
        };
        window.addEventListener("resize", onResize);

        // frena al pasar el ratón, para poder detenerse en una foto
        const ease = (value) =>
          gsap.to(tween, { timeScale: value, duration: 0.7, overwrite: true });
        const slow = () => ease(0);
        const resume = () => ease(1);
        track.addEventListener("mouseenter", slow);
        track.addEventListener("mouseleave", resume);

        return () => {
          clearTimeout(pending);
          window.removeEventListener("resize", onResize);
          track.removeEventListener("mouseenter", slow);
          track.removeEventListener("mouseleave", resume);
          tween?.kill();
        };
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="w-full">
      {/* nombre + rol */}
      <div className="flex h-48 flex-col items-center justify-center px-5 text-center md:h-[34svh]">
        <TextReveal
          as="h1"
          text={name}
          className="max-w-5xl text-3xl font-light leading-[1.15] tracking-tight md:text-6xl"
          delay={0.9}
        />
        <TextReveal
          as="p"
          text={role}
          className="mt-3 max-w-2xl text-sm font-light tracking-tight text-ink/70 md:mt-6 md:text-xl"
          delay={1.05}
        />
      </div>

      {/* MÓVIL: se desliza con el dedo */}
      <div className="pb-12 md:hidden">
        {/* El relleno lateral vale (100 - 62) / 2 para que la primera y la
            última foto también puedan quedar centradas por el imán. */}
        <div
          data-hero-strip
          className="hero-strip flex snap-x snap-mandatory gap-3 overflow-x-auto px-[19vw]"
        >
          {images.map((img, i) => (
            <figure
              key={img.src + i}
              data-hero-card
              className="w-[62vw] shrink-0 snap-center will-change-transform"
            >
              <div
                data-hero-inner
                className="overflow-hidden rounded-[3px] will-change-transform"
              >
                {/* algo más ancha que su marco y recentrada: así queda
                    margen para desplazarla sin descubrir los bordes */}
                <img
                  src={img.src}
                  alt={img.alt}
                  draggable={false}
                  data-hero-img
                  className="-ml-[6%] aspect-[3/4] w-[112%] object-cover will-change-transform"
                />
              </div>
            </figure>
          ))}
        </div>

        {/* progreso: dice cuánto queda por deslizar sin añadir ruido */}
        <div className="mx-auto mt-7 h-px w-24 overflow-hidden bg-line">
          <div
            data-hero-progress
            className="h-full w-1/4 bg-ink will-change-transform"
          />
        </div>
      </div>

      {/* ESCRITORIO: la misma tira, avanzando sola */}
      <div className="hero-marquee hidden overflow-hidden pb-16 md:block">
        <div data-hero-track className="flex w-max gap-4 will-change-transform">
          {/* el juego va dos veces para que el bucle no tenga costura */}
          {[...images, ...images].map((img, i) => (
            <figure
              key={`${img.src}-${i}`}
              className="w-[clamp(215px,21vw,360px)] shrink-0"
              // la segunda copia es puramente visual: que no se lea dos veces
              aria-hidden={i >= images.length ? true : undefined}
            >
              <div className="overflow-hidden rounded-[3px]">
                <img
                  src={img.src}
                  alt={img.alt}
                  draggable={false}
                  className="aspect-[3/4] w-full object-cover"
                />
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
