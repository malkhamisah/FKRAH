import type { Metadata } from "next";
import "./globals.css";
import { getLocale } from "@/lib/i18n";
import { dirFor } from "@/lib/i18n/config";

export const metadata: Metadata = {
  title: "فكرة | FKRAH — Idea Management Platform",
  description:
    "منصة إدارة الأفكار المؤسسية — من الفكرة إلى التنفيذ. An enterprise idea management platform.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  return (
    <html lang={locale} dir={dirFor(locale)}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
