import Link from "next/link";
import { site, nav, socials } from "@/data/content";
import BackToTop from "@/components/BackToTop";

// Footer: nombre grande, tres columnas iguales (menú, redes, contacto) y una
// barra inferior con ©, claim y volver arriba.
export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-[1600px] px-5 py-16 md:px-10 md:py-24">
        <p className="text-[12vw] font-light leading-none tracking-tight md:text-[7vw]">
          {site.name}
        </p>

        <div className="mt-12 grid grid-cols-1 gap-10 border-t border-line pt-10 sm:grid-cols-3 md:mt-16 md:gap-6">
          <div>
            <p className="mb-5 text-xs uppercase tracking-[0.18em] text-muted">
              Menú
            </p>
            <ul className="space-y-2.5">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="u-line text-sm font-light">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-5 text-xs uppercase tracking-[0.18em] text-muted">
              Redes
            </p>
            <ul className="space-y-2.5">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="u-line text-sm font-light"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-5 text-xs uppercase tracking-[0.18em] text-muted">
              Contacto
            </p>
            <ul className="space-y-2.5 text-sm font-light">
              <li>
                <a href={`mailto:${site.email}`} className="u-line">
                  {site.email}
                </a>
              </li>
              <li className="text-muted">{site.phone}</li>
              <li className="text-muted">{site.city}</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-line pt-6 md:mt-20 md:flex-row md:items-baseline md:justify-between">
          <p className="text-sm font-light text-muted">
            © {new Date().getFullYear()} {site.name}
          </p>
          <p className="text-sm font-light text-muted">{site.claim}</p>
          <BackToTop />
        </div>
      </div>
    </footer>
  );
}
