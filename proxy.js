import { NextResponse } from "next/server";

// Puerta de entrada a /admin: usuario y contraseña antes de servir nada.
//
// Esto corre en el servidor de Vercel, no en el navegador, así que la
// contraseña (que vive en las variables de entorno) nunca sale de ahí. Una
// comprobación hecha en el JavaScript de la página no serviría: el navegador
// se descarga ese código entero y cualquiera podría leerla.
//
// En Next 16 este archivo se llama proxy.js — antes era middleware.js.

export const config = {
  matcher: ["/admin", "/admin/", "/admin/:path*"],
};

// Comparación en tiempo constante: comparar con === se corta en la primera
// letra distinta, y ese tiempo de más es medible. Aquí siempre se recorre todo.
function safeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

function decodeCredentials(header) {
  const raw = atob(header.slice(6));
  // atob devuelve bytes: sin esto, una contraseña con ñ o acentos falla
  const text = new TextDecoder().decode(
    Uint8Array.from(raw, (c) => c.charCodeAt(0)),
  );
  const split = text.indexOf(":");
  if (split === -1) return null;
  return { user: text.slice(0, split), pass: text.slice(split + 1) };
}

const challenge = () =>
  new NextResponse("Acceso restringido", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Panel", charset="UTF-8"',
      // que ninguna caché intermedia guarde una respuesta de esta ruta
      "Cache-Control": "no-store",
    },
  });

export function proxy(request) {
  const user = process.env.ADMIN_USER;
  const pass = process.env.ADMIN_PASSWORD;

  if (!user || !pass) {
    // En local se pasa sin más, para no estorbar mientras se desarrolla.
    if (process.env.NODE_ENV === "development") return NextResponse.next();
    // En producción se cierra: es preferible quedarse fuera uno mismo a dejar
    // el panel abierto porque se olvidó configurar las variables.
    return new NextResponse(
      "El panel no está configurado: faltan ADMIN_USER y ADMIN_PASSWORD.",
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  const header = request.headers.get("authorization");
  if (!header?.startsWith("Basic ")) return challenge();

  let creds = null;
  try {
    creds = decodeCredentials(header);
  } catch {
    return challenge();
  }
  if (!creds) return challenge();

  const ok = safeEqual(creds.user, user) && safeEqual(creds.pass, pass);
  return ok ? NextResponse.next() : challenge();
}
