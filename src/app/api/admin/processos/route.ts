import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Não autorizado" }, { status: 401 });

  const processos = await prisma.processo.findMany({ orderBy: [{ ordem: "asc" }, { createdAt: "desc" }] });
  return Response.json(processos);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Não autorizado" }, { status: 401 });

  const body = await request.json();
  if (!body.categoria || !body.numero || !body.titulo || !body.descricao) {
    return Response.json({ error: "Categoria, número, título e descrição são obrigatórios" }, { status: 400 });
  }

  const processo = await prisma.processo.create({
    data: {
      categoria: body.categoria,
      numero: body.numero,
      titulo: body.titulo,
      descricao: body.descricao,
      imagemUrl: body.imagemUrl || null,
      ativo: body.ativo ?? true,
      ordem: body.ordem ?? 0,
    },
  });
  return Response.json(processo, { status: 201 });
}
