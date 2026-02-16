import { defineConfig } from "vite";

export default defineConfig({
  server: {
    proxy: {
      "/n8n": {
        target: "http://localhost:5678",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/n8n/, ""),
      },
    },
  },
});
