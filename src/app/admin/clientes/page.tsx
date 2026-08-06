"use client";

import { CmsManager, type Column, type Field } from "@/components/admin/cms-manager";

const fields: Field[] = [
  { name: "nome", label: "Nome do cliente", required: true },
  { name: "siteUrl", label: "Site", type: "url", placeholder: "https://..." },
  { name: "logoUrl", label: "Logo principal", type: "upload", required: true, accept: "image/png,image/svg+xml", help: "Aceita PNG e SVG." },
  { name: "logoDarkUrl", label: "Logo para fundo escuro", type: "upload", accept: "image/png,image/svg+xml", help: "Opcional. Sem esta versão, a logo principal será usada." },
  { name: "ordem", label: "Ordem", type: "number", help: "Menores números aparecem primeiro." },
  { name: "ativo", label: "Cliente ativo", type: "toggle" },
];

const columns: Column[] = [
  { key: "logoUrl", label: "Logo", kind: "image" },
  { key: "nome", label: "Cliente" },
  { key: "siteUrl", label: "Site" },
  { key: "ordem", label: "Ordem", kind: "order" },
  { key: "ativo", label: "Status", kind: "status" },
];

export default function ClientesPage() {
  return <CmsManager endpoint="/api/admin/clientes" eyebrow="Marcas" title="Clientes" description="Organize as marcas parceiras e suas versões de logo." singular="Cliente" fields={fields} columns={columns} defaults={{ ativo: true, ordem: 0 }} />;
}
