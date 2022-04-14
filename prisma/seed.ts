import { PrismaClient } from '@prisma/client';
import { ptdinterets } from '../data/ptdinterets';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      email: 'sami..abdelmlek@gmail.com',
      role: 'ADMIN',
    },
  });

  await prisma.link.createMany({
    data: ptdinterets,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect);
