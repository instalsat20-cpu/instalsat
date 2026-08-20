import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Não autorizado" }, { status: 401 });

  const blocos = await prisma.blocoConteudo.findMany({ orderBy: { chave: "asc" } });
  return Response.json(blocos);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Não autorizado" }, { status: 401 });

  const body: Record<string, string> = await req.json();

  const updates = await Promise.all(
    Object.entries(body).map(([chave, valor]) =>
      prisma.blocoConteudo.update({ where: { chave }, data: { valor } })
    )
  );

  return Response.json({ ok: true, updates });
}
