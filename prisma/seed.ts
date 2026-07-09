import 'dotenv/config';
import bcrypt from 'bcrypt';
import prisma from '../src/config/prisma';

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 12);

  await prisma.user.upsert({
    where: { email: 'admin@rentnest.com' },
    update: {},
    create: {
      email: 'admin@rentnest.com',
      name: 'Super Admin',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('Seeding completed. Admin Account Ready!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });