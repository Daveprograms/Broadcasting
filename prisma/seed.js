const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "admin@broadcasting.net";
  const defaultPassword = "admin";

  console.log("Seeding database...");

  // 1. Create Default Admin User
  const hashedPassword = await bcrypt.hash(defaultPassword, 10);
  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword,
      role: "ADMIN",
    },
    create: {
      name: "System Administrator",
      email: adminEmail,
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log(`✅ Admin user configured:`);
  console.log(`   Email: ${adminEmail}`);
  console.log(`   Password: ${defaultPassword}`);

  // 2. Create default e-transfer settings
  const settings = await prisma.settings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      email1: "etransfer-alpha@broadcasting.net",
      email1Name: "James",
      email2: "etransfer-beta@broadcasting.net",
      email2Name: "Sarah",
    },
  });

  console.log(`✅ Default e-transfer settings seeded.`);
}

main()
  .catch((e) => {
    console.error("Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
