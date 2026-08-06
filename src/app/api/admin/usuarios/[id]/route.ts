import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";

type Context = { params: Promise<{ id: string }> };

const ALLOWED_ROLES = ["STUDIO", "CLIENT_ADMIN"];

export async function PUT(request: Request, context: Context) {
  const session = await getServerSession(authOptions);
  if (!session || !ALLOWED_ROLES.includes(session.user?.role as string)) {
    return Response.json({ error: "Nao autorizado" }, { status: 401 });
  }

  const { id } = await context.params;
  const body = await request.json();

  const data: Record<string, unknown> = {};
  if (body.name !== undefined) data.name = body.name;
  if (body.email !== undefined) data.email = body.email;
  if (body.role !== undefined) {
    const callerRole = session.user?.role as string;
    if (callerRole === "CLIENT_ADMIN" && !["CLIENT_USER", "PARTNER"].includes(body.role)) {
      return Response.json({ error: "Sem permissao para este perfil" }, { status: 403 });
    }
    data.role = body.role;
  }

  const user = await prisma.user.update({
    where: { id },
    data,
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  return Response.json(user);
}

export async function DELETE(_request: Request, context: Context) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "STUDIO") {
    return Response.json({ error: "Apenas STUDIO pode deletar usuarios" }, { status: 403 });
  }

  const { id } = await context.params;
  await prisma.user.delete({ where: { id } });
  return new Response(null, { status: 204 });
}

export async function PATCH(request: Request, context: Context) {
  const session = await getServerSession(authOptions);
  if (!session || !ALLOWED_ROLES.includes(session.user?.role as string)) {
    return Response.json({ error: "Nao autorizado" }, { status: 401 });
  }

  const { id } = await context.params;
  const body = await request.json();

  if (body.action === "reset-password") {
    const tempPassword = crypto.randomBytes(8).toString("hex");
    const hashed = await bcrypt.hash(tempPassword, 12);
    await prisma.user.update({ where: { id }, data: { password: hashed } });
    return Response.json({ tempPassword });
  }

  return Response.json({ error: "Acao desconhecida" }, { status: 400 });
}