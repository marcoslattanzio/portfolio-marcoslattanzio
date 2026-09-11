import projectsData from "./projects.json";
import siteData from "./site.json";

// Este archivo ya no guarda contenido: solo reparte el de los dos JSON.
//
// Son los únicos archivos que escribe el panel de /admin, y separarlos del
// código tiene un motivo concreto: por mucho que se escriba en el panel, una
// publicación no puede romper el JavaScript de la web. Lo peor que puede pasar
// es que un texto quede raro.
//
//   site.json     → cabecera, portada, sobre mí, contacto, redes, menú
//   projects.json → los proyectos

export const site = siteData.site;
export const socials = siteData.socials;
export const nav = siteData.nav;
export const categories = siteData.categories;
export const home = siteData.home;
export const about = siteData.about;
export const contact = siteData.contact;

export const projects = projectsData;

export function getProject(slug) {
  return projects.find((p) => p.slug === slug);
}
