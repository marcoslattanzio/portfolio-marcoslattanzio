// ============================================================================
//  CONTENIDO DEL SITIO
//  Este es el ÚNICO archivo que necesitas tocar para cambiar textos, imágenes,
//  vídeos y enlaces. Los componentes leen todo de aquí.
//
//  IMÁGENES: ahora mismo se usan fotos de muestra de picsum.photos (solo
//  para ver el diseño con imagen real). Para poner TUS fotos: guárdalas en
//  /public/images/ y cambia la URL por la ruta local, ej. "/images/mi-foto.jpg".
//  Los placeholders grises originales siguen en /public/images/img-01.svg ... img-19.svg
//  (las dimensiones recomendadas están escritas dentro de cada uno).
//
//  VÍDEOS: pega la URL normal de Vimeo o YouTube (el componente la convierte
//  a embed automáticamente).
// ============================================================================

export const site = {
  name: "Marcos Lattanzio", // TODO: EDITAR — tu nombre o marca (aparece en logo, hero y footer)
  claim: "Filmmaker & Photographer", // TODO: EDITAR — tu claim (marquee y subtítulos)
  description:
    "Portfolio de dirección, fotografía y film. Historias contadas con luz.", // TODO: EDITAR — descripción SEO
  city: "Valencia, España",
  email: "marcoslattanzio@gmail.com",
  phone: "+34 601 383 074",
};

export const socials = [
  { label: "Instagram", url: "https://instagram.com/" }, // TODO: EDITAR — tu URL
  { label: "YouTube", url: "https://youtube.com/" }, // TODO: EDITAR — tu URL
  { label: "LinkedIn", url: "https://linkedin.com/" }, // TODO: EDITAR — tu URL
];

export const nav = [
  { label: "Home", href: "/" },
  { label: "Proyectos", href: "/proyectos" },
  { label: "Sobre mí", href: "/sobre-mi" },
  { label: "Contacto", href: "/contacto" },
];

// ----------------------------------------------------------------------------
//  HOME
// ----------------------------------------------------------------------------

export const home = {
  hero: {
    // TODO: pegar URL del vídeo .mp4 para abrir la web (autohospedado en /public
    // ej. "/videos/hero.mp4", o desde un CDN). Si se deja vacío, se usa la imagen.
    video: "",
    image: "https://picsum.photos/seed/atlas/2400/1400", // TODO: EDITAR — imagen de respaldo/poster (2400x1400 aprox)
    title: "Marcos Lattanzio", // TODO: EDITAR — titular grande del hero
    subtitle: "Filmmaker & Photographer — historias en movimiento y en silencio.", // TODO: EDITAR
  },

  // Apertura "constelación": frase centrada rodeada de fotos pequeñas flotando
  // con profundidad (las lejanas se ven más tenues), parallax con el ratón y
  // deriva constante. Las posiciones/tamaños se definen en HeroConstellation.js.
  constellation: {
    tagline: "Historias en movimiento, hechas con luz.", // TODO: EDITAR — frase central de la apertura
    images: [
      { src: "/images/constellation-04.jpg", alt: "" }, // retrato arriba
      { src: "/images/constellation-07.jpg", alt: "" }, // retrato centro-izq arriba
      { src: "/images/constellation-05.jpg", alt: "" }, // retrato centro arriba
      { src: "/images/constellation-08.jpg", alt: "" }, // retrato centro-der arriba
      { src: "/images/constellation-09.jpg", alt: "" }, // pantalla centro-der arriba
      { src: "/images/constellation-01.jpg", alt: "" }, // IZQUIERDA EXTREMA medio
      { src: "/images/constellation-02.jpg", alt: "" }, // zapatos centro-izq
      { src: "/images/constellation-03.jpg", alt: "" }, // cámara centro
      { src: "/images/constellation-10.jpg", alt: "" }, // paisaje centro-der
      { src: "/images/constellation-11.jpg", alt: "" }, // paisaje DERECHA medio
      { src: "/images/constellation-12.jpg", alt: "" }, // paisaje izq medio-abajo
      { src: "/images/constellation-16.jpg", alt: "" }, // B&N centro-izq
      { src: "/images/constellation-15.jpg", alt: "" }, // paisaje chica centro (más centrado)
      { src: "/images/constellation-13.jpg", alt: "" }, // paisaje centro-der medio-abajo
      { src: "/images/constellation-06.jpg", alt: "" }, // DERECHA EXTREMA abajo
      { src: "/images/constellation-14.jpg", alt: "" }, // paisaje agua izq abajo
    ],
  },

  // Collage de imágenes flotantes con parallax (velocidades distintas por imagen).
  // "speed" controla el parallax: positivo sube más rápido, negativo baja.
  collage: {
    eyebrow: "(01) — Selección", // TODO: EDITAR
    title: "Fragmentos de trabajo reciente", // TODO: EDITAR
    images: [
      { src: "https://picsum.photos/seed/vela/900/1200", alt: "Fragmento 01", speed: 1.4 }, // TODO: EDITAR
      { src: "https://picsum.photos/seed/niebla/1200/800", alt: "Fragmento 02", speed: -0.8 }, // TODO: EDITAR
      { src: "https://picsum.photos/seed/rio/800/1000", alt: "Fragmento 03", speed: 0.6 }, // TODO: EDITAR
      { src: "https://picsum.photos/seed/norte/1000/1250", alt: "Fragmento 04", speed: -1.2 }, // TODO: EDITAR
      { src: "https://picsum.photos/seed/valle/1400/900", alt: "Fragmento 05", speed: 1.0 }, // TODO: EDITAR
    ],
  },

  // Secciones "statement" apiladas: el bloque se queda fijo en pantalla y cada
  // statement cubre al anterior en la misma posición al hacer scroll.
  // Cada una: fondo a pantalla completa + imagen pequeña centrada + titular serif.
  statements: [
    {
      background: "https://picsum.photos/seed/escena/2400/1400", // TODO: EDITAR — fondo (2400x1400 aprox)
      inset: "https://picsum.photos/seed/gesto/900/1200", // TODO: EDITAR — imagen central (900x1200 aprox)
      title: "Diez años contando historias.", // TODO: EDITAR — frase corta, en serif grande
    },
    {
      background: "https://picsum.photos/seed/andenes/2400/1400", // TODO: EDITAR
      inset: "https://picsum.photos/seed/perfil/900/1200", // TODO: EDITAR
      title: "La luz antes que la palabra.", // TODO: EDITAR
    },
    {
      background: "https://picsum.photos/seed/orilla/2400/1400", // TODO: EDITAR
      inset: "https://picsum.photos/seed/butaca/900/1200", // TODO: EDITAR
      title: "Cada encargo, una película.", // TODO: EDITAR
    },
  ],

  // Sección "carrete": tira horizontal de fotos que se recorre con el scroll
  // vertical — la sección se clava y las fotos desfilan como fotogramas.
  filmstrip: {
    title: "Del archivo", // TODO: EDITAR — titular de la sección
    images: [
      { src: "https://picsum.photos/seed/silencio/900/1200", alt: "Archivo 01" }, // TODO: EDITAR
      { src: "https://picsum.photos/seed/sombra/800/1000", alt: "Archivo 02" }, // TODO: EDITAR
      { src: "https://picsum.photos/seed/papel/900/1200", alt: "Archivo 03" }, // TODO: EDITAR
      { src: "https://picsum.photos/seed/campo/800/800", alt: "Archivo 04" }, // TODO: EDITAR
      { src: "https://picsum.photos/seed/linterna/900/1200", alt: "Archivo 05" }, // TODO: EDITAR
      { src: "https://picsum.photos/seed/anden/800/1000", alt: "Archivo 06" }, // TODO: EDITAR
      { src: "https://picsum.photos/seed/cinta/1200/900", alt: "Archivo 07" }, // TODO: EDITAR
      { src: "https://picsum.photos/seed/reflejo/800/1000", alt: "Archivo 08" }, // TODO: EDITAR
    ],
  },

  // Slugs de los 4 proyectos destacados (deben existir en "projects" más abajo)
  featuredSlugs: ["proyecto-01", "proyecto-02", "proyecto-03", "proyecto-04"], // TODO: EDITAR

  aboutTeaser: {
    eyebrow: "(03) — Sobre mí",
    text: "Cuento historias con cámara desde hace más de una década. Trabajo entre el documental, la moda y la publicidad, buscando siempre la imagen que respira.", // TODO: EDITAR — 2/3 líneas
    linkLabel: "Conocer más",
  },

  cta: {
    eyebrow: "(04) — Contacto",
    title: "¿Tienes un proyecto en mente?", // TODO: EDITAR
    linkLabel: "Hablemos",
  },
};

// ----------------------------------------------------------------------------
//  PROYECTOS
//  category: "film" | "foto"
//  videoUrl: pega la URL de Vimeo/YouTube (déjala "" si el proyecto no tiene vídeo)
// ----------------------------------------------------------------------------

export const categories = [
  { id: "todos", label: "Todos" },
  { id: "film", label: "Film" },
  { id: "foto", label: "Fotografía" },
];

export const projects = [
  {
    slug: "proyecto-01",
    title: "Proyecto Uno", // TODO: EDITAR
    year: "2025", // TODO: EDITAR
    category: "film",
    client: "Cliente / Marca", // TODO: EDITAR
    description:
      "Descripción breve del proyecto: concepto, enfoque y resultado. Dos o tres frases que den contexto sin desvelarlo todo.", // TODO: EDITAR
    // Bloques explicativos: minititulo + párrafo corto (añade o quita los que quieras)
    sections: [
      {
        heading: "El encargo", // TODO: EDITAR
        text: "Qué pedía el cliente y de dónde partía la idea. Dos o tres frases de contexto para situar el proyecto.", // TODO: EDITAR
      },
      {
        heading: "El enfoque", // TODO: EDITAR
        text: "Cómo se resolvió: las decisiones de dirección, luz y ritmo que definieron la pieza final.", // TODO: EDITAR
      },
    ],
    cover: "https://picsum.photos/seed/salina/1200/1500", // TODO: EDITAR — portada (1200x1500 aprox)
    videoUrl: "", // TODO: pegar URL del vídeo (Vimeo/YouTube)
    gallery: [
      "https://picsum.photos/seed/lumen/1600/2000", // TODO: EDITAR
      "https://picsum.photos/seed/marea/2000/1250", // TODO: EDITAR
      "https://picsum.photos/seed/senda/1400/1750", // TODO: EDITAR
    ],
  },
  {
    slug: "proyecto-02",
    title: "Proyecto Dos", // TODO: EDITAR
    year: "2025", // TODO: EDITAR
    category: "foto",
    client: "Cliente / Marca", // TODO: EDITAR
    description:
      "Descripción breve del proyecto: concepto, enfoque y resultado.", // TODO: EDITAR
    sections: [
      {
        heading: "El encargo", // TODO: EDITAR
        text: "Qué pedía el cliente y de dónde partía la idea. Dos o tres frases de contexto para situar el proyecto.", // TODO: EDITAR
      },
      {
        heading: "El enfoque", // TODO: EDITAR
        text: "Cómo se resolvió: las decisiones de dirección, luz y ritmo que definieron la pieza final.", // TODO: EDITAR
      },
    ],
    cover: "https://picsum.photos/seed/puerto/1600/1200", // TODO: EDITAR
    videoUrl: "", // TODO: pegar URL del vídeo (o dejar vacío si es solo foto)
    gallery: [
      "https://picsum.photos/seed/aurora/2000/1250", // TODO: EDITAR
      "https://picsum.photos/seed/cielo/1800/1200", // TODO: EDITAR
      "https://picsum.photos/seed/brisa/1600/2000", // TODO: EDITAR
      "https://picsum.photos/seed/cauceo/1400/1750", // TODO: EDITAR
    ],
  },
  {
    slug: "proyecto-03",
    title: "Proyecto Tres", // TODO: EDITAR
    year: "2024", // TODO: EDITAR
    category: "film",
    client: "Cliente / Marca", // TODO: EDITAR
    description:
      "Descripción breve del proyecto: concepto, enfoque y resultado.", // TODO: EDITAR
    sections: [
      {
        heading: "El encargo", // TODO: EDITAR
        text: "Qué pedía el cliente y de dónde partía la idea. Dos o tres frases de contexto para situar el proyecto.", // TODO: EDITAR
      },
      {
        heading: "El enfoque", // TODO: EDITAR
        text: "Cómo se resolvió: las decisiones de dirección, luz y ritmo que definieron la pieza final.", // TODO: EDITAR
      },
    ],
    cover: "https://picsum.photos/seed/faro/1200/1500", // TODO: EDITAR
    videoUrl: "", // TODO: pegar URL del vídeo
    gallery: [
      "https://picsum.photos/seed/duna2/1400/1750", // TODO: EDITAR
      "https://picsum.photos/seed/encina/1600/2000", // TODO: EDITAR
      "https://picsum.photos/seed/faro2/1800/1200", // TODO: EDITAR
    ],
  },
  {
    slug: "proyecto-04",
    title: "Proyecto Cuatro", // TODO: EDITAR
    year: "2024", // TODO: EDITAR
    category: "foto",
    client: "Cliente / Marca", // TODO: EDITAR
    description:
      "Descripción breve del proyecto: concepto, enfoque y resultado.", // TODO: EDITAR
    sections: [
      {
        heading: "El encargo", // TODO: EDITAR
        text: "Qué pedía el cliente y de dónde partía la idea. Dos o tres frases de contexto para situar el proyecto.", // TODO: EDITAR
      },
      {
        heading: "El enfoque", // TODO: EDITAR
        text: "Cómo se resolvió: las decisiones de dirección, luz y ritmo que definieron la pieza final.", // TODO: EDITAR
      },
    ],
    cover: "https://picsum.photos/seed/bruma/1400/1750", // TODO: EDITAR
    videoUrl: "", // TODO: pegar URL del vídeo (o dejar vacío)
    gallery: [
      "https://picsum.photos/seed/gaviota/1800/1200", // TODO: EDITAR
      "https://picsum.photos/seed/hiedra/2000/1250", // TODO: EDITAR
    ],
  },
  {
    slug: "proyecto-05",
    title: "Proyecto Cinco", // TODO: EDITAR
    year: "2024", // TODO: EDITAR
    category: "film",
    client: "Cliente / Marca", // TODO: EDITAR
    description:
      "Descripción breve del proyecto: concepto, enfoque y resultado.", // TODO: EDITAR
    sections: [
      {
        heading: "El encargo", // TODO: EDITAR
        text: "Qué pedía el cliente y de dónde partía la idea. Dos o tres frases de contexto para situar el proyecto.", // TODO: EDITAR
      },
      {
        heading: "El enfoque", // TODO: EDITAR
        text: "Cómo se resolvió: las decisiones de dirección, luz y ritmo que definieron la pieza final.", // TODO: EDITAR
      },
    ],
    cover: "https://picsum.photos/seed/costa/1600/1000", // TODO: EDITAR
    videoUrl: "", // TODO: pegar URL del vídeo
    gallery: [
      "https://picsum.photos/seed/islote/1600/2000", // TODO: EDITAR
      "https://picsum.photos/seed/jara/1400/1750", // TODO: EDITAR
      "https://picsum.photos/seed/lava/2000/1250", // TODO: EDITAR
    ],
  },
  {
    slug: "proyecto-06",
    title: "Proyecto Seis", // TODO: EDITAR
    year: "2023", // TODO: EDITAR
    category: "foto",
    client: "Cliente / Marca", // TODO: EDITAR
    description:
      "Descripción breve del proyecto: concepto, enfoque y resultado.", // TODO: EDITAR
    sections: [
      {
        heading: "El encargo", // TODO: EDITAR
        text: "Qué pedía el cliente y de dónde partía la idea. Dos o tres frases de contexto para situar el proyecto.", // TODO: EDITAR
      },
      {
        heading: "El enfoque", // TODO: EDITAR
        text: "Cómo se resolvió: las decisiones de dirección, luz y ritmo que definieron la pieza final.", // TODO: EDITAR
      },
    ],
    cover: "https://picsum.photos/seed/cumbre/1200/1500", // TODO: EDITAR
    videoUrl: "", // TODO: pegar URL del vídeo (o dejar vacío)
    gallery: [
      "https://picsum.photos/seed/manglar/2000/1250", // TODO: EDITAR
      "https://picsum.photos/seed/nieve/1600/2000", // TODO: EDITAR
    ],
  },
  {
    slug: "proyecto-07",
    title: "Proyecto Siete", // TODO: EDITAR
    year: "2023", // TODO: EDITAR
    category: "film",
    client: "Cliente / Marca", // TODO: EDITAR
    description:
      "Descripción breve del proyecto: concepto, enfoque y resultado.", // TODO: EDITAR
    sections: [
      {
        heading: "El encargo", // TODO: EDITAR
        text: "Qué pedía el cliente y de dónde partía la idea. Dos o tres frases de contexto para situar el proyecto.", // TODO: EDITAR
      },
      {
        heading: "El enfoque", // TODO: EDITAR
        text: "Cómo se resolvió: las decisiones de dirección, luz y ritmo que definieron la pieza final.", // TODO: EDITAR
      },
    ],
    cover: "https://picsum.photos/seed/bosque/1600/1200", // TODO: EDITAR
    videoUrl: "", // TODO: pegar URL del vídeo
    gallery: [
      "https://picsum.photos/seed/ocaso/1400/1750", // TODO: EDITAR
      "https://picsum.photos/seed/pedregal/1800/1200", // TODO: EDITAR
      "https://picsum.photos/seed/quilla/1600/2000", // TODO: EDITAR
    ],
  },
  {
    slug: "proyecto-08",
    title: "Proyecto Ocho", // TODO: EDITAR
    year: "2022", // TODO: EDITAR
    category: "foto",
    client: "Cliente / Marca", // TODO: EDITAR
    description:
      "Descripción breve del proyecto: concepto, enfoque y resultado.", // TODO: EDITAR
    sections: [
      {
        heading: "El encargo", // TODO: EDITAR
        text: "Qué pedía el cliente y de dónde partía la idea. Dos o tres frases de contexto para situar el proyecto.", // TODO: EDITAR
      },
      {
        heading: "El enfoque", // TODO: EDITAR
        text: "Cómo se resolvió: las decisiones de dirección, luz y ritmo que definieron la pieza final.", // TODO: EDITAR
      },
    ],
    cover: "https://picsum.photos/seed/piedra/1200/1600", // TODO: EDITAR
    videoUrl: "", // TODO: pegar URL del vídeo (o dejar vacío)
    gallery: [
      "https://picsum.photos/seed/ribera/1800/1200", // TODO: EDITAR
      "https://picsum.photos/seed/sauce/2000/1250", // TODO: EDITAR
    ],
  },
];

// ----------------------------------------------------------------------------
//  SOBRE MÍ
// ----------------------------------------------------------------------------

export const about = {
  portrait: "https://picsum.photos/seed/retrato/1200/1500", // TODO: EDITAR — tu retrato (1200x1500 aprox)
  // dos imágenes de apoyo para la banda con parallax de "Sobre mí"
  gallery: [
    "https://picsum.photos/seed/cuarzo/700/900", // TODO: EDITAR
    "https://picsum.photos/seed/viento/800/600", // TODO: EDITAR
  ],
  intro: "Filmmaker y fotógrafo afincado en Valencia.", // TODO: EDITAR — frase corta bajo el titular
  // Frase de apertura grande y centrada del hero de "Sobre mí"
  statement:
    "Filmmaker y fotógrafo afincado en Valencia, contando historias en cualquier parte.", // TODO: EDITAR
  bio: [
    "Escribe aquí el primer párrafo de tu biografía. Quién eres, de dónde vienes, qué te mueve a coger una cámara.", // TODO: EDITAR
    "Segundo párrafo: tu enfoque, tu manera de trabajar, los proyectos que te interesan. Mantén un tono cercano y directo.", // TODO: EDITAR
  ],
  // Bloques de historia: etiqueta (izquierda) + párrafo que se revela palabra a
  // palabra al scrollear (derecha). Añade o quita los que quieras.
  story: [
    {
      label: "Quién soy", // TODO: EDITAR
      body: "Soy Marcos Lattanzio, director y fotógrafo. Llevo más de una década detrás de la cámara, entre el documental, la publicidad y el retrato, buscando siempre la imagen que respira.", // TODO: EDITAR
    },
    {
      label: "Cómo trabajo", // TODO: EDITAR
      body: "Empiezo por entender el proyecto de verdad: la marca, el público y la historia detrás del encargo. A partir de ahí propongo una dirección clara y cuido cada decisión de luz, ritmo y montaje.", // TODO: EDITAR
    },
    {
      label: "Filosofía", // TODO: EDITAR
      body: "No sigo tendencias porque sí. Cada proyecto, grande o pequeño, merece el mismo cuidado: algo honesto, bien hecho y pensado para durar.", // TODO: EDITAR
    },
  ],
  // Cada servicio tiene una imagen que aparece flotando junto al cursor al
  // pasar el ratón por su fila (preview interactivo). Cambia la URL por tu foto.
  services: [
    { title: "Grabación de vídeo profesional", detail: "Rodajes para marcas, eventos y proyectos personales.", image: "https://picsum.photos/seed/rodaje/600/750" }, // TODO: EDITAR detalle + imagen
    { title: "Edición de vídeo", detail: "Montaje con ritmo, del bruto a la pieza final.", image: "https://picsum.photos/seed/montaje/600/750" }, // TODO: EDITAR detalle + imagen
    { title: "Color grading", detail: "Etalonaje y look final para que cada plano respire.", image: "https://picsum.photos/seed/etalonaje/600/750" }, // TODO: EDITAR detalle + imagen
    { title: "Fotografía profesional", detail: "Retrato, editorial y campaña.", image: "https://picsum.photos/seed/retratos/600/750" }, // TODO: EDITAR detalle + imagen
    { title: "Edición de fotografía", detail: "Revelado y retoque fino, sin artificios.", image: "https://picsum.photos/seed/revelado/600/750" }, // TODO: EDITAR detalle + imagen
  ],
};

// ----------------------------------------------------------------------------
//  CONTACTO
// ----------------------------------------------------------------------------

export const contact = {
  title: "Hablemos", // TODO: EDITAR — titular grande
  text: "Cuéntame tu proyecto y te respondo en menos de 48 horas.", // TODO: EDITAR
};

// Utilidad interna: no tocar
export function getProject(slug) {
  return projects.find((p) => p.slug === slug);
}
