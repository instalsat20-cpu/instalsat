import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Não autorizado" }, { status: 401 });

  const faqs = await prisma.faq.findMany({ orderBy: [{ ordem: "asc" }, { createdAt: "desc" }] });
  return Response.json(faqs);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Não autorizado" }, { status: 401 });

  const body = await request.json();
  if (!body.pergunta || !body.resposta) {
    return Response.json({ error: "Pergunta e resposta são obrigatórias" }, { status: 400 });
  }

  const faq = await prisma.faq.create({
    data: {
      pergunta: body.pergunta,
      resposta: body.resposta,
      ativo: body.ativo ?? true,
      ordem: body.ordem ?? 0,
    },
  });
  return Response.json(faq, { status: 201 });
}
