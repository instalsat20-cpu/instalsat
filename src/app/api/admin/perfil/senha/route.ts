import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return Response.json({ error: "Não autorizado" }, { status: 401 });

  const body = await request.json();
  const { currentPassword, newPassword, confirmPassword } = body;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return Response.json({ error: "Preencha todos os campos" }, { status: 400 });
  }

  if (newPassword !== confirmPassword) {
    return Response.json({ error: "A confirmação não corresponde à nova senha" }, { status: 400 });
  }

  if (newPassword.length < 8) {
    return Response.json({ error: "A nova senha deve ter ao menos 8 caracteres" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || !user.password) {
    return Response.json({ error: "Usuário inválido" }, { status: 400 });
  }

  const senhaCorreta = await bcrypt.compare(currentPassword, user.password);
  if (!senhaCorreta) {
    return Response.json({ error: "Senha atual incorreta" }, { status: 401 });
  }

  const hashed = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({ where: { id: session.user.id }, data: { password: hashed } });

  return Response.json({ ok: true });
}
