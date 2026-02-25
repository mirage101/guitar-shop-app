const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function main() {
  const username = process.argv[2];
  const password = process.argv[3];

  if (!username || !password) {
    console.log('Usage: node scripts/verify-admin-credentials.js <username> <password>');
    process.exit(1);
  }

  const prisma = new PrismaClient();
  try {
    const user = await prisma.adminUser.findUnique({ where: { userName: username } });

    if (!user) {
      console.log('USER_NOT_FOUND');
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log(JSON.stringify({ userName: user.userName, userType: user.userType, isMatch }, null, 2));
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
