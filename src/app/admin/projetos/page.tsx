"use client";

import { useEffect, useMemo, useState } from "react";
import { CmsManager, type Column, type Field } from "@/components/admin/cms-manager";
import { AdminDropdown, AdminIcon } from "@/components/admin/admin-ui";
import { UploadNameModal } from "@/components/admin/upload-name-modal";
import { slugifyFilename } from "@/lib/slugify";

type Depoimento = { id: string; nome: string; cargo: string };
type ProjetoResumo = { id: string; titulo: string };
type Midia = { id: string; tipo: "imagem" | "video"; url: string; ordem: number };

function ProjetoGaleria() {
  const [projetos, setProjetos] = useState<ProjetoResumo[]>([]);
  const [projetoId, setProjetoId] = useState("");
  const [midias, setMidias] = useState<Midia[]>([]);
  const [loading, setLoading] = useState(false);
  const [novoTipo, setNovoTipo] = useState<"imagem" | "video">("imagem");
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/projetos", { cache: "no-store", credentials: "include" })
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data: ProjetoResumo[]) => setProjetos(data))
      .catch(() => undefined);
  }, []);

  const loadMidias = (id: string) => {
    if (!id) { setMidias([]); return; }
    setLoading(true);
    fetch(`/api/admin/projetos/${id}/midias`, { cache: "no-store", credentials: "include" })
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data: Midia[]) => setMidias(data))
      .catch(() => setMessage("Não foi possível carregar a galeria."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadMidias(projetoId); }, [projetoId]);

  async function confirmUpload(filename: string) {
    if (!pendingFile || !projetoId) return;
    const file = pendingFile;
    setPendingFile(null);
    setUploading(true);
    setMessage(null);
    try {
      const data = new FormData();
      data.append("file", file);
      data.append("filename", filename);
      if (novoTipo === "video") {
        data.append("allowVideo", "true");
        data.append("maxSizeMB", "50");
      }
      const uploadResponse = await fetch("/api/admin/upload", { method: "POST", credentials: "include", body: data });
      const uploadResult = await uploadResponse.json();
      if (!uploadResponse.ok) throw new Error(uploadResult.error || "Erro no upload.");

      const createResponse = await fetch(`/api/admin/projetos/${projetoId}/midias`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo: novoTipo, url: uploadResult.url }),
      });
      if (!createResponse.ok) throw new Error("Erro ao salvar a mídia na galeria.");
      loadMidias(projetoId);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erro no upload.");
    } finally {
      setUploading(false);
    }
  }

  async function remove(midia: Midia) {
    if (!window.confirm("Remover esta mídia da galeria?")) return;
    const response = await fetch(`/api/admin/midias/${midia.id}`, { method: "DELETE", credentials: "include" });
    if (response.ok) loadMidias(projetoId);
  }

  async function move(midia: Midia, direction: -1 | 1) {
    const sorted = [...midias].sort((a, b) => a.ordem - b.ordem);
    const index = sorted.findIndex((m) => m.id === midia.id);
    const swapWith = sorted[index + direction];
    if (!swapWith) return;
    await Promise.all([
      fetch(`/api/admin/midias/${midia.id}`, { method: "PUT", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ordem: swapWith.ordem }) }),
      fetch(`/api/admin/midias/${swapWith.id}`, { method: "PUT", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ordem: midia.ordem }) }),
    ]);
    loadMidias(projetoId);
  }

  const sortedMidias = [...midias].sort((a, b) => a.ordem - b.ordem);

  return (
    <section className="admin-surface p-5 sm:p-7">
      <h2 className="mb-1 text-[20px] font-semibold text-[#003841]">Galeria do projeto<span className="text-[#E05829]">.</span></h2>
      <p className="mb-5 text-[13px] text-[#63777B]">Imagens e vídeos que aparecem no carrossel de cada case em /projetos. Sem itens aqui, o case mostra só a imagem de capa.</p>

      <AdminDropdown label="Projeto" value={projetoId} onChange={setProjetoId} placeholder="Selecione um projeto" options={projetos.map((p) => ({ value: p.id, label: p.titulo }))} className="mb-5 max-w-[420px]" />

      {message ? <div className="mb-4 border-l-2 border-[#E05829] bg-white px-4 py-3 text-[14px] text-[#003841]">{message}</div> : null}

      {projetoId ? (
        <>
          <div className="mb-5 divide-y divide-[#E0E8EA] border border-[#D7E1E5]">
            {loading ? <p className="p-4 text-[14px] text-[#52666A]">Carregando...</p> : null}
            {!loading && sortedMidias.length === 0 ? <p className="p-4 text-[14px] text-[#52666A]">Nenhuma mídia cadastrada ainda.</p> : null}
            {sortedMidias.map((midia, index) => (
              <div key={midia.id} className="flex items-center gap-3 p-3">
                <span className="rounded px-2 py-1 text-[11px] font-medium uppercase tracking-wide text-white" style={{ backgroundColor: midia.tipo === "video" ? "#003841" : "#128C7E" }}>{midia.tipo}</span>
                <span className="flex-1 truncate text-[13px] text-[#52666A]">{midia.url}</span>
                <button type="button" disabled={index === 0} onClick={() => move(midia, -1)} className="grid size-8 place-items-center rounded disabled:opacity-30" aria-label="Mover para cima"><AdminIcon name="chevron-up" className="size-4" /></button>
                <button type="button" disabled={index === sortedMidias.length - 1} onClick={() => move(midia, 1)} className="grid size-8 place-items-center rounded disabled:opacity-30" aria-label="Mover para baixo"><AdminIcon name="chevron-down" className="size-4" /></button>
                <button type="button" onClick={() => remove(midia)} className="grid size-8 place-items-center rounded text-red-700" aria-label="Remover"><AdminIcon name="remove" className="size-4" /></button>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 border border-dashed border-[#9DB0B5] bg-white p-4 sm:flex-row sm:items-center">
            <AdminDropdown value={novoTipo} onChange={(v) => setNovoTipo(v as "imagem" | "video")} options={[{ value: "imagem", label: "Imagem" }, { value: "video", label: "Vídeo" }]} className="w-full sm:w-[160px]" />
            <div className="flex-1">
              <input
                type="file"
                accept={novoTipo === "video" ? "video/mp4,video/webm,video/quicktime" : "image/png,image/jpeg,image/webp"}
                onChange={(event) => setPendingFile(event.target.files?.[0] ?? null)}
                className="block max-w-full text-[12px] text-[#52666A] file:mr-3 file:border-0 file:bg-[#003841] file:px-4 file:py-2 file:text-white"
              />
              <p className="mt-2 text-[12px] text-[#63777B]">
                {uploading ? "Enviando..." : novoTipo === "video" ? "MP4, WebM ou MOV. Até 50MB." : "PNG, JPG ou WebP."}
              </p>
            </div>
          </div>
        </>
      ) : null}

      <UploadNameModal
        open={Boolean(pendingFile)}
        suggestedName={pendingFile ? slugifyFilename(pendingFile.name) : ""}
        isVideo={novoTipo === "video"}
        onConfirm={confirmUpload}
        onCancel={() => setPendingFile(null)}
      />
    </section>
  );
}

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
    { name: "imagemUrl", label: "Imagem de capa", type: "upload", accept: "image/png,image/jpeg,image/webp", help: "PNG, JPG ou WebP. Paisagem, mínimo 1268×1094px. Até 4MB. Usada quando a galeria abaixo estiver vazia.", maxSizeMB: 4, minWidth: 1268, minHeight: 1094 },
    { name: "linkDetalhes", label: "Link de detalhes do projeto", type: "url", placeholder: "https://...", help: "Opcional. Exibe o botão \"+ detalhes do projeto\" apontando para esse link." },
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

  return (
    <>
      <CmsManager endpoint="/api/admin/projetos" eyebrow="Portfólio" title="Projetos" description="Gerencie cases publicados e selecione até três destaques para a Home." singular="Projeto" fields={fields} columns={columns} defaults={{ ativo: true, destaqueHome: false, ordem: 0, depoimentoId: "", linkDetalhes: "" }} maxHighlights={3} />
      <div className="mt-8">
        <ProjetoGaleria />
      </div>
    </>
  );
}
