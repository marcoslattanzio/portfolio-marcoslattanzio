"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useIsoLayoutEffect, prefersReducedMotion } from "@/lib/hooks";

// Medio del hero (vídeo o imagen de respaldo) con:
// - entrada suave al cargar: fade + zoom-out sincronizado con el preloader
// - parallax SIN salto: el rango empieza exactamente en la posición de carga
//   (start "top top"), así el primer gesto de scroll no corrige nada de golpe.
export default function HeroMedia({ video, image, className = "" }) {
  const wrapRef = useRef(null);

  useIsoLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const wrap = wrapRef.current;
    const media = wrap.querySelector("video, img");

    const ctx = gsap.context(() => {
      // entrada: aparece mientras el preloader se retira
      gsap.fromTo(
        media,
        { opacity: 0, scale: 1.08 },
        { opacity: 1, scale: 1, duration: 1.8, delay: 1.1, ease: "power3.out" },
      );
      // parallax: en la carga vale 0 y crece solo al alejarse del top
      gsap.to(media, {
        yPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: wrap,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, wrap);

    return () => ctx.revert();
  }, []);

  const mediaClass =
    "absolute left-0 top-0 h-[115%] w-full object-cover will-change-transform";

  return (
    <div ref={wrapRef} className={`overflow-hidden ${className}`}>
      {video ? (
        <video
          src={video}
          poster={image}
          autoPlay
          muted
          loop
          playsInline
          className={mediaClass}
        />
      ) : (
        <img src={image} alt="" className={mediaClass} />
      )}
    </div>
  );
}
