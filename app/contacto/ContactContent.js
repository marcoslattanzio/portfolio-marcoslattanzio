"use client";

import { useContent } from "@/components/ContentProvider";
import TextReveal from "@/components/TextReveal";
import ContactForm from "@/components/ContactForm";


// fila de contacto: etiqueta pequeña a la izquierda, valor grande a la derecha
function Row({ label, children }) {
  return (
    <div className="grid items-baseline gap-2 border-t border-line py-7 md:grid-cols-12 md:py-10">
      <p className="text-xs uppercase tracking-[0.18em] text-muted md:col-span-3">
        {label}
      </p>
      <div className="md:col-span-9">{children}</div>
    </div>
  );
}

export default function ContactContent() {
  const { contact, site, socials } = useContent();

  return (
    <div className="mx-auto max-w-[1600px] px-5 pb-28 pt-36 md:px-10 md:pb-44 md:pt-48">
      <p className="mb-4 text-xs uppercase tracking-[0.18em] text-muted">
        Contacto
      </p>
      <TextReveal
        as="h1"
        text={contact.title}
        className="text-[15vw] font-light leading-none tracking-tight md:text-[10vw]"
      />
      <TextReveal
        as="p"
        text={contact.text}
        className="mt-8 max-w-xl text-lg font-light leading-relaxed text-ink/85 md:text-xl"
        delay={0.2}
      />

      {/* ficha de contacto: filas a todo lo ancho, email y redes magnéticos */}
      <div className="mt-20 md:mt-28">
        <Row label="Email">
          <a
            href={`mailto:${site.email}`}
            className="u-line inline-block break-all text-2xl font-light tracking-tight md:text-5xl"
          >
            {site.email}
          </a>
        </Row>

        <Row label="Teléfono">
          <a
            href={`tel:${site.phone.replace(/\s/g, "")}`}
            className="u-line inline-block text-2xl font-light tracking-tight md:text-5xl"
          >
            {site.phone}
          </a>
        </Row>

        <Row label="Ubicación">
          <p className="text-2xl font-light tracking-tight md:text-5xl">
            {site.city}
          </p>
        </Row>

        <Row label="Redes">
          <div className="flex flex-wrap gap-x-10 gap-y-4">
            {socials.map((s, i) => (
              <a
                key={s.label}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="u-line text-xl font-light md:text-3xl"
              >
                <span className="mr-2 align-super text-xs text-muted">
                  ({String(i + 1).padStart(2, "0")})
                </span>
                {s.label}
              </a>
            ))}
          </div>
        </Row>
      </div>

      {/* formulario con calendario para proponer llamada */}
      <div className="mt-24 border-t border-line pt-10 md:mt-36 md:pt-14">
        <p className="mb-4 text-xs uppercase tracking-[0.18em] text-muted">
          Escríbeme
        </p>
        <TextReveal
          as="h2"
          text="Cuéntame tu proyecto"
          className="mb-12 text-3xl font-light leading-tight tracking-tight md:mb-16 md:text-5xl"
        />
        <ContactForm />
      </div>
    </div>
  );
}
