import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { revalidateTag } from "next/cache";
import { NextRequest } from "next/server";

const ALLOWED_ROLES = ["STUDIO", "CLIENT_ADMIN"];

const FIELDS = [
  "gtmId",
  "ga4Id",
  "googleAdsId",
  "googleAdsLabel",
  "metaPixelId",
  "whatsappNumber",
  "whatsappMessage",
  "chatProvider",
  "chatId",
] as const;

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !ALLOWED_ROLES.includes(session.user?.role as string)) {
    return Response.json({ error: "Não autorizado" }, { status: 401 });
  }

  const integrations = await prisma.marketingIntegrations.findFirst();
  return Response.json(integrations ?? {});
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !ALLOWED_ROLES.includes(session.user?.role as string)) {
    return Response.json({ error: "Não autorizado" }, { status: 401 });
  }

  const body = await req.json();
  const data: Record<string, string | null> = {};
  for (const field of FIELDS) {
    if (field in body) data[field] = body[field] ? String(body[field]) : null;
  }

  const existing = await prisma.marketingIntegrations.findFirst();
  const updated = existing
    ? await prisma.marketingIntegrations.update({ where: { id: existing.id }, data })
    : await prisma.marketingIntegrations.create({ data: { id: "singleton", ...data } });

  revalidateTag("marketing-integrations", "max");

  return Response.json(updated);
}
