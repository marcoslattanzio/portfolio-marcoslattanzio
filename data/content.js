import projectsData from "./projects.json";

export const site = {
  "name": "Marcos Lattanzio",
  "claim": "Filmmaker y Fotógrafo",
  "description": "Portfolio de fotografía y filmmaking",
  "city": "Valencia, España",
  "email": "marcoslattanzio@gmail.com",
  "phone": "+34 601 383 074"
};

export const socials = [
  {
    "label": "Instagram",
    "url": "https://www.instagram.com/marcoslattanzio/?hl=es"
  },
  {
    "label": "YouTube",
    "url": "https://www.youtube.com/@marcoslattanzio"
  },
  {
    "label": "LinkedIn",
    "url": "https://www.linkedin.com/in/marcos-lattanzio-caparros-1b1186251/"
  }
];

export const nav = [
  {
    "label": "Inicio",
    "href": "/"
  },
  {
    "label": "Proyectos",
    "href": "/proyectos"
  },
  {
    "label": "Sobre mí",
    "href": "/sobre-mi"
  },
  {
    "label": "Contacto",
    "href": "/contacto"
  }
];

export const categories = [
  {
    "id": "todos",
    "label": "Todos"
  },
  {
    "id": "film",
    "label": "Film"
  },
  {
    "id": "foto",
    "label": "Fotografía"
  }
];

export const home = {
  "hero": {
    "video": "/videos/output.mp4",
    "image": "https://picsum.photos/seed/atlas/2400/1400",
    "title": "ShowReel 2026",
    "subtitle": ""
  },
  "constellation": {
    "name": "Marcos Lattanzio",
    "role": "Filmmaker y Fotógrafo",
    "images": [
      {
        "src": "/images/constellation-10.jpg",
        "alt": ""
      },
      {
        "src": "/images/constellation-02.jpg",
        "alt": ""
      },
      {
        "src": "/images/constellation-03.jpg",
        "alt": ""
      },
      {
        "src": "/images/constellation-04.jpg",
        "alt": ""
      },
      {
        "src": "/images/constellation-05.jpg",
        "alt": ""
      },
      {
        "src": "/images/constellation-06.jpg",
        "alt": ""
      },
      {
        "src": "/images/constellation-07.jpg",
        "alt": ""
      },
      {
        "src": "/images/constellation-08.jpg",
        "alt": ""
      },
      {
        "src": "/images/constellation-09.jpg",
        "alt": ""
      },
      {
        "src": "/images/constellation-01.jpg",
        "alt": ""
      },
      {
        "src": "/images/constellation-11.jpg",
        "alt": ""
      },
      {
        "src": "/images/constellation-12.jpg",
        "alt": ""
      },
      {
        "src": "/images/constellation-13.jpg",
        "alt": ""
      },
      {
        "src": "/images/constellation-14.jpg",
        "alt": ""
      },
      {
        "src": "/images/constellation-15.jpg",
        "alt": ""
      }
    ]
  },
  "collage": {
    "eyebrow": "(01) — Selección",
    "title": "Fragmentos de trabajos recientes",
    "images": [
      {
        "src": "/images/Recurso 6.jpg",
        "alt": "Fragmento 01",
        "speed": 1.4
      },
      {
        "src": "/images/Recurso 23.jpg",
        "alt": "Fragmento 02",
        "speed": -0.8
      },
      {
        "src": "/images/Recurso 29.jpg",
        "alt": "Fragmento 03",
        "speed": 0.6
      },
      {
        "src": "/images/Recurso 24.jpg",
        "alt": "Fragmento 04",
        "speed": -1.2
      },
      {
        "src": "/images/Recurso 3.jpg",
        "alt": "Fragmento 05",
        "speed": 1
      }
    ]
  },
  "statements": [
    {
      "background": "/images/constellation-01.jpg",
      "inset": "/images/constellation-02.jpg",
      "title": "STUDIO"
    },
    {
      "background": "/images/constellation-06.jpg",
      "inset": "/images/constellation-03.jpg",
      "title": "MAKING OFF"
    },
    {
      "background": "/images/DSC03127.jpg",
      "inset": "/images/constellation-13.jpg",
      "title": "PRODUCTO"
    }
  ],
  "filmstrip": {
    "title": "Fragmentos",
    "images": [
      {
        "src": "/images/constellation-05.jpg",
        "alt": "Archivo 01",
        "aspect": "900/1200"
      },
      {
        "src": "/images/constellation-09.jpg",
        "alt": "Archivo 02",
        "aspect": "900/1200"
      },
      {
        "src": "/images/constellation-07.jpg",
        "alt": "Archivo 03",
        "aspect": "900/1200"
      },
      {
        "src": "/images/Recurso 25.jpg",
        "alt": "Archivo 04",
        "aspect": "800/1000"
      },
      {
        "src": "/images/Recurso 7.jpg",
        "alt": "Archivo 05",
        "aspect": "900/1200"
      },
      {
        "src": "/images/constellation-08.jpg",
        "alt": "Archivo 06",
        "aspect": "900/1200"
      },
      {
        "src": "/images/DSC03127.jpg",
        "alt": "Archivo 07",
        "aspect": "900/1200",
        "objectPosition": "left"
      },
      {
        "src": "/images/constellation-11.jpg",
        "alt": "Archivo 08",
        "aspect": "900/1200"
      },
      {
        "src": "/images/constellation-06.jpg",
        "alt": "Archivo 09",
        "aspect": "900/1200"
      }
    ]
  },
  "featuredSlugs": [
    "proyecto-01",
    "proyecto-02",
    "proyecto-03",
    "proyecto-04"
  ],
  "aboutTeaser": {
    "eyebrow": "(03) — Sobre mí",
    "text": "Cuento historias con cámara desde hace más de una década. Trabajo entre el documental, la moda y la publicidad, buscando siempre la imagen que respira.",
    "linkLabel": "Conocer más"
  },
  "cta": {
    "eyebrow": "(04) — Contacto",
    "title": "¿Tienes un proyecto en mente?",
    "linkLabel": "Hablemos"
  }
};

// Los proyectos viven en projects.json: es lo único que escribe el panel de
// /admin, así que separarlo evita que una publicación pueda romper este JS.
export const projects = projectsData;

export const about = {
  "badge": "/images/memoji.png",
  "portrait": "/images/yo.jpeg",
  "gallery": [
    "https://picsum.photos/seed/cuarzo/700/900",
    "https://picsum.photos/seed/viento/800/600"
  ],
  "intro": "Filmmaker y fotógrafo afincado en Valencia.",
  "statement": "Filmmaker y fotógrafo afincado en Valencia, contando historias en cualquier parte.",
  "bio": [
    "Escribe aquí el primer párrafo de tu biografía. Quién eres, de dónde vienes, qué te mueve a coger una cámara.",
    "Segundo párrafo: tu enfoque, tu manera de trabajar, los proyectos que te interesan. Mantén un tono cercano y directo."
  ],
  "story": [
    {
      "label": "Quién soy",
      "body": "Soy Marcos Lattanzio, director y fotógrafo. Llevo más de una década detrás de la cámara, entre el documental, la publicidad y el retrato, buscando siempre la imagen que respira."
    },
    {
      "label": "Cómo trabajo",
      "body": "Empiezo por entender el proyecto de verdad: la marca, el público y la historia detrás del encargo. A partir de ahí propongo una dirección clara y cuido cada decisión de luz, ritmo y montaje."
    },
    {
      "label": "Filosofía",
      "body": "No sigo tendencias porque sí. Cada proyecto, grande o pequeño, merece el mismo cuidado: algo honesto, bien hecho y pensado para durar."
    }
  ],
  "services": [
    {
      "title": "Grabación de vídeo profesional",
      "detail": "Rodajes para marcas, eventos y proyectos personales.",
      "image": "https://picsum.photos/seed/rodaje/600/750"
    },
    {
      "title": "Edición de vídeo",
      "detail": "Montaje con ritmo, del bruto a la pieza final.",
      "image": "https://picsum.photos/seed/montaje/600/750"
    },
    {
      "title": "Color grading",
      "detail": "Etalonaje y look final para que cada plano respire.",
      "image": "https://picsum.photos/seed/etalonaje/600/750"
    },
    {
      "title": "Fotografía profesional",
      "detail": "Retrato, editorial y campaña.",
      "image": "https://picsum.photos/seed/retratos/600/750"
    },
    {
      "title": "Edición de fotografía",
      "detail": "Revelado y retoque fino, sin artificios.",
      "image": "https://picsum.photos/seed/revelado/600/750"
    }
  ]
};

export const contact = {
  "title": "Hablemos",
  "text": "Cuéntame tu proyecto y te respondo en menos de 48 horas."
};

export function getProject(slug) {
  return projects.find((p) => p.slug === slug);
}
