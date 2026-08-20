import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { buildLeadsWhere } from "../route";

function csvEscape(value: string) {
  return `"${value.replace(/"/g, '""')}"`;
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Não autorizado" }, { status: 401 });

  const where = buildLeadsWhere(request.nextUrl.searchParams);
  const leads = await prisma.lead.findMany({ where, orderBy: { createdAt: "desc" } });

  const header = ["Nome", "Email", "Telefone", "Cidade", "Estado", "Assunto", "Mensagem", "Data de criação"];
  const rows = leads.map((lead) => [
    lead.nome,
    lead.email,
    lead.telefone ?? "",
    lead.cidade ?? "",
    lead.estado ?? "",
    lead.assunto ?? "",
    lead.mensagem ?? "",
    lead.createdAt.toISOString(),
  ]);

  const csv = [header, ...rows].map((row) => row.map((cell) => csvEscape(String(cell))).join(",")).join("\r\n");

  return new Response(`﻿${csv}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leads.csv"`,
    },
  });
}
