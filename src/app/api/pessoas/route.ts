import { prisma } from "@/lib/prisma";

export async function GET() {
  const pessoas = await prisma.pessoa.findMany({
    where: { ativo: true },
    orderBy: [{ ordem: "asc" }, { createdAt: "asc" }],
  });
  return Response.json(pessoas);
}
