"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  SITE_PATH,
  blobToBase64,
  commitFiles,
  fetchSite,
  textToBase64,
} from "@/lib/github";
import { imagePaths, processImage } from "@/lib/media";
import {
  Dropzone,
  Field,
  TokenGate,
  inputCls,
  useAdminToken,
} from "@/components/admin/ui";
import { SECCIONES, escribir, leer } from "./esquema";

// Editor del contenido de la web. A la izquierda los campos, a la derecha la
// web de verdad cargada con ?cms=1: cada tecla que escribes se le manda por
// postMessage y se vuelve a pintar con el borrador. No es una imitación de la
// web, es la web.

// Cómo llamar a un elemento de una lista: su primer texto de verdad. Se
// descartan las rutas de archivo, que no dicen nada al leerlas.
function resumirItem(campo, item) {
  const valores = campo.sub.map((sub) =>
    sub.clave == null ? item : item?.[sub.clave],
  );
  const texto = valores.find(
    (v) =>
      typeof v === "string" &&
      v.trim() &&
      !v.startsWith("/") &&
      !/^https?:/i.test(v) &&
      !/\.(jpe?g|png|webp|avif|svg|mp4|webm)$/i.test(v),
  );
  if (!texto) return "";
  return texto.length > 42 ? texto.slice(0, 42).trimEnd() + "…" : texto;
}

export default function WebEditor() {
  const { token, setToken, loading } = useAdminToken();
  const [contenido, setContenido] = useState(null);
  const [seccion, setSeccion] = useState(SECCIONES[0].id);
  const [pendientes, setPendientes] = useState({}); // ruta -> { file, preview }
  const [sucio, setSucio] = useState(false);
  const [publicando, setPublicando] = useState(false);
  const [progreso, setProgreso] = useState("");
  const [error, setError] = useState("");
  const [hecho, setHecho] = useState("");
  const marcoRef = useRef(null);

  const actual = SECCIONES.find((s) => s.id === seccion);

  // el JSON real del repositorio, no el compilado en la web: si publicas dos
  // veces seguidas sin esperar a Vercel, partir del bundle pisaría lo anterior
  useEffect(() => {
    if (!token) return;
    fetchSite(token)
      .then(setContenido)
      .catch((e) => setError(`No se pudo leer el contenido: ${e.message}`));
  }, [token]);

  // lo que ve la vista previa: el borrador con las fotos aún sin subir
  // sustituidas por su versión local, para que se vean ya
  const paraVistaPrevia = useMemo(() => {
    if (!contenido) return null;
    let copia = contenido;
    for (const [ruta, item] of Object.entries(pendientes)) {
      copia = escribir(copia, ruta, item.preview);
    }
    return copia;
  }, [contenido, pendientes]);

  const enviarAlMarco = () => {
    if (!paraVistaPrevia) return;
    marcoRef.current?.contentWindow?.postMessage(
      { type: "cms:content", content: paraVistaPrevia },
      window.location.origin,
    );
  };

  // la web avisa cuando ya puede recibir; si no, un mensaje enviado antes de
  // que monte se perdería y la vista previa se quedaría con el contenido viejo
  useEffect(() => {
    const alRecibir = (event) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === "cms:ready") enviarAlMarco();
    };
    window.addEventListener("message", alRecibir);
    return () => window.removeEventListener("message", alRecibir);
  });

  useEffect(enviarAlMarco, [paraVistaPrevia]);

  // aviso del navegador si hay cambios sin publicar
  useEffect(() => {
    if (!sucio) return;
    const avisar = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", avisar);
    return () => window.removeEventListener("beforeunload", avisar);
  }, [sucio]);

  const cambiar = (ruta, valor) => {
    setContenido((prev) => escribir(prev, ruta, valor));
    setSucio(true);
    setHecho("");
  };

  const soltarFoto = (ruta, file) => {
    setPendientes((prev) => {
      if (prev[ruta]) URL.revokeObjectURL(prev[ruta].preview);
      return { ...prev, [ruta]: { file, preview: URL.createObjectURL(file) } };
    });
    setSucio(true);
    setHecho("");
  };

  const publicar = async () => {
    setPublicando(true);
    setError("");
    setHecho("");
    try {
      let final = contenido;
      const archivos = [];

      const rutas = Object.keys(pendientes);
      for (let i = 0; i < rutas.length; i++) {
        setProgreso(`Optimizando foto ${i + 1} de ${rutas.length}…`);
        const { blob } = await processImage(pendientes[rutas[i]].file);
        const { repoPath, publicUrl } = imagePaths("web", "foto");
        archivos.push({ path: repoPath, base64: await blobToBase64(blob) });
        final = escribir(final, rutas[i], publicUrl);
      }

      archivos.push({
        path: SITE_PATH,
        base64: textToBase64(JSON.stringify(final, null, 2) + "\n"),
      });

      setProgreso(
        archivos.length > 1
          ? `Subiendo ${archivos.length - 1} foto(s) y el contenido…`
          : "Subiendo el contenido…",
      );
      await commitFiles(token, {
        message: "Actualizar contenido de la web desde el panel",
        files: archivos,
      });

      Object.values(pendientes).forEach((p) => URL.revokeObjectURL(p.preview));
      setPendientes({});
      setContenido(final);
      setSucio(false);
      setHecho(
        "Publicado. Vercel está reconstruyendo la web: en un par de minutos estará online.",
      );
    } catch (e) {
      setError(e.message);
    } finally {
      setPublicando(false);
      setProgreso("");
    }
  };

  if (loading) {
    return (
      <div className="px-5 py-32 text-center text-sm text-muted">Cargando…</div>
    );
  }
  if (!token) return <TokenGate onUnlock={setToken} />;
  if (!contenido) {
    return (
      <div className="px-5 py-32 text-center text-sm text-muted">
        {error || "Leyendo el contenido…"}
      </div>
    );
  }

  /* ------------------------------------------------------------- un campo */
  const pintarCampo = (ruta, etiqueta, tipo, clave) => {
    const valor = leer(contenido, ruta) ?? "";
    const pendiente = pendientes[ruta];

    if (tipo === "imagen") {
      const vista = pendiente?.preview || valor;
      return (
        <div key={ruta}>
          <p className="mb-2 text-[0.65rem] uppercase tracking-[0.18em] text-muted">
            {etiqueta}
          </p>
          {vista && (
            <div className="relative mb-2 overflow-hidden rounded-xl border border-line">
              <img src={vista} alt="" className="h-36 w-full object-cover" />
              {pendiente && (
                <span className="absolute right-3 top-3 rounded-full bg-accent px-2.5 py-1 text-[0.6rem] uppercase tracking-wider text-black">
                  Sin subir
                </span>
              )}
            </div>
          )}
          <Dropzone
            compacto={!!vista}
            onFiles={([file]) => soltarFoto(ruta, file)}
            label={
              vista ? "Cambiar foto" : "Arrastra una foto o pulsa para elegirla"
            }
          />
        </div>
      );
    }

    if (tipo === "video") {
      return (
        <Field
          key={ruta}
          label={etiqueta}
          hint="Ruta del archivo en la web. Los vídeos no se suben por el panel: pesan demasiado para el repositorio."
        >
          <input
            className={inputCls}
            value={valor}
            onChange={(e) => cambiar(ruta, e.target.value)}
          />
        </Field>
      );
    }

    return (
      <Field key={ruta} label={etiqueta}>
        {tipo === "area" ? (
          <textarea
            rows={3}
            className={inputCls}
            value={valor}
            onChange={(e) => cambiar(ruta, e.target.value)}
          />
        ) : (
          <input
            className={inputCls}
            value={valor}
            onChange={(e) => cambiar(ruta, e.target.value)}
          />
        )}
      </Field>
    );
  };

  const pintarEntrada = (campo, i) => {
    if (!campo.lista) {
      return pintarCampo(campo.ruta, campo.etiqueta, campo.tipo);
    }
    const items = leer(contenido, campo.lista) || [];
    return (
      <div key={campo.lista} className="space-y-3">
        <p className="text-[0.65rem] uppercase tracking-[0.18em] text-muted">
          {campo.etiqueta} ({items.length})
        </p>
        {items.map((item, idx) => (
          <div
            key={idx}
            className="space-y-4 rounded-xl border border-line bg-ink/[0.02] p-4"
          >
            {/* el bloque se titula con su propio contenido en vez de con un
                número: si no, para dar con "Quién soy" hay que abrir los tres
                y leerlos, y el panel se vuelve una adivinanza */}
            <p className="text-xs text-muted">
              <span className="mr-2">{String(idx + 1).padStart(2, "0")}</span>
              <span className="text-ink">{resumirItem(campo, item)}</span>
            </p>
            {campo.sub.map((sub) =>
              pintarCampo(
                sub.clave == null
                  ? `${campo.lista}.${idx}`
                  : `${campo.lista}.${idx}.${sub.clave}`,
                sub.etiqueta,
                sub.tipo,
              ),
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-[1600px] px-5 py-10 md:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link
            href="/admin"
            className="text-sm font-light text-muted transition-colors hover:text-ink"
          >
            ← Panel
          </Link>
          <h1 className="mt-2 text-3xl font-light tracking-tight md:text-4xl">
            Web general
          </h1>
        </div>
      </div>

      {error && (
        <p className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-500">
          {error}
        </p>
      )}
      {hecho && (
        <p className="mt-6 rounded-lg border border-accent/40 bg-accent/10 px-3.5 py-2.5 text-sm text-accent">
          {hecho}
        </p>
      )}

      {/* secciones */}
      <div className="swipe-x mt-8 flex gap-2 overflow-x-auto pb-2">
        {SECCIONES.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setSeccion(s.id)}
            className={`shrink-0 rounded-full border px-4 py-2 text-[0.7rem] uppercase tracking-[0.15em] transition-colors duration-200 ${
              s.id === seccion
                ? "border-accent bg-accent text-black"
                : "border-line text-muted hover:border-ink hover:text-ink"
            }`}
          >
            {s.titulo}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        {/* campos */}
        <div className="space-y-6">
          {actual.nota && (
            <p className="text-sm font-light leading-relaxed text-muted">
              {actual.nota}
            </p>
          )}
          {actual.campos.map(pintarEntrada)}
        </div>

        {/* vista previa: la web de verdad, sin animaciones para poder
            sustituir los textos en caliente */}
        <div className="hidden lg:block">
          <div className="sticky top-6">
            <p className="mb-2 text-[0.65rem] uppercase tracking-[0.18em] text-muted">
              Vista previa · {actual.pagina}
            </p>
            <div className="overflow-hidden rounded-xl border border-line">
              <iframe
                ref={marcoRef}
                key={actual.pagina}
                src={`${actual.pagina}?cms=1`}
                title="Vista previa"
                className="h-[78vh] w-full bg-cream"
                onLoad={enviarAlMarco}
              />
            </div>
          </div>
        </div>
      </div>

      {/* barra de publicación */}
      {sucio && (
        <div className="sticky bottom-4 z-20 mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-accent/40 bg-cream/90 p-4 backdrop-blur-xl">
          <p className="text-sm font-light">
            {publicando ? progreso || "Publicando…" : "Cambios sin publicar"}
          </p>
          <button
            type="button"
            onClick={publicar}
            disabled={publicando}
            className="rounded-full bg-accent px-6 py-2.5 text-[0.7rem] uppercase tracking-[0.18em] text-black transition-transform duration-200 hover:scale-105 active:scale-95 disabled:pointer-events-none disabled:opacity-50"
          >
            {publicando ? "Publicando…" : "Publicar cambios"}
          </button>
        </div>
      )}
    </div>
  );
}
