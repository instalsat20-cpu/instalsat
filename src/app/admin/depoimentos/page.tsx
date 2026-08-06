"use client";

import { CmsManager, type Column, type Field } from "@/components/admin/cms-manager";

const fields: Field[] = [
  { name: "nome", label: "Nome", required: true },
  { name: "cargo", label: "Cargo", required: true },
  { name: "texto", label: "Depoimento", type: "textarea", required: true },
  { name: "fotoUrl", label: "Foto", type: "upload", accept: "image/png,image/jpeg,image/webp", help: "PNG, JPG ou WebP." },
  { name: "linkGoogle", label: "Link da avaliação no Google", type: "url", placeholder: "https://..." },
  { name: "ordem", label: "Ordem", type: "number", help: "Menores números aparecem primeiro." },
  { name: "ativo", label: "Depoimento ativo", type: "toggle" },
];

const columns: Column[] = [
  { key: "fotoUrl", label: "Foto", kind: "image" },
  { key: "nome", label: "Nome" },
  { key: "cargo", label: "Cargo" },
  { key: "ordem", label: "Ordem", kind: "order" },
  { key: "ativo", label: "Status", kind: "status" },
];

export default function DepoimentosPage() {
  return <CmsManager endpoint="/api/admin/depoimentos" eyebrow="Conteúdo" title="Depoimentos" description="Gerencie avaliações e relatos exibidos no site." singular="Depoimento" fields={fields} columns={columns} defaults={{ ativo: true, ordem: 0 }} />;
}
