import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const ALLOWED_ROLES = ["STUDIO", "CLIENT_ADMIN"];

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !ALLOWED_ROLES.includes(session.user?.role as string)) {
    return Response.json({ error: "Não autorizado" }, { status: 401 });
  }

  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  return Response.json(users);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !ALLOWED_ROLES.includes(session.user?.role as string)) {
    return Response.json({ error: "Não autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const { name, email, role } = body;

  if (!name || !email || !role) {
    return Response.json({ error: "Nome, email e role são obrigatórios" }, { status: 400 });
  }

  const callerRole = session.user?.role as string;
  if (callerRole === "CLIENT_ADMIN" && !["CLIENT_USER", "PARTNER"].includes(role)) {
    return Response.json({ error: "Você não tem permissão para criar usuários com esse perfil" }, { status: 403 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return Response.json({ error: "Já existe um usuário com esse e-mail" }, { status: 409 });
  }

  const tempPassword = crypto.randomBytes(8).toString("hex");
  const hashed = await bcrypt.hash(tempPassword, 12);

  const user = await prisma.user.create({
    data: { name, email, role, password: hashed },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  return Response.json({ user, tempPassword }, { status: 201 });
}
