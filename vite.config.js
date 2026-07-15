import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  base: "/",

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@api": path.resolve(__dirname, "src/api.js"),
      "@components": path.resolve(__dirname, "src/components"),
      "@pages": path.resolve(__dirname, "src/pages"),
      "@context": path.resolve(__dirname, "src/context"),

      "#minpath": path.resolve(__dirname, "node_modules/minpath/index.js"),
      "#minproc": path.resolve(__dirname, "node_modules/minproc/index.js"),
      "#minurl": path.resolve(__dirname, "node_modules/minurl/index.js"),

      "react-markdown": "markdown-to-jsx",
    },
  },

  optimizeDeps: {
    exclude: ["framer-motion"],
    include: [
      "chart.js",
      "react-chartjs-2",
      "jwt-decode",
      "react-phone-input-2",
    ],
  },

  server: {
    port: 3000,

    proxy: {
      "/api": {
        // Prefer local API when VITE_API_PROXY_TARGET is set (e.g. http://localhost:5000)
        target:
          process.env.VITE_API_PROXY_TARGET || "https://api.bizuply.com",
        changeOrigin: true,
        secure: false,
        // AI generate + large site PUT can exceed default proxy timeouts
        timeout: 180000,
        proxyTimeout: 180000,
        rewrite: (proxyPath) => proxyPath.replace(/^\/api/, "/api"),
      },
    },

    watch: {
      ignored: ["**/.history/**"],
    },
  },

  build: {
    rollupOptions: {
      input: path.resolve(__dirname, "index.html"),
    },

    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },

  define: {
    "process.env.NODE_ENV": JSON.stringify(
      process.env.NODE_ENV || "development"
    ),
  },
});