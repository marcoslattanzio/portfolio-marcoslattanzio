// Marquee horizontal infinito. El contenido se duplica (la copia va con
// aria-hidden) y la animación CSS desplaza el track un -50%.
// "reverse" invierte el sentido (útil para filas contrapuestas).
export default function Marquee({
  text,
  duration = 40,
  reverse = false,
  className = "",
}) {
  const chunk = (
    <span className="shrink-0">
      {Array.from({ length: 4 }).map((_, i) => (
        <span key={i} className="mx-8 inline-block md:mx-14">
          {text}
          <span className="ml-8 inline-block text-muted md:ml-14" aria-hidden>
            —
          </span>
        </span>
      ))}
    </span>
  );

  return (
    <div
      className={`overflow-hidden whitespace-nowrap ${className}`}
      style={{ "--marquee-duration": `${duration}s` }}
    >
      <div
        className="marquee-track"
        style={reverse ? { animationDirection: "reverse" } : undefined}
      >
        {chunk}
        <span aria-hidden>{chunk}</span>
      </div>
    </div>
  );
}
