const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

function getArgValue(flag) {
  const index = process.argv.indexOf(flag);
  if (index === -1) return null;
  return process.argv[index + 1] ?? null;
}

function hasFlag(flag) {
  return process.argv.includes(flag);
}

function printUsage() {
  console.log(`\nUsage:\n  node scripts/set-admin-credentials.js --current <currentUserName> --username <newUserName> --password <newPassword> [--userType <type>]\n\nExamples:\n  node scripts/set-admin-credentials.js --current VivekMistry --username admin --password MyPass@123\n  node scripts/set-admin-credentials.js --current Nirmal --username Nirmal --password NewStrong@123 --userType "Super Admin"\n`);
}

async function main() {
  const currentUserName = getArgValue('--current');
  const newUserName = getArgValue('--username');
  const newPassword = getArgValue('--password');
  const newUserType = getArgValue('--userType');

  if (hasFlag('--help') || hasFlag('-h')) {
    printUsage();
    return;
  }

  if (!currentUserName || !newUserName || !newPassword) {
    console.error('Missing required arguments.');
    printUsage();
    process.exit(1);
  }

  const prisma = new PrismaClient();

  try {
    const existingUser = await prisma.adminUser.findUnique({
      where: { userName: currentUserName },
      select: { id: true, userName: true },
    });

    if (!existingUser) {
      console.error(`User not found: ${currentUserName}`);
      process.exit(1);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await prisma.adminUser.update({
      where: { id: existingUser.id },
      data: {
        userName: newUserName,
        password: hashedPassword,
        ...(newUserType ? { userType: newUserType } : {}),
      },
      select: { id: true, userName: true, userType: true },
    });

    console.log('Admin credentials updated successfully:');
    console.log(JSON.stringify(updatedUser, null, 2));
  } catch (error) {
    if (error?.code === 'P2002') {
      console.error('The new username is already taken. Use a different --username value.');
      process.exit(1);
    }

    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
