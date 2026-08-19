"use client";

import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AdminIcon, AdminNavItem, AdminSidebarProfile, type AdminIconName } from "@/components/admin/admin-ui";

const ROLE_LABELS: Record<string, string> = {
  STUDIO: "Studio",
  CLIENT_ADMIN: "Admin Cliente",
  CLIENT_USER: "Usuário Cliente",
  PARTNER: "Parceiro",
};

const ADMIN_ROLES = ["STUDIO", "CLIENT_ADMIN"];

const links = [
  { href: "/admin", label: "Dashboard", icon: "dashboard" },
  { href: "/admin/conteudo-institucional", label: "Conteúdo Institucional", icon: "data" },
  { href: "/admin/depoimentos", label: "Depoimentos", icon: "reports" },
  { href: "/admin/clientes", label: "Clientes", icon: "staff" },
  { href: "/admin/solucoes", label: "Soluções", icon: "data" },
  { href: "/admin/projetos", label: "Projetos", icon: "reports" },
  { href: "/admin/processos", label: "Processos", icon: "reports" },
  { href: "/admin/pessoas", label: "Pessoas", icon: "staff" },
  { href: "/admin/configuracoes", label: "Configurações", icon: "settings" },
  { href: "/admin/integracoes", label: "Integrações", icon: "data", adminOnly: true },
  { href: "/admin/usuarios", label: "Usuários", icon: "users" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session } = useSession();
  const userName = session?.user?.name || "Instalsat";
  const userRole = ROLE_LABELS[session?.user?.role ?? ""] ?? "Administrador";
  const userImage = session?.user?.image ?? undefined;

  if (pathname === "/admin/login") return children;

  return (
    <div className="min-h-screen bg-[#F4F8FC] lg:grid lg:grid-cols-[272px_1fr]">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between bg-[#003841] px-5 lg:hidden">
        <Link href="/admin" aria-label="Dashboard Instalsat">
          <Image src="/institucional/logo-wordmark.svg" alt="Instalsat" width={126} height={24} />
        </Link>
        <button type="button" onClick={() => setMenuOpen((open) => !open)} className="grid size-10 place-items-center rounded-lg border border-[#3A99A8] text-xl text-[#DCE3EC]" aria-label="Abrir menu">
          {menuOpen ? "×" : <AdminIcon name="menu" className="size-6" />}
        </button>
      </header>

      {menuOpen ? <button className="fixed inset-0 z-30 bg-black/30 lg:hidden" onClick={() => setMenuOpen(false)} aria-label="Fechar menu" /> : null}

      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[272px] flex-col bg-[#003841] transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <Link href="/admin" className="flex h-24 items-center gap-3 border-b border-[#3A99A8]/30 px-7" onClick={() => setMenuOpen(false)}>
          <Image src="/institucional/logo-symbol.svg" alt="" width={38} height={38} />
          <Image src="/institucional/logo-wordmark.svg" alt="Instalsat" width={128} height={24} />
        </Link>

        <nav className="flex-1 px-4 py-7" aria-label="Navegação administrativa">
          <p className="mb-4 px-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[#DCE3EC]/45">Gerenciamento</p>
          <div className="space-y-1.5">
            {links.filter((link) => !link.adminOnly || ADMIN_ROLES.includes(session?.user?.role ?? "")).map((link) => {
              const active = link.href === "/admin" ? pathname === link.href : pathname.startsWith(link.href);
              return (
                <AdminNavItem key={link.href} href={link.href} label={link.label} icon={link.icon as AdminIconName} active={active} onClick={() => setMenuOpen(false)} />
              );
            })}
          </div>
        </nav>

        <div className="border-t border-[#3A99A8]/30 p-4">
          <Link href="/admin/perfil" onClick={() => setMenuOpen(false)} className="block rounded-lg transition-opacity hover:opacity-80">
            <AdminSidebarProfile name={userName} role={userRole} avatarUrl={userImage} />
          </Link>
          <button type="button" onClick={() => signOut({ callbackUrl: "/admin/login" })} className="mt-2 flex h-10 w-full items-center gap-3 rounded-lg px-3 text-left text-[14px] text-[#DCE3EC] transition-colors hover:bg-white/8 hover:text-white">
            <span className="w-5 text-center text-lg" aria-hidden="true">↪</span>
            Sair do painel
          </button>
        </div>
      </aside>

      <main className="min-w-0 p-5 sm:p-8 xl:px-10 xl:py-9">{children}</main>
    </div>
  );
}
