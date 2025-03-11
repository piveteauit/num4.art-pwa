// export default globalPrisma;
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    },
    // Configuration du pool de connexions
    log: ["query", "error", "warn"]

    // Augmenter les limites du pool de connexions
  });

// Gestion explicite des connexions prisma
globalForPrisma.prisma = prisma;

// Si vous avez des problèmes persistants, vous pouvez ajouter cette fonction pour
// fermer explicitement la connexion avant que l'application ne se termine
process.on("beforeExit", async () => {
  await prisma.$disconnect();
});
