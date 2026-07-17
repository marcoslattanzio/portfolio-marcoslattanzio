// Genera los placeholders SVG de /public/images.
// Ejecutar con: node scripts/generate-placeholders.mjs
// Cuando tengas tus fotos reales, simplemente sustituye los archivos
// (o cambia las rutas en data/content.js) — este script solo hace falta
// si quieres regenerar los placeholders.

import { mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "images");
mkdirSync(outDir, { recursive: true });

const images = [
  ["img-01", 2400, 1400], // hero home
  ["img-02", 900, 1200], // collage
  ["img-03", 1200, 800], // collage
  ["img-04", 800, 1000], // collage
  ["img-05", 1000, 1250], // collage
  ["img-06", 1400, 900], // collage
  ["img-07", 1200, 1500], // portada proyecto 01
  ["img-08", 1600, 1200], // portada proyecto 02
  ["img-09", 1200, 1500], // portada proyecto 03
  ["img-10", 1400, 1750], // portada proyecto 04
  ["img-11", 1600, 1000], // portada proyecto 05
  ["img-12", 1200, 1500], // portada proyecto 06
  ["img-13", 1600, 1200], // portada proyecto 07
  ["img-14", 1200, 1600], // portada proyecto 08
  ["img-15", 1600, 2000], // galería
  ["img-16", 2000, 1250], // galería
  ["img-17", 1400, 1750], // galería
  ["img-18", 1800, 1200], // galería
  ["img-19", 1200, 1500], // retrato sobre mí
];

for (const [name, w, h] of images) {
  const label = `${name.toUpperCase()} · ${w}x${h}`;
  const fontSize = Math.round(Math.min(w, h) / 18);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="100%" height="100%" fill="#e5e5e0"/>
  <rect x="1" y="1" width="${w - 2}" height="${h - 2}" fill="none" stroke="#d0cfc8" stroke-width="2"/>
  <text x="50%" y="50%" fill="#8a897f" font-family="Helvetica, Arial, sans-serif" font-size="${fontSize}" letter-spacing="2" text-anchor="middle" dominant-baseline="middle">${label}</text>
</svg>
`;
  writeFileSync(join(outDir, `${name}.svg`), svg);
  console.log(`✓ ${name}.svg (${w}x${h})`);
}
console.log(`\n${images.length} placeholders generados en /public/images`);
