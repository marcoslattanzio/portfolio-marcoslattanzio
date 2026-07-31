"use client";

import { useState } from "react";
import { home, site, contact, socials, nav, projects, about, categories } from "@/data/content";

export default function AdminPanel() {
  const [formData, setFormData] = useState({
    site,
    socials,
    nav,
    categories,
    home,
    projects,
    about,
    contact,
  });
  const [message, setMessage] = useState("");

  const handleChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleNestedChange = (section, parent, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [parent]: {
          ...prev[section][parent],
          [field]: value,
        },
      },
    }));
  };

  const downloadJSON = () => {
    const json = JSON.stringify(formData, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "content.json";
    a.click();
    URL.revokeObjectURL(url);
    setMessage("✓ JSON descargado");
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="min-h-screen bg-cream p-8 md:p-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-light mb-2">Editor de contenido</h1>
        <p className="text-ink/60 mb-4">
          Edita y descarga el JSON. Luego reemplázalo en tu proyecto.
        </p>
        <p className="text-sm text-ink/50 mb-8 bg-cream/50 p-3 rounded">
          📝 <strong>Instrucciones:</strong> Edita los campos abajo, haz clic en "Descargar JSON",
          y reemplaza el archivo <code className="bg-white px-1">data/content.js</code> en tu proyecto
          con el contenido del JSON descargado.
        </p>

        <div className="space-y-8">
          {/* Site */}
          <section className="bg-white p-6 rounded-lg border border-ink/10">
            <h2 className="text-2xl font-light mb-4">Información del sitio</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nombre</label>
                <input
                  type="text"
                  value={formData.site.name}
                  onChange={(e) => handleChange("site", "name", e.target.value)}
                  className="w-full px-3 py-2 border border-ink/20 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Claim</label>
                <input
                  type="text"
                  value={formData.site.claim}
                  onChange={(e) => handleChange("site", "claim", e.target.value)}
                  className="w-full px-3 py-2 border border-ink/20 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={formData.site.email}
                  onChange={(e) => handleChange("site", "email", e.target.value)}
                  className="w-full px-3 py-2 border border-ink/20 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Teléfono</label>
                <input
                  type="text"
                  value={formData.site.phone}
                  onChange={(e) => handleChange("site", "phone", e.target.value)}
                  className="w-full px-3 py-2 border border-ink/20 rounded"
                />
              </div>
            </div>
          </section>

          {/* Hero */}
          <section className="bg-white p-6 rounded-lg border border-ink/10">
            <h2 className="text-2xl font-light mb-4">Hero (portada)</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Título</label>
                <input
                  type="text"
                  value={formData.home.hero.title}
                  onChange={(e) => handleNestedChange("home", "hero", "title", e.target.value)}
                  className="w-full px-3 py-2 border border-ink/20 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Subtítulo</label>
                <input
                  type="text"
                  value={formData.home.hero.subtitle}
                  onChange={(e) => handleNestedChange("home", "hero", "subtitle", e.target.value)}
                  className="w-full px-3 py-2 border border-ink/20 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Vídeo (URL o ruta local)</label>
                <input
                  type="text"
                  value={formData.home.hero.video}
                  onChange={(e) => handleNestedChange("home", "hero", "video", e.target.value)}
                  className="w-full px-3 py-2 border border-ink/20 rounded"
                  placeholder="ej. /videos/hero.mp4"
                />
              </div>
            </div>
          </section>

          {/* Constelación */}
          <section className="bg-white p-6 rounded-lg border border-ink/10">
            <h2 className="text-2xl font-light mb-4">Constelación</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nombre</label>
                <input
                  type="text"
                  value={formData.home.constellation.name}
                  onChange={(e) => handleNestedChange("home", "constellation", "name", e.target.value)}
                  className="w-full px-3 py-2 border border-ink/20 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Rol / Subtítulo</label>
                <input
                  type="text"
                  value={formData.home.constellation.role}
                  onChange={(e) => handleNestedChange("home", "constellation", "role", e.target.value)}
                  className="w-full px-3 py-2 border border-ink/20 rounded"
                />
              </div>
            </div>
          </section>

          {/* Contacto */}
          <section className="bg-white p-6 rounded-lg border border-ink/10">
            <h2 className="text-2xl font-light mb-4">Contacto</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={formData.contact.email}
                  onChange={(e) => handleChange("contact", "email", e.target.value)}
                  className="w-full px-3 py-2 border border-ink/20 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Mensaje de éxito</label>
                <input
                  type="text"
                  value={formData.contact.successMessage}
                  onChange={(e) => handleChange("contact", "successMessage", e.target.value)}
                  className="w-full px-3 py-2 border border-ink/20 rounded"
                />
              </div>
            </div>
          </section>

          {/* Botón descargar */}
          <div className="flex gap-4 items-center">
            <button
              onClick={downloadJSON}
              className="px-6 py-3 bg-ink text-cream rounded font-light hover:bg-ink/90"
            >
              📥 Descargar JSON
            </button>
            {message && <p className="text-green-600">{message}</p>}
          </div>

          {/* Instrucciones finales */}
          <section className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="font-medium mb-3">¿Cómo guardar los cambios?</h3>
            <ol className="text-sm space-y-2 list-decimal list-inside text-ink/80">
              <li>Edita el contenido arriba</li>
              <li>Haz clic en "Descargar JSON"</li>
              <li>
                Abre el archivo <code className="bg-white px-1">data/content.js</code> en tu proyecto
              </li>
              <li>Reemplaza el contenido con el del JSON descargado (que es JS válido)</li>
              <li>Guarda y recarga el navegador</li>
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
}
