// El panel es una URL pública (la web es estática, no hay login de servidor).
// Quien entre sin token no puede hacer nada, pero al menos que no lo indexe
// Google ni salga en búsquedas.
export const metadata = {
  title: "Panel",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  return children;
}
