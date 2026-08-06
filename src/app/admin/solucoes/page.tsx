"use client";

import { CmsManager, type Column, type Field } from "@/components/admin/cms-manager";

const fields: Field[] = [
  { name: "categoria", label: "Categoria", required: true },
  { name: "titulo", label: "Título", required: true },
  { name: "descricao", label: "Descrição", type: "textarea", required: true },
  { name: "imagemUrl", label: "Imagem", type: "upload", accept: "image/png,image/jpeg,image/webp", help: "PNG, JPG ou WebP." },
  { name: "ordem", label: "Ordem", type: "number", help: "Menores números aparecem primeiro." },
  { name: "ativo", label: "Solução ativa", type: "toggle" },
  { name: "destaqueHome", label: "Destaque na Home", type: "toggle", help: "Máximo de 3 soluções simultâneas." },
];

const columns: Column[] = [
  { key: "imagemUrl", label: "Imagem", kind: "image" },
  { key: "titulo", label: "Solução" },
  { key: "categoria", label: "Categoria" },
  { key: "destaqueHome", label: "Home", kind: "highlight" },
  { key: "ordem", label: "Ordem", kind: "order" },
  { key: "ativo", label: "Status", kind: "status" },
];

export default function SolucoesPage() {
  return <CmsManager endpoint="/api/admin/solucoes" eyebrow="Serviços" title="Soluções" description="Cadastre soluções e escolha até três destaques para a página inicial." singular="Solução" fields={fields} columns={columns} defaults={{ ativo: true, destaqueHome: false, ordem: 0 }} maxHighlights={3} />;
}
