/** @type {import('next').NextConfig} */
const nextConfig = {
  // Exportación estática: `npm run build` genera la carpeta /out con HTML, CSS
  // y JS planos, listos para subir a un hosting normal (Hostinger, etc.).
  // La web no usa servidor (ni API, ni next/image), así que no pierde nada.
  output: "export",

  // Cada ruta se sirve como carpeta con su index.html (/proyectos/index.html),
  // que es como esperan las URLs los hostings de archivos estáticos.
  trailingSlash: true,
};

export default nextConfig;
