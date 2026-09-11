"use client";

import { useEffect, useRef, useState } from "react";
import { REPO, verifyToken } from "@/lib/github";

// Piezas compartidas por los dos paneles (proyectos y web general): la puerta
// de entrada con el token y los controles de formulario.

export const TOKEN_KEY = "cms-github-token";

export const inputCls =
  "w-full rounded-lg border border-line bg-ink/[0.03] px-3.5 py-2.5 text-sm text-ink outline-none transition-colors duration-200 placeholder:text-muted focus:border-accent";

// field-select (en globals.css) da a los desplegables un fondo opaco y colores
// propios en las opciones: el sistema pinta esa lista y con el tinte
// translúcido del resto de campos salía texto claro sobre blanco.
export const selectCls = `${inputCls} field-select`;

export function Field({ label, hint, children }) {
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

export function Dropzone({ multiple, onFiles, label, compacto }) {
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
      className={`flex cursor-pointer items-center justify-center rounded-xl border border-dashed px-4 text-center text-sm transition-colors duration-200 ${
        compacto ? "py-2.5" : "py-7"
      } ${
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

// Comprueba si hay un token guardado y sigue valiendo. Devuelve:
//   token   → null mientras no haya uno válido
//   loading → true mientras se comprueba el guardado
export function useAdminToken() {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(TOKEN_KEY);
    if (!saved) return setLoading(false);
    verifyToken(saved)
      .then(() => setToken(saved))
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false));
  }, []);

  const forget = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  };

  return { token, setToken, loading, forget };
}

export function TokenGate({ onUnlock }) {
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
