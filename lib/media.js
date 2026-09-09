// Preparación de fotos antes de subirlas al repositorio.
//
// Una foto recién salida de la cámara pesa 10–20 MB. Subir eso por la API de
// GitHub es lento, engorda el repositorio para siempre (git guarda todas las
// versiones) y encima el navegador del visitante tendría que descargarla. Se
// reescala a un lado máximo razonable para pantalla y se recomprime a JPEG.

const MAX_SIDE = 2400; // suficiente para pantallas grandes y retina
const QUALITY = 0.82;

export function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // fuera acentos
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

// Sufijo corto para que cada subida tenga un nombre nuevo. Si se reutilizara
// la misma ruta, los navegadores (y la CDN de Vercel) seguirían sirviendo la
// foto antigua desde caché.
function stamp() {
  return Math.random().toString(36).slice(2, 8);
}

export function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Devuelve { blob, width, height, before, after } listo para subir
export async function processImage(file) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close?.();

  const blob = await new Promise((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", QUALITY),
  );

  return {
    blob,
    width,
    height,
    before: file.size,
    after: blob.size,
  };
}

// Ruta dentro del repo y URL pública que acabará en el JSON
export function imagePaths(slug, kind) {
  const name = `${kind}-${stamp()}.jpg`;
  return {
    repoPath: `public/images/proyectos/${slug}/${name}`,
    publicUrl: `/images/proyectos/${slug}/${name}`,
  };
}
