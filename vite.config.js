import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function softCopyUploadPlugin() {
  return {
    name: "soft-copy-upload",
    configureServer(server) {
      server.middlewares.use("/upload.php", (req, res, next) => {
        if (req.method === "OPTIONS") {
          res.statusCode = 204;
          res.setHeader("Access-Control-Allow-Origin", "*");
          res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
          res.setHeader("Access-Control-Allow-Headers", "Content-Type");
          res.end();
          return;
        }

        if (req.method !== "POST") {
          next();
          return;
        }

        const chunks = [];
        req.on("data", (chunk) => chunks.push(chunk));
        req.on("end", () => {
          try {
            const raw = Buffer.concat(chunks).toString("utf8");
            const json = JSON.parse(raw);
            const source = json.source || json.image || "";
            const match = /^data:image\/(\w+);base64,(.+)$/s.exec(source);

            if (!match) {
              res.statusCode = 400;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: "Invalid image data" }));
              return;
            }

            let ext = match[1].toLowerCase();
            if (ext === "jpeg") ext = "jpg";
            if (!["jpg", "png", "webp"].includes(ext)) ext = "jpg";

            const buffer = Buffer.from(match[2], "base64");
            const dir = path.resolve(__dirname, "public/uploads");
            fs.mkdirSync(dir, { recursive: true });

            const filename = `photo_${Date.now()}_${Math.random()
              .toString(16)
              .slice(2, 8)}.${ext}`;
            fs.writeFileSync(path.join(dir, filename), buffer);

            const host = req.headers.host || "localhost:5173";
            const protoHeader = req.headers["x-forwarded-proto"];
            const proto = protoHeader || "http";
            const resultUrl = `${proto}://${host}/uploads/${filename}`;

            res.setHeader("Content-Type", "application/json");
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.end(JSON.stringify({ data: { result_url: resultUrl } }));
          } catch (error) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: String(error) }));
          }
        });
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), softCopyUploadPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
