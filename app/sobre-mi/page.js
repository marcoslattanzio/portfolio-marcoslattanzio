import Link from "next/link";
import { about, site } from "@/data/content";
import TextReveal from "@/components/TextReveal";
import ScrollReveal from "@/components/ScrollReveal";
import AboutHero from "@/components/AboutHero";
import PortraitBleed from "@/components/PortraitBleed";
import ServicesList from "@/components/ServicesList";

export const metadata = { title: "Sobre mí" };

export default function SobreMiPage() {
  return (
    <div className="overflow-hidden bg-gradient-to-br from-cream to-emerald-50/30 pb-28 md:pb-44">
      {/* 1 — Declaración de apertura, centrada */}
      <AboutHero
        statement={about.statement}
        badge={about.badge}
        city={site.city}
        claim={site.claim}
      />

      {/* 2 — Retrato a sangre completa */}
      <PortraitBleed
        image={about.portrait}
        name={site.name}
        role={site.claim}
      />

      {/* 3 — Bloques de historia: etiqueta + revelado palabra a palabra */}
      <section className="mx-auto mt-28 max-w-[1600px] px-5 md:mt-44 md:px-10">
        <div className="space-y-28 md:space-y-44">
          {about.story.map((block, i) => (
            <div key={block.label} className="grid gap-8 md:grid-cols-12 md:gap-6">
              <div className="md:col-span-4">
                <div className="md:sticky md:top-28">
                  <p className="mb-4 text-xs uppercase tracking-[0.22em] text-muted">
                    ({String(i + 1).padStart(2, "0")})
                  </p>
                  <p className="font-serif text-4xl font-light italic leading-none text-accent md:text-6xl">
                    {block.label}
                  </p>
                </div>
              </div>
              <div className="md:col-span-7 md:col-start-6">
                <ScrollReveal
                  text={block.body}
                  className="text-2xl font-light leading-[1.35] tracking-tight text-ink md:text-4xl"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4 — Servicios: índice + marco sticky (sigue el tema, uniforme) */}
      <section className="mt-28 py-20 md:mt-44 md:py-32">
        <div className="mx-auto max-w-[1600px] px-5 md:px-10">
          <div className="mb-14 max-w-3xl md:mb-20">
            <p className="mb-4 text-xs uppercase tracking-[0.22em] text-muted">
              Servicios
            </p>
            <TextReveal
              as="h2"
              text="Lo que puedo hacer por tu proyecto"
              className="text-4xl font-light leading-[1.02] tracking-tight md:text-7xl"
            />
          </div>
          <ServicesList services={about.services} />
        </div>
      </section>

      {/* 5 — Cierre hacia contacto */}
      <section className="mx-auto mt-28 max-w-[1600px] px-5 text-center md:mt-44 md:px-10">
        <TextReveal
          as="p"
          text="Ya conoces mi historia, contemos la tuya."
          className="mx-auto max-w-4xl text-4xl font-light leading-[1.05] tracking-tight md:text-7xl"
        />
        <Link
          href="/contacto"
          className="u-line mt-10 inline-block text-xl font-light md:text-2xl"
        >
          Hablemos →
        </Link>
      </section>
    </div>
  );
}
