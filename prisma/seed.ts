import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DB,
  }),
});

const seedUserEmail = "fachru2006@gmail.com";

async function seedUser() {
  const password = await bcrypt.hash("password", 8);

  const user = await prisma.user.upsert({
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

  return user;
}

async function seedWebConfig() {
  await prisma.webConfig.upsert({
    where: { id: 1 },
    update: {},
    create: {
      logo: null,
      favicon: null,
      copyright: "© 2025 Fachru. All rights reserved.",
      metaDescription: "Portfolio of Fachru.",
      metaTitle: "Fachru Portfolio",
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
      phoneNumber: "+62 822-1315-3118",
      location: "Indonesia",
      cv: null,
    },
  });
}

async function seedExperience() {
  await prisma.experience.createMany({
    data: [
      { institution: "ACME Corp", years: "2022 - Now", sortOrder: 1 },
      { institution: "Tech Labs", years: "2020 - 2022", sortOrder: 2 },
    ],
    skipDuplicates: true,
  });

  const exps = await prisma.experience.findMany();
  await prisma.experienceTranslation.createMany({
    data: exps.flatMap((exp, idx) => [
      { experienceId: exp.id, locale: "EN", title: `Experience ${idx + 1}`, description: "Did awesome stuff." },
      { experienceId: exp.id, locale: "ID", title: `Pengalaman ${idx + 1}`, description: "Melakukan hal hebat." },
    ]),
    skipDuplicates: true,
  });
}

async function seedSkills() {
  await prisma.skill.createMany({
    data: [
      { title: "JavaScript", level: "MIDDLE", sortOrder: 1 },
      { title: "TypeScript", level: "PROFESSIONAL", sortOrder: 2 },
    ],
    skipDuplicates: true,
  });
}

async function seedCertificates() {
  const cert = await prisma.certificate.upsert({
    where: { id: 1 },
    update: {},
    create: {
      file: "https://example.com/cert.pdf",
      previewImg: "https://example.com/cert-preview.png",
      issuedBy: "Sample Org",
      issuedOn: new Date("2023-01-01"),
      sortOrder: 1,
    },
  });

  await prisma.certificateTranslation.createMany({
    data: [
      { certificateId: cert.id, locale: "EN", title: "Certification", description: "Certificate description." },
      { certificateId: cert.id, locale: "ID", title: "Sertifikat", description: "Deskripsi sertifikat." },
    ],
    skipDuplicates: true,
  });
}

async function seedProjects() {
  const project = await prisma.project.upsert({
    where: { id: 1 },
    update: {},
    create: {
      slug: "sample-project",
      sortOrder: 1,
      images: { create: [{ url: "https://example.com/project-image.png", alt: "Project image", sortOrder: 1 }] },
    },
    include: { images: true },
  });

  await prisma.projectTranslation.createMany({
    data: [
      {
        projectId: project.id,
        locale: "EN",
        title: "Sample Project",
        subtitle: "A sample project",
        description: "Sample description",
      },
      {
        projectId: project.id,
        locale: "ID",
        title: "Proyek Contoh",
        subtitle: "Proyek contoh",
        description: "Deskripsi contoh",
      },
    ],
    skipDuplicates: true,
  });
}

async function seedSocialMedia() {
  await prisma.socialMedia.createMany({
    data: [
      { title: "GitHub", link: "https://github.com/fachru", logo: "https://example.com/github.png", sortOrder: 1 },
      { title: "LinkedIn", link: "https://linkedin.com/in/fachru", logo: "https://example.com/linkedin.png", sortOrder: 2 },
    ],
    skipDuplicates: true,
  });
}

async function seedContactForm() {
  await prisma.contactForm.createMany({
    data: [
      { name: "John Doe", email: "john@example.com", subject: "Hello", description: "Just saying hi." },
      { name: "Jane Roe", email: "jane@example.com", subject: "Work", description: "Let's collaborate." },
    ],
    skipDuplicates: true,
  });
}

async function seedBlog(userId: number) {
  const category = await prisma.blogCategory.upsert({
    where: { id: 1 },
    update: {},
    create: {
      slug: "general",
      sortOrder: 1,
    },
  });

  await prisma.blogCategoryTranslation.createMany({
    data: [
      { blogCategoryId: category.id, locale: "EN", title: "General" },
      { blogCategoryId: category.id, locale: "ID", title: "Umum" },
    ],
    skipDuplicates: true,
  });

  const post = await prisma.blogPost.upsert({
    where: { id: 1 },
    update: {},
    create: {
      blogCategoryId: category.id,
      authorId: userId,
      slug: "hello-world",
      featuredImage: "https://example.com/blog-image.png",
      metaTitle: "Hello World",
      metaDescription: "First blog post",
      status: "PUBLISHED",
      publishedAt: new Date(),
      createdBy: "seed",
    },
  });

  await prisma.blogPostTranslation.createMany({
    data: [
      { blogPostId: post.id, locale: "EN", title: "Hello World", content: "Welcome to the blog." },
      { blogPostId: post.id, locale: "ID", title: "Halo Dunia", content: "Selamat datang di blog." },
    ],
    skipDuplicates: true,
  });
}

async function main() {
  const user = await seedUser();
  await seedWebConfig();
  await seedHero();
  await seedAbout();
  await seedContactInfo();
  await seedExperience();
  await seedSkills();
  await seedCertificates();
  await seedProjects();
  await seedSocialMedia();
  await seedContactForm();
  await seedBlog(user.id);
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
