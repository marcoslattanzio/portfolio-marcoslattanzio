// Qué se puede editar de la web, en el mismo orden en que se ve al navegarla.
//
// Es una descripción, no formularios escritos a mano: el panel recorre esto y
// pinta un campo por entrada. Añadir algo editable en el futuro es añadir una
// línea aquí, no maquetar otro bloque.
//
//   ruta   → dónde vive el valor dentro de site.json ("home.hero.title")
//   tipo   → texto | area | imagen | video | enlace
//   lista  → repite los subcampos por cada elemento del array
//   pagina → qué página abre la vista previa al entrar en la sección

export const SECCIONES = [
  {
    id: "sitio",
    titulo: "Datos del sitio",
    nota: "Se usan en la cabecera, el pie y el título de la pestaña del navegador.",
    pagina: "/",
    campos: [
      { ruta: "site.name", etiqueta: "Nombre", tipo: "texto" },
      { ruta: "site.claim", etiqueta: "Claim", tipo: "texto" },
      { ruta: "site.description", etiqueta: "Descripción (buscadores)", tipo: "area" },
      { ruta: "site.city", etiqueta: "Ciudad", tipo: "texto" },
      { ruta: "site.email", etiqueta: "Email", tipo: "texto" },
      { ruta: "site.phone", etiqueta: "Teléfono", tipo: "texto" },
    ],
  },
  {
    id: "apertura",
    titulo: "Portada · Apertura",
    nota: "Lo primero que se ve: el nombre y la tira de fotos.",
    pagina: "/",
    campos: [
      {
        ruta: "home.constellation.eyebrow",
        etiqueta: "Línea pequeña de arriba",
        tipo: "texto",
      },
      {
        ruta: "home.constellation.badge",
        etiqueta: "Icono junto a la frase",
        tipo: "imagen",
      },
      {
        ruta: "home.constellation.headline",
        etiqueta: "Frase principal",
        tipo: "area",
      },
      {
        lista: "home.constellation.images",
        etiqueta: "Fotos de la tira",
        sub: [
          { clave: "src", etiqueta: "Foto", tipo: "imagen" },
          { clave: "alt", etiqueta: "Descripción (para buscadores)", tipo: "texto" },
        ],
      },
    ],
  },
  {
    id: "video",
    titulo: "Portada · Vídeo",
    pagina: "/",
    campos: [
      { ruta: "home.hero.video", etiqueta: "Vídeo", tipo: "video" },
      { ruta: "home.hero.image", etiqueta: "Imagen de reserva", tipo: "imagen" },
      { ruta: "home.hero.title", etiqueta: "Título sobre el vídeo", tipo: "texto" },
      { ruta: "home.hero.subtitle", etiqueta: "Subtítulo", tipo: "texto" },
    ],
  },
  {
    id: "frases",
    titulo: "Portada · Frases",
    nota: "Las pantallas que se apilan al bajar.",
    pagina: "/",
    campos: [
      {
        lista: "home.statements",
        etiqueta: "Frases",
        sub: [
          { clave: "title", etiqueta: "Frase", tipo: "area" },
          { clave: "background", etiqueta: "Fondo", tipo: "imagen" },
          { clave: "inset", etiqueta: "Foto pequeña", tipo: "imagen" },
        ],
      },
    ],
  },
  {
    id: "carrete",
    titulo: "Portada · Carrete",
    pagina: "/",
    campos: [
      { ruta: "home.filmstrip.title", etiqueta: "Título", tipo: "texto" },
      {
        lista: "home.filmstrip.images",
        etiqueta: "Fotos del carrete",
        sub: [
          { clave: "src", etiqueta: "Foto", tipo: "imagen" },
          { clave: "alt", etiqueta: "Descripción", tipo: "texto" },
        ],
      },
    ],
  },
  {
    id: "avance",
    titulo: "Portada · Avance de Sobre mí",
    pagina: "/",
    campos: [
      { ruta: "home.aboutTeaser.eyebrow", etiqueta: "Antetítulo", tipo: "texto" },
      { ruta: "home.aboutTeaser.text", etiqueta: "Texto", tipo: "area" },
      { ruta: "home.aboutTeaser.linkLabel", etiqueta: "Texto del enlace", tipo: "texto" },
    ],
  },
  {
    id: "cierre",
    titulo: "Portada · Cierre",
    pagina: "/",
    campos: [
      { ruta: "home.cta.eyebrow", etiqueta: "Antetítulo", tipo: "texto" },
      { ruta: "home.cta.title", etiqueta: "Titular", tipo: "area" },
      { ruta: "home.cta.linkLabel", etiqueta: "Texto del enlace", tipo: "texto" },
    ],
  },
  {
    id: "sobremi",
    titulo: "Sobre mí",
    pagina: "/sobre-mi",
    campos: [
      { ruta: "about.intro", etiqueta: "Introducción", tipo: "area" },
      { ruta: "about.statement", etiqueta: "Frase destacada", tipo: "area" },
      { ruta: "about.portrait", etiqueta: "Retrato", tipo: "imagen" },
      { ruta: "about.badge", etiqueta: "Distintivo", tipo: "imagen" },
      {
        lista: "about.bio",
        etiqueta: "Biografía",
        sub: [{ clave: null, etiqueta: "Párrafo", tipo: "area" }],
      },
      {
        lista: "about.gallery",
        etiqueta: "Galería",
        sub: [{ clave: null, etiqueta: "Foto", tipo: "imagen" }],
      },
      {
        lista: "about.story",
        etiqueta: "Bloques numerados (Quién soy, Cómo trabajo…)",
        sub: [
          { clave: "label", etiqueta: "Título del bloque", tipo: "texto" },
          { clave: "body", etiqueta: "Texto del bloque", tipo: "area" },
        ],
      },
      {
        lista: "about.services",
        etiqueta: "Servicios",
        sub: [
          { clave: "title", etiqueta: "Servicio", tipo: "texto" },
          { clave: "detail", etiqueta: "Detalle", tipo: "area" },
          { clave: "image", etiqueta: "Foto", tipo: "imagen" },
        ],
      },
    ],
  },
  {
    id: "contacto",
    titulo: "Contacto",
    pagina: "/contacto",
    campos: [
      { ruta: "contact.title", etiqueta: "Título", tipo: "texto" },
      { ruta: "contact.text", etiqueta: "Texto", tipo: "area" },
    ],
  },
  {
    id: "menu",
    titulo: "Menú y redes",
    nota: "Solo los nombres. A dónde llevan los enlaces del menú es estructura y no se toca desde aquí.",
    pagina: "/",
    campos: [
      {
        lista: "nav",
        etiqueta: "Menú",
        sub: [{ clave: "label", etiqueta: "Nombre", tipo: "texto" }],
      },
      {
        lista: "socials",
        etiqueta: "Redes sociales",
        sub: [
          { clave: "label", etiqueta: "Nombre", tipo: "texto" },
          { clave: "url", etiqueta: "Enlace", tipo: "enlace" },
        ],
      },
      {
        lista: "categories",
        etiqueta: "Filtros de proyectos",
        sub: [{ clave: "label", etiqueta: "Nombre", tipo: "texto" }],
      },
    ],
  },
];

/* --------------------------------------------------- leer y escribir rutas */

export function leer(obj, ruta) {
  return ruta.split(".").reduce((nodo, clave) => nodo?.[clave], obj);
}

// Devuelve una copia con el valor cambiado: no se toca el original para que
// React vea que algo cambió y vuelva a pintar.
export function escribir(obj, ruta, valor) {
  const partes = ruta.split(".");
  const copia = Array.isArray(obj) ? [...obj] : { ...obj };
  let nodo = copia;
  for (let i = 0; i < partes.length - 1; i++) {
    const clave = partes[i];
    nodo[clave] = Array.isArray(nodo[clave]) ? [...nodo[clave]] : { ...nodo[clave] };
    nodo = nodo[clave];
  }
  nodo[partes.at(-1)] = valor;
  return copia;
}
