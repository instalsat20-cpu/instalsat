import { prisma } from "@/lib/prisma";

export async function GET() {
  const faqs = await prisma.faq.findMany({
    where: { ativo: true },
    orderBy: [{ ordem: "asc" }, { createdAt: "asc" }],
  });
  return Response.json(faqs);
}
