import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/wp-content/uploads": {
        target: "https://goodpartsadmin.boomsite.fm",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
