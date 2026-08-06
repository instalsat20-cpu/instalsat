import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

type Context = { params: Promise<{ id: string }> };

export async function PUT(request: Request, context: Context) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await context.params;
  const body = await request.json();
  const depoimento = await prisma.depoimento.update({
    where: { id },
    data: {
      texto: body.texto,
      nome: body.nome,
      cargo: body.cargo,
      fotoUrl: body.fotoUrl,
      linkGoogle: body.linkGoogle,
      ativo: body.ativo,
      ordem: body.ordem,
    },
  });
  return Response.json(depoimento);
}

export async function DELETE(_request: Request, context: Context) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await context.params;
  await prisma.depoimento.delete({ where: { id } });
  return new Response(null, { status: 204 });
}
