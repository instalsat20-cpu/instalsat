import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const senha = await bcrypt.hash("metacube2026", 10);

  const studio = await prisma.user.upsert({
    where: { email: "alison@metacube.me" },
    update: { password: senha },
    create: {
      name: "Alison — MetaCube Studio",
      email: "alison@metacube.me",
      password: senha,
      role: "STUDIO",
    },
  });

  console.log("Usuário studio criado:", studio.email);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());