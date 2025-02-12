const { PrismaClient } = require("@prisma/client");
const { faker } = require("@faker-js/faker/locale/fr");

const prisma = new PrismaClient();

async function main() {
  const artistId = "cm6qpsgpr0003jeyb8bfzq72t";

  // Créer quelques genres
  const genres = await Promise.all(
    ["Pop", "Rock", "Hip-Hop", "Électro"].map((label) =>
      prisma.genre.upsert({
        where: { label },
        update: {},
        create: { label }
      })
    )
  );

  // Créer 10 chansons de test
  const songs = [];
  for (let i = 0; i < 10; i++) {
    const song = await prisma.song.create({
      data: {
        title: faker.music.songName(),
        price: parseFloat(faker.commerce.price({ min: 0.99, max: 9.99 })),
        description: faker.lorem.paragraph(),
        image: faker.image.urlLoremFlickr({ category: "album" }),
        audio: `https://example.com/audio/song_${i}.mp3`,
        preview: `https://example.com/preview/song_${i}.mp3`,
        ISRC: faker.string.alphanumeric({ length: 12, casing: "upper" }),
        previewStartTime: 0,
        artists: {
          connect: { id: artistId }
        },
        genres: {
          connect: [
            { id: genres[Math.floor(Math.random() * genres.length)].id }
          ]
        }
      }
    });
    songs.push(song);
    console.log(`Chanson créée: ${song.title}`);
  }

  console.log(`Seeding terminé ! ${songs.length} chansons créées.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
