"use client";

import Link from "next/link";
import { projects } from "@/data/content";
import { useContent } from "@/components/ContentProvider";
import HeroConstellation from "@/components/HeroConstellation";
import HeroMedia from "@/components/HeroMedia";
import HeroText from "@/components/HeroText";
import TextReveal from "@/components/TextReveal";
import FeaturedAccordion from "@/components/FeaturedAccordion";
import Marquee from "@/components/Marquee";
import StatementStack from "@/components/StatementStack";
import FilmstripSection from "@/components/FilmstripSection";

export default function HomePage() {
  // el contenido llega del proveedor para que el panel pueda sustituirlo en
  // la vista previa; los proyectos tienen su propio panel y van aparte
  const { home, site } = useContent();

  // Cada proyecto lleva su puesto en la portada (0 = no destacado). Antes esto
  // era una lista fija en content.js, que el panel de /admin no toca: para
  // rotarlos había que editar el código.
  const featured = projects
    .filter((p) => p.featured > 0)
    .sort((a, b) => a.featured - b.featured);

  return (
    <>
      {/* APERTURA: constelación de fotos flotando alrededor de la frase */}
      <HeroConstellation
        name={home.constellation.name}
        role={home.constellation.role}
        images={home.constellation.images}
      />

      {/* VÍDEO a pantalla completa con el nombre */}
      {/* El 16:9 manda en todos los tamaños. Antes en escritorio se imponía
          h-svh, la sección dejaba de ser 16:9 y el vídeo se recortaba por los
          lados para rellenarla. */}
      <section className="relative aspect-[16/9] w-full">
        <HeroMedia
          video={home.hero.video}
          image={home.hero.image}
          className="absolute inset-0 h-full w-full"
        />
        <div className="absolute inset-0 bg-cream/25" />
        <HeroText title={home.hero.title} subtitle={home.hero.subtitle} />
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
