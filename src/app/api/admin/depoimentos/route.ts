import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Não autorizado" }, { status: 401 });

  const depoimentos = await prisma.depoimento.findMany({ orderBy: [{ ordem: "asc" }, { createdAt: "desc" }] });
  return Response.json(depoimentos);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Não autorizado" }, { status: 401 });

  const body = await request.json();
  if (!body.texto || !body.nome || !body.cargo) {
    return Response.json({ error: "Texto, nome e cargo são obrigatórios" }, { status: 400 });
  }

  const depoimento = await prisma.depoimento.create({
    data: {
      texto: body.texto,
      nome: body.nome,
      cargo: body.cargo,
      fotoUrl: body.fotoUrl || null,
      linkGoogle: body.linkGoogle || null,
      ativo: body.ativo ?? true,
      ordem: body.ordem ?? 0,
    },
  });
  return Response.json(depoimento, { status: 201 });
}
