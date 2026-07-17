import Link from "next/link";
import { home, projects, site } from "@/data/content";
import HeroConstellation from "@/components/HeroConstellation";
import HeroMedia from "@/components/HeroMedia";
import TextReveal from "@/components/TextReveal";
import Collage from "@/components/Collage";
import FeaturedAccordion from "@/components/FeaturedAccordion";
import Marquee from "@/components/Marquee";
import StatementStack from "@/components/StatementStack";
import FilmstripSection from "@/components/FilmstripSection";

export default function HomePage() {
  const featured = home.featuredSlugs
    .map((slug) => projects.find((p) => p.slug === slug))
    .filter(Boolean);

  return (
    <>
      {/* APERTURA: constelación de fotos flotando alrededor de la frase */}
      <HeroConstellation
        tagline={home.constellation.tagline}
        images={home.constellation.images}
      />

      {/* VÍDEO a pantalla completa con el nombre */}
      <section className="relative h-svh w-full">
        <HeroMedia
          video={home.hero.video}
          image={home.hero.image}
          className="absolute inset-0 h-full w-full"
        />
        <div className="absolute inset-0 bg-cream/25" />
        <div className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-end px-5 pb-16 md:px-10 md:pb-20">
          <TextReveal
            as="h2"
            text={home.hero.title}
            className="text-[13vw] font-light leading-[0.95] tracking-tight md:text-[9vw]"
            delay={0.2}
          />
          <TextReveal
            as="p"
            text={home.hero.subtitle}
            className="mt-6 max-w-md text-sm font-light leading-relaxed text-ink/80 md:text-base"
            delay={0.5}
          />
        </div>
        <p className="absolute bottom-6 right-5 z-10 text-[0.65rem] uppercase tracking-[0.2em] text-muted md:right-10">
          Scroll
        </p>
      </section>

      {/* COLLAGE flotante con parallax */}
      <section className="mx-auto max-w-[1600px] px-5 py-28 md:px-10 md:py-44">
        <p className="mb-4 text-xs uppercase tracking-[0.18em] text-muted">
          {home.collage.eyebrow}
        </p>
        <TextReveal
          as="h2"
          text={home.collage.title}
          className="mb-16 max-w-3xl text-3xl font-light leading-[1.15] tracking-tight md:mb-28 md:text-5xl"
        />
        <Collage images={home.collage.images} />
      </section>

      {/* PROYECTOS DESTACADOS */}
      <section className="mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-36">
        <div className="mb-12 flex items-end justify-between border-t border-line pt-6 md:mb-20">
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.18em] text-muted">
              (02) — Trabajo
            </p>
            <TextReveal
              as="h2"
              text="Proyectos destacados"
              className="text-3xl font-light leading-tight tracking-tight md:text-5xl"
            />
          </div>
          <Link
            href="/proyectos"
            className="u-line hidden text-sm font-light md:inline-block"
          >
            Ver todos
          </Link>
        </div>

        <FeaturedAccordion projects={featured} />

        <Link
          href="/proyectos"
          className="u-line mt-12 inline-block text-sm font-light md:hidden"
        >
          Ver todos
        </Link>
      </section>

      {/* STATEMENTS apilados: se clavan en pantalla y se cubren entre sí */}
      <StatementStack items={home.statements} />

      {/* CARRETE: tira horizontal de fotos ligada al scroll vertical */}
      <FilmstripSection
        title={home.filmstrip.title}
        images={home.filmstrip.images}
      />

      {/* MARQUEE con el claim */}
      <section className="border-y border-line py-8 md:py-12">
        <Marquee
          text={site.claim}
          duration={38}
          className="text-[11vw] font-light leading-none tracking-tight md:text-[6.5vw]"
        />
      </section>

      {/* SOBRE MÍ (teaser) */}
      <section className="mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-36">
        <div className="grid gap-10 md:grid-cols-12">
          <p className="text-xs uppercase tracking-[0.18em] text-muted md:col-span-3">
            {home.aboutTeaser.eyebrow}
          </p>
          <div className="md:col-span-7">
            <TextReveal
              as="p"
              text={home.aboutTeaser.text}
              className="text-2xl font-light leading-[1.35] tracking-tight md:text-4xl"
            />
            <Link
              href="/sobre-mi"
              className="u-line mt-10 inline-block text-sm font-light"
            >
              {home.aboutTeaser.linkLabel}
            </Link>
          </div>
        </div>
      </section>

      {/* CTA final hacia contacto */}
      <section className="mx-auto max-w-[1600px] px-5 pb-28 md:px-10 md:pb-44">
        <div className="border-t border-line pt-6">
          <p className="mb-10 text-xs uppercase tracking-[0.18em] text-muted">
            {home.cta.eyebrow}
          </p>
          <TextReveal
            as="h2"
            text={home.cta.title}
            className="max-w-4xl text-4xl font-light leading-[1.05] tracking-tight md:text-7xl"
          />
          <Link
            href="/contacto"
            className="u-line mt-12 inline-block text-xl font-light md:text-2xl"
          >
            {home.cta.linkLabel} →
          </Link>
        </div>
      </section>
    </>
  );
}
