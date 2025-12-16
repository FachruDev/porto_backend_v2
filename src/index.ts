import { createApp } from "./app";
import { getEnv } from "./config/env";
import prisma from "./config/prisma";

const env = getEnv();
const PORT = env.PORT ?? 4000;

const app = createApp();

const server = app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API ready on http://localhost:${PORT}/api`);
});

const shutdown = async () => {
  server.close();
  await prisma.$disconnect();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
