"use client";

import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { AdminIcon } from "@/components/admin/admin-ui";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!result?.ok) {
        setError("E-mail ou senha incorretos. Tente novamente.");
        return;
      }

      const callbackUrl = searchParams.get("callbackUrl");
      router.push(callbackUrl?.startsWith("/") ? callbackUrl : "/admin");
      router.refresh();
    } catch {
      setError("Não foi possível entrar agora. Tente novamente em instantes.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen bg-[#EEF5FF] lg:grid-cols-[minmax(0,1.08fr)_minmax(440px,0.92fr)]">
      <section className="relative hidden overflow-hidden bg-[#003841] p-12 lg:flex lg:flex-col lg:justify-between xl:p-20">
        <Link href="/" className="relative z-10 flex items-center gap-3" aria-label="Voltar para a página inicial da Instalsat">
          <Image src="/institucional/logo-symbol.svg" alt="" width={42} height={42} />
          <Image src="/institucional/logo-wordmark.svg" alt="Instalsat" width={147} height={28} />
        </Link>

        <div className="relative z-10 max-w-[590px]">
          <div className="mb-6 flex h-7 w-fit items-center gap-2 rounded-full border border-[#3A99A8] px-[10px] text-[13px] leading-none text-[#DCE3EC]">
            <span className="size-2 shrink-0 bg-[#E05829]" />
            <span className="whitespace-nowrap">Área administrativa</span>
          </div>
          <h1 className="text-[48px] font-medium leading-[1.08] text-[#DCE3EC] xl:text-[60px]">
            Gestão segura, do início ao fim<span className="text-[#E05829]">.</span>
          </h1>
          <p className="mt-6 max-w-[480px] text-[16px] leading-7 text-[#DCE3EC]/80">
            Acesse o painel para gerenciar o conteúdo do seu website
          </p>
        </div>

        <div className="relative z-10 space-y-1 text-[13px] text-[#DCE3EC]/60">
          <p>© 2026 • Instalsat Eletrônica Ltda • 02.515.886/0001-31</p>
          <p>
            Desenvolvido por{" "}
            <a href="https://metacube.me" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 transition-colors hover:text-[#E05829]">
              MetaCube Studio
            </a>
          </p>
        </div>
      </section>

      <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-10 lg:px-16 xl:px-24">
        <div className="w-full max-w-[440px]">
          <Link href="/" className="mb-14 flex items-center gap-3 lg:hidden" aria-label="Voltar para a página inicial da Instalsat">
            <Image src="/LOGO.svg" alt="Instalsat" width={184} height={37} priority />
          </Link>

          <div className="mb-10">
            <p className="mb-3 text-[13px] font-medium uppercase tracking-[0.18em] text-[#E05829]">Bem-vindo de volta</p>
            <h2 className="text-[34px] font-medium leading-tight text-[#003841] sm:text-[40px]">
              Entre na sua conta<span className="text-[#E05829]">.</span>
            </h2>
            <p className="mt-3 text-[15px] leading-6 text-[#52666A]">Use suas credenciais para acessar o painel administrativo.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div>
              <label htmlFor="email" className="mb-2 block text-[14px] font-medium text-[#003841]">E-mail</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="seuemail@empresa.com.br"
                className="admin-field h-14 bg-transparent text-[15px]"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-[14px] font-medium text-[#003841]">Senha</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Digite sua senha"
                  className="admin-field h-14 bg-transparent pr-16 text-[15px]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  className="absolute inset-y-0 right-0 px-4 text-[13px] font-medium text-[#52666A] transition-colors hover:text-[#E05829]"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>
            </div>

            {error ? (
              <div role="alert" className="border-l-2 border-[#E05829] bg-[#E05829]/8 px-4 py-3 text-[14px] text-[#8B3518]">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className="admin-button-primary h-14 w-full justify-between px-6 text-[15px]"
            >
              <span>{isLoading ? "Entrando..." : "Entrar no painel"}</span>
              <AdminIcon name="chevron-right" className="size-5" />
            </button>
          </form>

          <p className="mt-10 border-t border-[#D2DDE0] pt-6 text-[13px] leading-5 text-[#52666A]">
            Problemas para acessar? Entre em contato com o administrador do sistema.
          </p>
        </div>
      </section>
    </main>
  );
}
