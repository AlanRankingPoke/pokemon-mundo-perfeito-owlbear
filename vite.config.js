import { defineConfig } from "vite";

export default defineConfig({
  base: "/pokemon-mundo-perfeito-owlbear/",

  server: {
    cors: {
      origin: "https://www.owlbear.rodeo",
    },
  },
});