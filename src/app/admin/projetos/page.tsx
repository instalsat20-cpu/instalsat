"use client";

import { useEffect, useMemo, useState } from "react";
import { CmsManager, type Column, type Field } from "@/components/admin/cms-manager";

type Depoimento = { id: string; nome: string; cargo: string };

export default function ProjetosPage() {
  const [depoimentos, setDepoimentos] = useState<Depoimento[]>([]);

  useEffect(() => {
    fetch("/api/admin/depoimentos", { cache: "no-store", credentials: "include" })
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data: Depoimento[]) => setDepoimentos(data))
      .catch(() => undefined);
  }, []);

  const fields: Field[] = useMemo(() => [
    { name: "categoria", label: "Categoria", required: true },
    { name: "titulo", label: "Título", required: true },
    { name: "descricao", label: "Descrição", type: "textarea", required: true },
    { name: "imagemUrl", label: "Imagem", type: "upload", accept: "image/png,image/jpeg,image/webp", help: "PNG, JPG ou WebP." },
    {
      name: "depoimentoId",
      label: "Vincular depoimento",
      type: "select",
      placeholder: "Nenhum",
      options: [{ value: "", label: "Nenhum" }, ...depoimentos.map((d) => ({ value: d.id, label: `${d.nome} — ${d.cargo}` }))],
      help: "Exibe o botão \"Veja o depoimento\" neste case.",
    },
    { name: "ordem", label: "Ordem", type: "number", help: "Menores números aparecem primeiro." },
    { name: "ativo", label: "Projeto ativo", type: "toggle" },
    { name: "destaqueHome", label: "Destaque na Home", type: "toggle", help: "Máximo de 3 projetos simultâneos." },
  ], [depoimentos]);

  const columns: Column[] = [
    { key: "imagemUrl", label: "Imagem", kind: "image" },
    { key: "titulo", label: "Projeto" },
    { key: "categoria", label: "Categoria" },
    { key: "destaqueHome", label: "Home", kind: "highlight" },
    { key: "ordem", label: "Ordem", kind: "order" },
    { key: "ativo", label: "Status", kind: "status" },
  ];

  return <CmsManager endpoint="/api/admin/projetos" eyebrow="Portfólio" title="Projetos" description="Gerencie cases publicados e selecione até três destaques para a Home." singular="Projeto" fields={fields} columns={columns} defaults={{ ativo: true, destaqueHome: false, ordem: 0, depoimentoId: "" }} maxHighlights={3} />;
}
