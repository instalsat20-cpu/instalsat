"use client";

import { useCallback, useEffect, useState } from "react";
import { PageHeader } from "@/components/admin/page-header";
import { AdminButton, AdminField } from "@/components/admin/admin-ui";

type Lead = {
  id: string;
  nome: string;
  email: string;
  telefone: string | null;
  cidade: string | null;
  estado: string | null;
  assunto: string | null;
  mensagem: string | null;
  emailEnviado: boolean;
  createdAt: string;
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [busca, setBusca] = useState("");
  const [inicio, setInicio] = useState("");
  const [fim, setFim] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  const query = () => {
    const params = new URLSearchParams();
    if (busca) params.set("busca", busca);
    if (inicio) params.set("inicio", inicio);
    if (fim) params.set("fim", fim);
    return params.toString();
  };

  const load = useCallback(() => {
    setLoading(true);
    fetch(`/api/admin/leads?${query()}`, { cache: "no-store", credentials: "include" })
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data: Lead[]) => setLeads(data))
      .catch(() => setMessage("Não foi possível carregar os leads."))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busca, inicio, fim]);

  useEffect(() => { load(); }, [load]);

  async function remove(lead: Lead) {
    if (!window.confirm(`Remover o lead de "${lead.nome}"?`)) return;
    const response = await fetch(`/api/admin/leads/${lead.id}`, { method: "DELETE", credentials: "include" });
    if (response.ok) {
      setMessage("Lead removido com sucesso.");
      load();
    } else {
      setMessage("Não foi possível remover o lead.");
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Website"
        title="Leads"
        description="Contatos recebidos pelo formulário do site."
        action={<a href={`/api/admin/leads/export?${query()}`} className="admin-button-secondary">Exportar CSV</a>}
      />

      {message ? <div className="mb-5 border-l-2 border-[#E05829] bg-white px-4 py-3 text-[14px] text-[#003841]">{message}</div> : null}

      <div className="admin-surface mb-5 grid gap-4 p-5 sm:grid-cols-3">
        <AdminField label="Buscar" placeholder="Nome, e-mail ou telefone" value={busca} onChange={(e) => setBusca(e.target.value)} />
        <AdminField label="De" type="date" value={inicio} onChange={(e) => setInicio(e.target.value)} />
        <AdminField label="Até" type="date" value={fim} onChange={(e) => setFim(e.target.value)} />
      </div>

      <div className="admin-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] border-collapse text-left">
            <thead className="border-b border-[#D7E1E5] bg-[#F8FAFC] text-[#52666A]">
              <tr>
                {["Nome", "Contato", "Local", "Assunto", "Mensagem", "E-mail enviado", "Data"].map((label) => (
                  <th key={label} className="px-5 py-4 text-[12px] font-medium uppercase tracking-[0.08em]">{label}</th>
                ))}
                <th className="px-5 py-4 text-right text-[12px] font-medium uppercase tracking-[0.08em]">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E0E8EA]">
              {loading ? <tr><td colSpan={8} className="px-5 py-12 text-center text-[14px] text-[#52666A]">Carregando...</td></tr> : null}
              {!loading && leads.length === 0 ? <tr><td colSpan={8} className="px-5 py-12 text-center text-[14px] text-[#52666A]">Nenhum lead encontrado.</td></tr> : null}
              {!loading && leads.map((lead) => (
                <tr key={lead.id} className="text-[14px] text-[#003841] transition-colors hover:bg-[#F5F9FC]">
                  <td className="px-5 py-4">{lead.nome}</td>
                  <td className="px-5 py-4"><p>{lead.email}</p>{lead.telefone ? <p className="text-[#63777B]">{lead.telefone}</p> : null}</td>
                  <td className="px-5 py-4">{[lead.cidade, lead.estado].filter(Boolean).join(" - ") || "—"}</td>
                  <td className="px-5 py-4">{lead.assunto || "—"}</td>
                  <td className="max-w-[280px] px-5 py-4"><span className="line-clamp-2">{lead.mensagem || "—"}</span></td>
                  <td className="px-5 py-4"><span className={`rounded-full px-3 py-1 text-[12px] font-medium ${lead.emailEnviado ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"}`}>{lead.emailEnviado ? "Enviado" : "Não enviado"}</span></td>
                  <td className="px-5 py-4">{new Date(lead.createdAt).toLocaleString("pt-BR")}</td>
                  <td className="px-5 py-4 text-right"><AdminButton type="button" variant="danger" onClick={() => remove(lead)}>Excluir</AdminButton></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
