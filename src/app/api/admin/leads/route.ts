import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import type { Prisma } from "@prisma/client";

export function buildLeadsWhere(searchParams: URLSearchParams): Prisma.LeadWhereInput {
  const where: Prisma.LeadWhereInput = {};
  const search = searchParams.get("busca")?.trim();
  const inicio = searchParams.get("inicio");
  const fim = searchParams.get("fim");

  if (search) {
    where.OR = [
      { nome: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { telefone: { contains: search, mode: "insensitive" } },
    ];
  }

  if (inicio || fim) {
    where.createdAt = {
      ...(inicio ? { gte: new Date(`${inicio}T00:00:00`) } : {}),
      ...(fim ? { lte: new Date(`${fim}T23:59:59`) } : {}),
    };
  }

  return where;
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Não autorizado" }, { status: 401 });

  const where = buildLeadsWhere(request.nextUrl.searchParams);
  const leads = await prisma.lead.findMany({ where, orderBy: { createdAt: "desc" } });
  return Response.json(leads);
}
