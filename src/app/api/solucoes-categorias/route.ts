import { prisma } from "@/lib/prisma";

export async function GET() {
  const categorias = await prisma.solucao.findMany({
    where: { ativo: true, destaqueHome: false },
    orderBy: [{ ordem: "asc" }, { createdAt: "asc" }],
  });
  return Response.json(categorias);
}
