import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

type Context = { params: Promise<{ id: string }> };

export async function PUT(request: Request, context: Context) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await context.params;
  const body = await request.json();

  const faq = await prisma.faq.update({
    where: { id },
    data: {
      pergunta: body.pergunta,
      resposta: body.resposta,
      ativo: body.ativo,
      ordem: body.ordem,
    },
  });
  return Response.json(faq);
}

export async function DELETE(_request: Request, context: Context) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await context.params;
  await prisma.faq.delete({ where: { id } });
  return new Response(null, { status: 204 });
}
