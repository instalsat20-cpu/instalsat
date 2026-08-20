import { prisma } from "@/lib/prisma";

export async function GET() {
  const processos = await prisma.processo.findMany({
    where: { ativo: true },
    orderBy: [{ ordem: "asc" }, { createdAt: "asc" }],
  });
  return Response.json(processos);
}
