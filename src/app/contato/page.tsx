"use client";

import Image from "next/image";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { Dropdown } from "@/components/ui/dropdown";
import { SocialLinks } from "@/components/ui/social-icons";

const ease = { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const };

const faqs = [
  {
    question: "Qual é a área de atendimento da Instalsat?",
    answer: "Atendemos condomínios, administradoras e empresas em todo o Grande ABC e, para contratos de manutenção recorrente, em diversas regiões do estado de São Paulo.",
  },
  {
    question: "Como funciona o processo para contratar um serviço?",
    answer: "Começamos com uma visita técnica para diagnóstico real da estrutura. A partir disso, montamos uma proposta sob medida — nunca uma tabela genérica — e, após aprovação, seguimos com execução acompanhada e documentação técnica completa.",
  },
  {
    question: "A Instalsat atende chamados de emergência?",
    answer: "Sim. Clientes com contrato de manutenção recorrente têm atendimento prioritário, com prazo de resposta de até 24 horas para chamados urgentes.",
  },
  {
    question: "Vocês trabalham com contratos de manutenção recorrente?",
    answer: "Sim, é uma das nossas principais frentes. Trabalhamos com manutenção corretiva, preventiva e preditiva, com visitas programadas e relatórios de acompanhamento a cada ciclo.",
  },
  {
    question: "Qual o prazo médio de resposta após o contato?",
    answer: "Nosso time normalmente responde em até 1 dia útil para agendar a visita técnica de diagnóstico inicial.",
  },
  {
    question: "A Instalsat fornece laudo técnico e ART?",
    answer: "Sim. Todos os projetos de instalação elétrica são entregues com documentação técnica completa e emissão de ART, garantindo conformidade legal e segurança para o cliente.",
  },
];

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

function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className={className}>
      <path d="M2.5 7h9M8 3.5 11.5 7 8 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <motion.span animate={{ rotate: open ? -90 : 90 }} transition={ease} className="flex size-4 shrink-0 items-center justify-center">
      <Image src="/contato/icon-faq-arrow.svg" alt="" width={16} height={16} className="size-4" />
    </motion.span>
  );
}

function Footer() {
  const navigation = ["Início", "Sobre", "Soluções", "Projetos", "Contato", "Solicite uma análise"];
  const solutions = ["Segurança eletrônica", "Instalações elétricas", "Contratos de manutenção"];

  return (
    <footer className="border-t border-[#DCE3EC] bg-[#EEF5FF] px-5 pb-8 pt-12 md:px-20 md:pt-16">
      <div className="mb-12 flex flex-col md:mb-16 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col gap-4 border-b border-[#DCE3EC] pb-10 md:w-[230px] md:border-0 md:pb-0">
          <Image src="/LOGO.svg" alt="Instalsat" width={160} height={32} className="h-auto" />
          <p className="text-[16px] font-medium text-[#003841]">A empresa que fica<span className="text-[#E05829]">.</span></p>
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
          <div><p className="text-[14px] text-[#003841]">WhatsApp</p><a href="https://wa.me/551145411316" className="text-[14px] font-semibold text-[#E05829]">(11) 4541-1316</a></div>
          <div><p className="text-[14px] text-[#003841]">Telefone</p><a href="tel:+5511439012345" className="text-[14px] font-semibold text-[#E05829]">[11] 43901-2345</a></div>
          <div><p className="text-[14px] text-[#003841]">E-mail</p><a href="mailto:contato@instalsat.com.br" className="text-[14px] font-semibold text-[#E05829]">contato@instalsat.com.br</a></div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-1 border-t border-[#DCE3EC] pt-6 text-center text-[14px] leading-[22px] text-[#003841]">
        <p>© 2026 • Instalsat Eletrônica Ltda • 02.515.886/0001-31 • Todos os direitos reservados</p>
        <p>Termos de Uso • Desenvolvido por <a href="https://metacube.studio" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#E05829]">MetaCube Studio</a></p>
      </div>
    </footer>
  );
}

function FaqItem({ item, open, onToggle }: { item: (typeof faqs)[number]; open: boolean; onToggle: () => void }) {
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

  const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lines = [
      "Olá, gostaria de falar com a Instalsat.",
      form.nome && `Nome: ${form.nome}`,
      form.telefone && `Telefone: ${form.telefone}`,
      form.email && `E-mail: ${form.email}`,
      (form.cidade || form.estado) && `Local: ${[form.cidade, form.estado].filter(Boolean).join(" - ")}`,
      form.assunto && `Assunto: ${form.assunto}`,
      form.mensagem && `Mensagem: ${form.mensagem}`,
    ].filter(Boolean);

    window.open(`https://wa.me/551145411316?text=${encodeURIComponent(lines.join("\n"))}`, "_blank", "noopener,noreferrer");
    setSent(true);
  };

  return (
    <main className="w-full overflow-x-hidden bg-[#EEF5FF] font-sans">
      <section className="relative min-h-[560px] overflow-hidden bg-[#003841] md:min-h-[366px]">
        <Image src="/contato/hero-bg.png" alt="Atendente da Instalsat" fill priority sizes="100vw" className="object-cover opacity-15" />
        <SiteHeader activePath="/contato" />
        <div className="relative z-10 flex flex-col gap-8 px-5 pb-16 pt-10 md:flex-row md:items-end md:justify-between md:px-20 md:pb-14 md:pt-7">
          <motion.div initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }} className="flex max-w-[655px] flex-col gap-6">
            <Eyebrow dark square>Entre em contato</Eyebrow>
            <h1 className="text-[32px] font-medium leading-[38px] text-[#DCE3EC] md:text-[40px] md:leading-[46px]">
              Antes de falar com a gente, talvez a resposta já esteja aqui<span className="text-[#E05829]">.</span>
            </h1>
          </motion.div>
          <motion.p initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.12, ease: [0.4, 0, 0.2, 1] }} className="max-w-[493px] text-[16px] leading-6 text-[#DCE3EC]">
            Reunimos as dúvidas mais comuns de quem está conhecendo a Instalsat. Se não encontrar o que precisa, use o formulário ou fale direto pelo WhatsApp.
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
            { icon: "/contato/icon-whatsapp-lg.svg", label: "WhatsApp", value: "(11) 4541-1316", href: "https://wa.me/551145411316" },
            { icon: "/contato/icon-phone-lg.svg", label: "Telefone", value: "[11] 43901-2345", href: "tel:+5511439012345" },
            { icon: "/contato/icon-email-lg.svg", label: "E-mail", value: "contato@instalsat.com.br", href: "mailto:contato@instalsat.com.br" },
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

            <motion.button type="submit" whileHover={{ backgroundColor: "#AD4420" }} transition={ease} className="flex h-[52px] w-full items-center justify-between bg-[#E05829] px-6 text-[15px] font-medium text-[#EEF5FF]">
              Enviar
              <ArrowIcon />
            </motion.button>
            {sent && <p className="text-[14px] text-[#128C7E]">Abrimos o WhatsApp com sua mensagem pronta para envio.</p>}
          </form>
        </FadeUp>
      </section>

      <Footer />
    </main>
  );
}
