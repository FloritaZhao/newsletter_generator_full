const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Create a default user
  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      name: 'Demo User',
    },
  });

  console.log('Created user:', user);

  // Optionally add some sample sources
  const source1 = await prisma.source.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'TechCrunch',
      url: 'https://techcrunch.com/feed/',
      type: 'rss',
      userId: user.id,
    },
  });

  const source2 = await prisma.source.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Hacker News',
      url: 'https://hnrss.org/frontpage',
      type: 'rss',
      userId: user.id,
    },
  });

  console.log('Created sources:', source1, source2);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  }); 