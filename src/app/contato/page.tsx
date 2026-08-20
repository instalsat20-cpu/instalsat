"use client";

import Image from "next/image";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { Dropdown } from "@/components/ui/dropdown";
import { SocialLinks } from "@/components/ui/social-icons";
import { ArrowIcon } from "@/components/ui/arrow-icon";
import { useConteudoInstitucional, useFaqs } from "@/lib/use-site-content";

const ease = { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const };

const assuntos = ["Segurança Eletrônica", "Instalações Elétricas", "Contratos de Manutenção", "Outro Assunto"];

function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-70px" });

  return (
    <motion.div ref={ref} initial={false} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay, ease: [0.4, 0, 0.2, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

function Eyebrow({ children, dark = false, square = false }: { children: React.ReactNode; dark?: boolean; square?: boolean }) {
  return (
    <div className={`flex h-7 w-fit items-center gap-2 rounded-full border px-[10px] text-[13px] leading-none ${dark ? "border-[#3A99A8] text-[#DCE3EC]" : "border-[#E05829] text-[#003841]"}`}>
      {square && <span className="size-2 shrink-0 bg-[#E05829]" />}
      <span className="whitespace-nowrap">{children}</span>
    </div>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <motion.span animate={{ rotate: open ? -90 : 90 }} transition={ease} className="flex size-4 shrink-0 items-center justify-center">
      <Image src="/contato/icon-faq-arrow.svg" alt="" width={16} height={16} className="size-4" />
    </motion.span>
  );
}

function Footer({ conteudo }: { conteudo: Record<string, string> }) {
  const navigation = ["Início", "Sobre", "Soluções", "Projetos", "Contato", "Solicite uma análise"];
  const solutions = ["Segurança eletrônica", "Instalações elétricas", "Contratos de manutenção"];

  return (
    <footer className="border-t border-[#DCE3EC] bg-[#EEF5FF] px-5 pb-8 pt-12 md:px-20 md:pt-16">
      <div className="mb-12 flex flex-col md:mb-16 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col gap-4 border-b border-[#DCE3EC] pb-10 md:w-[230px] md:border-0 md:pb-0">
          <Image src="/LOGO.svg" alt="Instalsat" width={160} height={32} className="h-auto" />
          <p className="text-[16px] font-medium text-[#003841]">{conteudo.footer_tagline}<span className="text-[#E05829]">.</span></p>
          <SocialLinks />
        </div>

        <div className="grid grid-cols-2 gap-8 border-b border-[#DCE3EC] py-10 md:flex md:gap-20 md:border-0 md:py-0">
          {[
            { title: "Navegação", items: navigation },
            { title: "Soluções", items: solutions },
          ].map((column) => (
            <div key={column.title} className="flex flex-col gap-3">
              <p className="text-[18px] font-medium text-[#003841]">{column.title}</p>
              {column.items.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="size-[5px] shrink-0 bg-[#E05829]" />
                  <span className="text-[14px] text-[#003841]">{item}</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 pt-10 md:w-[223px] md:pt-0">
          <p className="text-[18px] font-medium text-[#003841]">Contato</p>
          <div><p className="text-[14px] text-[#003841]">WhatsApp</p><a href="https://wa.me/551145411316" className="text-[14px] font-semibold text-[#E05829]">{conteudo.footer_whatsapp_numero}</a></div>
          <div><p className="text-[14px] text-[#003841]">Telefone</p><a href="tel:+5511439012345" className="text-[14px] font-semibold text-[#E05829]">{conteudo.footer_telefone_numero}</a></div>
          <div><p className="text-[14px] text-[#003841]">E-mail</p><a href="mailto:contato@instalsat.com.br" className="text-[14px] font-semibold text-[#E05829]">{conteudo.footer_email}</a></div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-1 border-t border-[#DCE3EC] pt-6 text-center text-[14px] leading-[22px] text-[#003841]">
        <p>{conteudo.footer_copyright}</p>
        <p>Termos de Uso • Desenvolvido por <a href="https://metacube.studio" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#E05829]">MetaCube Studio</a></p>
      </div>
    </footer>
  );
}

function FaqItem({ item, open, onToggle }: { item: { question: string; answer: string }; open: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-[#969BA1]">
      <button type="button" onClick={onToggle} className="flex w-full items-center justify-between gap-4 py-4 pl-6 pr-4 text-left" aria-expanded={open}>
        <span className="flex items-center gap-4">
          <span className="size-3 shrink-0 bg-[#E05829]" />
          <span className="text-[18px] font-medium leading-[27px] text-[#003841] md:text-[24px] md:leading-[36px]">{item.question}</span>
        </span>
        <ChevronIcon open={open} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }} className="overflow-hidden">
            <p className="px-6 pb-5 text-[14px] leading-[22px] text-[#003841] md:pl-[52px]">{item.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FieldShell({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <div className="flex h-[52px] flex-1 items-center gap-2 border border-[#CFD5DE] p-4">
      <span className="flex size-5 shrink-0 items-center justify-center">
        <Image src={icon} alt="" width={20} height={20} className="size-auto max-h-5 max-w-5 object-contain" />
      </span>
      {children}
    </div>
  );
}

export default function ContatoPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [form, setForm] = useState({ nome: "", telefone: "", email: "", cidade: "", estado: "", assunto: "", mensagem: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const conteudo = useConteudoInstitucional();
  const faqs = useFaqs();

  const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError(null);
    try {
      const response = await fetch("/api/contato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error();
      setSent(true);
      setForm({ nome: "", telefone: "", email: "", cidade: "", estado: "", assunto: "", mensagem: "" });
    } catch {
      setError("Não foi possível enviar sua mensagem. Tente novamente ou fale pelo WhatsApp.");
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="w-full overflow-x-hidden bg-[#EEF5FF] font-sans">
      <section className="relative min-h-[560px] overflow-hidden bg-[#003841] md:min-h-[366px]">
        <Image src="/contato/hero-bg.png" alt="Atendente da Instalsat" fill priority sizes="100vw" className="object-cover opacity-15" />
        <SiteHeader activePath="/contato" />
        <div className="relative z-10 flex flex-col gap-8 px-5 pb-16 pt-10 md:flex-row md:items-end md:justify-between md:px-20 md:pb-14 md:pt-7">
          <motion.div initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }} className="flex max-w-[655px] flex-col gap-6">
            <Eyebrow dark square>{conteudo.contato_hero_eyebrow}</Eyebrow>
            <h1 className="text-[32px] font-medium leading-[38px] text-[#DCE3EC] md:text-[40px] md:leading-[46px]">
              {conteudo.contato_hero_titulo}<span className="text-[#E05829]">.</span>
            </h1>
          </motion.div>
          <motion.p initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.12, ease: [0.4, 0, 0.2, 1] }} className="max-w-[493px] text-[16px] leading-6 text-[#DCE3EC]">
            {conteudo.contato_hero_paragrafo}
          </motion.p>
        </div>
      </section>

      <section className="px-5 py-16 md:px-20 md:py-[100px]">
        <FadeUp className="mx-auto flex max-w-[1280px] flex-col gap-8 md:gap-10">
          <div className="flex flex-col gap-3">
            <Eyebrow>Perguntas Frequentes</Eyebrow>
            <h2 className="text-[30px] font-medium leading-[36px] text-[#003841] md:text-[40px] md:leading-[46px]">Tire suas dúvidas</h2>
          </div>
          <div className="flex flex-col">
            {faqs.map((item, index) => (
              <FaqItem key={item.question} item={item} open={openFaq === index} onToggle={() => setOpenFaq(openFaq === index ? null : index)} />
            ))}
          </div>
        </FadeUp>
      </section>

      <section className="bg-[#DCE3EC] px-5 py-10 md:px-20">
        <div className="mx-auto grid max-w-[1280px] gap-3 md:grid-cols-3">
          {[
            { icon: "/contato/icon-whatsapp-lg.svg", label: "WhatsApp", value: conteudo.footer_whatsapp_numero, href: "https://wa.me/551145411316" },
            { icon: "/contato/icon-phone-lg.svg", label: "Telefone", value: conteudo.footer_telefone_numero, href: "tel:+5511439012345" },
            { icon: "/contato/icon-email-lg.svg", label: "E-mail", value: conteudo.footer_email, href: "mailto:contato@instalsat.com.br" },
          ].map((card) => (
            <a key={card.label} href={card.href} target={card.href.startsWith("http") ? "_blank" : undefined} rel={card.href.startsWith("http") ? "noopener noreferrer" : undefined} className="flex items-center gap-4 border border-[#969BA1] p-4 md:gap-6 md:p-6">
              <Image src={card.icon} alt="" width={44} height={44} className="size-10 shrink-0 md:size-11" />
              <div className="flex flex-col gap-1">
                <p className="text-[14px] leading-[19.6px] text-[#003841]">{card.label}</p>
                <p className="text-[17px] font-medium leading-[24px] text-[#E05829] md:text-[20px] md:leading-[28px]">{card.value}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="px-5 py-16 md:px-20 md:py-[100px]">
        <FadeUp className="mx-auto flex max-w-[1280px] flex-col gap-10">
          <div className="flex flex-col gap-3">
            <Eyebrow>Formulário</Eyebrow>
            <h2 className="text-[30px] font-medium leading-[36px] text-[#003841] md:text-[40px] md:leading-[46px]">Envie sua mensagem</h2>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <FieldShell icon="/contato/icon-user.svg">
              <input required type="text" placeholder="Nome Completo" value={form.nome} onChange={handleChange("nome")} className="w-full bg-transparent text-[16px] text-[#003841] placeholder:text-[#969BA1] focus:outline-none" />
            </FieldShell>

            <div className="flex flex-col gap-3 md:flex-row">
              <FieldShell icon="/contato/icon-whatsapp.svg">
                <input required type="tel" placeholder="Telefone/WhatsApp" value={form.telefone} onChange={handleChange("telefone")} className="w-full bg-transparent text-[16px] text-[#003841] placeholder:text-[#969BA1] focus:outline-none" />
              </FieldShell>
              <FieldShell icon="/contato/icon-email.svg">
                <input required type="email" placeholder="Email" value={form.email} onChange={handleChange("email")} className="w-full bg-transparent text-[16px] text-[#003841] placeholder:text-[#969BA1] focus:outline-none" />
              </FieldShell>
            </div>

            <div className="flex flex-col gap-3 md:flex-row">
              <FieldShell icon="/contato/icon-city.svg">
                <input type="text" placeholder="Cidade" value={form.cidade} onChange={handleChange("cidade")} className="w-full bg-transparent text-[16px] text-[#003841] placeholder:text-[#969BA1] focus:outline-none" />
              </FieldShell>
              <FieldShell icon="/contato/icon-city.svg">
                <input type="text" placeholder="Estado" value={form.estado} onChange={handleChange("estado")} className="w-full bg-transparent text-[16px] text-[#003841] placeholder:text-[#969BA1] focus:outline-none" />
              </FieldShell>
            </div>

            <Dropdown
              icon="/contato/icon-subject.svg"
              placeholder="Assunto"
              options={assuntos}
              value={form.assunto}
              onChange={(assunto) => setForm((prev) => ({ ...prev, assunto }))}
              name="assunto"
              required
            />

            <div className="flex items-start gap-2 border border-[#CFD5DE] p-4">
              <span className="flex size-5 shrink-0 items-center justify-center">
                <Image src="/contato/icon-message.svg" alt="" width={20} height={20} className="size-auto max-h-5 max-w-5 object-contain" />
              </span>
              <textarea required placeholder="Mensagem" rows={5} value={form.mensagem} onChange={handleChange("mensagem")} className="w-full resize-none bg-transparent text-[16px] text-[#003841] placeholder:text-[#969BA1] focus:outline-none" />
            </div>

            <motion.button type="submit" disabled={sending} initial="rest" whileHover="hover" variants={{ rest: { backgroundColor: "#E05829" }, hover: { backgroundColor: "#AD4420" } }} transition={ease} className="flex h-[52px] w-full items-center justify-between px-6 text-[15px] font-medium text-[#EEF5FF] disabled:opacity-70">
              {sending ? "Enviando..." : "Enviar"}
              <ArrowIcon />
            </motion.button>
            {sent && <p className="text-[14px] text-[#128C7E]">Mensagem enviada com sucesso. Em breve entraremos em contato.</p>}
            {error && <p className="text-[14px] text-red-700">{error}</p>}
          </form>
        </FadeUp>
      </section>

      <Footer conteudo={conteudo} />
    </main>
  );
}
