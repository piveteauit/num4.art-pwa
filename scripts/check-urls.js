const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkUrls() {
  // Vérifier les images des chansons
  const songs = await prisma.song.findMany({
    select: {
      id: true,
      title: true,
      image: true,
      audio: true,
      preview: true
    }
  });

  console.log("\n=== URLs des chansons ===");
  songs.forEach((song) => {
    if (song.image?.includes("/null/")) {
      console.error(
        `Chanson "${song.title}" (${song.id}) a une URL d'image invalide:`,
        song.image
      );
    }
    if (song.audio?.includes("/null/")) {
      console.error(
        `Chanson "${song.title}" (${song.id}) a une URL audio invalide:`,
        song.audio
      );
    }
    if (song.preview?.includes("/null/")) {
      console.error(
        `Chanson "${song.title}" (${song.id}) a une URL de preview invalide:`,
        song.preview
      );
    }
  });

  // Vérifier les avatars des utilisateurs
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      image: true
    }
  });

  console.log("\n=== URLs des avatars ===");
  users.forEach((user) => {
    if (user.image?.includes("/null/")) {
      console.error(
        `Utilisateur ${user.name || user.email} (${user.id}) a une URL d'avatar invalide:`,
        user.image
      );
    }
  });

  // Vérifier les artistes
  const artists = await prisma.artist.findMany({
    select: {
      id: true,
      name: true,
      profile: {
        include: {
          user: {
            select: {
              image: true
            }
          }
        }
      }
    }
  });

  console.log("\n=== URLs des artistes ===");
  artists.forEach((artist) => {
    const image = artist.profile?.[0]?.user?.image;
    if (image?.includes("/null/")) {
      console.error(
        `Artiste ${artist.name} (${artist.id}) a une URL d'image invalide:`,
        image
      );
    }
  });
}

checkUrls()
  .then(() => {
    console.log("\nVérification terminée");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\nErreur lors de la vérification:", error);
    process.exit(1);
  });
