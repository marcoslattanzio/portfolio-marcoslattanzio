"use client";

import Link from "next/link";
import { TokenGate, useAdminToken } from "@/components/admin/ui";

// Puerta de entrada al panel: una vez dentro, se elige qué se va a tocar.
// El token se comprueba aquí y queda guardado, así que los dos paneles ya
// entran directos.

const PUERTAS = [
  {
    href: "/admin/proyectos",
    titulo: "Proyectos",
    texto:
      "Añadir, editar, reordenar o borrar proyectos, y elegir cuáles salen destacados en la portada.",
  },
  {
    href: "/admin/web",
    titulo: "Web general",
    texto:
      "Los textos y las fotos del resto de la web: portada, sobre mí, contacto, redes y menú. Con la web al lado para ir viendo los cambios.",
  },
];

export default function AdminHome() {
  const { token, setToken, loading, forget } = useAdminToken();

  if (loading) {
    return (
      <div className="px-5 py-32 text-center text-sm text-muted">Cargando…</div>
    );
  }

  if (!token) return <TokenGate onUnlock={setToken} />;

  return (
    <div className="mx-auto max-w-3xl px-5 py-16 md:py-24">
      <h1 className="text-3xl font-light tracking-tight md:text-4xl">Panel</h1>
      <p className="mt-2 text-sm font-light text-muted">
        ¿Qué quieres cambiar?
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {PUERTAS.map((puerta) => (
          <Link
            key={puerta.href}
            href={puerta.href}
            className="group rounded-2xl border border-line bg-ink/[0.02] p-6 transition-colors duration-200 hover:border-accent/50"
          >
            <p className="text-lg font-light transition-colors duration-200 group-hover:text-accent">
              {puerta.titulo}
            </p>
            <p className="mt-2 text-sm font-light leading-relaxed text-muted">
              {puerta.texto}
            </p>
          </Link>
        ))}
      </div>

      <button
        type="button"
        onClick={forget}
        className="mt-12 text-xs font-light text-muted underline-offset-4 transition-colors hover:text-ink hover:underline"
      >
        Olvidar el token en este navegador
      </button>
    </div>
  );
}
