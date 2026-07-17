"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/hooks";
import { site } from "@/data/content";

// Pantalla inicial con el nombre, que se desvanece al cargar.
export default function Preloader() {
  const [done, setDone] = useState(false);
  const overlayRef = useRef(null);
  const nameRef = useRef(null);

  useEffect(() => {
    // la intro se enseña una vez por sesión: las recargas y visitas
    // posteriores entran directas (la web se siente mucho más ágil)
    let seen = false;
    try {
      seen = sessionStorage.getItem("introShown") === "1";
    } catch {}
    if (seen || prefersReducedMotion()) {
      setDone(true);
      return;
    }
    try {
      sessionStorage.setItem("introShown", "1");
    } catch {}
    document.documentElement.classList.add("overflow-hidden");

    const tl = gsap.timeline({
      onComplete: () => {
        document.documentElement.classList.remove("overflow-hidden");
        setDone(true);
      },
    });
    tl.fromTo(
      nameRef.current,
      { yPercent: 110 },
      { yPercent: 0, duration: 0.9, ease: "power3.out", delay: 0.15 },
    )
      .to(nameRef.current, { opacity: 0, duration: 0.5, ease: "power2.in" }, "+=0.55")
      .to(
        overlayRef.current,
        { yPercent: -100, duration: 0.9, ease: "power3.inOut" },
        "-=0.15",
      );

    return () => {
      tl.kill();
      document.documentElement.classList.remove("overflow-hidden");
    };
  }, []);

  if (done) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[90] flex items-center justify-center bg-cream"
      aria-hidden
    >
      <div className="overflow-hidden">
        <p
          ref={nameRef}
          className="text-[7vw] font-light leading-none tracking-tight md:text-5xl"
        >
          {site.name}
        </p>
      </div>
    </div>
  );
}
