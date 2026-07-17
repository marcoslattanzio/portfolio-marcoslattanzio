"use client";

import { useRouter } from "next/navigation";
import { prefersReducedMotion } from "@/lib/hooks";
import { expandIntoProject } from "@/lib/transition";
import ImageReveal from "@/components/ImageReveal";

// Tarjeta de proyecto: la imagen escala 1.0 → 1.05 dentro de su contenedor
// (overflow hidden) y el año/categoría aparecen al hacer hover. Al clicar,
// la portada se expande a pantalla completa (transición inmersiva).
export default function ProjectCard({
  project,
  index,
  aspect = "aspect-[4/5]",
  className = "",
}) {
  const categoryLabel = project.category === "film" ? "Film" : "Fotografía";
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
      className={`group block ${className}`}
    >
      <div className={`relative ${aspect} overflow-hidden`}>
        <ImageReveal
          src={project.cover}
          alt={project.title}
          className="h-full w-full"
          imgClassName="transition-[transform,scale] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
        />
      </div>

      <div className="mt-4 flex items-baseline justify-between">
        <p className="text-base font-light transition-colors duration-300 group-hover:text-accent">
          {typeof index === "number" && (
            <span className="mr-2 text-xs text-muted">
              ({String(index + 1).padStart(2, "0")})
            </span>
          )}
          {project.title}
        </p>
        <p className="translate-y-1 text-xs font-light text-accent opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          {categoryLabel} — {project.year}
        </p>
      </div>
    </a>
  );
}
