import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Não autorizado" }, { status: 401 });

  const configs = await prisma.configuracao.findMany();
  const resultado: Record<string, string> = {};
  configs.forEach((c) => { resultado[c.chave] = c.valor; });

  return Response.json(resultado);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Não autorizado" }, { status: 401 });

  const body = await req.json();

  const updates = await Promise.all(
    Object.entries(body).map(([chave, valor]) =>
      prisma.configuracao.upsert({
        where: { chave },
        update: { valor: valor as string },
        create: { chave, valor: valor as string },
      })
    )
  );

  return Response.json({ ok: true, updates });
}
