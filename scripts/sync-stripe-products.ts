const { PrismaClient } = require("@prisma/client");
const Stripe = require("stripe");

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-04-10"
});

async function main() {
  // Récupérer toutes les chansons sans productId ou priceId
  const songs = await prisma.song.findMany({
    where: {
      OR: [{ stripeProductId: null }, { stripePriceId: null }]
    },
    include: {
      artists: {
        include: {
          profile: {
            include: {
              artist: true
            }
          }
        }
      }
    }
  });

  console.log(`Traitement de ${songs.length} chansons...`);

  for (const song of songs) {
    try {
      const artistName =
        song.artists[0]?.profile?.artist?.name || "Artiste Inconnu";

      // Transformer les URLs /api en URLs S3
      const imageUrl = song.image.startsWith("/api")
        ? `https://numero.s3.sbg.io.cloud.ovh.net${song.image.replace("/api/storage", "")}`
        : song.image;

      // Créer le produit Stripe
      const product = await stripe.products.create({
        name: `${song.title} - ${artistName}`,
        type: "service",
        images: [imageUrl],
        metadata: {
          song_id: song.id,
          song_name: song.title,
          artist_name: artistName
        }
      });

      // Créer le prix Stripe
      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: Math.round(song.price * 100), // Convertir en centimes
        currency: "eur"
      });

      // Mettre à jour la chanson dans la base de données
      await prisma.song.update({
        where: { id: song.id },
        data: {
          stripeProductId: product.id,
          stripePriceId: price.id
        }
      });

      console.log(`✅ Synchronisé: ${song.title}`);
    } catch (error) {
      console.error(`❌ Erreur pour ${song.title}:`, error);
    }
  }

  console.log("Synchronisation terminée !");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
