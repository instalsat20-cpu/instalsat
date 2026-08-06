import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

type Context = { params: Promise<{ id: string }> };

export async function PUT(request: Request, context: Context) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await context.params;
  const body = await request.json();
  const cliente = await prisma.cliente.update({
    where: { id },
    data: {
      nome: body.nome,
      logoUrl: body.logoUrl,
      logoDarkUrl: body.logoDarkUrl,
      siteUrl: body.siteUrl,
      ativo: body.ativo,
      ordem: body.ordem,
    },
  });
  return Response.json(cliente);
}

export async function DELETE(_request: Request, context: Context) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await context.params;
  await prisma.cliente.delete({ where: { id } });
  return new Response(null, { status: 204 });
}
