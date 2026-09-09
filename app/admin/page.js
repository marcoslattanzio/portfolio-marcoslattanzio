"use client";

import { useEffect, useRef, useState } from "react";
import { categories, projects as bundledProjects } from "@/data/content";
import {
  PROJECTS_PATH,
  REPO,
  blobToBase64,
  commitFiles,
  fetchProjects,
  textToBase64,
  verifyToken,
} from "@/lib/github";
import { formatBytes, imagePaths, processImage, slugify } from "@/lib/media";

// Panel de contenido. La web es un export estático, así que no hay servidor
// donde guardar nada: el panel escribe data/projects.json (y las fotos) en el
// repositorio con un token del propio Marco, y Vercel redespliega solo.

const TOKEN_KEY = "cms-github-token";
const REAL_CATEGORIES = categories.filter((c) => c.id !== "todos");

const emptyProject = () => ({
  slug: "",
  title: "",
  year: String(new Date().getFullYear()),
  category: REAL_CATEGORIES[0]?.id || "film",
  client: "",
  description: "",
  sections: [
    { heading: "El encargo", text: "" },
    { heading: "El enfoque", text: "" },
  ],
  cover: "",
  videoUrl: "",
  gallery: [],
  _cover: null, // foto pendiente de subir
  _gallery: [], // fotos pendientes de subir
});

/* ------------------------------------------------------------------ campos */

function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[0.65rem] uppercase tracking-[0.18em] text-muted">
        {label}
      </span>
      {children}
      {hint && <span className="mt-1.5 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

const inputCls =
  "w-full rounded-lg border border-line bg-ink/[0.03] px-3.5 py-2.5 text-sm text-ink outline-none transition-colors duration-200 placeholder:text-muted focus:border-accent";

function Dropzone({ multiple, onFiles, label }) {
  const [over, setOver] = useState(false);
  const inputRef = useRef(null);

  const take = (fileList) => {
    const files = [...fileList].filter((f) => f.type.startsWith("image/"));
    if (files.length) onFiles(multiple ? files : [files[0]]);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        take(e.dataTransfer.files);
      }}
      onClick={() => inputRef.current?.click()}
      className={`flex cursor-pointer items-center justify-center rounded-xl border border-dashed px-4 py-7 text-center text-sm transition-colors duration-200 ${
        over
          ? "border-accent bg-accent/10 text-accent"
          : "border-line bg-ink/[0.02] text-muted hover:border-accent/50 hover:text-ink"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        className="hidden"
        onChange={(e) => {
          take(e.target.files);
          e.target.value = "";
        }}
      />
      {label}
    </div>
  );
}

/* ------------------------------------------------------------------- token */

function TokenGate({ onUnlock }) {
  const [value, setValue] = useState("");
  const [remember, setRemember] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await verifyToken(value.trim());
      if (remember) localStorage.setItem(TOKEN_KEY, value.trim());
      onUnlock(value.trim());
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-5 py-20 md:py-28">
      <h1 className="text-3xl font-light tracking-tight md:text-4xl">Panel</h1>
      <p className="mt-3 text-sm font-light text-muted">
        Para publicar hace falta un token de GitHub con permiso de escritura en{" "}
        <code className="text-ink">{REPO}</code>.
      </p>

      <form onSubmit={submit} className="mt-8 space-y-4">
        <Field label="Token de acceso">
          <input
            type="password"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="github_pat_..."
            autoComplete="off"
            className={inputCls}
          />
        </Field>

        <label className="flex items-center gap-2.5 text-sm font-light text-muted">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="h-4 w-4 accent-[#14cc45]"
          />
          Recordar en este navegador
        </label>

        {error && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-500">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy || !value.trim()}
          className="w-full rounded-full bg-accent py-3 text-[0.7rem] uppercase tracking-[0.18em] text-black transition-transform duration-200 hover:scale-[1.02] active:scale-95 disabled:pointer-events-none disabled:opacity-40"
        >
          {busy ? "Comprobando…" : "Entrar"}
        </button>
      </form>

      <details className="mt-10 rounded-xl border border-line bg-ink/[0.02] p-5">
        <summary className="cursor-pointer text-sm font-light">
          ¿Cómo saco el token? (una sola vez)
        </summary>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm font-light text-muted">
          <li>
            Entra en{" "}
            <a
              href="https://github.com/settings/personal-access-tokens/new"
              target="_blank"
              rel="noreferrer"
              className="text-accent underline underline-offset-4"
            >
              github.com/settings/personal-access-tokens/new
            </a>
          </li>
          <li>
            Nombre: <span className="text-ink">Portfolio CMS</span>. Caducidad:
            la que quieras (cuando caduque, repite esto).
          </li>
          <li>
            En <span className="text-ink">Repository access</span> elige{" "}
            <span className="text-ink">Only select repositories</span> y marca{" "}
            <span className="text-ink">portfolio-marcoslattanzio</span>.
          </li>
          <li>
            En <span className="text-ink">Permissions → Repository</span>, pon{" "}
            <span className="text-ink">Contents</span> en{" "}
            <span className="text-ink">Read and write</span>. Nada más.
          </li>
          <li>Genera el token, cópialo y pégalo aquí arriba.</li>
        </ol>
        <p className="mt-4 text-xs text-muted">
          El token se guarda solo en este navegador y solo puede tocar ese
          repositorio. Si alguna vez lo pierdes de vista, bórralo desde la
          misma página de GitHub y saca otro.
        </p>
      </details>
    </div>
  );
}

/* ------------------------------------------------------------------ editor */

function ProjectEditor({ project, taken, onSave, onCancel }) {
  const [draft, setDraft] = useState(project);
  const [error, setError] = useState("");

  const set = (patch) => setDraft((d) => ({ ...d, ...patch }));

  const setTitle = (title) =>
    setDraft((d) => ({
      ...d,
      title,
      // el slug sigue al título mientras no se toque a mano
      slug: d._slugTouched ? d.slug : slugify(title),
    }));

  const coverPreview = draft._cover?.preview || draft.cover;

  const save = () => {
    if (!draft.title.trim()) return setError("Falta el título.");
    if (!draft.slug.trim()) return setError("Falta la URL (slug).");
    if (taken.includes(draft.slug))
      return setError("Ya hay otro proyecto con esa URL.");
    if (!coverPreview) return setError("Falta la portada.");
    const clean = { ...draft };
    delete clean._slugTouched;
    onSave(clean);
  };

  return (
    <div className="space-y-7">
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Título">
          <input
            className={inputCls}
            value={draft.title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nombre del proyecto"
          />
        </Field>
        <Field label="URL" hint={`/proyectos/${draft.slug || "…"}`}>
          <input
            className={inputCls}
            value={draft.slug}
            onChange={(e) =>
              set({ slug: slugify(e.target.value), _slugTouched: true })
            }
          />
        </Field>
        <Field label="Cliente">
          <input
            className={inputCls}
            value={draft.client}
            onChange={(e) => set({ client: e.target.value })}
            placeholder="Cliente / Marca"
          />
        </Field>
        <div className="grid grid-cols-2 gap-5">
          <Field label="Año">
            <input
              className={inputCls}
              value={draft.year}
              onChange={(e) => set({ year: e.target.value })}
            />
          </Field>
          <Field label="Categoría">
            <select
              className={inputCls}
              value={draft.category}
              onChange={(e) => set({ category: e.target.value })}
            >
              {REAL_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </div>

      <Field label="Descripción">
        <textarea
          rows={3}
          className={inputCls}
          value={draft.description}
          onChange={(e) => set({ description: e.target.value })}
          placeholder="Dos o tres frases que den contexto."
        />
      </Field>

      <Field
        label="Vídeo"
        hint="Enlace de Vimeo o YouTube. Los vídeos no se suben aquí: pesan demasiado para el repositorio."
      >
        <input
          className={inputCls}
          value={draft.videoUrl}
          onChange={(e) => set({ videoUrl: e.target.value })}
          placeholder="https://vimeo.com/…"
        />
      </Field>

      {/* portada */}
      <div>
        <p className="mb-2 text-[0.65rem] uppercase tracking-[0.18em] text-muted">
          Portada
        </p>
        {coverPreview ? (
          <div className="relative overflow-hidden rounded-xl border border-line">
            <img
              src={coverPreview}
              alt=""
              className="h-52 w-full object-cover"
            />
            <button
              type="button"
              onClick={() => set({ cover: "", _cover: null })}
              className="absolute right-3 top-3 rounded-full bg-black/70 px-3 py-1.5 text-xs text-white backdrop-blur transition-colors hover:bg-black"
            >
              Quitar
            </button>
          </div>
        ) : (
          <Dropzone
            label="Arrastra la portada aquí o pulsa para elegirla"
            onFiles={([file]) =>
              set({
                _cover: { file, preview: URL.createObjectURL(file) },
              })
            }
          />
        )}
      </div>

      {/* galería */}
      <div>
        <p className="mb-2 text-[0.65rem] uppercase tracking-[0.18em] text-muted">
          Galería
        </p>
        {(draft.gallery.length > 0 || draft._gallery.length > 0) && (
          <div className="mb-3 grid grid-cols-3 gap-2 md:grid-cols-4">
            {draft.gallery.map((url, i) => (
              <div
                key={`up-${url}`}
                className="group relative overflow-hidden rounded-lg border border-line"
              >
                <img src={url} alt="" className="h-24 w-full object-cover" />
                <button
                  type="button"
                  onClick={() =>
                    set({ gallery: draft.gallery.filter((_, j) => j !== i) })
                  }
                  className="absolute inset-0 flex items-center justify-center bg-black/70 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  Quitar
                </button>
              </div>
            ))}
            {draft._gallery.map((item, i) => (
              <div
                key={`new-${i}`}
                className="group relative overflow-hidden rounded-lg border border-accent/50"
              >
                <img
                  src={item.preview}
                  alt=""
                  className="h-24 w-full object-cover"
                />
                <span className="absolute left-1.5 top-1.5 rounded bg-accent px-1.5 py-0.5 text-[0.6rem] uppercase tracking-wider text-black">
                  Nueva
                </span>
                <button
                  type="button"
                  onClick={() => {
                    URL.revokeObjectURL(item.preview);
                    set({
                      _gallery: draft._gallery.filter((_, j) => j !== i),
                    });
                  }}
                  className="absolute inset-0 flex items-center justify-center bg-black/70 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  Quitar
                </button>
              </div>
            ))}
          </div>
        )}
        <Dropzone
          multiple
          label="Arrastra aquí las fotos de la galería"
          onFiles={(files) =>
            set({
              _gallery: [
                ...draft._gallery,
                ...files.map((file) => ({
                  file,
                  preview: URL.createObjectURL(file),
                })),
              ],
            })
          }
        />
      </div>

      {/* secciones de texto */}
      <div>
        <p className="mb-2 text-[0.65rem] uppercase tracking-[0.18em] text-muted">
          Bloques de texto
        </p>
        <div className="space-y-3">
          {draft.sections.map((section, i) => (
            <div
              key={i}
              className="rounded-xl border border-line bg-ink/[0.02] p-4"
            >
              <div className="flex gap-3">
                <input
                  className={`${inputCls} font-medium`}
                  value={section.heading}
                  placeholder="Título del bloque"
                  onChange={(e) => {
                    const next = [...draft.sections];
                    next[i] = { ...section, heading: e.target.value };
                    set({ sections: next });
                  }}
                />
                <button
                  type="button"
                  onClick={() =>
                    set({ sections: draft.sections.filter((_, j) => j !== i) })
                  }
                  className="shrink-0 rounded-lg border border-line px-3 text-xs text-muted transition-colors hover:border-red-500/50 hover:text-red-500"
                >
                  Quitar
                </button>
              </div>
              <textarea
                rows={3}
                className={`${inputCls} mt-2.5`}
                value={section.text}
                placeholder="Texto del bloque"
                onChange={(e) => {
                  const next = [...draft.sections];
                  next[i] = { ...section, text: e.target.value };
                  set({ sections: next });
                }}
              />
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() =>
            set({ sections: [...draft.sections, { heading: "", text: "" }] })
          }
          className="mt-3 rounded-full border border-line px-4 py-2 text-[0.7rem] uppercase tracking-[0.18em] transition-colors hover:border-accent hover:text-accent"
        >
          Añadir bloque
        </button>
      </div>

      {error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-500">
          {error}
        </p>
      )}

      <div className="flex gap-3 border-t border-line pt-6">
        <button
          type="button"
          onClick={save}
          className="rounded-full bg-accent px-6 py-3 text-[0.7rem] uppercase tracking-[0.18em] text-black transition-transform duration-200 hover:scale-105 active:scale-95"
        >
          Guardar
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-line px-6 py-3 text-[0.7rem] uppercase tracking-[0.18em] transition-colors hover:border-ink"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------- app  */

export default function AdminPanel() {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState(bundledProjects);
  const [dirty, setDirty] = useState(false);
  const [editing, setEditing] = useState(null); // { index, project }
  const [publishing, setPublishing] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState("");

  // token guardado de una sesión anterior
  useEffect(() => {
    const saved = localStorage.getItem(TOKEN_KEY);
    if (!saved) return setLoading(false);
    verifyToken(saved)
      .then(() => setToken(saved))
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false));
  }, []);

  // al entrar, leer el JSON real del repositorio (el compilado en la web es el
  // del último despliegue y puede ir por detrás)
  useEffect(() => {
    if (!token) return;
    fetchProjects(token)
      .then(setList)
      .catch((e) => setError(`No se pudo leer el contenido: ${e.message}`));
  }, [token]);

  // aviso del navegador si hay cambios sin publicar
  useEffect(() => {
    if (!dirty) return;
    const warn = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const publish = async () => {
    setPublishing(true);
    setError("");
    setDone("");
    try {
      const files = [];
      const clean = [];

      for (const project of list) {
        const copy = { ...project };

        if (copy._cover) {
          setProgress(`Optimizando la portada de "${copy.title}"…`);
          const { blob, before, after } = await processImage(copy._cover.file);
          const { repoPath, publicUrl } = imagePaths(copy.slug, "portada");
          files.push({ path: repoPath, base64: await blobToBase64(blob) });
          copy.cover = publicUrl;
          console.info(
            `portada ${copy.slug}: ${formatBytes(before)} → ${formatBytes(after)}`,
          );
        }

        if (copy._gallery?.length) {
          const urls = [...(copy.gallery || [])];
          for (let i = 0; i < copy._gallery.length; i++) {
            setProgress(
              `Optimizando foto ${i + 1} de ${copy._gallery.length} de "${copy.title}"…`,
            );
            const { blob } = await processImage(copy._gallery[i].file);
            const { repoPath, publicUrl } = imagePaths(copy.slug, "foto");
            files.push({ path: repoPath, base64: await blobToBase64(blob) });
            urls.push(publicUrl);
          }
          copy.gallery = urls;
        }

        delete copy._cover;
        delete copy._gallery;
        clean.push(copy);
      }

      files.push({
        path: PROJECTS_PATH,
        base64: textToBase64(JSON.stringify(clean, null, 2) + "\n"),
      });

      setProgress(
        files.length > 1
          ? `Subiendo ${files.length - 1} foto(s) y el contenido…`
          : "Subiendo el contenido…",
      );
      await commitFiles(token, {
        message: "Actualizar proyectos desde el panel",
        files,
      });

      setList(clean);
      setDirty(false);
      setDone(
        "Publicado. Vercel está reconstruyendo la web: en un par de minutos estará online.",
      );
    } catch (e) {
      setError(e.message);
    } finally {
      setPublishing(false);
      setProgress("");
    }
  };

  if (loading) {
    return (
      <div className="px-5 py-32 text-center text-sm text-muted">Cargando…</div>
    );
  }

  if (!token) return <TokenGate onUnlock={setToken} />;

  /* ------------------------------------------------------------- editor */
  if (editing) {
    const taken = list
      .filter((_, i) => i !== editing.index)
      .map((p) => p.slug);

    return (
      <div className="mx-auto max-w-3xl px-5 py-16 md:py-24">
        <button
          type="button"
          onClick={() => setEditing(null)}
          className="mb-6 text-sm font-light text-muted transition-colors hover:text-ink"
        >
          ← Volver
        </button>
        <h1 className="mb-8 text-3xl font-light tracking-tight md:text-4xl">
          {editing.index === -1 ? "Nuevo proyecto" : "Editar proyecto"}
        </h1>
        <ProjectEditor
          project={editing.project}
          taken={taken}
          onCancel={() => setEditing(null)}
          onSave={(project) => {
            setList((prev) =>
              editing.index === -1
                ? [project, ...prev]
                : prev.map((p, i) => (i === editing.index ? project : p)),
            );
            setDirty(true);
            setEditing(null);
            setDone("");
          }}
        />
      </div>
    );
  }

  /* --------------------------------------------------------------- lista */
  const move = (index, delta) => {
    const next = [...list];
    const target = index + delta;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setList(next);
    setDirty(true);
  };

  return (
    <div className="mx-auto max-w-3xl px-5 py-16 md:py-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-light tracking-tight md:text-4xl">
            Proyectos
          </h1>
          <p className="mt-2 text-sm font-light text-muted">
            {list.length} publicados · el orden aquí es el de la web
          </p>
        </div>
        <button
          type="button"
          onClick={() => setEditing({ index: -1, project: emptyProject() })}
          className="rounded-full bg-accent px-5 py-2.5 text-[0.7rem] uppercase tracking-[0.18em] text-black transition-transform duration-200 hover:scale-105 active:scale-95"
        >
          Nuevo proyecto
        </button>
      </div>

      {error && (
        <p className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-500">
          {error}
        </p>
      )}
      {done && (
        <p className="mt-6 rounded-lg border border-accent/40 bg-accent/10 px-3.5 py-2.5 text-sm text-accent">
          {done}
        </p>
      )}

      <div className="mt-8 space-y-2">
        {list.map((project, i) => (
          <div
            key={project.slug}
            className="flex items-center gap-4 rounded-xl border border-line bg-ink/[0.02] p-3 transition-colors duration-200 hover:border-accent/40"
          >
            <img
              src={project._cover?.preview || project.cover}
              alt=""
              className="h-14 w-14 shrink-0 rounded-lg object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm">{project.title}</p>
              <p className="truncate text-xs text-muted">
                {project.year} ·{" "}
                {REAL_CATEGORIES.find((c) => c.id === project.category)
                  ?.label || project.category}
                {(project._cover || project._gallery?.length > 0) && (
                  <span className="text-accent"> · fotos sin subir</span>
                )}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                aria-label="Subir"
                className="h-7 w-7 rounded-md border border-line text-xs transition-colors hover:border-ink disabled:opacity-25"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === list.length - 1}
                aria-label="Bajar"
                className="h-7 w-7 rounded-md border border-line text-xs transition-colors hover:border-ink disabled:opacity-25"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() =>
                  setEditing({
                    index: i,
                    project: { _cover: null, _gallery: [], ...project },
                  })
                }
                className="ml-1 rounded-full border border-line px-3.5 py-1.5 text-[0.65rem] uppercase tracking-[0.15em] transition-colors hover:border-accent hover:text-accent"
              >
                Editar
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!confirm(`¿Borrar "${project.title}"?`)) return;
                  setList(list.filter((_, j) => j !== i));
                  setDirty(true);
                }}
                aria-label="Borrar"
                className="h-7 w-7 rounded-md border border-line text-xs text-muted transition-colors hover:border-red-500/50 hover:text-red-500"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* barra de publicación */}
      {dirty && (
        <div className="sticky bottom-4 z-20 mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-accent/40 bg-cream/90 p-4 backdrop-blur-xl">
          <p className="text-sm font-light">
            {publishing ? progress || "Publicando…" : "Cambios sin publicar"}
          </p>
          <button
            type="button"
            onClick={publish}
            disabled={publishing}
            className="rounded-full bg-accent px-6 py-2.5 text-[0.7rem] uppercase tracking-[0.18em] text-black transition-transform duration-200 hover:scale-105 active:scale-95 disabled:pointer-events-none disabled:opacity-50"
          >
            {publishing ? "Publicando…" : "Publicar cambios"}
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={() => {
          localStorage.removeItem(TOKEN_KEY);
          setToken(null);
        }}
        className="mt-12 text-xs font-light text-muted underline-offset-4 transition-colors hover:text-ink hover:underline"
      >
        Olvidar el token en este navegador
      </button>
    </div>
  );
}
