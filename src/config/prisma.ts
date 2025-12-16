import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { getEnv } from "./env";

const env = getEnv();

const adapter = new PrismaPg({
  connectionString: env.DB,
});

const prisma = new PrismaClient({ adapter });

export default prisma;
