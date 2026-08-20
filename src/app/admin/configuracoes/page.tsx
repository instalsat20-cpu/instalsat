"use client";

import { FormEvent, useEffect, useState } from "react";
import { PageHeader } from "@/components/admin/page-header";
import { AdminButton, AdminDropdown, AdminField } from "@/components/admin/admin-ui";

const siteStatusOptions = [
  { value: "online", label: "Site no ar" },
  { value: "manutencao", label: "Modo manutenção" },
  { value: "em_breve", label: "Em breve" },
];

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
  { key: "contato_email_destino", label: "E-mail de destino do formulário", placeholder: "contato@instalsat.com.br", group: "Formulário de contato" },
] as const;

const DOMINIO_PERMITIDO = "@instalsat.com.br";

export default function ConfiguracoesPage() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/configuracoes", { cache: "no-store", credentials: "include" })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data: Record<string, string>) => setValues({ site_status: "online", ...data }))
      .catch(() => setMessage("Não foi possível carregar as configurações."))
      .finally(() => setLoading(false));
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const destino = values.contato_email_destino?.trim();
    if (destino && !destino.toLowerCase().endsWith(DOMINIO_PERMITIDO)) {
      setMessage(`O e-mail de destino do formulário deve pertencer ao domínio ${DOMINIO_PERMITIDO}.`);
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      const payload = {
        site_status: values.site_status ?? "online",
        ...Object.fromEntries(fields.map((field) => [field.key, values[field.key] ?? ""])),
      };
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
        <section className="admin-surface overflow-visible p-5 sm:p-7">
          <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-end">
            <div>
              <div className="mb-3 flex h-7 w-fit items-center gap-2 rounded-full border border-[#E05829] px-[10px] text-[12px] text-[#003841]">
                <span className="size-2 bg-[#E05829]" />
                Disponibilidade
              </div>
              <h2 className="text-[24px] font-semibold text-[#003841]">Status do site<span className="text-[#E05829]">.</span></h2>
              <p className="mt-2 max-w-xl text-[13px] leading-5 text-[#63777B]">Escolha o que os visitantes verão. O painel administrativo continuará acessível em qualquer modo.</p>
            </div>
            <AdminDropdown label="Modo atual" value={values.site_status ?? "online"} options={siteStatusOptions} disabled={loading} onChange={(value) => setValues((current) => ({ ...current, site_status: value }))} />
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {siteStatusOptions.map((option) => <div key={option.value} className={`rounded-lg border p-4 ${values.site_status === option.value || (!values.site_status && option.value === "online") ? "border-[#E05829] bg-[#FFF7F4]" : "border-[#D7E1E5] bg-[#F8FAFC]"}`}><p className="text-[13px] font-semibold text-[#003841]">{option.label}</p><p className="mt-1 text-[12px] leading-5 text-[#63777B]">{option.value === "online" ? "Todo o site público fica disponível." : option.value === "manutencao" ? "Exibe a página temporária de manutenção." : "Exibe a página de lançamento em breve."}</p></div>)}
          </div>
        </section>
        {groups.map((group) => <section key={group} className="admin-surface p-5 sm:p-7"><h2 className="mb-5 text-[20px] font-semibold text-[#003841]">{group}<span className="text-[#E05829]">.</span></h2><div className="grid gap-5 sm:grid-cols-2">{fields.filter((field) => field.group === group).map((field) => <AdminField key={field.key} label={field.label} type={"type" in field ? field.type : "text"} min={"type" in field && field.type === "number" ? 0 : undefined} disabled={loading} value={values[field.key] ?? ""} onChange={(event) => setValues((current) => ({ ...current, [field.key]: event.target.value }))} placeholder={field.placeholder} />)}</div></section>)}
        <div className="flex justify-end"><AdminButton type="submit" size="large" disabled={saving || loading}>{saving ? "Salvando..." : "Salvar configurações"}</AdminButton></div>
      </form>
    </>
  );
}
