"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useIsoLayoutEffect, prefersReducedMotion } from "@/lib/hooks";

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

// píxeles por segundo del avance automático en escritorio. Lento a propósito:
// es un fondo del que se mira una foto al pasar, no un carrusel que exige
// atención.
const SPEED = 46;

// móvil: cada cuánto salta a la siguiente foto, y cuánto espera para reanudar
// después de que sueltes el dedo
const STEP_EVERY = 4000;
const RESUME_AFTER = 1800;

export default function HeroConstellation({ eyebrow, badge, headline, images }) {
  const sectionRef = useRef(null);

  /* ------------------------------------------------- entrada del titular */
  useIsoLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // el retardo espera a que el preloader se retire
      gsap.fromTo(
        ["[data-hero-eyebrow]", "[data-hero-frase]"],
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: "power3.out",
          stagger: 0.12,
          delay: 0.95,
        },
      );
      gsap.fromTo(
        "[data-hero-chip]",
        { opacity: 0, scale: 0.6, rotate: -10 },
        {
          opacity: 1,
          scale: 1,
          rotate: 0,
          duration: 0.9,
          ease: "back.out(1.7)",
          delay: 1.05,
        },
      );
    }, section);

    return () => ctx.revert();
  }, []);

  /* ---------------------------------------------------- móvil: se desliza */
  // Va en su propio efecto porque el desplazamiento es nativo: el enfoque y el
  // progreso deben seguir funcionando aunque el sistema pida menos animación
  // — lo único que se salta entonces es la entrada.
  useIsoLayoutEffect(() => {
    const strip = sectionRef.current?.querySelector("[data-hero-strip]");
    if (!strip) return;

    const cards = gsap.utils.toArray(strip.querySelectorAll("[data-hero-card]"));
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

    /* -------- avance automático, con el dedo por encima de todo -------- */

    // paso = una foto con su hueco; juego = las fotos originales, sin la copia
    const stepWidth = () => cards[1].offsetLeft - cards[0].offsetLeft;
    const setWidth = () =>
      cards[cards.length / 2].offsetLeft - cards[0].offsetLeft;

    // El salto invisible del bucle: al pasar de un juego se retrocede uno
    // entero. Como el contenido se repite exactamente, en pantalla no cambia
    // nada; solo evita llegar al final de la tira y quedarse ahí parada.
    const wrap = () => {
      const set = setWidth();
      if (set > 0 && strip.scrollLeft >= set) strip.scrollLeft -= set;
    };

    let holding = false;
    let ticker = null;
    let resumeTimer = null;
    let step = null;
    let teardown = null;

    const advance = () => {
      if (holding || document.hidden) return;
      // El imán y una animación de scrollLeft se pelean: el navegador intenta
      // encajar la foto en cada fotograma y el movimiento sale a tirones. Se
      // desactiva mientras dura el salto y se devuelve al acabar, para que el
      // dedo lo siga teniendo.
      strip.style.scrollSnapType = "none";
      step = gsap.to(strip, {
        scrollLeft: strip.scrollLeft + stepWidth(),
        duration: 0.8,
        ease: "power2.inOut",
        onComplete: () => {
          strip.style.scrollSnapType = "";
          wrap();
        },
      });
    };

    const play = () => {
      clearInterval(ticker);
      ticker = setInterval(advance, STEP_EVERY);
    };
    const pause = () => {
      clearInterval(ticker);
      ticker = null;
    };

    // mientras tocas, la tira es tuya
    const grab = () => {
      holding = true;
      step?.kill();
      strip.style.scrollSnapType = "";
      pause();
      clearTimeout(resumeTimer);
    };
    const release = () => {
      if (!holding) return;
      holding = false;
      wrap();
      // un respiro antes de retomarlo: reanudar al instante se sentiría como
      // si te quitara la tira de las manos
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(play, RESUME_AFTER);
    };

    const auto = !prefersReducedMotion();

    if (auto) {
      strip.addEventListener("pointerdown", grab, { passive: true });
      window.addEventListener("pointerup", release, { passive: true });
      window.addEventListener("pointercancel", release, { passive: true });

      // fuera de la pantalla no tiene sentido que siga avanzando: gasta
      // batería y te la encuentras movida al volver arriba
      const io = new IntersectionObserver(
        ([entry]) => (entry.isIntersecting ? play() : pause()),
        { threshold: 0.15 },
      );
      io.observe(strip);

      const onVisibility = () => (document.hidden ? pause() : play());
      document.addEventListener("visibilitychange", onVisibility);

      teardown = () => {
        io.disconnect();
        document.removeEventListener("visibilitychange", onVisibility);
        strip.removeEventListener("pointerdown", grab);
        window.removeEventListener("pointerup", release);
        window.removeEventListener("pointercancel", release);
      };
    }

    return () => {
      strip.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
      if (queued) cancelAnimationFrame(queued);
      entrance?.kill();
      pause();
      clearTimeout(resumeTimer);
      step?.kill();
      teardown?.();
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
        let step = 0; // lo que recorre una vuelta; lo necesita el arrastre

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
          step = cards[cards.length / 2].offsetLeft - cards[0].offsetLeft;

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

        /* ---------------------------------------------------- arrastre */
        // La tira se puede coger y mover a mano. Al soltar no vuelve al
        // principio: se recoloca la animación en el punto donde se ha quedado
        // y sigue desde ahí, porque el recorrido es lineal y su progreso
        // equivale exactamente a la posición (x = -step · progreso).
        let dragging = false;
        let desdeX = 0;
        let desdePuntero = 0;

        const agarrar = (e) => {
          if (e.button !== 0 || !step) return;
          dragging = true;
          tween.pause();
          desdePuntero = e.clientX;
          desdeX = gsap.getProperty(track, "x");
          // no hace falta capturar el puntero: el seguimiento y el soltar
          // escuchan en window, así que el gesto no se pierde aunque el ratón
          // salga de la tira o de la ventana
          e.preventDefault(); // si no, el navegador arrastra la propia foto
        };

        const mover = (e) => {
          if (!dragging) return;
          // se envuelve dentro de una vuelta: así se puede arrastrar sin fin
          // en los dos sentidos, igual que avanzando sola
          gsap.set(track, {
            x: gsap.utils.wrap(-step, 0, desdeX + (e.clientX - desdePuntero)),
          });
        };

        const soltar = () => {
          if (!dragging) return;
          dragging = false;
          tween.progress(-gsap.getProperty(track, "x") / step);
          // sigue sola; si el ratón continúa encima, el frenado de hover la
          // mantiene quieta hasta que lo apartes
          tween.play();
        };

        track.addEventListener("pointerdown", agarrar);
        window.addEventListener("pointermove", mover);
        window.addEventListener("pointerup", soltar);
        window.addEventListener("pointercancel", soltar);

        return () => {
          clearTimeout(pending);
          window.removeEventListener("resize", onResize);
          track.removeEventListener("mouseenter", slow);
          track.removeEventListener("mouseleave", resume);
          track.removeEventListener("pointerdown", agarrar);
          window.removeEventListener("pointermove", mover);
          window.removeEventListener("pointerup", soltar);
          window.removeEventListener("pointercancel", soltar);
          tween?.kill();
        };
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="w-full">
      {/* Quién eres y a qué te dedico, de un vistazo. Antes aquí solo estaba el
          nombre grande: quien llegaba de fuera veía a una persona, pero no qué
          hacía. El memoji va dentro del titular, no al lado, para que ancle la
          frase en vez de flotar como un adorno. */}
      <div className="flex flex-col items-center justify-center px-5 py-20 text-center md:min-h-[34svh] md:py-24">
        <p
          data-hero-eyebrow
          className="mb-6 text-[0.65rem] uppercase tracking-[0.24em] text-muted md:mb-8 md:text-xs"
        >
          {eyebrow}
        </p>

        <h1 className="mx-auto max-w-4xl text-[1.75rem] font-light leading-[1.2] tracking-tight md:text-5xl md:leading-[1.15]">
          {badge && (
            <span
              data-hero-chip
              className="mr-2.5 inline-block h-9 w-9 -translate-y-1 overflow-hidden rounded-xl align-middle md:mr-4 md:h-14 md:w-14 md:rounded-2xl"
            >
              <img src={badge} alt="" className="h-full w-full object-cover" />
            </span>
          )}
          <span data-hero-frase>{headline}</span>
        </h1>
      </div>

      {/* MÓVIL: avanza sola y el dedo manda cuando la tocas */}
      <div className="pb-12 md:hidden">
        {/* El relleno lateral vale (100 - 62) / 2 para que las fotos queden
            centradas por el imán. El juego va dos veces, como en escritorio:
            al pasar de largo se retrocede un juego entero de golpe y, como el
            contenido se repite, en pantalla no se ve ningún salto. */}
        <div
          data-hero-strip
          className="swipe-x flex snap-x snap-mandatory gap-3 overflow-x-auto px-[19vw]"
        >
          {[...images, ...images].map((img, i) => (
            <figure
              key={`${img.src}-${i}`}
              data-hero-card
              className="w-[62vw] shrink-0 snap-center will-change-transform"
              aria-hidden={i >= images.length ? true : undefined}
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
      </div>

      {/* ESCRITORIO: la misma tira, avanzando sola */}
      <div className="hero-marquee hidden overflow-hidden pb-16 md:block">
        <div
          data-hero-track
          className="flex w-max cursor-grab select-none gap-7 will-change-transform active:cursor-grabbing"
        >
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
