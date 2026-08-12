import { PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "node:crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { r2, R2_BUCKET, R2_PUBLIC_URL } from "@/lib/r2";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return Response.json({ error: "Não autorizado" }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return Response.json({ error: "Arquivo não enviado" }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return Response.json({ error: "O arquivo deve ser uma imagem" }, { status: 400 });
  }

  if (!R2_BUCKET || !R2_PUBLIC_URL) {
    return Response.json({ error: "Storage não configurado" }, { status: 500 });
  }

  const extension = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "bin";
  const key = `avatars/${session.user.id}-${Date.now()}-${randomUUID()}.${extension}`;

  await r2.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      Body: Buffer.from(await file.arrayBuffer()),
      ContentType: file.type,
    }),
  );

  const url = `${R2_PUBLIC_URL.replace(/\/$/, "")}/${key}`;

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: { image: url },
    select: { id: true, name: true, email: true, image: true, role: true },
  });

  return Response.json(user, { status: 201 });
}
