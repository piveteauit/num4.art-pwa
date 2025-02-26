// @ts-nocheck
const { PrismaClient, AdminRole } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    // Créer d'abord un utilisateur
    const user = await prisma.user.create({
      data: {
        email: "admin_num4_bloublou@yopmail.fr",
        name: "Admin",
        passwordHash: await bcrypt.hash("votre_mot_de_passe_securise", 10)
      }
    });

    const profile = await prisma.profile.create({
      data: {
        userId: user.id,
        locale: "fr"
      }
    });

    // Créer ensuite l'admin associé à cet utilisateur
    const admin = await prisma.admin.create({
      data: {
        userId: user.id,
        role: AdminRole.SUPER_ADMIN
      }
    });

    console.log("Administrateur créé avec succès:", admin);
  } catch (error) {
    console.error("Erreur lors de la création de l'administrateur:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
