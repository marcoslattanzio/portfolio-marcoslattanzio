"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useIsoLayoutEffect, prefersReducedMotion } from "@/lib/hooks";

// Reveal de texto línea a línea: divide el texto en líneas reales (agrupando
// palabras por su posición vertical) y las hace entrar con desplazamiento
// vertical + fade, con stagger.
export default function TextReveal({
  as: Tag = "div",
  text,
  className = "",
  delay = 0,
}) {
  const ref = useRef(null);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    // elemento oculto: ni el troceado en líneas ni el trigger tendrían medidas
    if (!el.offsetParent) return;

    // 1) separar en palabras para poder medir dónde rompe cada línea
    const words = text.split(" ");
    el.innerHTML = words
      .map((w) => `<span style="display:inline-block">${w}</span>`)
      .join(" ");

    const spans = Array.from(el.children);
    const lines = [];
    let currentTop = null;
    spans.forEach((s) => {
      if (s.offsetTop !== currentTop) {
        lines.push([]);
        currentTop = s.offsetTop;
      }
      lines[lines.length - 1].push(s.textContent);
    });

    // 2) reconstruir con un contenedor overflow-hidden por línea
    el.innerHTML = lines
      .map(
        (line) =>
          `<span class="block overflow-hidden"><span class="tr-inner block will-change-transform">${line.join(" ")}</span></span>`,
      )
      .join("");

    const inners = el.querySelectorAll(".tr-inner");
    const ctx = gsap.context(() => {
      gsap.fromTo(
        inners,
        { yPercent: 115, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.1,
          ease: "power3.out",
          stagger: 0.09,
          delay,
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        },
      );
    }, el);

    return () => {
      ctx.revert();
      el.textContent = text;
    };
  }, [text, delay]);

  return (
    <Tag ref={ref} className={className}>
      {text}
    </Tag>
  );
}
