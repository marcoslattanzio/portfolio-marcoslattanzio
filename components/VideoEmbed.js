// Embed de vídeo: acepta URLs normales de Vimeo o YouTube y las convierte a
// iframe. Si no hay URL, muestra un placeholder con instrucciones.
function toEmbedUrl(url) {
  if (!url) return null;
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  const youtube = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/,
  );
  if (youtube) return `https://www.youtube.com/embed/${youtube[1]}`;
  return url; // ya es una URL de embed
}

export default function VideoEmbed({ url, title = "Vídeo", className = "" }) {
  const embedUrl = toEmbedUrl(url);

  if (!embedUrl) {
    return (
      <div
        className={`flex aspect-video w-full items-center justify-center border border-line bg-[#e5e5e0] ${className}`}
      >
        <p className="px-6 text-center text-xs uppercase tracking-[0.18em] text-muted">
          Vídeo · pega la URL de Vimeo o YouTube en data/content.js
        </p>
      </div>
    );
  }

  return (
    <div className={`aspect-video w-full ${className}`}>
      <iframe
        src={embedUrl}
        title={title}
        className="h-full w-full"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
}
