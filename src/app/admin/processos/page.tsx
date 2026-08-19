"use client";

import { CmsManager, type Column, type Field } from "@/components/admin/cms-manager";

const fields: Field[] = [
  { name: "categoria", label: "Categoria", required: true },
  { name: "numero", label: "Número", required: true, placeholder: "01" },
  { name: "titulo", label: "Título", required: true },
  { name: "descricao", label: "Descrição", type: "textarea", required: true },
  { name: "imagemUrl", label: "Imagem", type: "upload", accept: "image/png,image/jpeg,image/webp", help: "PNG, JPG ou WebP." },
  { name: "ordem", label: "Ordem", type: "number", help: "Menores números aparecem primeiro." },
  { name: "ativo", label: "Etapa ativa", type: "toggle" },
];

const columns: Column[] = [
  { key: "imagemUrl", label: "Imagem", kind: "image" },
  { key: "numero", label: "Nº" },
  { key: "titulo", label: "Etapa" },
  { key: "categoria", label: "Categoria" },
  { key: "ordem", label: "Ordem", kind: "order" },
  { key: "ativo", label: "Status", kind: "status" },
];

export default function ProcessosPage() {
  return <CmsManager endpoint="/api/admin/processos" eyebrow="Como trabalhamos" title="Processos" description="Gerencie as etapas exibidas na seção 'Como trabalhamos' da Home." singular="Processo" fields={fields} columns={columns} defaults={{ ativo: true, ordem: 0 }} />;
}
