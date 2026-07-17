import TextReveal from "@/components/TextReveal";
import ProjectsBoard from "@/components/ProjectsBoard";

export const metadata = { title: "Proyectos" };

export default function ProyectosPage() {
  return (
    <div className="mx-auto max-w-[1600px] px-5 pb-28 pt-36 md:px-10 md:pb-44 md:pt-48">
      <p className="mb-4 text-xs uppercase tracking-[0.18em] text-muted">
        Trabajo seleccionado
      </p>
      <TextReveal
        as="h1"
        text="Proyectos"
        className="mb-16 text-[13vw] font-light leading-none tracking-tight md:mb-24 md:text-[8vw]"
      />
      <ProjectsBoard />
    </div>
  );
}
