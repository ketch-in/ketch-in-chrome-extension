import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

const path = require("path");

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'example/index.html',
          dest: './'
        }
      ]
    })
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "ketchInComponents",
      fileName: "ketch-in-components",
    },
  },
});
