import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const org = await prisma.organization.upsert({
    where: { slug: 'demo-org' },
    update: {},
    create: { name: 'Demo Organization', slug: 'demo-org' },
  });

  console.log(`Seeded organization: ${org.name}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
