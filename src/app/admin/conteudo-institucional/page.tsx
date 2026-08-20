"use client";

import { FormEvent, useEffect, useState } from "react";
import { PageHeader } from "@/components/admin/page-header";
import { AdminButton } from "@/components/admin/admin-ui";

type Bloco = { id: string; chave: string; valor: string; label: string; grupo: string };

const GROUP_ORDER = [
  "Home — Hero",
  "CTA final (Home e Institucional)",
  "Institucional — Hero",
  "Institucional — Nossa história",
  "Institucional — Pilares",
  "Rodapé",
];

export default function ConteudoInstitucionalPage() {
  const [blocos, setBlocos] = useState<Bloco[]>([]);
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/conteudo-institucional", { cache: "no-store", credentials: "include" })
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data: Bloco[]) => {
        setBlocos(data);
        setValues(Object.fromEntries(data.map((b) => [b.chave, b.valor])));
      })
      .catch(() => setMessage("Não foi possível carregar o conteúdo institucional."))
      .finally(() => setLoading(false));
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const response = await fetch("/api/admin/conteudo-institucional", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error();
      setMessage("Conteúdo salvo com sucesso.");
    } catch {
      setMessage("Não foi possível salvar todo o conteúdo.");
    } finally {
      setSaving(false);
    }
  }

  const groups = [...new Set(blocos.map((b) => b.grupo))].sort((a, b) => {
    const ia = GROUP_ORDER.indexOf(a);
    const ib = GROUP_ORDER.indexOf(b);
    if (ia === -1 && ib === -1) return a.localeCompare(b);
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });

  return (
    <>
      <PageHeader
        eyebrow="Website"
        title="Conteúdo Institucional"
        description="Edite os textos fixos de hero, chamadas finais, nossa história, pilares e rodapé que aparecem na Home e na página Institucional."
      />
      {message ? <div className="mb-5 border-l-2 border-[#E05829] bg-white px-4 py-3 text-[14px] text-[#003841]">{message}</div> : null}
      <form onSubmit={submit} className="space-y-6">
        {groups.map((grupo) => (
          <section key={grupo} className="admin-surface p-5 sm:p-7">
            <h2 className="mb-5 text-[20px] font-semibold text-[#003841]">{grupo}<span className="text-[#E05829]">.</span></h2>
            <div className="grid gap-5 sm:grid-cols-2">
              {blocos.filter((b) => b.grupo === grupo).map((bloco) => {
                const isLong = bloco.valor.length > 80;
                return (
                  <label key={bloco.chave} className={isLong ? "sm:col-span-2" : ""}>
                    <span className="mb-2 block text-[13px] font-medium text-[#003841]">{bloco.label}</span>
                    {isLong ? (
                      <textarea
                        disabled={loading}
                        value={values[bloco.chave] ?? ""}
                        onChange={(event) => setValues((current) => ({ ...current, [bloco.chave]: event.target.value }))}
                        rows={4}
                        className="admin-field resize-y py-3"
                      />
                    ) : (
                      <input
                        type="text"
                        disabled={loading}
                        value={values[bloco.chave] ?? ""}
                        onChange={(event) => setValues((current) => ({ ...current, [bloco.chave]: event.target.value }))}
                        className="admin-field h-[52px]"
                      />
                    )}
                  </label>
                );
              })}
            </div>
          </section>
        ))}
        <div className="flex justify-end"><AdminButton type="submit" size="large" disabled={saving || loading}>{saving ? "Salvando..." : "Salvar conteúdo"}</AdminButton></div>
      </form>
    </>
  );
}
