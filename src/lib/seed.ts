import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  try {
    const user = await prisma.user.create({
      data: {
        email: 'user@example.com',
        name: 'John Doe',
        password: await bcrypt.hash('password', 10),
      },
    });
  
    console.log('User created:', user);
  } catch (e) {
    console.error('Error creating user:', e);
  }

  try {
    const admin = await prisma.user.create({
      data: {
        email: 'admin@example.com',
        name: 'Jane Doe',
        password: await bcrypt.hash('password', 10),
        role: 'admin',
      },
    })
  
    console.log('Admin created:', admin);
  } catch (e) {
    console.error('Error creating admin:', e);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });