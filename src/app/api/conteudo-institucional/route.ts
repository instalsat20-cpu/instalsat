import { prisma } from "@/lib/prisma";

export async function GET() {
  const blocos = await prisma.blocoConteudo.findMany({ select: { chave: true, valor: true } });
  return Response.json(Object.fromEntries(blocos.map(({ chave, valor }) => [chave, valor])));
}
