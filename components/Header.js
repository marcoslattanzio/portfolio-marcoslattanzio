"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/hooks";
import { site, nav, socials } from "@/data/content";
import ThemeToggle from "@/components/ThemeToggle";

// Header fijo minimalista: transparente arriba, se oculta al bajar y reaparece
// al subir, con fondo crema + blur al despegarse del top. Incluye el menú
// móvil overlay a pantalla completa con entrada escalonada.
export default function Header() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const overlayRef = useRef(null);

  // sección activa, con rutas normalizadas (con o sin barra final) y
  // contando las subrutas: dentro de un proyecto, "Proyectos" sigue activo
  const normPath = (p) => (p || "/").replace(/\/+$/, "") || "/";
  const isActive = (href) => {
    const p = normPath(pathname);
    const h = normPath(href);
    return h === "/" ? p === "/" : p === h || p.startsWith(h + "/");
  };

  // transición entre secciones: funde la página actual antes de navegar;
  // la nueva entra con el fade del template
  const navTo = (e, href) => {
    if (href === pathname) {
      e.preventDefault();
      return;
    }
    if (prefersReducedMotion()) return; // navegación normal
    e.preventDefault();
    const main = document.querySelector("main");
    gsap.to(main, {
      opacity: 0,
      y: -12,
      duration: 0.25,
      ease: "power2.in",
      onComplete: () => router.push(href),
    });
  };

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      if (Math.abs(y - lastY) > 8) {
        setHidden(y > lastY && y > 160);
        lastY = y;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // cerrar el menú al navegar
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // animación de apertura del overlay + bloqueo de scroll
  useEffect(() => {
    if (open) {
      window.__lenis?.stop();
      document.documentElement.classList.add("overflow-hidden");
      const items = overlayRef.current?.querySelectorAll("[data-menu-item]");
      if (items?.length) {
        gsap.fromTo(
          items,
          { yPercent: 120, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.07,
            delay: 0.15,
          },
        );
      }
    } else {
      window.__lenis?.start();
      document.documentElement.classList.remove("overflow-hidden");
    }
    return () => {
      window.__lenis?.start();
      document.documentElement.classList.remove("overflow-hidden");
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[70] transition-[translate,transform,background-color,border-color] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          hidden && !open ? "-translate-y-full" : "translate-y-0"
        } ${
          scrolled && !open
            ? "border-b border-line/40 bg-cream/30 backdrop-blur-2xl backdrop-saturate-[1.8]"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-5 md:px-10">
          <Link
            href="/"
            onClick={(e) => navTo(e, "/")}
            className="text-sm font-normal uppercase tracking-[0.18em]"
          >
            {site.name}
          </Link>

          {/* nav escritorio */}
          <nav className="hidden items-baseline gap-9 md:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => navTo(e, item.href)}
                className={`u-line text-sm font-light tracking-wide ${
                  isActive(item.href) ? "u-line-active" : ""
                }`}
              >
                {item.label}
              </Link>
            ))}
            <ThemeToggle />
          </nav>

          {/* botón menú móvil: 3 barras que se funden en una X */}
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="relative flex h-9 w-9 items-center justify-center md:hidden"
            aria-expanded={open}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
          >
            <span
              className={`absolute h-px w-6 bg-ink transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                open ? "rotate-45" : "-translate-y-[7px]"
              }`}
            />
            <span
              className={`absolute h-px w-6 bg-ink transition-all duration-300 ease-out ${
                open ? "scale-x-0 opacity-0" : ""
              }`}
            />
            <span
              className={`absolute h-px w-6 bg-ink transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                open ? "-rotate-45" : "translate-y-[7px]"
              }`}
            />
          </button>
        </div>
      </header>

      {/* overlay móvil a pantalla completa: cortina que baja con clip-path */}
      <div
        ref={overlayRef}
        className={`fixed inset-0 z-[60] flex flex-col justify-between bg-cream/70 px-5 pb-10 pt-32 backdrop-blur-2xl backdrop-saturate-[1.8] transition-[clip-path] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden ${
          open
            ? "[clip-path:inset(0_0_0%_0)]"
            : "pointer-events-none [clip-path:inset(0_0_100%_0)]"
        }`}
        aria-hidden={!open}
      >
        <nav className="flex flex-col gap-2">
          {nav.map((item) => (
            <div key={item.href} className="overflow-hidden">
              <Link
                data-menu-item
                href={item.href}
                onClick={(e) => navTo(e, item.href)}
                className={`block text-5xl font-light leading-[1.15] tracking-tight ${
                  isActive(item.href) ? "text-accent" : ""
                }`}
              >
                {item.label}
              </Link>
            </div>
          ))}
        </nav>

        <div className="flex flex-col gap-6">
          <div className="overflow-hidden">
            <div data-menu-item>
              <ThemeToggle />
            </div>
          </div>
          <div className="overflow-hidden">
            <a data-menu-item href={`mailto:${site.email}`} className="block text-sm">
              {site.email}
            </a>
          </div>
          <div className="flex gap-5">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="u-line text-sm text-muted"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
