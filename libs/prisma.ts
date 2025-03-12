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
  });

// Gestion explicite des connexions prisma
globalForPrisma.prisma = prisma;

// Mise en place d'une gestion proactive des reconnexions
let isConnected = false;

// Fonction pour vérifier et rétablir la connexion
const connectPrisma = async () => {
  try {
    if (!isConnected) {
      await prisma.$connect();
      isConnected = true;
      console.log("Connexion Prisma établie avec succès");
    }
  } catch (error) {
    console.error("Erreur de connexion Prisma:", error);
    isConnected = false;
    // Tentative de reconnexion après un délai
    setTimeout(connectPrisma, 5000);
  }
};

// Initialiser la connexion
connectPrisma();

// Événements pour gérer les déconnexions
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

// Pour les déconnexions normales
process.on("beforeExit", async () => {
  await prisma.$disconnect();
});
