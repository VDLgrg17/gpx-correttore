import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  // In production, dist/index.js runs from the dist folder
  // So public folder is at ./public relative to dist/index.js
  // Which means import.meta.dirname (dist/) + public
  const possiblePaths = [
    // When running from dist/index.js, public is a sibling folder
    path.resolve(import.meta.dirname, "public"),
    // Fallback: relative to cwd
    path.resolve(process.cwd(), "dist", "public"),
    // Absolute path for Render
    "/opt/render/project/src/dist/public",
  ];

  console.log(`Looking for build directory...`);
  console.log(`import.meta.dirname: ${import.meta.dirname}`);
  console.log(`process.cwd(): ${process.cwd()}`);

  let distPath = "";
  for (const p of possiblePaths) {
    console.log(`Checking path: ${p}`);
    if (fs.existsSync(p)) {
      distPath = p;
      console.log(`Found build directory at: ${distPath}`);
      break;
    } else {
      console.log(`Path not found: ${p}`);
    }
  }

  if (!distPath) {
    // Last resort: try to list what's in the directory
    console.error(`Could not find the build directory.`);
    try {
      console.log(`Contents of import.meta.dirname:`, fs.readdirSync(import.meta.dirname));
      console.log(`Contents of cwd:`, fs.readdirSync(process.cwd()));
    } catch (e) {
      console.error(`Error listing directories:`, e);
    }
    distPath = possiblePaths[0]; // Use first as fallback
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    const indexPath = path.resolve(distPath, "index.html");
    console.log(`Serving index.html from: ${indexPath}`);
    res.sendFile(indexPath);
  });
}
