import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Não autorizado" }, { status: 401 });

  const projetos = await prisma.projeto.findMany({ orderBy: [{ ordem: "asc" }, { createdAt: "desc" }] });
  return Response.json(projetos);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Não autorizado" }, { status: 401 });

  const body = await request.json();
  if (!body.categoria || !body.titulo || !body.descricao) {
    return Response.json({ error: "Categoria, título e descrição são obrigatórios" }, { status: 400 });
  }

  if (body.destaqueHome) {
    const totalDestaques = await prisma.projeto.count({ where: { destaqueHome: true } });
    if (totalDestaques >= 3) {
      return Response.json({ error: "É permitido destacar no máximo 3 projetos na Home" }, { status: 409 });
    }
  }

  const projeto = await prisma.projeto.create({
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
  return Response.json(projeto, { status: 201 });
}
