# Setup en tu Mac 🍎

## 1️⃣ Clone el repositorio

```bash
git clone https://github.com/marcoslattanzio/portfolio-marcoslattanzio.git
cd portfolio-marcoslattanzio
```

## 2️⃣ Instala dependencias

Si no tienes Node.js instalado:
```bash
# Via Homebrew (recomendado)
brew install node

# O descarga de https://nodejs.org (LTS)
```

Luego:
```bash
npm install
```

## 3️⃣ Arranca el servidor

```bash
npm run dev
```

Abre **http://localhost:3000** en tu navegador.

## 4️⃣ Abre en Claude Code

1. Abre Claude Code en tu Mac
2. **File → Open Folder** → selecciona `portfolio-marcoslattanzio`
3. Claude Code leerá automáticamente `CLAUDE.md` con toda la documentación del proyecto

## 📝 Para editar contenido

**TODO el contenido está en `data/content.js`** — verás TODO comments que indican qué cambiar:
- Título, nombre, email, teléfono
- Links de redes sociales  
- 8 proyectos (título, cliente, año, descripción, video, galería)
- Bio sobre mí
- 5 servicios (grabación, edición, color grading, etc.)
- Texto de contacto

Solo edita ese archivo, guarda, y el navegador se recarga automáticamente (HMR).

## 🖼 Reemplazar imágenes placeholder

1. Copia tus fotos a `public/images/` (ej: `hero.jpg`, `project-01.jpg`)
2. En `data/content.js`, cambia URLs de `https://picsum.photos/...` a `/images/tu-foto.jpg`

Ejemplo:
```js
home: {
  hero: {
    image: "/images/hero.jpg"  // ← cambiar esto
  }
}
```

## 🚀 Pushear cambios

```bash
git add -A
git commit -m "Update projects section"
git push
```

## 🔄 Sync desde Windows (o viceversa)

Cada máquina:
```bash
git pull   # obtener cambios recientes
git push   # subir tus cambios
```

## 📞 Preguntas?

Lee **CLAUDE.md** en la raíz del proyecto — tiene la documentación completa.

¡Buen finde! 🎬
