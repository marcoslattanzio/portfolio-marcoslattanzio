"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "@/lib/gsap";
import { useIsoLayoutEffect, prefersReducedMotion } from "@/lib/hooks";
import { expandIntoProject } from "@/lib/transition";
import { projects, categories } from "@/data/content";

// Rejilla de proyectos: las portadas están a la vista desde el primer momento,
// alineadas y rectas. Al pasar el cursor, la tarjeta se levanta y se inclina
// en 3D siguiendo al ratón (efecto lámina); al hacer clic, la imagen se
// expande a pantalla completa y "entras" en el proyecto (la página de detalle
// abre con esa misma portada a sangre).

export default function ProjectsBoard() {
  const [filter, setFilter] = useState("todos");
  const gridRef = useRef(null);
  const router = useRouter();

  const visible = projects.filter(
    (p) => filter === "todos" || p.category === filter,
  );

  // entrada: las copias "caen" sobre la mesa escalonadas al llegar con el scroll
  useIsoLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const grid = gridRef.current;
    if (!grid.offsetParent) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        grid.children,
        { opacity: 0, y: 80 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: grid,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        },
      );
    }, grid);
    return () => ctx.revert();
  }, []);

  // tilt 3D + enderezado en hover (se re-monta al filtrar porque cambian las tarjetas)
  useIsoLayoutEffect(() => {
    if (
      prefersReducedMotion() ||
      !window.matchMedia("(pointer: fine)").matches
    )
      return;
    const grid = gridRef.current;
    const cleanups = [];

    grid.querySelectorAll("[data-board-card]").forEach((card) => {
      const inner = card.querySelector("[data-tilt]");
      gsap.set(inner, { transformPerspective: 850 });
      const rxTo = gsap.quickTo(inner, "rotationX", {
        duration: 0.5,
        ease: "power2.out",
      });
      const ryTo = gsap.quickTo(inner, "rotationY", {
        duration: 0.5,
        ease: "power2.out",
      });

      const enter = () => {
        gsap.to(card, {
          scale: 1.02,
          duration: 0.5,
          ease: "power3.out",
          overwrite: "auto",
        });
      };
      const move = (e) => {
        const r = card.getBoundingClientRect();
        const relX = (e.clientX - r.left) / r.width;
        const relY = (e.clientY - r.top) / r.height;
        rxTo((0.5 - relY) * 10);
        ryTo((relX - 0.5) * 12);
      };
      const leave = () => {
        gsap.to(card, {
          scale: 1,
          duration: 0.7,
          ease: "power3.out",
          overwrite: "auto",
        });
        rxTo(0);
        ryTo(0);
      };

      card.addEventListener("mouseenter", enter);
      card.addEventListener("mousemove", move);
      card.addEventListener("mouseleave", leave);
      cleanups.push(() => {
        card.removeEventListener("mouseenter", enter);
        card.removeEventListener("mousemove", move);
        card.removeEventListener("mouseleave", leave);
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, [filter]);

  // transición inmersiva: la portada de la tarjeta clicada crece hasta llenar
  // la pantalla y la página de detalle aterriza sobre esa misma imagen
  const openProject = (e, project) => {
    if (prefersReducedMotion()) return;
    e.preventDefault();
    expandIntoProject(
      e.currentTarget.querySelector("img"),
      project.cover,
      () => router.push(`/proyectos/${project.slug}`),
      project.slug,
    );
  };

  const applyFilter = (id) => {
    if (id === filter) return;
    const grid = gridRef.current;
    if (prefersReducedMotion() || !grid) {
      setFilter(id);
      return;
    }
    gsap.to(grid.children, {
      opacity: 0,
      y: 30,
      duration: 0.3,
      stagger: 0.04,
      ease: "power2.in",
      onComplete: () => {
        setFilter(id);
        requestAnimationFrame(() => {
          gsap.fromTo(
            grid.children,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.7, stagger: 0.07, ease: "power3.out" },
          );
        });
      },
    });
  };

  return (
    <div>
      {/* filtros */}
      <div className="flex flex-wrap gap-x-8 gap-y-3 border-t border-line pt-6">
        {categories.map((cat, i) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => applyFilter(cat.id)}
            className={`u-line text-sm font-light tracking-wide transition-colors ${
              filter === cat.id ? "u-line-active text-ink" : "text-muted"
            }`}
          >
            <span className="mr-1.5 text-[0.65rem]">
              ({String(i + 1).padStart(2, "0")})
            </span>
            {cat.label}
          </button>
        ))}
        <span className="ml-auto text-sm font-light text-muted">
          {visible.length} proyectos
        </span>
      </div>

      {/* mesa de trabajo */}
      <div
        ref={gridRef}
        className="mt-16 grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 md:mt-24 md:grid-cols-3 md:gap-x-10 md:gap-y-24"
      >
        {visible.map((project, i) => {
          const categoryLabel =
            project.category === "film" ? "Film" : "Fotografía";
          return (
            <a
              key={project.slug}
              data-board-card
              data-project-slug={project.slug}
              href={`/proyectos/${project.slug}`}
              onClick={(e) => openProject(e, project)}
              className="group block will-change-transform"
            >
              <div
                data-tilt
                className="aspect-[4/5] overflow-hidden will-change-transform"
              >
                <img
                  src={project.cover}
                  alt={project.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-[transform,scale] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                />
              </div>
              <div className="mt-4 flex items-baseline justify-between gap-4">
                <p className="min-w-0 truncate text-base font-light transition-colors duration-300 group-hover:text-accent">
                  <span className="mr-2 text-xs text-muted">
                    ({String(i + 1).padStart(2, "0")})
                  </span>
                  {project.title}
                </p>
                <p className="shrink-0 text-xs font-light text-muted">
                  {categoryLabel} — {project.year}
                </p>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
