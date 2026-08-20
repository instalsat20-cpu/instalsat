import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

type Context = { params: Promise<{ id: string }> };

export async function PUT(request: Request, context: Context) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await context.params;
  const body = await request.json();

  const pessoa = await prisma.pessoa.update({
    where: { id },
    data: {
      nome: body.nome,
      cargo: body.cargo,
      descricao: body.descricao,
      imagemUrl: body.imagemUrl,
      ativo: body.ativo,
      ordem: body.ordem,
    },
  });
  return Response.json(pessoa);
}

export async function DELETE(_request: Request, context: Context) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await context.params;
  await prisma.pessoa.delete({ where: { id } });
  return new Response(null, { status: 204 });
}
