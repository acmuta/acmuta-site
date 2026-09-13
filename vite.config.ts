import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { execFileSync } from "node:child_process";

/** Regenerates officer photo variants when image-src/officerpics changes while the dev server runs */
function officerPhotos(): Plugin {
  const dir = path.resolve(__dirname, "image-src/officerpics");
  let timer: ReturnType<typeof setTimeout>;
  return {
    name: "officer-photos",
    configureServer(server) {
      server.watcher.add(dir);
      server.watcher.on("all", (_event, file) => {
        if (path.relative(dir, file).startsWith("..")) return;
        clearTimeout(timer);
        timer = setTimeout(() => {
          try {
            execFileSync(process.execPath, ["scripts/officer-photos.mjs"], { stdio: "inherit" });
          } catch (e) {
            console.error(e);
          }
        }, 500);
      });
    },
  };
}

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), officerPhotos()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
