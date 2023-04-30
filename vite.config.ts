import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

const vitePWA = VitePWA({
  registerType: "autoUpdate",
  outDir: "dist",
  manifest: {
    name: "React Chat",
    short_name: "RChat",
    description: "A simple chat app",
    theme_color: "#3e3c61",
    icons: [
      {
        src: "assets/images/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
  },
});

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      src: "/src",
      components: "/src/components",
      assets: "/src/assets",
    },
  },

  plugins: [react(), vitePWA],
});
