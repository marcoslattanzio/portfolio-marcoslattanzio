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
            className="absolute right-5 bottom-6 z-20 md:right-10 md:bottom-10 text-white bg-black/40 hover:bg-black/60 backdrop-blur-sm px-3 py-2 rounded text-xs uppercase tracking-wider transition"
            aria-label={isMuted ? "Unmute video" : "Mute video"}
          >
            {isMuted ? "🔊 Unmute" : "🔇 Mute"}
          </button>
        </>
      ) : (
        <img src={image} alt="" className={mediaClass} />
      )}
    </div>
  );
}
