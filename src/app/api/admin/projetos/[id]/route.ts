import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

type Context = { params: Promise<{ id: string }> };

export async function PUT(request: Request, context: Context) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await context.params;
  const body = await request.json();

  if (body.destaqueHome) {
    const totalDestaques = await prisma.projeto.count({ where: { destaqueHome: true, id: { not: id } } });
    if (totalDestaques >= 3) {
      return Response.json({ error: "É permitido destacar no máximo 3 projetos na Home" }, { status: 409 });
    }
  }

  const projeto = await prisma.projeto.update({
    where: { id },
    data: {
      categoria: body.categoria,
      titulo: body.titulo,
      descricao: body.descricao,
      imagemUrl: body.imagemUrl,
      destaqueHome: body.destaqueHome,
      ativo: body.ativo,
      ordem: body.ordem,
    },
  });
  return Response.json(projeto);
}

export async function DELETE(_request: Request, context: Context) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await context.params;
  await prisma.projeto.delete({ where: { id } });
  return new Response(null, { status: 204 });
}
