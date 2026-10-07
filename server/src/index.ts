import { createApp } from "./app.js";
import { config } from "./config.js";
import { createStore } from "./store.js";

async function main(): Promise<void> {
  const store = createStore();
  await store.init();

  const app = createApp(store);
  const server = app.listen(config.port, () => {
    console.log(
      `[vobi-api] listening on http://localhost:${config.port} ` +
        `(${config.env}, storage=${config.databaseUrl ? "postgres" : "file"})`,
    );
  });

  const shutdown = (signal: string) => {
    console.log(`[vobi-api] ${signal} received, shutting down.`);
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 8000).unref();
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

main().catch((err) => {
  console.error("[vobi-api] failed to start", err);
  process.exit(1);
});
