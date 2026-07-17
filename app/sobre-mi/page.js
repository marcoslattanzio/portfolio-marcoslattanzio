import Link from "next/link";
import { about, site } from "@/data/content";
import TextReveal from "@/components/TextReveal";
import AboutHero from "@/components/AboutHero";
import Drift from "@/components/Drift";
import ServicesList from "@/components/ServicesList";

export const metadata = { title: "Sobre mí" };

export default function SobreMiPage() {
  return (
    <div className="pb-28 md:pb-44">
      {/* hero sándwich: retrato en medio del nombre, con parallax por capas */}
      <AboutHero
        name={site.name}
        image={about.portrait}
        claim={site.claim}
        city={site.city}
      />

      {/* bio: bloques e imágenes derivando a velocidades distintas */}
      <section className="mx-auto mt-24 max-w-[1600px] px-5 md:mt-40 md:px-10">
        <div className="grid gap-12 md:grid-cols-12 md:gap-6">
          <Drift speed={0.35} className="md:col-span-6">
            <TextReveal
              as="h2"
              text={about.intro}
              className="text-3xl font-light leading-[1.12] tracking-tight md:text-5xl"
            />
          </Drift>
          <Drift speed={-0.25} className="md:col-span-4 md:col-start-9 md:mt-28">
            <img
              src={about.gallery[0]}
              alt=""
              className="aspect-[3/4] w-full object-cover"
            />
          </Drift>
        </div>

        <div className="mt-16 grid gap-12 md:mt-10 md:grid-cols-12 md:gap-6">
          <Drift speed={-0.3} className="md:col-span-4 md:col-start-2">
            <img
              src={about.gallery[1]}
              alt=""
              className="aspect-[4/3] w-full object-cover"
            />
          </Drift>
          <Drift speed={0.3} className="md:col-span-5 md:col-start-7 md:mt-24">
            <div className="space-y-10">
              {about.bio.map((paragraph, i) => (
                <div key={i}>
                  <p className="mb-3 text-xs text-muted">
                    ({String(i + 1).padStart(2, "0")})
                  </p>
                  <p className="max-w-md text-lg font-light leading-relaxed text-ink/85 md:text-xl">
                    {paragraph}
                  </p>
                </div>
              ))}
            </div>
          </Drift>
        </div>
      </section>

      {/* servicios: palabra gigante al fondo derivando a contracorriente */}
      <section className="relative mx-auto mt-28 max-w-[1600px] overflow-hidden px-5 pb-10 md:mt-48 md:px-10">
        <Drift
          speed={-0.5}
          className="pointer-events-none absolute -right-8 top-6 select-none md:-right-16"
        >
          <p
            aria-hidden
            className="whitespace-nowrap font-serif text-[24vw] font-light italic leading-none text-ink/5 md:text-[16vw]"
          >
            Servicios
          </p>
        </Drift>

        <div className="relative">
          <p className="mb-4 text-xs uppercase tracking-[0.18em] text-muted">
            (01) — Servicios
          </p>
          <TextReveal
            as="h2"
            text="Lo que puedo hacer por tu proyecto"
            className="mb-12 max-w-3xl text-3xl font-light leading-[1.12] tracking-tight md:mb-20 md:text-5xl"
          />
          <ServicesList services={about.services} />
        </div>
      </section>

      {/* cierre hacia contacto */}
      <section className="mx-auto mt-28 max-w-[1600px] px-5 md:mt-44 md:px-10">
        <Drift speed={0.25}>
          <TextReveal
            as="p"
            text="¿Trabajamos juntos?"
            className="max-w-4xl text-4xl font-light leading-[1.05] tracking-tight md:text-7xl"
          />
          <Link
            href="/contacto"
            className="u-line mt-10 inline-block text-xl font-light md:text-2xl"
          >
            Hablemos →
          </Link>
        </Drift>
      </section>
    </div>
  );
}
