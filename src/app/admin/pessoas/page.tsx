"use client";

import { CmsManager, type Column, type Field } from "@/components/admin/cms-manager";

const fields: Field[] = [
  { name: "nome", label: "Nome", required: true },
  { name: "cargo", label: "Cargo", required: true },
  { name: "descricao", label: "Descrição", type: "textarea", required: true },
  { name: "imagemUrl", label: "Foto", type: "upload", accept: "image/png,image/jpeg,image/webp", help: "PNG, JPG ou WebP." },
  { name: "ordem", label: "Ordem", type: "number", help: "Menores números aparecem primeiro." },
  { name: "ativo", label: "Pessoa ativa", type: "toggle" },
];

const columns: Column[] = [
  { key: "imagemUrl", label: "Foto", kind: "image" },
  { key: "nome", label: "Nome" },
  { key: "cargo", label: "Cargo" },
  { key: "ordem", label: "Ordem", kind: "order" },
  { key: "ativo", label: "Status", kind: "status" },
];

export default function PessoasPage() {
  return <CmsManager endpoint="/api/admin/pessoas" eyebrow="Institucional" title="Pessoas" description="Gerencie a equipe exibida na seção 'Quem está por trás' da página Institucional." singular="Pessoa" fields={fields} columns={columns} defaults={{ ativo: true, ordem: 0 }} />;
}
