"use client";

import { useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useIsoLayoutEffect, prefersReducedMotion } from "@/lib/hooks";

// Medio del hero (vídeo o imagen de respaldo) con:
// - entrada suave al cargar: fade + zoom-out sincronizado con el preloader
// - parallax SIN salto: el rango empieza exactamente en la posición de carga
//   (start "top top"), así el primer gesto de scroll no corrige nada de golpe.
export default function HeroMedia({ video, image, className = "" }) {
  const wrapRef = useRef(null);
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

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
        <>
          <video
            ref={videoRef}
            src={video}
            poster={image}
            autoPlay
            muted={isMuted}
            loop
            playsInline
            className={mediaClass}
          />
          <button
            onClick={toggleMute}
            aria-label={isMuted ? "Activar sonido" : "Silenciar"}
            aria-pressed={!isMuted}
            className="group absolute bottom-6 right-5 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-black/25 text-white/90 backdrop-blur-md transition-colors duration-300 hover:border-white/50 hover:bg-black/45 md:bottom-10 md:right-10"
          >
            {/* icono de altavoz: las ondas se dibujan/borran al mutear */}
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 10v4h4l5 4V6L7 10H3z" fill="currentColor" stroke="none" />
              <path
                d="M15.5 8.5a5 5 0 0 1 0 7"
                className="origin-[13px_12px] transition-all duration-300 ease-out"
                style={{
                  opacity: isMuted ? 0 : 1,
                  transform: isMuted ? "scale(0.6)" : "scale(1)",
                }}
              />
              <path
                d="M18 6a9 9 0 0 1 0 12"
                className="origin-[13px_12px] transition-all duration-300 ease-out"
                style={{
                  opacity: isMuted ? 0 : 1,
                  transform: isMuted ? "scale(0.6)" : "scale(1)",
                }}
              />
              <path
                d="M16 9l5 6M21 9l-5 6"
                className="transition-all duration-300 ease-out"
                style={{
                  opacity: isMuted ? 1 : 0,
                  transform: isMuted ? "scale(1)" : "scale(0.6)",
                }}
              />
            </svg>
          </button>
        </>
      ) : (
        <img src={image} alt="" className={mediaClass} />
      )}
    </div>
  );
}
