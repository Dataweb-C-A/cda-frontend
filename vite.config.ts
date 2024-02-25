import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA, VitePWAOptions } from "vite-plugin-pwa";

const manifestForPlugin: Partial<VitePWAOptions> = {
  registerType: "autoUpdate",
  includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
  workbox: {
    clientsClaim: true,
    skipWaiting: true
  },
  devOptions: {
    enabled: true
  },
  manifest: {
    name: "Rifamax Admin",
    short_name: "Rifamax",
    description: "Rifamax dashboard administrativo de rifas",
    icons: [
      {
        src: "/favicon/android-icon-192x192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "/rifamax-icon.png",
        sizes: "500x500",
        type: "image/png"
      },
      {
        src: "/favicon/apple-icon-180x180.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "apple touch icon",
      },
      {
        src: "/rifamax-icon.png",
        sizes: "500x500",
        type: "image/png",
        purpose: "any maskable",
      }
    ],
    theme_color: "#ffffff",
    background_color: "#ffffff",
    display: "standalone",
    scope: "/",
    start_url: "/",
    orientation: "portrait"
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        clientsClaim: true,
        skipWaiting: true
      }
    }
  )],
  base: "./"
})