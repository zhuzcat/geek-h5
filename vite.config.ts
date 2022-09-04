import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import postcsspxtoviewport from "postcss-px-to-viewport";
import { join } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 配置路径别名
  resolve: {
    alias: {
      "@": join(__dirname, "src"),
      "@scss": join(__dirname, "src/assets/styles"),
    },
  },
  // 配置postcss
  css: {
    postcss: {
      plugins: [postcsspxtoviewport({ viewportWidth: 375 })],
    },
  },
});
