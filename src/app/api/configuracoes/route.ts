import { prisma } from "@/lib/prisma";

const PUBLIC_STATS = ["stat_anos", "stat_clientes", "stat_atendimentos", "stat_contratos"];

export async function GET() {
  const configuracoes = await prisma.configuracao.findMany({
    where: { chave: { in: PUBLIC_STATS } },
    select: { chave: true, valor: true },
  });

  return Response.json(Object.fromEntries(configuracoes.map(({ chave, valor }) => [chave, valor])));
}
