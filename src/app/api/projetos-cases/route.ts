import { prisma } from "@/lib/prisma";

export async function GET() {
  const projetos = await prisma.projeto.findMany({
    where: { ativo: true, destaqueHome: false },
    orderBy: [{ ordem: "asc" }, { createdAt: "asc" }],
    include: { depoimento: true, midias: { orderBy: { ordem: "asc" } } },
  });
  return Response.json(projetos);
}
