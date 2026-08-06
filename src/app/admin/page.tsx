"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/admin/page-header";
import { AdminIcon } from "@/components/admin/admin-ui";

const resources = [
  { key: "depoimentos", label: "Depoimentos", href: "/admin/depoimentos" },
  { key: "clientes", label: "Clientes", href: "/admin/clientes" },
  { key: "solucoes", label: "Soluções", href: "/admin/solucoes" },
  { key: "projetos", label: "Projetos", href: "/admin/projetos" },
] as const;

export default function AdminDashboardPage() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all(resources.map(async (resource) => {
      const response = await fetch(`/api/admin/${resource.key}`, { cache: "no-store", credentials: "include" });
      if (!response.ok) return [resource.key, 0] as const;
      const data = await response.json();
      return [resource.key, Array.isArray(data) ? data.length : 0] as const;
    })).then((entries) => setCounts(Object.fromEntries(entries))).finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageHeader eyebrow="Visão geral" title="Dashboard" description="Acompanhe e acesse rapidamente o conteúdo administrável do website." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {resources.map((resource, index) => <Link key={resource.key} href={resource.href} className="admin-surface group p-5 transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-[#E05829] hover:shadow-[0_8px_24px_rgba(0,56,65,0.08)]"><div className="mb-7 flex items-start justify-between"><span className="grid size-10 place-items-center rounded-lg bg-[#003841] text-[12px] font-medium text-white">0{index + 1}</span><span className="grid size-9 place-items-center rounded-lg border border-[#D7E1E5] text-[#E05829] transition-colors group-hover:border-[#E05829] group-hover:bg-[#E05829] group-hover:text-white"><AdminIcon name="chevron-right" className="size-5" /></span></div><p className="text-[12px] font-medium text-[#63777B]">Total cadastrado</p><p className="mt-1 text-[36px] font-semibold tracking-[-0.03em] text-[#003841]">{loading ? "—" : counts[resource.key] ?? 0}</p><p className="mt-4 border-t border-[#E0E8EA] pt-4 text-[14px] font-medium text-[#003841]">{resource.label}</p></Link>)}
      </div>
      <section className="mt-6 flex flex-col gap-5 rounded-lg bg-[#003841] p-6 text-[#DCE3EC] sm:flex-row sm:items-center sm:justify-between"><div><p className="text-[12px] font-medium uppercase tracking-[0.12em] text-[#E05829]">Configuração geral</p><h2 className="mt-2 text-[22px] font-semibold">Mantenha os dados do site atualizados.</h2><p className="mt-2 text-[14px] text-[#DCE3EC]/70">Contatos, redes sociais, avaliações e estatísticas ficam centralizados no painel.</p></div><Link href="/admin/configuracoes" className="admin-button-primary shrink-0">Abrir configurações</Link></section>
    </>
  );
}
