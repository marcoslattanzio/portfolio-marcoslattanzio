"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useIsoLayoutEffect, prefersReducedMotion } from "@/lib/hooks";

// Revelado palabra por palabra ligado al scroll: las palabras arrancan tenues
// y se encienden a tinta según avanzas por la sección (scrub). El efecto
// característico de páginas editoriales de scroll.
export default function ScrollReveal({ as: Tag = "p", text, className = "" }) {
  const ref = useRef(null);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el || !el.offsetParent) return;

    const words = text.split(" ");
    el.innerHTML = words
      .map((w) => `<span class="reveal-word" style="display:inline-block">${w}</span>`)
      .join(" ");
    const spans = el.querySelectorAll(".reveal-word");

    if (prefersReducedMotion()) {
      gsap.set(spans, { opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(spans, { opacity: 0.16 });
      gsap.to(spans, {
        opacity: 1,
        ease: "none",
        stagger: 0.5,
        scrollTrigger: {
          trigger: el,
          start: "top 82%",
          end: "bottom 58%",
          scrub: true,
        },
      });
    }, el);

    return () => {
      ctx.revert();
      el.textContent = text;
    };
  }, [text]);

  return (
    <Tag ref={ref} className={className}>
      {text}
    </Tag>
  );
}
