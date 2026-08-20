import { prisma } from "@/lib/prisma";

export async function GET() {
  const solucoes = await prisma.solucao.findMany({
    where: { ativo: true, destaqueHome: true },
    orderBy: [{ ordem: "asc" }, { createdAt: "asc" }],
  });
  return Response.json(solucoes);
}
