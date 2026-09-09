/** @type {import('next').NextConfig} */
const nextConfig = {
  // Antes esto era `output: "export"` (HTML plano en /out para un hosting de
  // archivos como Hostinger). Se quitó al proteger /admin: el filtro de
  // usuario y contraseña vive en middleware.js, y el middleware necesita que
  // haya un servidor delante — con un export estático no se ejecuta nada y la
  // contraseña tendría que ir en el JavaScript del navegador, donde cualquiera
  // la leería. En Vercel esto no cambia nada: las páginas se siguen generando
  // en el build; lo único que se pierde es la carpeta /out portátil.
  trailingSlash: true,
};

export default nextConfig;
