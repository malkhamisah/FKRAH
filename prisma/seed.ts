import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function upsertUser(input: {
  name: string;
  email: string;
  password: string;
  role: "ADMIN" | "EVALUATOR" | "MEMBER";
  jobTitle?: string;
  department?: string;
}) {
  const passwordHash = await bcrypt.hash(input.password, 10);
  return prisma.user.upsert({
    where: { email: input.email },
    update: { name: input.name, role: input.role },
    create: {
      name: input.name,
      email: input.email,
      passwordHash,
      role: input.role,
      jobTitle: input.jobTitle,
      department: input.department,
    },
  });
}

async function main() {
  await upsertUser({
    name: "مدير النظام",
    email: "admin@fikra.local",
    password: "Admin@12345",
    role: "ADMIN",
    jobTitle: "System Administrator",
    department: "IT",
  });

  await upsertUser({
    name: "سارة المقيّمة",
    email: "evaluator@fikra.local",
    password: "Eval@12345",
    role: "EVALUATOR",
    jobTitle: "Innovation Analyst",
    department: "Strategy",
  });

  await upsertUser({
    name: "أحمد العضو",
    email: "member@fikra.local",
    password: "Member@12345",
    role: "MEMBER",
    jobTitle: "Product Specialist",
    department: "Operations",
  });

  console.log("Seed complete. Accounts:");
  console.log("  admin@fikra.local     / Admin@12345   (ADMIN)");
  console.log("  evaluator@fikra.local / Eval@12345    (EVALUATOR)");
  console.log("  member@fikra.local    / Member@12345  (MEMBER)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
