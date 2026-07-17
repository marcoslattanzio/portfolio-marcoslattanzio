import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  if (process.env.NODE_ENV !== "production") {
    // expuestos solo en desarrollo, para poder depurar desde la consola
    window.gsap = gsap;
    window.ScrollTrigger = ScrollTrigger;
  }
}

export { gsap, ScrollTrigger };
