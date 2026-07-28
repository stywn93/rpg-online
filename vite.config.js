import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import flowbiteReact from "flowbite-react/plugin/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), flowbiteReact()],
  server: {
    proxy: {
      "/api/v1": {
        target: "http://localhost",
        changeOrigin: true,
      },
    },
    allowedHosts: ['.loca.lt', '.ngrok-free.app', '.ngrok-free.dev']// allows any loca.lt subdomain
  },
});
