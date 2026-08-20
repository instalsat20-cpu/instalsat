"use client";

import { useEffect, useState } from "react";
import { AdminButton } from "@/components/admin/admin-ui";

type Props = {
  open: boolean;
  suggestedName: string;
  isVideo?: boolean;
  onConfirm: (name: string) => void;
  onCancel: () => void;
};

export function UploadNameModal({ open, suggestedName, isVideo = false, onConfirm, onCancel }: Props) {
  const [name, setName] = useState(suggestedName);

  useEffect(() => {
    if (open) setName(suggestedName);
  }, [open, suggestedName]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-[#001E23]/55 p-5" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onCancel(); }}>
      <section className="w-full max-w-[440px] rounded-lg bg-white p-6 shadow-[0_20px_60px_rgba(0,30,35,0.25)]" role="dialog" aria-modal="true" aria-labelledby="upload-name-title">
        <h2 id="upload-name-title" className="text-[18px] font-semibold text-[#003841]">Nome do arquivo</h2>
        <p className="mt-2 text-[13px] leading-5 text-[#63777B]">
          Use nomes descritivos, em minúsculo e com hífen entre as palavras — isso ajuda o Google a entender {isVideo ? "o vídeo" : "a imagem"}.
          {" "}Exemplo: <span className="font-medium text-[#003841]">{isVideo ? "instalacao-camera-condominio-maua.mp4" : "fachada-condominio-maua.jpg"}</span>.
        </p>
        <label className="mt-4 block">
          <span className="mb-2 block text-[13px] font-medium text-[#003841]">Nome sugerido</span>
          <input value={name} onChange={(event) => setName(event.target.value)} className="admin-field h-[48px]" autoFocus />
        </label>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <AdminButton type="button" variant="secondary" onClick={onCancel}>Cancelar</AdminButton>
          <AdminButton type="button" onClick={() => onConfirm(name.trim() || suggestedName)}>Usar este nome</AdminButton>
        </div>
      </section>
    </div>
  );
}
