"use client";

import { CmsManager, type Column, type Field } from "@/components/admin/cms-manager";

const fields: Field[] = [
  { name: "pergunta", label: "Pergunta", required: true },
  { name: "resposta", label: "Resposta", type: "textarea", required: true },
  { name: "ordem", label: "Ordem", type: "number", help: "Menores números aparecem primeiro." },
  { name: "ativo", label: "Pergunta ativa", type: "toggle" },
];

const columns: Column[] = [
  { key: "pergunta", label: "Pergunta" },
  { key: "ordem", label: "Ordem", kind: "order" },
  { key: "ativo", label: "Status", kind: "status" },
];

export default function FaqsPage() {
  return <CmsManager endpoint="/api/admin/faqs" eyebrow="Website" title="Perguntas Frequentes" description="Gerencie as perguntas e respostas exibidas na página de Contato." singular="Pergunta" fields={fields} columns={columns} defaults={{ ativo: true, ordem: 0 }} />;
}
