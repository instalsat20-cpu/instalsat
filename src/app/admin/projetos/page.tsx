"use client";

import { CmsManager, type Column, type Field } from "@/components/admin/cms-manager";

const fields: Field[] = [
  { name: "categoria", label: "Categoria", required: true },
  { name: "titulo", label: "Título", required: true },
  { name: "descricao", label: "Descrição", type: "textarea", required: true },
  { name: "imagemUrl", label: "Imagem", type: "upload", accept: "image/png,image/jpeg,image/webp", help: "PNG, JPG ou WebP." },
  { name: "ordem", label: "Ordem", type: "number", help: "Menores números aparecem primeiro." },
  { name: "ativo", label: "Projeto ativo", type: "toggle" },
  { name: "destaqueHome", label: "Destaque na Home", type: "toggle", help: "Máximo de 3 projetos simultâneos." },
];

const columns: Column[] = [
  { key: "imagemUrl", label: "Imagem", kind: "image" },
  { key: "titulo", label: "Projeto" },
  { key: "categoria", label: "Categoria" },
  { key: "destaqueHome", label: "Home", kind: "highlight" },
  { key: "ordem", label: "Ordem", kind: "order" },
  { key: "ativo", label: "Status", kind: "status" },
];

export default function ProjetosPage() {
  return <CmsManager endpoint="/api/admin/projetos" eyebrow="Portfólio" title="Projetos" description="Gerencie cases publicados e selecione até três destaques para a Home." singular="Projeto" fields={fields} columns={columns} defaults={{ ativo: true, destaqueHome: false, ordem: 0 }} maxHighlights={3} />;
}
