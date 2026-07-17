"use client";

import { useRouter } from "next/navigation";
import { prefersReducedMotion } from "@/lib/hooks";
import { expandIntoProject } from "@/lib/transition";

// Cierre de la página de proyecto: preview ancha y atenuada del siguiente.
// Al hacer clic, la imagen "se enciende" y se expande a pantalla completa con
// la misma transición inmersiva que la rejilla de proyectos.
export default function NextProjectCard({ project }) {
  const router = useRouter();

  const open = (e) => {
    if (prefersReducedMotion()) return;
    e.preventDefault();
    expandIntoProject(
      e.currentTarget.querySelector("img"),
      project.cover,
      () => router.push(`/proyectos/${project.slug}`),
      project.slug,
    );
  };

  return (
    <a
      data-project-slug={project.slug}
      href={`/proyectos/${project.slug}`}
      onClick={open}
      className="group block border-t border-line pt-6"
    >
      <p className="mb-8 text-xs uppercase tracking-[0.18em] text-muted">
        Siguiente proyecto
      </p>
      <div className="relative aspect-[16/8] w-full overflow-hidden md:aspect-[21/8]">
        <img
          src={project.cover}
          alt={project.title}
          className="h-full w-full object-cover opacity-50 saturate-50 transition-[opacity,filter,scale] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] group-hover:opacity-85 group-hover:saturate-100"
        />
        {/* velo inferior literal: siempre sobre foto */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
          <h2 className="text-3xl font-light leading-tight tracking-tight text-[#f2f1ec] md:text-6xl">
            {project.title}
            <span className="ml-4 inline-block transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-3">
              →
            </span>
          </h2>
        </div>
      </div>
    </a>
  );
}
