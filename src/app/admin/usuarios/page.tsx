"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { PageHeader } from "@/components/admin/page-header";
import { AdminDropdown, AdminIcon, AdminSidePanel } from "@/components/admin/admin-ui";

type User = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: string;
};

const ROLE_LABELS: Record<string, string> = {
  STUDIO: "Studio",
  CLIENT_ADMIN: "Admin Cliente",
  CLIENT_USER: "Usuario Cliente",
  PARTNER: "Parceiro",
};

const ROLE_COLORS: Record<string, string> = {
  STUDIO: "bg-[#E05829]/10 text-[#AD4420]",
  CLIENT_ADMIN: "bg-[#003841]/10 text-[#003841]",
  CLIENT_USER: "bg-[#128C7E]/10 text-[#0a5c55]",
  PARTNER: "bg-slate-100 text-slate-600",
};

export default function AdminUsuariosPage() {
  const { data: session, status } = useSession();
  const callerRole = session?.user?.role as string | undefined;
  const isStudio = callerRole === "STUDIO";

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  // Panel state
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [panelMode, setPanelMode] = useState<"create" | "edit" | "password">("create");

  // Form fields
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formRole, setFormRole] = useState("CLIENT_USER");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [tempPassword, setTempPassword] = useState<string | null>(null);

  const allowedRoles = ["STUDIO", "CLIENT_ADMIN"];
  const hasAccess = callerRole && allowedRoles.includes(callerRole);

  const availableRoles = isStudio
    ? ["STUDIO", "CLIENT_ADMIN", "CLIENT_USER", "PARTNER"]
    : ["CLIENT_USER", "PARTNER"];

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/usuarios", { cache: "no-store", credentials: "include" });
      if (!res.ok) throw new Error("Nao foi possivel carregar os usuarios.");
      setUsers(await res.json());
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "Erro ao carregar." });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated" && hasAccess) loadUsers();
  }, [status, hasAccess, loadUsers]);

  function openCreate() {
    setEditingUser(null);
    setPanelMode("create");
    setFormName("");
    setFormEmail("");
    setFormRole("CLIENT_USER");
    setFormError(null);
    setTempPassword(null);
    setOpen(true);
  }

  function openEdit(user: User) {
    setEditingUser(user);
    setPanelMode("edit");
    setFormName(user.name ?? "");
    setFormEmail(user.email);
    setFormRole(user.role);
    setFormError(null);
    setTempPassword(null);
    setOpen(true);
  }

  function openResetPassword(user: User) {
    setEditingUser(user);
    setPanelMode("password");
    setFormError(null);
    setTempPassword(null);
    setOpen(true);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setFormError(null);
    setTempPassword(null);

    try {
      if (panelMode === "create") {
        const res = await fetch("/api/admin/usuarios", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: formName, email: formEmail, role: formRole }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Erro ao criar usuario.");
        setTempPassword(data.tempPassword);
        await loadUsers();
        setMessage({ type: "success", text: "Usuario criado com sucesso." });
      } else if (panelMode === "edit" && editingUser) {
        const res = await fetch(`/api/admin/usuarios/${editingUser.id}`, {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: formName, email: formEmail, role: formRole }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Erro ao editar usuario.");
        setOpen(false);
        await loadUsers();
        setMessage({ type: "success", text: "Usuario atualizado com sucesso." });
      } else if (panelMode === "password" && editingUser) {
        const res = await fetch(`/api/admin/usuarios/${editingUser.id}`, {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "reset-password" }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Erro ao resetar senha.");
        setTempPassword(data.tempPassword);
      }
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Erro desconhecido.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(user: User) {
    if (!window.confirm(`Deseja remover o usuario "${user.name || user.email}"? Esta acao nao pode ser desfeita.`)) return;
    const res = await fetch(`/api/admin/usuarios/${user.id}`, { method: "DELETE", credentials: "include" });
    if (res.ok) {
      setMessage({ type: "success", text: "Usuario removido com sucesso." });
      await loadUsers();
    } else {
      setMessage({ type: "error", text: "Nao foi possivel remover o usuario." });
    }
  }

  if (status === "loading") {
    return (
      <div className="flex h-48 items-center justify-center">
        <p className="text-[14px] text-[#63777B]">Carregando...</p>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="flex h-48 items-center justify-center">
        <p className="text-[14px] text-red-600">Acesso negado. Voce nao tem permissao para esta pagina.</p>
      </div>
    );
  }

  const panelTitle =
    panelMode === "create" ? "Novo Usuario" :
    panelMode === "edit" ? "Editar Usuario" :
    "Resetar Senha";

  const panelSubtitle =
    panelMode === "create" ? "Preencha os dados para criar um novo acesso ao painel." :
    panelMode === "edit" ? `Editando: ${editingUser?.email}` :
    `Gerar nova senha temporaria para ${editingUser?.email}`;

  return (
    <>
      <PageHeader
        eyebrow="Acesso"
        title="Usuarios"
        description="Gerencie os acessos ao painel administrativo. Defina perfis e permissoes para cada membro."
        action={
          <button type="button" onClick={openCreate} className="admin-button-primary">
            <AdminIcon name="add" className="size-4" /> Novo usuario
          </button>
        }
      />

      {message && !open ? (
        <div className={`mb-5 border-l-2 px-4 py-3 text-[14px] ${message.type === "error" ? "border-red-600 bg-red-50 text-red-800" : "border-[#128C7E] bg-emerald-50 text-emerald-800"}`}>
          {message.text}
        </div>
      ) : null}

      <div className="admin-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead className="border-b border-[#D7E1E5] bg-[#F8FAFC] text-[#52666A]">
              <tr>
                <th className="px-5 py-4 text-[12px] font-medium uppercase tracking-[0.08em]">Nome</th>
                <th className="px-5 py-4 text-[12px] font-medium uppercase tracking-[0.08em]">E-mail</th>
                <th className="px-5 py-4 text-[12px] font-medium uppercase tracking-[0.08em]">Perfil</th>
                <th className="px-5 py-4 text-right text-[12px] font-medium uppercase tracking-[0.08em]">Acoes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E0E8EA]">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center text-[14px] text-[#52666A]">Carregando...</td>
                </tr>
              ) : null}
              {!loading && users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center text-[14px] text-[#52666A]">Nenhum usuario cadastrado.</td>
                </tr>
              ) : null}
              {!loading && users.map((user) => (
                <tr key={user.id} className="text-[14px] text-[#003841] transition-colors hover:bg-[#F5F9FC]">
                  <td className="px-5 py-4 font-medium">{user.name || <span className="text-[#829397]">—</span>}</td>
                  <td className="px-5 py-4 text-[#52666A]">{user.email}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-block rounded-full px-3 py-1 text-[12px] font-medium ${ROLE_COLORS[user.role] ?? "bg-slate-100 text-slate-600"}`}>
                      {ROLE_LABELS[user.role] ?? user.role}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(user)}
                        className="admin-button-secondary h-9 px-3 text-[12px]"
                        title="Editar"
                      >
                        <AdminIcon name="edit" className="size-4" /> Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => openResetPassword(user)}
                        className="admin-button-secondary h-9 px-3 text-[12px]"
                        title="Resetar senha"
                      >
                        <AdminIcon name="check" className="size-4" /> Senha
                      </button>
                      {isStudio && (
                        <button
                          type="button"
                          onClick={() => handleDelete(user)}
                          className="admin-button-secondary h-9 px-3 text-[12px] hover:border-red-600 hover:text-red-700"
                          title="Excluir"
                        >
                          <AdminIcon name="remove" className="size-4" /> Excluir
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AdminSidePanel
        open={open}
        title={panelTitle}
        subtitle={panelSubtitle}
        onClose={() => setOpen(false)}
      >
        {formError ? (
          <div className="mb-5 border-l-2 border-red-600 bg-red-50 px-4 py-3 text-[14px] text-red-800">{formError}</div>
        ) : null}

        {tempPassword ? (
          <div className="mb-5 rounded-lg border border-[#128C7E]/30 bg-emerald-50 p-4">
            <p className="mb-1 text-[13px] font-semibold text-[#003841]">Senha temporaria gerada</p>
            <p className="text-[12px] text-[#52666A]">Copie e envie ao usuario. Ela nao sera exibida novamente.</p>
            <div className="mt-3 flex items-center gap-2 rounded border border-[#D7E1E5] bg-white px-4 py-3">
              <code className="flex-1 text-[15px] font-mono font-semibold tracking-widest text-[#003841]">{tempPassword}</code>
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(tempPassword)}
                className="text-[12px] text-[#E05829] hover:underline"
              >
                Copiar
              </button>
            </div>
            {panelMode === "create" && (
              <button type="button" onClick={() => setOpen(false)} className="admin-button-primary mt-4 w-full">
                Concluir
              </button>
            )}
          </div>
        ) : null}

        {!tempPassword || panelMode !== "create" ? (
          <form onSubmit={handleSubmit} className="grid gap-5">
            {panelMode !== "password" ? (
              <>
                <label>
                  <span className="mb-2 block text-[13px] font-medium text-[#003841]">Nome *</span>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Nome completo"
                    className="admin-field h-[52px]"
                  />
                </label>
                <label>
                  <span className="mb-2 block text-[13px] font-medium text-[#003841]">E-mail *</span>
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="email@exemplo.com"
                    className="admin-field h-[52px]"
                  />
                </label>
                <AdminDropdown label="Perfil *" value={formRole} onChange={setFormRole} options={availableRoles.map((role) => ({ value: role, label: ROLE_LABELS[role] ?? role }))} />
              </>
            ) : (
              <div className="rounded-lg border border-[#D7E1E5] bg-[#F8FAFC] p-4">
                <p className="text-[14px] text-[#52666A]">
                  Uma nova senha temporaria sera gerada para <strong className="text-[#003841]">{editingUser?.email}</strong>. A senha atual sera invalidada.
                </p>
              </div>
            )}

            <div className="flex flex-col-reverse gap-3 border-t border-[#CFDCE0] pt-5 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => setOpen(false)} className="admin-button-secondary">
                Cancelar
              </button>
              <button type="submit" disabled={saving} className="admin-button-primary">
                {saving ? "Processando..." : panelMode === "password" ? "Gerar nova senha" : panelMode === "edit" ? "Salvar alteracoes" : "Criar usuario"}
              </button>
            </div>
          </form>
        ) : null}
      </AdminSidePanel>
    </>
  );
}
