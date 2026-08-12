import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return Response.json({ error: "Não autorizado" }, { status: 401 });

  const body = await request.json();
  const { name, email } = body;

  if (!name || !email) {
    return Response.json({ error: "Nome e email são obrigatórios" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing && existing.id !== session.user.id) {
    return Response.json({ error: "Já existe um usuário com esse e-mail" }, { status: 409 });
  }

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: { name, email },
    select: { id: true, name: true, email: true, image: true, role: true },
  });

  return Response.json(user);
}
