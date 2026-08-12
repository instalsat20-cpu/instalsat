"use client";

import { FormEvent, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { PageHeader } from "@/components/admin/page-header";
import { AdminDesktopHeader } from "@/components/admin/admin-ui";

const ROLE_LABELS: Record<string, string> = {
  STUDIO: "Studio",
  CLIENT_ADMIN: "Admin Cliente",
  CLIENT_USER: "Usuário Cliente",
  PARTNER: "Parceiro",
};

type Message = { type: "error" | "success"; text: string } | null;

export default function AdminPerfilPage() {
  const { data: session, status, update } = useSession();
  const user = session?.user;

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState<Message>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<Message>(null);

  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarMessage, setAvatarMessage] = useState<Message>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initialized = useRef(false);
  if (!initialized.current && user) {
    initialized.current = true;
    setName(user.name ?? "");
    setEmail(user.email ?? "");
  }

  async function handleProfileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingProfile(true);
    setProfileMessage(null);
    try {
      const res = await fetch("/api/admin/perfil", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao atualizar dados.");
      await update();
      setProfileMessage({ type: "success", text: "Dados atualizados com sucesso." });
    } catch (error) {
      setProfileMessage({ type: "error", text: error instanceof Error ? error.message : "Erro desconhecido." });
    } finally {
      setSavingProfile(false);
    }
  }

  async function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingPassword(true);
    setPasswordMessage(null);
    try {
      const res = await fetch("/api/admin/perfil/senha", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao trocar senha.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordMessage({ type: "success", text: "Senha alterada com sucesso." });
    } catch (error) {
      setPasswordMessage({ type: "error", text: error instanceof Error ? error.message : "Erro desconhecido." });
    } finally {
      setSavingPassword(false);
    }
  }

  async function handleAvatarChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    setAvatarMessage(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/perfil/avatar", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao enviar imagem.");
      await update();
      setAvatarMessage({ type: "success", text: "Foto de perfil atualizada." });
    } catch (error) {
      setAvatarMessage({ type: "error", text: error instanceof Error ? error.message : "Erro desconhecido." });
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  if (status === "loading") {
    return (
      <div className="flex h-48 items-center justify-center">
        <p className="text-[14px] text-[#63777B]">Carregando...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-48 items-center justify-center">
        <p className="text-[14px] text-red-600">Não foi possível carregar seus dados.</p>
      </div>
    );
  }

  return (
    <>
      <PageHeader eyebrow="Conta" title="Meu perfil" description="Edite seus dados pessoais, foto de perfil e senha de acesso." />

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="admin-surface flex flex-col items-center gap-4 p-6 text-center">
          <AdminDesktopHeader title={name || "Usuário"} variant="profile" avatarUrl={user.image ?? undefined} subtitle={ROLE_LABELS[user.role ?? ""] ?? user.role} />

          <div className="mt-2 flex flex-col items-center gap-3">
            <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleAvatarChange} />
            <button
              type="button"
              disabled={uploadingAvatar}
              onClick={() => fileInputRef.current?.click()}
              className="admin-button-secondary"
            >
              {uploadingAvatar ? "Enviando..." : "Alterar foto"}
            </button>
            {avatarMessage ? (
              <p className={`text-[12px] ${avatarMessage.type === "error" ? "text-red-700" : "text-[#128C7E]"}`}>{avatarMessage.text}</p>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <section className="admin-surface p-6 sm:p-8">
            <h2 className="text-[20px] font-semibold text-[#003841]">Dados pessoais</h2>
            <p className="mt-1 text-[13px] text-[#63777B]">Atualize seu nome e e-mail de acesso ao painel.</p>

            {profileMessage ? (
              <div className={`mt-5 border-l-2 px-4 py-3 text-[14px] ${profileMessage.type === "error" ? "border-red-600 bg-red-50 text-red-800" : "border-[#128C7E] bg-emerald-50 text-emerald-800"}`}>
                {profileMessage.text}
              </div>
            ) : null}

            <form onSubmit={handleProfileSubmit} className="mt-5 grid gap-5 sm:grid-cols-2">
              <label className="sm:col-span-1">
                <span className="mb-2 block text-[13px] font-medium text-[#003841]">Nome *</span>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome completo" className="admin-field h-[52px]" />
              </label>
              <label className="sm:col-span-1">
                <span className="mb-2 block text-[13px] font-medium text-[#003841]">E-mail *</span>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@exemplo.com" className="admin-field h-[52px]" />
              </label>
              <div className="flex justify-end sm:col-span-2">
                <button type="submit" disabled={savingProfile} className="admin-button-primary">
                  {savingProfile ? "Salvando..." : "Salvar alterações"}
                </button>
              </div>
            </form>
          </section>

          <section className="admin-surface p-6 sm:p-8">
            <h2 className="text-[20px] font-semibold text-[#003841]">Trocar senha</h2>
            <p className="mt-1 text-[13px] text-[#63777B]">Informe a senha atual e defina uma nova senha de acesso.</p>

            {passwordMessage ? (
              <div className={`mt-5 border-l-2 px-4 py-3 text-[14px] ${passwordMessage.type === "error" ? "border-red-600 bg-red-50 text-red-800" : "border-[#128C7E] bg-emerald-50 text-emerald-800"}`}>
                {passwordMessage.text}
              </div>
            ) : null}

            <form onSubmit={handlePasswordSubmit} className="mt-5 grid gap-5">
              <label>
                <span className="mb-2 block text-[13px] font-medium text-[#003841]">Senha atual *</span>
                <input type="password" required value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="••••••••" className="admin-field h-[52px]" />
              </label>
              <div className="grid gap-5 sm:grid-cols-2">
                <label>
                  <span className="mb-2 block text-[13px] font-medium text-[#003841]">Nova senha *</span>
                  <input type="password" required minLength={8} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Mínimo 8 caracteres" className="admin-field h-[52px]" />
                </label>
                <label>
                  <span className="mb-2 block text-[13px] font-medium text-[#003841]">Confirmar nova senha *</span>
                  <input type="password" required minLength={8} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repita a nova senha" className="admin-field h-[52px]" />
                </label>
              </div>
              <div className="flex justify-end">
                <button type="submit" disabled={savingPassword} className="admin-button-primary">
                  {savingPassword ? "Salvando..." : "Trocar senha"}
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </>
  );
}
