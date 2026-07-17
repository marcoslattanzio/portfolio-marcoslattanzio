import { notFound } from "next/navigation";
import { projects, getProject } from "@/data/content";
import TextReveal from "@/components/TextReveal";
import ImageReveal from "@/components/ImageReveal";
import ParallaxImage from "@/components/ParallaxImage";
import VideoEmbed from "@/components/VideoEmbed";
import NextProjectCard from "@/components/NextProjectCard";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = getProject(slug);
  return { title: project ? project.title : "Proyecto" };
}

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = projects.findIndex((p) => p.slug === slug);
  const next = projects[(index + 1) % projects.length];
  const categoryLabel = project.category === "film" ? "Film" : "Fotografía";

  return (
    <article className="pb-28 md:pb-44">
      {/* hero: la portada a sangre completa — la transición desde la lista
          expande esta misma imagen, así el aterrizaje es continuo */}
      <header className="relative h-svh w-full overflow-hidden">
        <ParallaxImage
          src={project.cover}
          alt={project.title}
          speed={0.7}
          className="absolute inset-0 h-full w-full"
        />
        {/* velo inferior literal: siempre sobre foto, en ambos temas */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 z-10 mx-auto max-w-[1600px] px-5 pb-12 md:px-10 md:pb-16">
          <p className="mb-4 text-xs uppercase tracking-[0.18em] text-[#f2f1ec]/80">
            ({String(index + 1).padStart(2, "0")}) — {categoryLabel} —{" "}
            {project.year}
          </p>
          <TextReveal
            as="h1"
            text={project.title}
            className="text-[12vw] font-light leading-[0.98] tracking-tight text-[#f2f1ec] md:text-[7vw]"
            delay={0.7}
          />
        </div>
      </header>

      {/* ficha */}
      <section className="mx-auto max-w-[1600px] px-5 pt-16 md:px-10 md:pt-24">
        <dl className="grid max-w-3xl grid-cols-2 gap-8 border-t border-line pt-6 text-sm font-light md:grid-cols-3">
          <div>
            <dt className="mb-1 text-xs uppercase tracking-[0.18em] text-muted">
              Año
            </dt>
            <dd>{project.year}</dd>
          </div>
          <div>
            <dt className="mb-1 text-xs uppercase tracking-[0.18em] text-muted">
              Cliente
            </dt>
            <dd>{project.client}</dd>
          </div>
          <div className="col-span-2 md:col-span-1">
            <dt className="mb-1 text-xs uppercase tracking-[0.18em] text-muted">
              Categoría
            </dt>
            <dd>{categoryLabel}</dd>
          </div>
        </dl>
        <p className="mt-10 max-w-2xl text-lg font-light leading-relaxed text-ink/85 md:text-xl">
          {project.description}
        </p>
      </section>

      {/* vídeo */}
      <div className="mx-auto mt-16 max-w-[1200px] px-5 md:mt-28 md:px-10">
        <VideoEmbed url={project.videoUrl} title={project.title} />
      </div>

      {/* galería con los bloques explicativos al lado: filas alternadas
          imagen ↔ texto (las imágenes sin texto ocupan más ancho) */}
      <div className="mx-auto mt-16 max-w-[1600px] space-y-16 px-5 md:mt-28 md:space-y-28 md:px-10">
        {project.gallery.map((src, i) => {
          const section = project.sections?.[i];
          const flip = i % 2 === 1;
          return (
            <div
              key={src + i}
              className="grid items-center gap-8 md:grid-cols-12"
            >
              <ImageReveal
                src={src}
                alt={`${project.title} — imagen ${i + 1}`}
                className={
                  section
                    ? `aspect-[4/3] md:col-span-7 ${flip ? "md:order-2 md:col-start-6" : ""}`
                    : `aspect-[16/9] md:col-span-10 ${flip ? "md:col-start-3" : ""}`
                }
              />
              {section && (
                <div
                  className={`md:col-span-4 ${
                    flip ? "md:order-1 md:col-start-1" : "md:col-start-9"
                  }`}
                >
                  <h2 className="text-xs uppercase tracking-[0.18em] text-muted">
                    <span className="mr-2">
                      ({String(i + 1).padStart(2, "0")})
                    </span>
                    {section.heading}
                  </h2>
                  <p className="mt-5 text-base font-light leading-relaxed text-ink/85">
                    {section.text}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* siguiente proyecto: preview atenuada con transición inmersiva */}
      <div className="mx-auto mt-24 max-w-[1600px] px-5 md:mt-40 md:px-10">
        <NextProjectCard project={next} />
      </div>
    </article>
  );
}
