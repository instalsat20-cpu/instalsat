import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

const STATUS_KEY = "site_status";
const MODE_PAGES = ["/manutencao", "/em-breve"];

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (MODE_PAGES.some((page) => pathname === page || pathname.startsWith(`${page}/`))) {
    return NextResponse.next();
  }

  try {
    const configuracao = await prisma.configuracao.findUnique({
      where: { chave: STATUS_KEY },
      select: { valor: true },
    });

    if (configuracao?.valor === "manutencao") {
      return NextResponse.rewrite(new URL("/manutencao", request.url));
    }

    if (configuracao?.valor === "em_breve") {
      return NextResponse.rewrite(new URL("/em-breve", request.url));
    }
  } catch (error) {
    console.error("[site-status] Não foi possível consultar o modo do site.", error);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|admin|_next/static|_next/image|favicon.ico|icon.png|robots.txt|sitemap.xml|.*\\..*).*)",
  ],
};
