"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/admin/page-header";
import { AdminCheckbox, AdminDropdown, AdminIcon, AdminSidePanel } from "@/components/admin/admin-ui";

type Value = string | number | boolean | null;
type Item = Record<string, unknown> & { id: string; ativo?: boolean; ordem?: number; destaqueHome?: boolean };

export type Field = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "url" | "number" | "toggle" | "upload" | "select";
  required?: boolean;
  placeholder?: string;
  accept?: string;
  help?: string;
  options?: { value: string; label: string }[];
};

export type Column = { key: string; label: string; kind?: "text" | "image" | "status" | "highlight" | "order" };

type Props = {
  endpoint: string;
  eyebrow: string;
  title: string;
  description: string;
  singular: string;
  fields: Field[];
  columns: Column[];
  defaults?: Record<string, Value>;
  maxHighlights?: number;
};

function initialState(fields: Field[], defaults: Record<string, Value>) {
  return fields.reduce<Record<string, Value>>((state, field) => {
    state[field.name] = defaults[field.name] ?? (field.type === "toggle" ? false : field.type === "number" ? 0 : "");
    return state;
  }, {});
}

export function CmsManager({ endpoint, eyebrow, title, description, singular, fields, columns, defaults = {}, maxHighlights }: Props) {
  const emptyForm = useMemo(() => initialState(fields, defaults), [fields, defaults]);
  const [items, setItems] = useState<Item[]>([]);
  const [form, setForm] = useState<Record<string, Value>>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  const loadItems = useCallback(async () => {
    try {
      const response = await fetch(endpoint, { cache: "no-store", credentials: "include" });
      if (!response.ok) throw new Error("Não foi possível carregar os dados.");
      setItems(await response.json());
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "Erro ao carregar dados." });
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    let cancelled = false;

    fetch(endpoint, { cache: "no-store", credentials: "include" })
      .then((response) => {
        if (!response.ok) throw new Error("Não foi possível carregar os dados.");
        return response.json();
      })
      .then((data) => {
        if (!cancelled) setItems(data);
      })
      .catch((error: unknown) => {
        if (!cancelled) setMessage({ type: "error", text: error instanceof Error ? error.message : "Erro ao carregar dados." });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [endpoint]);

  function openNew() {
    setEditingId(null);
    setForm({ ...emptyForm });
    setMessage(null);
    setOpen(true);
  }

  function openEdit(item: Item) {
    setEditingId(item.id);
    setForm(fields.reduce<Record<string, Value>>((state, field) => {
      const value = item[field.name];
      state[field.name] = typeof value === "string" || typeof value === "number" || typeof value === "boolean" ? value : field.type === "toggle" ? false : "";
      return state;
    }, {}));
    setMessage(null);
    setOpen(true);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (maxHighlights && form.destaqueHome) {
      const highlighted = items.filter((item) => item.destaqueHome && item.id !== editingId).length;
      if (highlighted >= maxHighlights) {
        setMessage({ type: "error", text: `Você já possui ${maxHighlights} itens destacados. Remova um destaque antes de adicionar outro.` });
        return;
      }
    }

    setSaving(true);
    setMessage(null);
    try {
      const response = await fetch(editingId ? `${endpoint}/${editingId}` : endpoint, {
        method: editingId ? "PUT" : "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) throw new Error(result?.error || "Não foi possível salvar.");
      setOpen(false);
      setMessage({ type: "success", text: `${singular} salvo com sucesso.` });
      await loadItems();
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "Erro ao salvar." });
    } finally {
      setSaving(false);
    }
  }

  async function remove(item: Item) {
    if (!window.confirm(`Deseja remover este ${singular.toLowerCase()}?`)) return;
    const response = await fetch(`${endpoint}/${item.id}`, { method: "DELETE", credentials: "include" });
    if (response.ok) {
      setMessage({ type: "success", text: `${singular} removido com sucesso.` });
      await loadItems();
    } else {
      setMessage({ type: "error", text: "Não foi possível remover o item." });
    }
  }

  async function toggleActive(item: Item) {
    const response = await fetch(`${endpoint}/${item.id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ativo: !item.ativo }),
    });
    if (response.ok) await loadItems();
  }

  async function upload(field: Field, file?: File) {
    if (!file) return;
    setUploading(field.name);
    setMessage(null);
    const data = new FormData();
    data.append("file", file);
    try {
      const response = await fetch("/api/admin/upload", { method: "POST", credentials: "include", body: data });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Erro no upload.");
      setForm((current) => ({ ...current, [field.name]: result.url }));
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "Erro no upload." });
    } finally {
      setUploading(null);
    }
  }

  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title} description={description} action={
        <button type="button" onClick={openNew} className="admin-button-primary">
          <AdminIcon name="add" className="size-4" /> Novo
        </button>
      } />

      {message && !open ? <div className={`mb-5 border-l-2 px-4 py-3 text-[14px] ${message.type === "error" ? "border-red-600 bg-red-50 text-red-800" : "border-[#128C7E] bg-emerald-50 text-emerald-800"}`}>{message.text}</div> : null}

      <div className="admin-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead className="border-b border-[#D7E1E5] bg-[#F8FAFC] text-[#52666A]">
              <tr>{columns.map((column) => <th key={column.key} className="px-5 py-4 text-[12px] font-medium uppercase tracking-[0.08em]">{column.label}</th>)}<th className="px-5 py-4 text-right text-[12px] font-medium uppercase tracking-[0.08em]">Ações</th></tr>
            </thead>
            <tbody className="divide-y divide-[#E0E8EA]">
              {loading ? <tr><td colSpan={columns.length + 1} className="px-5 py-12 text-center text-[14px] text-[#52666A]">Carregando...</td></tr> : null}
              {!loading && items.length === 0 ? <tr><td colSpan={columns.length + 1} className="px-5 py-12 text-center text-[14px] text-[#52666A]">Nenhum item cadastrado.</td></tr> : null}
              {!loading && items.map((item) => (
                <tr key={item.id} className="text-[14px] text-[#003841] transition-colors hover:bg-[#F5F9FC]">
                  {columns.map((column) => {
                    const value = item[column.key];
                    return <td key={column.key} className="max-w-[320px] px-5 py-4">
                      {column.kind === "image" ? (typeof value === "string" && value ? <div className="h-12 w-20 bg-contain bg-left bg-no-repeat" style={{ backgroundImage: `url(${JSON.stringify(value)})` }} /> : <span className="text-[#829397]">Sem imagem</span>) : null}
                      {column.kind === "status" ? <button type="button" onClick={() => toggleActive(item)} className={`rounded-full px-3 py-1 text-[12px] font-medium ${item.ativo ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"}`}>{item.ativo ? "Ativo" : "Inativo"}</button> : null}
                      {column.kind === "highlight" ? <span className={value ? "text-[#E05829]" : "text-[#829397]"}>{value ? "Destaque" : "—"}</span> : null}
                      {column.kind === "order" ? String(value ?? 0) : null}
                      {!column.kind || column.kind === "text" ? <span className="line-clamp-2">{String(value ?? "—")}</span> : null}
                    </td>;
                  })}
                  <td className="px-5 py-4"><div className="flex justify-end gap-2"><button type="button" onClick={() => openEdit(item)} className="admin-button-secondary h-9 px-3 text-[12px]"><AdminIcon name="edit" className="size-4" />Editar</button><button type="button" onClick={() => remove(item)} className="admin-button-secondary h-9 px-3 text-[12px] hover:border-red-600 hover:text-red-700"><AdminIcon name="remove" className="size-4" />Excluir</button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AdminSidePanel open={open} title={`${editingId ? "Editar" : "Novo"} ${singular}`} subtitle={editingId ? "Atualize as informações deste cadastro." : "Preencha as informações para criar um novo cadastro."} onClose={() => setOpen(false)}>
            {message ? <div className={`mb-5 border-l-2 px-4 py-3 text-[14px] ${message.type === "error" ? "border-red-600 bg-red-50 text-red-800" : "border-[#128C7E] bg-emerald-50 text-emerald-800"}`}>{message.text}</div> : null}

            <form onSubmit={submit} className="grid gap-5 sm:grid-cols-2">
              {fields.map((field) => {
                const value = form[field.name];
                if (field.type === "toggle") return <div key={field.name} className="admin-surface flex min-h-16 items-center justify-between px-4 sm:col-span-2"><span>{field.help ? <span className="block text-[12px] text-[#63777B]">{field.help}</span> : null}</span><AdminCheckbox label={field.label} checked={Boolean(value)} onChange={(event) => setForm((current) => ({ ...current, [field.name]: event.target.checked }))} /></div>;
                if (field.type === "select") return <div key={field.name}><AdminDropdown label={`${field.label}${field.required ? " *" : ""}`} value={String(value ?? "")} options={field.options ?? []} onChange={(next) => setForm((current) => ({ ...current, [field.name]: next }))} placeholder={field.placeholder} /></div>;
                if (field.type === "upload") return <div key={field.name} className="sm:col-span-2"><label className="mb-2 block text-[13px] font-medium text-[#003841]">{field.label}{field.required ? " *" : ""}</label><div className="flex flex-col gap-3 border border-dashed border-[#9DB0B5] bg-white p-4 sm:flex-row sm:items-center"><div className="grid h-24 w-full shrink-0 place-items-center bg-[#EEF5FF] sm:w-32">{typeof value === "string" && value ? <div className="h-full w-full bg-contain bg-center bg-no-repeat" style={{ backgroundImage: `url(${JSON.stringify(value)})` }} /> : <span className="text-[12px] text-[#829397]">Preview</span>}</div><div><input type="file" accept={field.accept || "image/*"} onChange={(event) => upload(field, event.target.files?.[0])} className="block max-w-full text-[12px] text-[#52666A] file:mr-3 file:border-0 file:bg-[#003841] file:px-4 file:py-2 file:text-white" /><p className="mt-2 text-[12px] text-[#63777B]">{uploading === field.name ? "Enviando..." : field.help || "Selecione uma imagem."}</p></div></div></div>;
                return <label key={field.name} className={field.type === "textarea" ? "sm:col-span-2" : ""}><span className="mb-2 block text-[13px] font-medium text-[#003841]">{field.label}{field.required ? " *" : ""}</span>{field.type === "textarea" ? <textarea required={field.required} value={String(value ?? "")} onChange={(event) => setForm((current) => ({ ...current, [field.name]: event.target.value }))} placeholder={field.placeholder} rows={5} className="admin-field resize-y py-3" /> : <input type={field.type === "number" ? "number" : field.type === "url" ? "url" : "text"} required={field.required} value={String(value ?? "")} onChange={(event) => setForm((current) => ({ ...current, [field.name]: field.type === "number" ? Number(event.target.value) : event.target.value }))} placeholder={field.placeholder} className="admin-field h-[52px]" />}{field.help ? <span className="mt-1 block text-[11px] text-[#63777B]">{field.help}</span> : null}</label>;
              })}
              <div className="mt-2 flex flex-col-reverse gap-3 border-t border-[#CFDCE0] pt-5 sm:col-span-2 sm:flex-row sm:justify-end"><button type="button" onClick={() => setOpen(false)} className="admin-button-secondary">Cancelar</button><button type="submit" disabled={saving || Boolean(uploading)} className="admin-button-primary">{saving ? "Salvando..." : "Salvar"}</button></div>
            </form>
      </AdminSidePanel>
    </>
  );
}
