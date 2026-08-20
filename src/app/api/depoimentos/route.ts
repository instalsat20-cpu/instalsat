import { prisma } from "@/lib/prisma";

export async function GET() {
  const depoimentos = await prisma.depoimento.findMany({
    where: { ativo: true },
    orderBy: [{ ordem: "asc" }, { createdAt: "asc" }],
  });
  return Response.json(depoimentos);
}
