import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Não autorizado" }, { status: 401 });

  const pessoas = await prisma.pessoa.findMany({ orderBy: [{ ordem: "asc" }, { createdAt: "desc" }] });
  return Response.json(pessoas);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Não autorizado" }, { status: 401 });

  const body = await request.json();
  if (!body.nome || !body.cargo || !body.descricao) {
    return Response.json({ error: "Nome, cargo e descrição são obrigatórios" }, { status: 400 });
  }

  const pessoa = await prisma.pessoa.create({
    data: {
      nome: body.nome,
      cargo: body.cargo,
      descricao: body.descricao,
      imagemUrl: body.imagemUrl || null,
      ativo: body.ativo ?? true,
      ordem: body.ordem ?? 0,
    },
  });
  return Response.json(pessoa, { status: 201 });
}
