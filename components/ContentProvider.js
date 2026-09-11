"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  about,
  categories,
  contact,
  home,
  nav,
  site,
  socials,
} from "@/data/content";
import { isCmsPreview } from "@/lib/hooks";

// De dónde sacan el contenido las páginas.
//
// Normalmente reparte lo que hay en site.json, igual que antes. La diferencia
// es que ahora se puede sustituir en caliente: cuando la web se abre dentro
// del panel (con ?cms=1), el panel le manda el borrador según escribes y la
// página se vuelve a pintar con él. Así la vista previa es la web de verdad,
// no una imitación, y no hay que marcar campo por campo dónde va cada texto.

const ContentContext = createContext(null);

export function useContent() {
  const value = useContext(ContentContext);
  if (!value) {
    throw new Error("useContent debe usarse dentro de <ContentProvider>");
  }
  return value;
}

export default function ContentProvider({ children }) {
  const [content, setContent] = useState({
    site,
    socials,
    nav,
    categories,
    home,
    about,
    contact,
  });

  useEffect(() => {
    if (!isCmsPreview()) return;

    const onMessage = (event) => {
      // solo se acepta al panel, que vive en este mismo dominio
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === "cms:content" && event.data.content) {
        setContent(event.data.content);
      }
    };

    window.addEventListener("message", onMessage);
    // avisar de que ya está lista para recibir el borrador: si el panel
    // enviara antes de que montara este efecto, el mensaje se perdería
    window.parent?.postMessage(
      { type: "cms:ready" },
      window.location.origin,
    );

    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <ContentContext.Provider value={content}>
      {children}
    </ContentContext.Provider>
  );
}
