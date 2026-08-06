"use client";

import { FormEvent, useEffect, useState } from "react";
import { PageHeader } from "@/components/admin/page-header";
import { AdminButton, AdminField } from "@/components/admin/admin-ui";

const fields = [
  { key: "whatsapp", label: "WhatsApp", placeholder: "(11) 99999-9999", group: "Contato" },
  { key: "telefone", label: "Telefone", placeholder: "(11) 4000-0000", group: "Contato" },
  { key: "email", label: "E-mail", placeholder: "contato@instalsat.com.br", group: "Contato" },
  { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/...", group: "Redes e avaliações" },
  { key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/company/...", group: "Redes e avaliações" },
  { key: "link_google_reviews", label: "Avaliações no Google", placeholder: "https://...", group: "Redes e avaliações" },
  { key: "stat_anos", label: "Anos de experiência", placeholder: "28", group: "Big numbers — Home e Institucional", type: "number" },
  { key: "stat_clientes", label: "Clientes (em milhares)", placeholder: "2", group: "Big numbers — Home e Institucional", type: "number" },
  { key: "stat_atendimentos", label: "Atendimentos/ano (em milhares)", placeholder: "3", group: "Big numbers — Home e Institucional", type: "number" },
  { key: "stat_contratos", label: "Contratos recorrentes", placeholder: "30", group: "Big numbers — Home e Institucional", type: "number" },
] as const;

export default function ConfiguracoesPage() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/configuracoes", { cache: "no-store", credentials: "include" })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data: Record<string, string>) => setValues(data))
      .catch(() => setMessage("Não foi possível carregar as configurações."))
      .finally(() => setLoading(false));
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const payload = Object.fromEntries(fields.map((field) => [field.key, values[field.key] ?? ""]));
      const response = await fetch("/api/admin/configuracoes", { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!response.ok) throw new Error();
      setMessage("Configurações salvas com sucesso.");
    } catch {
      setMessage("Não foi possível salvar todas as configurações.");
    } finally {
      setSaving(false);
    }
  }

  const groups = [...new Set(fields.map((field) => field.group))];

  return (
    <>
      <PageHeader eyebrow="Website" title="Configurações" description="Atualize contatos, redes sociais, avaliações e números exibidos no site." />
      {message ? <div className="mb-5 border-l-2 border-[#E05829] bg-white px-4 py-3 text-[14px] text-[#003841]">{message}</div> : null}
      <form onSubmit={submit} className="space-y-6">
        {groups.map((group) => <section key={group} className="admin-surface p-5 sm:p-7"><h2 className="mb-5 text-[20px] font-semibold text-[#003841]">{group}<span className="text-[#E05829]">.</span></h2><div className="grid gap-5 sm:grid-cols-2">{fields.filter((field) => field.group === group).map((field) => <AdminField key={field.key} label={field.label} type={"type" in field ? field.type : "text"} min={"type" in field && field.type === "number" ? 0 : undefined} disabled={loading} value={values[field.key] ?? ""} onChange={(event) => setValues((current) => ({ ...current, [field.key]: event.target.value }))} placeholder={field.placeholder} />)}</div></section>)}
        <div className="flex justify-end"><AdminButton type="submit" size="large" disabled={saving || loading}>{saving ? "Salvando..." : "Salvar configurações"}</AdminButton></div>
      </form>
    </>
  );
}
