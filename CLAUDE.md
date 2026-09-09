# Filmmaker Portfolio — Next.js 16 + GSAP + Lenis

## 🎬 Project Overview

Personal portfolio for filmmaker & photographer Marcos Lattanzio. Design inspired by kettal.com with smooth parallax effects, custom animations, and responsive layout.

- **Live site:** (pending deployment)
- **GitHub:** https://github.com/marcoslattanzio/portfolio-marcoslattanzio
- **Design system:** Cream (#f4f3ee) + Ink (#121210) + Serif typography

## 🛠 Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4
- **Animation:** GSAP 3.15 + ScrollTrigger
- **Smooth scroll:** Lenis 1.3
- **Font:** Inter (sans-serif)

## 📁 Project Structure

```
├── app/                      # Next.js pages
│   ├── page.js              # Home (hero, collage, projects, marquee, about teaser)
│   ├── proyectos/page.js    # Projects grid with filter
│   ├── proyectos/[slug]/    # Dynamic project detail pages
│   ├── sobre-mi/page.js     # About with parallax + services
│   ├── contacto/page.js     # Contact form
│   └── globals.css          # Design tokens + reusable animations
├── components/              # Reusable React components
│   ├── LenisProvider.js     # Smooth scroll setup
│   ├── ImageReveal.js       # Clip-path + scale animation
│   ├── TextReveal.js        # Line-by-line text reveal
│   ├── ParallaxImage.js     # Parallax scroll effect
│   ├── Drift.js             # Layer drift animation (used in Sobre mí)
│   ├── Header.js            # Navigation + mobile menu
│   ├── Footer.js            # Site footer (all pages)
│   ├── ProjectCard.js       # Project grid card
│   └── ... (16 total components)
├── data/content.js          # ⭐ CENTRAL CONTENT — edit here for copy/images/links
├── lib/                     # Utility hooks + GSAP setup
├── public/images/           # Placeholder SVGs (replace with your photos)
└── package.json
```

## 🎯 Key Features Implemented

- ✅ Smooth inertial scroll (Lenis lerp: 0.08)
- ✅ Image reveals with clip-path mask + scale
- ✅ Parallax on hero, collage, projects, services
- ✅ Text reveals (line-by-line stagger)
- ✅ Animated underlines on hover
- ✅ Project card hover scale + info reveal
- ✅ Marquee loop text
- ✅ Page transitions (fade + slide)
- ✅ Custom cursor (grows on hover)
- ✅ Mobile overlay menu with stagger animation
- ✅ Preloader fade + overlay slide
- ✅ Respects prefers-reduced-motion

## 📝 How to Edit Content

**ALL content is centralized in [`data/content.js`](data/content.js).** No need to touch components for copy changes.

### Example edits:

```js
// Site name & claim
site: {
  name: "Marcos Lattanzio",
  claim: "Filmmaker & Photographer"
}

// Projects (8 total)
projects: [
  {
    title: "Project Name",
    year: 2024,
    client: "Client Name",
    category: "Film",  // or "Fotografía"
    description: "...",
    cover: "https://...",
    videoUrl: "https://vimeo.com/...",  // auto-converts to embed
    gallery: ["img1.jpg", "img2.jpg", ...]
  }
]

// Services (5 total)
about: {
  services: [
    { title: "Grabación de vídeo profesional", detail: "..." },
    // ...
  ]
}
```

See TODO comments in content.js for all 19 editable sections.

## 🖼 Replace Placeholder Images

Currently using aesthetic placeholder images from picsum.photos. To use your own:

1. **Add your photos to `public/images/`** (e.g., `hero.jpg`, `project-01.jpg`)
2. **Update URLs in `data/content.js`** from `https://picsum.photos/...` to `/images/your-photo.jpg`

Example:
```js
home: {
  hero: {
    image: "/images/hero.jpg"  // ← change this
  }
}
```

## 🚀 Local Development

### First time (Windows or Mac):
```bash
git clone https://github.com/marcoslattanzio/portfolio-marcoslattanzio.git
cd portfolio-marcoslattanzio
npm install
npm run dev
```

Open http://localhost:3000

### After cloning (Mac tip):
If you get "command not found: node", install Node.js:
- Download from https://nodejs.org (LTS)
- Or via Homebrew: `brew install node`

Then `npm install && npm run dev`

## 💾 Git Workflow

After making changes:
```bash
git add -A
git commit -m "Update projects section"
git push
```

To sync from another device:
```bash
git pull
```

## 🌐 Deployment

Live on **Vercel**, auto-deploying on every push to `main`.

The site used to be a static export (`output: "export"` → an `out/` folder you
could drop on any file host like Hostinger). That was dropped when `/admin` got
password-protected: the check lives in `proxy.js` and needs a server in front of
it. Static hosting is no longer an option unless that protection goes away.

### Required environment variables

Set in **Vercel → Settings → Environment Variables** (see `.env.example`):

| Variable | What it is |
|---|---|
| `ADMIN_USER` | Username for `/admin` |
| `ADMIN_PASSWORD` | Password for `/admin` |

Without them `/admin` returns 503 — it fails closed on purpose, so forgetting to
configure them locks you out rather than leaving the panel open.

For local work, copy `.env.example` to `.env.local`. If you skip it, `/admin`
just opens in dev without asking.

## 📤 Publishing projects (/admin)

`/admin` is a content panel for adding, editing, reordering and deleting
projects without touching code.

- The **Proyecto destacado** field (0 = no, 1–4 = slot) drives the "Proyectos
  destacados" section on the home page, ordered by slot. Assigning a slot that
  another project holds takes it away from that one, so a slot never has two
  projects. This replaced `home.featuredSlugs`, a fixed list in `content.js`
  the panel never wrote — which meant the same four forever.
- Photos are resized to 2400px and recompressed in the browser before upload,
  so the repo doesn't bloat (git keeps every version forever).
- Videos are Vimeo/YouTube links, not uploads.
- Publishing writes `data/projects.json` plus any new photos as a **single**
  commit via the GitHub Git Data API, so Vercel rebuilds once per publish.
- It needs a fine-grained GitHub token with `Contents: Read and write` on this
  repo, pasted into the panel once (stored in the browser, never in the repo).
- `data/projects.json` is the only file the panel writes, which is why projects
  were split out of `content.js` — a publish can't break the surrounding JS.

After publishing, `git pull` locally before making further changes, or the repo
and your working copy drift apart.

## 🎨 Customize Design

### Colors (in `app/globals.css`):
```css
@theme {
  --color-cream: #f4f3ee;
  --color-ink: #121210;
  --color-muted: #77766e;
  --color-line: #dedcd3;
}
```

### Smooth scroll weight (in `components/LenisProvider.js`):
```js
lerp: 0.08  // Higher = more weighty, lower = snappier
```

### Animation timing (per component):
Each animation file has `duration`, `ease`, and `delay` props.

## 📞 Contact Info Editable Sections

- Email: `data/content.js` → `contact.email`
- Phone: `data/content.js` → `contact.phone`
- City: `data/content.js` → `site.city`
- Social links: `data/content.js` → `socials` array

## 🐛 Troubleshooting

**"npm: command not found"**
- Install Node.js from https://nodejs.org

**Images not loading**
- Check URL in `data/content.js` matches actual file path in `public/images/`
- Rebuild: `npm run build`

**Animations too fast/slow**
- Edit component duration values (in components/*.js GSAP timelines)

**Parallax not working**
- Ensure parent has `relative` class
- Check browser console (F12) for errors

## @AGENTS.md

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
