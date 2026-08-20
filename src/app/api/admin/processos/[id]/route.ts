import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

type Context = { params: Promise<{ id: string }> };

export async function PUT(request: Request, context: Context) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await context.params;
  const body = await request.json();

  const processo = await prisma.processo.update({
    where: { id },
    data: {
      categoria: body.categoria,
      numero: body.numero,
      titulo: body.titulo,
      descricao: body.descricao,
      imagemUrl: body.imagemUrl,
      ativo: body.ativo,
      ordem: body.ordem,
    },
  });
  return Response.json(processo);
}

export async function DELETE(_request: Request, context: Context) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await context.params;
  await prisma.processo.delete({ where: { id } });
  return new Response(null, { status: 204 });
}
