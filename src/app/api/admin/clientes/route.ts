import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Não autorizado" }, { status: 401 });

  const clientes = await prisma.cliente.findMany({ orderBy: [{ ordem: "asc" }, { createdAt: "desc" }] });
  return Response.json(clientes);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Não autorizado" }, { status: 401 });

  const body = await request.json();
  if (!body.nome || !body.logoUrl) {
    return Response.json({ error: "Nome e logo são obrigatórios" }, { status: 400 });
  }

  const cliente = await prisma.cliente.create({
    data: {
      nome: body.nome,
      logoUrl: body.logoUrl,
      logoDarkUrl: body.logoDarkUrl || null,
      siteUrl: body.siteUrl || null,
      ativo: body.ativo ?? true,
      ordem: body.ordem ?? 0,
    },
  });
  return Response.json(cliente, { status: 201 });
}
