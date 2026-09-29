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
  const admin = await upsertUser({
    name: "مدير النظام",
    email: "admin@fkrah.local",
    password: "Admin@12345",
    role: "ADMIN",
    jobTitle: "System Administrator",
    department: "IT",
  });

  const evaluator = await upsertUser({
    name: "سارة المقيّمة",
    email: "evaluator@fkrah.local",
    password: "Eval@12345",
    role: "EVALUATOR",
    jobTitle: "Innovation Analyst",
    department: "Strategy",
  });

  const member = await upsertUser({
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

  // Sample submitted ideas so the repository has content to browse.
  // Idempotent: skipped entirely if any idea already exists.
  const existingIdeas = await prisma.idea.count();
  if (existingIdeas === 0) {
    const catBySlug = new Map(
      (await prisma.category.findMany()).map((c) => [c.slug, c.id]),
    );

    const sampleIdeas: Array<{
      title: string;
      description: string;
      authorId: string;
      categorySlug: string;
      impact: "LOW" | "MEDIUM" | "HIGH" | null;
      tags: string[];
      businessProblem?: string;
      proposedSolution?: string;
      expectedBenefits?: string;
      daysAgo: number;
    }> = [
      {
        title: "بوابة خدمة ذاتية موحّدة للموظفين",
        description:
          "إنشاء بوابة واحدة يستطيع الموظفون من خلالها تقديم الطلبات ومتابعتها بدل تعدد الأنظمة.",
        authorId: member.id,
        categorySlug: "technology",
        impact: "HIGH",
        tags: ["خدمة ذاتية", "أتمتة", "موظفون"],
        businessProblem: "تشتت الطلبات عبر البريد والأنظمة المتعددة.",
        proposedSolution: "بوابة موحّدة مع تتبّع لحالة كل طلب.",
        expectedBenefits: "تقليل زمن المعالجة ورفع رضا الموظفين.",
        daysAgo: 2,
      },
      {
        title: "أتمتة تقارير المصروفات الشهرية",
        description:
          "استبدال إدخال بيانات المصروفات اليدوي بتكامل تلقائي مع بوابات الدفع.",
        authorId: evaluator.id,
        categorySlug: "process-improvement",
        impact: "MEDIUM",
        tags: ["أتمتة", "مالية", "كفاءة"],
        businessProblem: "أخطاء الإدخال اليدوي وتأخر الإقفال الشهري.",
        expectedBenefits: "دقة أعلى وتوفير ساعات عمل شهريًا.",
        daysAgo: 5,
      },
      {
        title: "روبوت محادثة لدعم العملاء على مدار الساعة",
        description:
          "توفير دعم فوري للأسئلة الشائعة وتحويل الحالات المعقدة إلى فريق الدعم.",
        authorId: member.id,
        categorySlug: "customer-experience",
        impact: "HIGH",
        tags: ["ذكاء اصطناعي", "دعم", "عملاء"],
        expectedBenefits: "تقليل زمن الاستجابة وخفض عبء الفريق.",
        daysAgo: 8,
      },
      {
        title: "برنامج إعادة تدوير مخلفات المكاتب",
        description:
          "تطبيق نظام فرز وإعادة تدوير في جميع المكاتب لتقليل النفايات.",
        authorId: evaluator.id,
        categorySlug: "sustainability",
        impact: "MEDIUM",
        tags: ["استدامة", "بيئة"],
        expectedBenefits: "خفض النفايات وتحسين الأثر البيئي.",
        daysAgo: 12,
      },
      {
        title: "التفاوض على أسعار موحّدة مع الموردين",
        description:
          "تجميع مشتريات الأقسام للتفاوض على خصومات كمية موحّدة.",
        authorId: admin.id,
        categorySlug: "cost-reduction",
        impact: "HIGH",
        tags: ["مشتريات", "توفير"],
        expectedBenefits: "خفض تكاليف المشتريات السنوية.",
        daysAgo: 15,
      },
      {
        title: "مساحات عمل مرنة قابلة للحجز",
        description:
          "نظام حجز للمكاتب وقاعات الاجتماعات لتحسين استغلال المساحات.",
        authorId: member.id,
        categorySlug: "process-improvement",
        impact: "LOW",
        tags: ["مكان العمل", "حجوزات"],
        daysAgo: 18,
      },
      {
        title: "لوحة مؤشرات لحظية للعمليات التشغيلية",
        description:
          "عرض المؤشرات التشغيلية الرئيسية لحظيًا لدعم القرار السريع.",
        authorId: evaluator.id,
        categorySlug: "technology",
        impact: "MEDIUM",
        tags: ["تحليلات", "لوحة مؤشرات"],
        daysAgo: 22,
      },
      {
        title: "برنامج إحالة العملاء بمكافآت",
        description:
          "تحفيز العملاء الحاليين على إحالة عملاء جدد عبر نظام مكافآت.",
        authorId: admin.id,
        categorySlug: "customer-experience",
        impact: "MEDIUM",
        tags: ["نمو", "تسويق", "عملاء"],
        daysAgo: 26,
      },
      {
        title: "دليل تدريبي تفاعلي للموظفين الجدد",
        description:
          "مسار تعريفي تفاعلي يقصّر فترة اندماج الموظفين الجدد.",
        authorId: member.id,
        categorySlug: "other",
        impact: "LOW",
        tags: ["تدريب", "موارد بشرية"],
        daysAgo: 30,
      },
      {
        title: "تحسين استهلاك الطاقة في مراكز البيانات",
        description:
          "مراجعة إعدادات التبريد والأحمال لخفض استهلاك الطاقة.",
        authorId: evaluator.id,
        categorySlug: "sustainability",
        impact: "HIGH",
        tags: ["طاقة", "استدامة", "توفير"],
        daysAgo: 35,
      },
    ];

    for (const s of sampleIdeas) {
      const submittedAt = new Date(Date.now() - s.daysAgo * 24 * 60 * 60 * 1000);
      await prisma.idea.create({
        data: {
          title: s.title,
          description: s.description,
          authorId: s.authorId,
          categoryId: catBySlug.get(s.categorySlug),
          estimatedImpact: s.impact ?? undefined,
          businessProblem: s.businessProblem,
          proposedSolution: s.proposedSolution,
          expectedBenefits: s.expectedBenefits,
          status: "SUBMITTED",
          submittedAt,
          createdAt: submittedAt,
          tags: {
            connectOrCreate: s.tags.map((name) => ({
              where: { name },
              create: { name },
            })),
          },
        },
      });
    }
    console.log(`Seeded ${sampleIdeas.length} sample ideas.`);
  } else {
    console.log(`Skipped sample ideas (${existingIdeas} already present).`);
  }

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
