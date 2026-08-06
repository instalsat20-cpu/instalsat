import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Não autorizado" }, { status: 401 });

  const solucoes = await prisma.solucao.findMany({ orderBy: [{ ordem: "asc" }, { createdAt: "desc" }] });
  return Response.json(solucoes);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Não autorizado" }, { status: 401 });

  const body = await request.json();
  if (!body.categoria || !body.titulo || !body.descricao) {
    return Response.json({ error: "Categoria, título e descrição são obrigatórios" }, { status: 400 });
  }

  if (body.destaqueHome) {
    const totalDestaques = await prisma.solucao.count({ where: { destaqueHome: true } });
    if (totalDestaques >= 3) {
      return Response.json({ error: "É permitido destacar no máximo 3 soluções na Home" }, { status: 409 });
    }
  }

  const solucao = await prisma.solucao.create({
    data: {
      categoria: body.categoria,
      titulo: body.titulo,
      descricao: body.descricao,
      imagemUrl: body.imagemUrl || null,
      destaqueHome: body.destaqueHome ?? false,
      ativo: body.ativo ?? true,
      ordem: body.ordem ?? 0,
    },
  });
  return Response.json(solucao, { status: 201 });
}
