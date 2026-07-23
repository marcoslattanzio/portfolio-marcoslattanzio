import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { site } from "@/data/content";
import LenisProvider from "@/components/LenisProvider";
import ScrollManager from "@/components/ScrollManager";
import Preloader from "@/components/Preloader";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-inter",
  display: "swap",
});

// Serif editorial de alto contraste para titulares "statement"
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata = {
  title: `${site.name} — ${site.claim}`,
  description: site.description,
};

// Aplica el tema guardado (o el del sistema) antes del primer pintado,
// para que no haya flash de modo incorrecto.
const themeInitScript = `(function(){try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.dataset.theme=t}catch(e){}})()`;

export default function RootLayout({ children }) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${cormorant.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col bg-cream text-ink">
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <LenisProvider>
          <ScrollManager />
          <Preloader />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </LenisProvider>
      </body>
    </html>
  );
}
