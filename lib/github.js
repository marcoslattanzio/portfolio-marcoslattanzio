// Cliente mínimo de la API de GitHub para el panel de /admin.
//
// La web es un export estático: no hay servidor que pueda escribir archivos.
// Así que el panel commitea directamente al repositorio y deja que Vercel
// redespliegue. Se usa la Git Data API (blobs → tree → commit → ref) en vez de
// la Contents API porque permite meter TODOS los archivos de una publicación
// en un único commit: una sola reconstrucción en Vercel en lugar de una por
// foto, y si algo falla a medias el repo no queda a medio actualizar.

export const REPO = "marcoslattanzio/portfolio-marcoslattanzio";
export const BRANCH = "main";
export const PROJECTS_PATH = "data/projects.json";

const API = "https://api.github.com";

async function gh(token, path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const detail = await res.text();
    let msg = `GitHub respondió ${res.status}`;
    try {
      const parsed = JSON.parse(detail);
      if (parsed.message) msg += `: ${parsed.message}`;
    } catch {
      /* respuesta no JSON: nos quedamos con el código */
    }
    if (res.status === 401) msg = "El token no es válido o ha caducado.";
    if (res.status === 403 || res.status === 404) {
      msg =
        "El token no tiene acceso al repositorio. Revisa que sea del repo " +
        `${REPO} y con permiso Contents: Read and write.`;
    }
    throw new Error(msg);
  }
  return res.json();
}

/* -------------------------------------------------------------------------
   Codificación. La API habla base64, y atob/btoa solo manejan bytes: hay que
   pasar por TextEncoder/TextDecoder o los acentos se corrompen.
------------------------------------------------------------------------- */

export function bytesToBase64(bytes) {
  let bin = "";
  // a trozos: String.fromCharCode(...bytes) revienta la pila con imágenes
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    bin += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  }
  return btoa(bin);
}

export function textToBase64(text) {
  return bytesToBase64(new TextEncoder().encode(text));
}

function base64ToText(b64) {
  const bin = atob(b64.replace(/\s/g, ""));
  return new TextDecoder().decode(
    Uint8Array.from(bin, (c) => c.charCodeAt(0)),
  );
}

export async function blobToBase64(blob) {
  const buf = await blob.arrayBuffer();
  return bytesToBase64(new Uint8Array(buf));
}

/* ------------------------------------------------------------------------- */

// Comprueba que el token sirve y devuelve el nombre del repo
export async function verifyToken(token) {
  const repo = await gh(token, `/repos/${REPO}`);
  if (!repo.permissions?.push) {
    throw new Error(
      "El token puede leer el repositorio pero no escribir. Dale permiso " +
        "Contents: Read and write.",
    );
  }
  return repo.full_name;
}

// Lee projects.json tal y como está AHORA en GitHub. Importante: el JSON que
// viene compilado en la web es el del último despliegue, así que si publicas
// dos veces seguidas sin esperar a Vercel, partir del bundle pisaría lo
// anterior. Aquí siempre se parte de la verdad del repositorio.
export async function fetchProjects(token) {
  const file = await gh(
    token,
    `/repos/${REPO}/contents/${PROJECTS_PATH}?ref=${BRANCH}`,
  );
  return JSON.parse(base64ToText(file.content));
}

// Un commit con varios archivos. `files` = [{ path, base64 }]
export async function commitFiles(token, { message, files }) {
  const ref = await gh(token, `/repos/${REPO}/git/ref/heads/${BRANCH}`);
  const parentSha = ref.object.sha;
  const parent = await gh(token, `/repos/${REPO}/git/commits/${parentSha}`);

  const tree = [];
  for (const file of files) {
    const blob = await gh(token, `/repos/${REPO}/git/blobs`, {
      method: "POST",
      body: JSON.stringify({ content: file.base64, encoding: "base64" }),
    });
    tree.push({
      path: file.path,
      mode: "100644",
      type: "blob",
      sha: blob.sha,
    });
  }

  const newTree = await gh(token, `/repos/${REPO}/git/trees`, {
    method: "POST",
    body: JSON.stringify({ base_tree: parent.tree.sha, tree }),
  });

  const commit = await gh(token, `/repos/${REPO}/git/commits`, {
    method: "POST",
    body: JSON.stringify({
      message,
      tree: newTree.sha,
      parents: [parentSha],
    }),
  });

  await gh(token, `/repos/${REPO}/git/refs/heads/${BRANCH}`, {
    method: "PATCH",
    body: JSON.stringify({ sha: commit.sha }),
  });

  return commit.sha;
}
