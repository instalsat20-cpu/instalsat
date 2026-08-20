import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

type Context = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: Context) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await context.params;
  const midias = await prisma.midiaProjeto.findMany({ where: { projetoId: id }, orderBy: { ordem: "asc" } });
  return Response.json(midias);
}

export async function POST(request: Request, context: Context) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await context.params;
  const body = await request.json();
  if (!body.url || !["imagem", "video"].includes(body.tipo)) {
    return Response.json({ error: "URL e tipo (imagem ou video) são obrigatórios" }, { status: 400 });
  }

  const ultimo = await prisma.midiaProjeto.findFirst({ where: { projetoId: id }, orderBy: { ordem: "desc" } });
  const midia = await prisma.midiaProjeto.create({
    data: { projetoId: id, tipo: body.tipo, url: body.url, ordem: (ultimo?.ordem ?? -1) + 1 },
  });
  return Response.json(midia, { status: 201 });
}
