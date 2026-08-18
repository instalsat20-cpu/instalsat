"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { ArrowLink } from "@/components/ui/arrow-link";
import { TestimonialModal, type Testimonial } from "@/components/ui/testimonial-modal";
import { SocialLinks } from "@/components/ui/social-icons";

const ease = { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const };

const testimonialMauaSP: Testimonial = {
  photo: "/projetos/testimonial-patricia.jpg",
  name: "Patricia Lima",
  role: "Síndica, Condomínio Residencial",
  project: "Condomínio Residencial, Mauá SP",
  quote: "\"Antes da Instalsat, cada problema virava uma dor de cabeça diferente. Hoje eu sei que tem alguém responsável por tudo isso. A tranquilidade que isso traz para a gestão do condomínio não tem preço.\"",
};

const cases: { tag: string; title: string; img: string; paragraphs: string[]; testimonial?: Testimonial }[] = [
  {
    tag: "Segurança Eletrônica",
    title: "Condomínio Residencial, Mauá SP",
    img: "/projetos/case-01.png",
    paragraphs: [
      "O condomínio enfrentava problemas recorrentes de segurança perimetral e não tinha visibilidade sobre o fluxo de entrada e saída de veículos e visitantes. A administradora buscava uma solução integrada que eliminasse pontos cegos e reduzisse a dependência de porteiros para o controle de acesso.",
      "A Instalsat realizou o diagnóstico completo da infraestrutura existente e propôs a implantação de um sistema de CFTV com inteligência artificial, capaz de identificar rostos e placas em tempo real. O projeto incluiu ainda controle de acesso facial nas entradas sociais e automação completa do portão de veículos. Desde a entrega, a Instalsat mantém contrato de manutenção recorrente, com visitas programadas e atendimento prioritário para chamados.",
    ],
    testimonial: testimonialMauaSP,
  },
  {
    tag: "Instalações Elétricas",
    title: "Condomínio Comercial, Santo André SP",
    img: "/projetos/case-04.png",
    paragraphs: [
      "Com uma infraestrutura elétrica antiga e fora das normas vigentes, o condomínio corria riscos técnicos e legais que comprometiam a operação dos lojistas e a segurança do edifício. A administradora precisava de uma empresa que assumisse o projeto com responsabilidade técnica total, da documentação à execução. A Instalsat desenvolveu o projeto elétrico completo, substituiu o painel de distribuição principal e executou a infraestrutura de baixa tensão em todas as áreas comuns. Todo o trabalho foi entregue dentro do prazo acordado, acompanhado de documentação técnica completa e emissão de ART. O condomínio opera hoje dentro das normas e com um sistema elétrico dimensionado para os próximos anos.",
    ],
  },
  {
    tag: "Manutenção Predial",
    title: "Condomínio Residencial, São Bernardo do Campo SP",
    img: "/projetos/case-02.png",
    paragraphs: [
      "A síndica profissional responsável pelo condomínio tinha um histórico frustrante com prestadores que atendiam bem no início e sumiam após os primeiros meses. Ela buscava um parceiro que assumisse a manutenção com método e previsibilidade, sem surpresas no orçamento nem espera longa para atendimento. A Instalsat assumiu o contrato de manutenção nas modalidades corretiva, preventiva e preditiva, cobrindo todos os sistemas elétricos e eletrônicos do condomínio. Com visitas programadas mensalmente e relatórios de acompanhamento a cada ciclo, a gestão da síndica passou a ter visibilidade total sobre o estado da infraestrutura. A parceria está ativa há mais de três anos, com renovação contratual consecutiva.",
    ],
  },
  {
    tag: "Segurança Eletrônica",
    title: "Empresa de Reciclagem, Grande ABC",
    img: "/projetos/case-05.png",
    paragraphs: [
      "A empresa operava em uma área industrial com alto fluxo de veículos pesados e colaboradores em turnos alternados, sem nenhum sistema estruturado de monitoramento ou controle de acesso. A ausência de registro de entrada e saída gerava problemas operacionais e riscos de segurança que impactavam diretamente a operação. A Instalsat projetou e implantou um sistema de alarme perimetral com barreiras de infravermelho e cercas elétricas de alta confiabilidade, cobrindo todo o perímetro da área industrial. O controle de acesso foi implementado com tecnologia RFID para leitura automática de tags de frotas e crachás de colaboradores. O sistema de CFTV instalado permite monitoramento remoto em tempo real de qualquer dispositivo conectado à internet.",
    ],
  },
  {
    tag: "Manutenção Predial",
    title: "Condomínio Residencial, Mauá SP",
    img: "/projetos/case-03.png",
    paragraphs: [
      "O condomínio apresentava falhas recorrentes no sistema de iluminação de emergência e portões com manutenção irregular, problemas que geravam reclamações constantes dos moradores e preocupação da administração com conformidade legal. A cada falha, o processo de contratação de um prestador avulso consumia tempo e gerava custos imprevisíveis.",
      "A Instalsat realizou a modernização completa do sistema de iluminação de emergência, substituindo equipamentos obsoletos e adequando as instalações às normas técnicas vigentes. Os portões de veículos passaram por revisão geral com troca de componentes desgastados e ajuste de automação. Com o contrato de manutenção preventiva em vigor, as visitas são programadas e o atendimento de chamados ocorre em até 24 horas, eliminando as surpresas que comprometiam o orçamento do condomínio.",
    ],
    testimonial: testimonialMauaSP,
  },
];

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
    <div className={`flex h-7 w-fit items-center gap-2 rounded-full border px-[10px] text-[13px] leading-none ${dark ? "border-[#3A99A8] text-[#DCE3EC]" : "border-[#969BA1] text-[#003841]"}`}>
      {square && <span className="size-2 shrink-0 bg-[#E05829]" />}
      <span className="whitespace-nowrap">{children}</span>
    </div>
  );
}

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2.5 7h9M8 3.5 11.5 7 8 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WhatsAppButton({ children }: { children: React.ReactNode }) {
  return (
    <motion.a
      href="https://wa.me/551145411316"
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ backgroundColor: "#0E6B5E" }}
      transition={ease}
      className="flex h-[52px] items-center justify-center gap-3 bg-[#128C7E] px-6 text-[15px] font-medium text-[#EEF5FF]"
    >
      {children}
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.555 4.122 1.528 5.855L.057 23.886a.5.5 0 0 0 .612.612l6.031-1.471A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.686-.522-5.204-1.428l-.374-.222-3.878.945.964-3.878-.244-.386A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
      </svg>
    </motion.a>
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

function CaseArrowButton({ direction }: { direction: "left" | "right" }) {
  return (
    <div className="flex size-[45px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#E05829]">
      <Image src="/projetos/carousel-arrow.svg" alt="" width={11} height={12} className={direction === "right" ? "rotate-180" : ""} />
    </div>
  );
}

function CaseCard({ item, imageLeft, onShowTestimonial }: { item: (typeof cases)[number]; imageLeft: boolean; onShowTestimonial: (testimonial: Testimonial) => void }) {
  return (
    <FadeUp className={`flex flex-col gap-8 md:flex-row md:items-center md:gap-[80px] lg:gap-[120px] ${imageLeft ? "" : "md:flex-row-reverse"}`}>
      <div className="relative h-[280px] w-full shrink-0 overflow-hidden bg-[#003841] md:h-[420px] md:w-[45%] lg:h-[547px] lg:w-[634px]">
        <Image src={item.img} alt={item.title} fill sizes="(max-width: 768px) 100vw, 634px" className="object-cover" />
        <div className="absolute right-4 top-4 flex items-center gap-3">
          <CaseArrowButton direction="left" />
          <CaseArrowButton direction="right" />
        </div>
      </div>
      <div className="flex flex-col gap-6 md:gap-9">
        <div className="flex flex-col gap-3">
          <Eyebrow>{item.tag}</Eyebrow>
          <h3 className="text-[26px] font-medium leading-[32px] text-[#003841] md:text-[32px] md:leading-[38.4px]">{item.title}</h3>
        </div>
        <div className="flex flex-col gap-4 text-[15px] leading-[23px] text-[#003841]">
          {item.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        {item.testimonial && (
          <ArrowLink text="Veja o depoimento" onClick={() => onShowTestimonial(item.testimonial!)} />
        )}
      </div>
    </FadeUp>
  );
}

export default function ProjetosPage() {
  const [activeTestimonial, setActiveTestimonial] = useState<Testimonial | null>(null);

  return (
    <main className="w-full overflow-x-hidden bg-[#EEF5FF] font-sans">
      <section className="relative min-h-[520px] overflow-hidden bg-[#003841] md:min-h-[366px]">
        <Image src="/projetos/hero-bg.png" alt="Câmera de segurança monitorando um condomínio" fill priority sizes="100vw" className="object-cover opacity-15" />
        <SiteHeader activePath="/projetos" />
        <div className="relative z-10 flex flex-col gap-8 px-5 pb-16 pt-10 md:flex-row md:items-end md:justify-between md:px-20 md:pb-14 md:pt-7">
          <motion.div initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }} className="flex max-w-[655px] flex-col gap-6">
            <Eyebrow dark square>Projetos realizados</Eyebrow>
            <h1 className="text-[36px] font-medium leading-[42px] text-[#DCE3EC] md:text-[40px] md:leading-[46px]">
              Infraestrutura que funciona<span className="text-[#E05829]">.</span> Projetos que ficam<span className="text-[#E05829]">.</span>
            </h1>
          </motion.div>
          <motion.p initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.12, ease: [0.4, 0, 0.2, 1] }} className="max-w-[493px] text-[16px] leading-6 text-[#DCE3EC]">
            Cada projeto começa por um diagnóstico real e termina com uma estrutura que a Instalsat continua acompanhando. Aqui estão alguns dos trabalhos que executamos para condomínios, administradoras e empresas da região.
          </motion.p>
        </div>
      </section>

      <section className="flex flex-col gap-16 px-5 py-16 md:gap-24 md:px-20 md:py-[100px]">
        {cases.map((item, index) => (
          <CaseCard key={item.title} item={item} imageLeft={index % 2 === 0} onShowTestimonial={setActiveTestimonial} />
        ))}
      </section>

      <section className="bg-[#EEF5FF] px-5 pb-16 md:px-20 md:pb-[100px]">
        <FadeUp className="mx-auto flex max-w-[1280px] flex-col items-center gap-10 bg-[#003841] px-5 py-14 text-center md:min-h-[344px] md:justify-center md:px-20">
          <div className="flex max-w-[629px] flex-col items-center gap-4">
            <h2 className="text-[30px] font-medium leading-[36px] text-[#DCE3EC] md:text-[48px] md:leading-[48px]">Pronto para ter uma empresa que fica<span className="text-[#E05829]">?</span></h2>
            <p className="text-[15px] leading-[23px] text-[#DCE3EC]">Fale com a Instalsat e entenda como podemos estruturar a segurança e a infraestrutura do seu condomínio ou empresa.</p>
          </div>
          <div className="flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
            <WhatsAppButton>Falar pelo WhatsApp</WhatsAppButton>
            <motion.a href="/contato" whileHover={{ backgroundColor: "#E05829", color: "#EEF5FF" }} transition={ease} className="flex h-[52px] items-center justify-center gap-3 border border-[#E05829] px-6 text-[15px] font-medium text-[#EEF5FF]">Solicite uma análise<ArrowIcon /></motion.a>
          </div>
        </FadeUp>
      </section>

      <Footer />
      <TestimonialModal testimonial={activeTestimonial} onClose={() => setActiveTestimonial(null)} />
    </main>
  );
}
