import AboutContent from "./AboutContent";

// El cuerpo vive en un componente de cliente porque lee el contenido del
// proveedor (para la vista previa del panel), y metadata solo existe en
// componentes de servidor: por eso quedan separados.
export const metadata = { title: "Sobre mí" };

export default function Page() {
  return <AboutContent />;
}
