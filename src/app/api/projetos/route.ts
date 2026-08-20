import { prisma } from "@/lib/prisma";

export async function GET() {
  const projetos = await prisma.projeto.findMany({
    where: { ativo: true, destaqueHome: true },
    orderBy: [{ ordem: "asc" }, { createdAt: "asc" }],
  });
  return Response.json(projetos);
}
