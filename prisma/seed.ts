import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DB,
  }),
});

const seedUserEmail = "fachru2006@gmail.com";

async function seedUser() {
  const password = await bcrypt.hash("password123", 10);

  await prisma.user.upsert({
    where: { email: seedUserEmail },
    update: {},
    create: {
      name: "Fachru",
      email: seedUserEmail,
      password,
      bio: "Default seeded admin user.",
      profile: null,
    },
  });
}

async function seedHero() {
  await prisma.hero.upsert({
    where: { id: 1 },
    update: {},
    create: {
      translations: {
        create: [
          { locale: "EN", title: "Hello, I am Fachru", subtitle: "Welcome to my portfolio" },
          { locale: "ID", title: "Halo, saya Fachru", subtitle: "Selamat datang di portofolio saya" },
        ],
      },
    },
  });
}

async function seedAbout() {
  await prisma.aboutMe.upsert({
    where: { id: 1 },
    update: {},
    create: {
      profile: null,
      translations: {
        create: [
          { locale: "EN", title: "About Me", content: "Short bio goes here." },
          { locale: "ID", title: "Tentang Saya", content: "Deskripsi singkat di sini." },
        ],
      },
    },
  });
}

async function seedContactInfo() {
  await prisma.contactInformation.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "Fachru",
      email: seedUserEmail,
      phoneNumber: '+62  822-1315-3118',
      location: 'Indonesia',
      cv: null,
    },
  });
}

async function seedWebConfig() {
  const existing = await prisma.webConfig.findFirst();
  if (!existing) {
    await prisma.webConfig.create({
      data: {
        logo: null,
        favicon: null,
        copyright: '© 2024 Fachru. All rights reserved.',
        metaDescription: 'meta description here',
        metaTitle: 'meta title here',
      },
    });
  }
}

async function main() {
  await seedUser();
  await seedHero();
  await seedAbout();
  await seedContactInfo();
  await seedWebConfig();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
