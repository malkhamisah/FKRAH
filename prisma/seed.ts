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
    email: "admin@fkrah.local",
    password: "Admin@12345",
    role: "ADMIN",
    jobTitle: "System Administrator",
    department: "IT",
  });

  await upsertUser({
    name: "سارة المقيّمة",
    email: "evaluator@fkrah.local",
    password: "Eval@12345",
    role: "EVALUATOR",
    jobTitle: "Innovation Analyst",
    department: "Strategy",
  });

  await upsertUser({
    name: "أحمد العضو",
    email: "member@fkrah.local",
    password: "Member@12345",
    role: "MEMBER",
    jobTitle: "Product Specialist",
    department: "Operations",
  });

  const categories = [
    { slug: "technology", nameEn: "Technology", nameAr: "تقنية", sortOrder: 1 },
    {
      slug: "process-improvement",
      nameEn: "Process Improvement",
      nameAr: "تحسين العمليات",
      sortOrder: 2,
    },
    {
      slug: "customer-experience",
      nameEn: "Customer Experience",
      nameAr: "تجربة العملاء",
      sortOrder: 3,
    },
    {
      slug: "cost-reduction",
      nameEn: "Cost Reduction",
      nameAr: "خفض التكاليف",
      sortOrder: 4,
    },
    {
      slug: "sustainability",
      nameEn: "Sustainability",
      nameAr: "الاستدامة",
      sortOrder: 5,
    },
    { slug: "other", nameEn: "Other", nameAr: "أخرى", sortOrder: 99 },
  ];

  for (const c of categories) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: { nameEn: c.nameEn, nameAr: c.nameAr, sortOrder: c.sortOrder },
      create: c,
    });
  }

  console.log(`Seeded ${categories.length} categories.`);
  console.log("Seed complete. Accounts:");
  console.log("  admin@fkrah.local     / Admin@12345   (ADMIN)");
  console.log("  evaluator@fkrah.local / Eval@12345    (EVALUATOR)");
  console.log("  member@fkrah.local    / Member@12345  (MEMBER)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
