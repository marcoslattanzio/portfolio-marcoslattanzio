"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "@/lib/gsap";
import { useIsoLayoutEffect, prefersReducedMotion } from "@/lib/hooks";
import { expandIntoProject } from "@/lib/transition";
import ProjectCard from "@/components/ProjectCard";

// Proyectos destacados como acordeón interactivo (escritorio): cuatro paneles
// altos a sangre; el panel bajo el cursor se ensancha con muelle suave, los
// demás se atenúan. El título/año viven sobre la imagen con velo inferior.
// En móvil (sin hover real) se muestran las tarjetas apiladas de siempre.
export default function FeaturedAccordion({ projects }) {
  const groupRef = useRef(null);
  const router = useRouter();

  // misma transición inmersiva que en la página de proyectos
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

  useIsoLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const group = groupRef.current;
    // en móvil el acordeón está display:none — sin medidas, sin trigger
    if (!group.offsetParent) return;

    // entrada: los paneles suben escalonados al llegar al viewport
    const ctx = gsap.context(() => {
      // fromTo con valores explícitos: gsap.from() captura el estado "actual"
      // como final y con el doble montaje de React puede quedarse en 0 → 0
      gsap.fromTo(
        group.children,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: group,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        },
      );
    }, group);

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* escritorio: acordeón */}
      <div
        ref={groupRef}
        className="acc-group hidden h-[72vh] gap-2 md:flex"
      >
        {projects.map((project, i) => {
          const categoryLabel =
            project.category === "film" ? "Film" : "Fotografía";
          return (
            <a
              key={project.slug}
              data-project-slug={project.slug}
              href={`/proyectos/${project.slug}`}
              onClick={(e) => openProject(e, project)}
              className="acc-item group relative min-w-0 overflow-hidden"
            >
              <img
                src={project.cover}
                alt={project.title}
                className="absolute inset-0 h-full w-full object-cover transition-[transform,scale] duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
              />
              {/* velo inferior literal: siempre sobre foto */}
              <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/60 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="text-[0.65rem] uppercase tracking-[0.2em] text-[#f2f1ec]/70">
                  ({String(i + 1).padStart(2, "0")})
                </p>
                <p className="mt-1 truncate text-lg font-light text-[#f2f1ec] transition-colors duration-300 group-hover:text-accent md:text-xl">
                  {project.title}
                </p>
                <p className="mt-1 max-h-0 overflow-hidden text-xs font-light text-[#f2f1ec]/80 opacity-0 transition-all duration-500 group-hover:max-h-6 group-hover:opacity-100">
                  {categoryLabel} — {project.year}
                </p>
              </div>
            </a>
          );
        })}
      </div>

      {/* móvil: tarjetas apiladas */}
      <div className="grid grid-cols-1 gap-y-14 sm:grid-cols-2 sm:gap-x-6 md:hidden">
        {projects.map((project, i) => (
          <ProjectCard
            key={project.slug}
            project={project}
            index={i}
            aspect="aspect-[3/4]"
          />
        ))}
      </div>
    </>
  );
}
