"use client";

import { FormEvent, useEffect, useState } from "react";
import { PageHeader } from "@/components/admin/page-header";
import { AdminButton, AdminDropdown, AdminField } from "@/components/admin/admin-ui";

const chatOptions = [
  { value: "none", label: "Nenhum" },
  { value: "crisp", label: "Crisp" },
  { value: "tidio", label: "Tidio" },
  { value: "jivochat", label: "JivoChat" },
];

type Values = Record<string, string>;

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span className={`inline-flex h-6 items-center gap-1.5 rounded-full px-2.5 text-[11px] font-semibold ${active ? "bg-[#128C7E]/10 text-[#128C7E]" : "bg-[#E0E8EA] text-[#63777B]"}`}>
      <span className={`size-1.5 rounded-full ${active ? "bg-[#128C7E]" : "bg-[#829397]"}`} />
      {active ? "Ativo" : "Inativo"}
    </span>
  );
}

function Section({ title, active, info, children }: { title: string; active: boolean; info: string; children: React.ReactNode }) {
  return (
    <section className="admin-surface p-5 sm:p-7">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-[20px] font-semibold text-[#003841]">{title}<span className="text-[#E05829]">.</span></h2>
        <StatusBadge active={active} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">{children}</div>
      <p className="mt-4 text-[12px] leading-5 text-[#63777B]">{info}</p>
    </section>
  );
}

export default function IntegracoesPage() {
  const [values, setValues] = useState<Values>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/integracoes", { cache: "no-store", credentials: "include" })
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data: Values) => setValues({ chatProvider: "none", ...data }))
      .catch(() => setMessage("Não foi possível carregar as integrações."))
      .finally(() => setLoading(false));
  }, []);

  function set(key: string, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const payload = {
        gtmId: values.gtmId ?? "",
        ga4Id: values.ga4Id ?? "",
        googleAdsId: values.googleAdsId ?? "",
        googleAdsLabel: values.googleAdsLabel ?? "",
        metaPixelId: values.metaPixelId ?? "",
        whatsappNumber: values.whatsappNumber ?? "",
        whatsappMessage: values.whatsappMessage ?? "",
        chatProvider: values.chatProvider && values.chatProvider !== "none" ? values.chatProvider : "",
        chatId: values.chatId ?? "",
      };
      const response = await fetch("/api/admin/integracoes", { method: "PATCH", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!response.ok) throw new Error();
      setMessage("Integrações salvas com sucesso.");
    } catch {
      setMessage("Não foi possível salvar as integrações.");
    } finally {
      setSaving(false);
    }
  }

  const chatActive = Boolean(values.chatProvider && values.chatProvider !== "none" && values.chatId);

  return (
    <>
      <PageHeader eyebrow="Website" title="Integrações de marketing" description="Configure rastreamento, anúncios, WhatsApp e chat de atendimento exibidos no site." />
      {message ? <div className="mb-5 border-l-2 border-[#E05829] bg-white px-4 py-3 text-[14px] text-[#003841]">{message}</div> : null}
      <form onSubmit={submit} className="space-y-6">
        <Section title="Google Tag Manager (recomendado)" active={Boolean(values.gtmId)} info="Ao usar o GTM, você pode gerenciar Google Analytics, Google Ads, Meta Pixel e outros scripts diretamente no painel do GTM, sem precisar alterar o site. Recomendado para quem trabalha com agência de tráfego.">
          <AdminField label="GTM ID" placeholder="GTM-XXXXXX" disabled={loading} value={values.gtmId ?? ""} onChange={(event) => set("gtmId", event.target.value)} />
        </Section>

        <Section title="Google Analytics 4" active={Boolean(values.ga4Id)} info="Preencha apenas se não estiver usando o Google Tag Manager.">
          <AdminField label="Measurement ID" placeholder="G-XXXXXXXXXX" disabled={loading} value={values.ga4Id ?? ""} onChange={(event) => set("ga4Id", event.target.value)} />
        </Section>

        <Section title="Google Ads" active={Boolean(values.googleAdsId)} info="Preencha apenas se não estiver usando o Google Tag Manager.">
          <AdminField label="ID de conversão" placeholder="AW-XXXXXXXXX" disabled={loading} value={values.googleAdsId ?? ""} onChange={(event) => set("googleAdsId", event.target.value)} />
          <AdminField label="Label de conversão" disabled={loading} value={values.googleAdsLabel ?? ""} onChange={(event) => set("googleAdsLabel", event.target.value)} />
        </Section>

        <Section title="Meta (Facebook/Instagram)" active={Boolean(values.metaPixelId)} info="Preencha apenas se não estiver usando o Google Tag Manager.">
          <AdminField label="Pixel ID" placeholder="1234567890" disabled={loading} value={values.metaPixelId ?? ""} onChange={(event) => set("metaPixelId", event.target.value)} />
        </Section>

        <Section title="WhatsApp" active={Boolean(values.whatsappNumber)} info="Ao preencher, um botão flutuante do WhatsApp aparece em todas as páginas do site.">
          <AdminField label="Número com DDI" placeholder="5511999999999" disabled={loading} value={values.whatsappNumber ?? ""} onChange={(event) => set("whatsappNumber", event.target.value)} hint="Sem espaços, traços ou parênteses." />
          <AdminField label="Mensagem pré-preenchida" placeholder="Olá, gostaria de solicitar um orçamento." disabled={loading} value={values.whatsappMessage ?? ""} onChange={(event) => set("whatsappMessage", event.target.value)} />
        </Section>

        <Section title="Chat de atendimento" active={chatActive} info="O script do chat será injetado automaticamente em todas as páginas.">
          <AdminDropdown label="Provedor" value={values.chatProvider ?? "none"} options={chatOptions} disabled={loading} onChange={(value) => set("chatProvider", value)} />
          {values.chatProvider && values.chatProvider !== "none" ? (
            <AdminField label="ID do chat" disabled={loading} value={values.chatId ?? ""} onChange={(event) => set("chatId", event.target.value)} />
          ) : null}
        </Section>

        <div className="flex justify-end"><AdminButton type="submit" size="large" disabled={saving || loading}>{saving ? "Salvando..." : "Salvar integrações"}</AdminButton></div>
      </form>
    </>
  );
}
