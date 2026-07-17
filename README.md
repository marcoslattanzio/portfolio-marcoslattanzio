# Portfolio — Filmmaker & Photographer

Portfolio personal con estética editorial: smooth scroll con inercia, reveals
con máscara, parallax, marquee y transiciones de página.

**Stack:** Next.js (App Router) · Tailwind CSS v4 · GSAP + ScrollTrigger · Lenis

## Arrancar el proyecto

```bash
npm install
npm run dev      # → http://localhost:3000
npm run build    # build de producción
```

## ✏️ Dónde editar TU contenido

### 1. Textos, enlaces y datos → `data/content.js` (el único archivo que necesitas tocar)

Todo el contenido está centralizado ahí, marcado con comentarios `// TODO: EDITAR`:

| Qué | Dónde en `content.js` |
| --- | --- |
| Tu nombre, claim, email, teléfono, ciudad | `site` |
| Instagram / Vimeo / YouTube | `socials` |
| Hero, collage, teaser "sobre mí", CTA | `home` |
| Los 8 proyectos (título, año, cliente, descripción, portada, galería) | `projects` |
| Bio, servicios, clientes | `about` |
| Titular y texto de contacto | `contact` |

### 2. Tus fotos → `/public/images/`

Cada placeholder es un SVG gris con su nombre y dimensiones recomendadas
escritas en el centro (ej. `IMG-07 · 1200x1500`). Para poner tus fotos:

1. Exporta tu foto con esas proporciones aproximadas (jpg o webp, ~200–400 KB).
2. Guárdala en `/public/images/` (ej. `mi-proyecto.jpg`).
3. Cambia la ruta en `data/content.js`: `cover: "/images/mi-proyecto.jpg"`.

Mapa de placeholders:

- `img-01` — fondo del hero (Home)
- `img-02` a `img-06` — collage flotante (Home)
- `img-07` a `img-14` — portadas de los 8 proyectos
- `img-15` a `img-18` — galerías de las páginas de proyecto
- `img-19` — tu retrato (Sobre mí)

Si quieres regenerar los placeholders: `node scripts/generate-placeholders.mjs`.

### 3. Tus vídeos → campo `videoUrl` de cada proyecto en `data/content.js`

Pega la URL **normal** de Vimeo o YouTube (no hace falta la de embed):

```js
videoUrl: "https://vimeo.com/123456789",
// o
videoUrl: "https://www.youtube.com/watch?v=XXXXXXXXXXX",
```

Déjala vacía (`""`) y se mostrará un placeholder con instrucciones.

## Estructura

```
data/content.js          ← TODO tu contenido
app/
  page.js                ← Home (hero, collage, destacados, marquee, CTA)
  proyectos/page.js      ← grid con filtro Todos / Film / Fotografía
  proyectos/[slug]/      ← detalle de proyecto (vídeo + galería)
  sobre-mi/page.js
  contacto/page.js
  layout.js              ← fuente, header, footer, preloader, cursor
  template.js            ← transición de página (fade)
  globals.css            ← colores, subrayados, marquee, formulario
components/
  LenisProvider.js       ← smooth scroll con inercia
  ImageReveal.js         ← máscara + scale al hacer scroll
  TextReveal.js          ← titulares línea a línea
  ParallaxImage.js       ← parallax sutil
  Collage.js             ← imágenes flotantes a distintas velocidades
  Marquee.js             ← texto en bucle horizontal
  ProjectCard.js         ← tarjeta con hover (scale + título/año)
  StatementStack.js      ← statements apilados con pin (se cubren en el sitio)
  FilmstripSection.js    ← carrete horizontal ligado al scroll vertical
  Header.js              ← header fijo + menú móvil overlay
  Footer.js / Preloader.js / CustomCursor.js / VideoEmbed.js
  ContactForm.js
  ProjectsBoard.js       ← mesa de trabajo: portadas con tilt 3D y transición inmersiva
```

## Personalización rápida

- **Colores**: variables `--color-cream`, `--color-ink`, `--color-muted`,
  `--color-line` y `--color-accent` (verde de los hovers) en `app/globals.css`
  (bloque `@theme`). El **modo oscuro** redefine esas mismas variables en el
  bloque `[data-theme="dark"]` — el toggle del header lo guarda en localStorage
  y por defecto sigue la preferencia del sistema.
- **Vídeo del hero**: pega la ruta del .mp4 en `home.hero.video` de
  `data/content.js` (ej. guárdalo en `/public/videos/hero.mp4`). Vacío = usa
  la imagen.
- **Tipografía**: fuente `Inter` en `app/layout.js` (cámbiala por otra de
  Google Fonts en una línea).
- **Peso del scroll**: `lerp` en `components/LenisProvider.js` (más bajo =
  más inercia).
- **Añadir un proyecto**: duplica un objeto del array `projects` en
  `content.js` con un `slug` nuevo — la página de detalle se genera sola.

## Accesibilidad

Todas las animaciones (scroll suave, reveals, parallax, marquee, cursor,
preloader) respetan `prefers-reduced-motion` y se desactivan si el sistema
lo pide.

## Formulario de contacto

Es solo maqueta (sin backend). Para recibir mensajes reales, conéctalo a
Formspree, Basin o un route handler de Next en `components/ContactForm.js`.
