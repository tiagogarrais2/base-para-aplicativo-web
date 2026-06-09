import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

let prisma;

const connectionString = process.env.DATABASE_URL;

if (process.env.NODE_ENV === "production") {
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  prisma = new PrismaClient({ adapter, log: ["error"] });
} else {
  // Avoid creating multiple instances in development
  if (!global.prisma) {
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    global.prisma = new PrismaClient({
      adapter,
      log: ["query", "error", "warn"],
    });
  }
  prisma = global.prisma;

  // Teste de conexão em desenvolvimento
  prisma
    .$connect()
    .then(() => console.log("✅ Banco de dados conectado"))
    .catch((error) => console.error("❌ Erro ao conectar ao banco:", error));
}

export default prisma;
