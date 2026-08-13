"use client";

import Image from "next/image";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { useSiteStats } from "@/lib/use-site-stats";

const ease = { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const };

const logos = [
  "/logos/Company logo.svg",
  "/logos/Company logo-1.svg",
  "/logos/Company logo-2.svg",
  "/logos/Company logo-3.svg",
  "/logos/Company logo-4.svg",
  "/logos/Company logo-5.svg",
];

const pillars = [
  {
    title: "Missão",
    icon: "/institucional/icon-missao.svg",
    text: "Entregar soluções técnicas seguras e duradouras, com diagnóstico real, execução responsável e presença contínua ao lado de cada cliente.",
  },
  {
    title: "Visão",
    icon: "/institucional/icon-visao.svg",
    text: "Ser reconhecida como a empresa de infraestrutura que permanece, referência em confiança, método e relacionamento no estado de São Paulo.",
  },
  {
    title: "Valores",
    icon: "/institucional/icon-valores.svg",
    text: "Responsabilidade técnica, transparência, compromisso com o cliente, qualidade sem atalhos e relações construídas para durar.",
  },
];

function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-70px" });

  return (
    <motion.div
      ref={ref}
      initial={false}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.4, 0, 0.2, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function AnimatedStat({ target, prefix, suffix, delay }: { target: number; prefix: string; suffix: string; delay: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.75 });
  const reduceMotion = useReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduceMotion) return;

    let frame = 0;
    let startTime = 0;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / 2600, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const nextCount = target <= 3
        ? Number((eased * target).toFixed(1))
        : Math.floor(eased * target);
      setCount(nextCount);

      if (progress < 1) frame = requestAnimationFrame(step);
      else setCount(target);
    };

    const timeout = window.setTimeout(() => {
      frame = requestAnimationFrame(step);
    }, delay);

    return () => {
      window.clearTimeout(timeout);
      cancelAnimationFrame(frame);
    };
  }, [delay, inView, reduceMotion, target]);

  const displayedCount = reduceMotion && inView ? target : count;
  const formattedCount = Number.isInteger(displayedCount)
    ? displayedCount.toString()
    : displayedCount.toFixed(1).replace(".", ",");

  return <span ref={ref}>{prefix}{formattedCount}{suffix}</span>;
}

function Eyebrow({ children, dark = false, square = false }: { children: React.ReactNode; dark?: boolean; square?: boolean }) {
  return (
    <div className={`flex h-7 w-fit items-center gap-2 rounded-full border px-[10px] text-[13px] leading-none ${dark ? "border-[#3A99A8] text-[#DCE3EC]" : "border-[#E05829] text-[#003841]"}`}>
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

export default function InstitucionalPage() {
  const siteStats = useSiteStats();
  const stats = [
    { target: siteStats.anos, prefix: "", suffix: "", label: "anos de mercado" },
    { target: siteStats.clientes, prefix: "+", suffix: " mil", label: "clientes" },
    { target: siteStats.atendimentos, prefix: "+", suffix: " mil", label: "atendimentos/ano" },
    { target: siteStats.contratos, prefix: "+", suffix: "", label: "clientes ativos com contrato recorrente" },
  ];
  const [activePillar, setActivePillar] = useState<number | null>(null);
  const logoLoop = [...logos, ...logos, ...logos];

  return (
    <main className="w-full overflow-x-hidden bg-[#EEF5FF] font-sans">
      <section className="relative min-h-[520px] overflow-hidden bg-[#003841] md:min-h-[366px]">
        <Image src="/institucional/asset-01.png" alt="Edifício corporativo no Grande ABC" fill priority sizes="100vw" className="object-cover opacity-15" />
        <SiteHeader activePath="/institucional" />
        <div className="relative z-10 flex flex-col gap-8 px-5 pb-16 pt-10 md:flex-row md:items-end md:justify-between md:px-20 md:pb-14 md:pt-7">
          <motion.div initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }} className="flex max-w-[655px] flex-col gap-6">
            <Eyebrow dark square>Sobre a Instalsat</Eyebrow>
            <h1 className="text-[36px] font-medium leading-[42px] text-[#DCE3EC] md:text-[40px] md:leading-[46px]">
              Quase três décadas construindo infraestrutura que funciona<span className="text-[#E05829]">.</span>
            </h1>
          </motion.div>
          <motion.p initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.12, ease: [0.4, 0, 0.2, 1] }} className="max-w-[493px] text-[16px] leading-6 text-[#DCE3EC]">
            Do Grande ABC para todo o estado. Da instalação à manutenção contínua. Da figura do fundador para uma empresa que opera com método, estrutura e presença.
          </motion.p>
        </div>
      </section>

      <section className="px-5 py-16 md:px-20 md:py-[100px]">
        <div className="mx-auto grid max-w-[1280px] gap-10 md:grid-cols-[525px_1fr] md:gap-[120px]">
          <FadeUp className="relative min-h-[360px] overflow-hidden bg-[#003841] md:min-h-[547px]">
            <Image src="/institucional/asset-05.jpg" alt="Condomínio atendido pela Instalsat" fill sizes="(max-width: 768px) 100vw, 525px" className="object-cover" />
          </FadeUp>
          <FadeUp delay={0.1} className="flex flex-col gap-3">
            <Eyebrow>Nossa história</Eyebrow>
            <div className="flex flex-col gap-6 text-[#003841]">
              <h2 className="text-[30px] font-medium leading-[36px] md:text-[40px] md:leading-[46px]">1998. Uma empresa que nasceu resolvendo o que outros não conseguiam<span className="text-[#E05829]">.</span></h2>
              <div className="flex flex-col gap-5 text-[15px] leading-[23px]">
                <p>A Instalsat foi fundada em Mauá, no Grande ABC paulista, num momento em que segurança eletrônica e infraestrutura elétrica eram territórios separados e mal atendidos. Desde o início, a empresa se recusou a operar com soluções de prateleira. Cada projeto exigia diagnóstico real, proposta construída sob medida e execução técnica sem atalhos.</p>
                <p>Esse modelo gerou algo raro no setor: clientes que ficaram. Condomínios que renovam contratos há mais de uma década. Administradoras que indicam sem hesitar. Uma reputação construída projeto a projeto, sem marketing, sem site, sem Instagram. Só entrega.</p>
                <p>Hoje, com mais de 28 anos de operação, a Instalsat passa por um movimento deliberado: transformar a solidez que sempre existiu em algo visível. Estruturar o que já funcionava. Comunicar o que sempre foi verdade.</p>
                <p>O nome continua. O resto é novo.</p>
              </div>
            </div>
          </FadeUp>
        </div>

        <div className="relative -mx-5 mt-20 overflow-hidden md:-mx-20 md:mt-[100px]">
          <motion.div className="flex w-max items-center gap-16 opacity-50" animate={{ x: [0, -720] }} transition={{ duration: 22, repeat: Infinity, ease: "linear" }}>
            {logoLoop.map((src, index) => (
              <div key={`${src}-${index}`} className="relative h-10 w-[150px] shrink-0"><Image src={src} alt="Cliente Instalsat" fill sizes="150px" className="object-contain" /></div>
            ))}
          </motion.div>
        </div>

        <FadeUp className="mx-auto mt-20 flex max-w-[1280px] flex-col items-center gap-10 md:mt-[100px]">
          <Eyebrow>Instalsat em números</Eyebrow>
          <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={stat.label} className="flex min-h-[110px] flex-col justify-between border border-[#DCE3EC] p-4">
                <p className="text-[42px] font-medium leading-[48px] text-[#E05829] md:text-[48px]"><AnimatedStat target={stat.target} prefix={stat.prefix} suffix={stat.suffix} delay={index * 140} /></p>
                <p className="text-[14px] leading-5 text-[#003841]">{stat.label}</p>
              </div>
            ))}
          </div>
        </FadeUp>
      </section>

      <section className="bg-[#003841] px-5 py-16 md:px-20 md:py-[100px]">
        <div className="mx-auto max-w-[1280px]">
          <FadeUp className="mb-12 flex flex-col items-center gap-3 text-center">
            <Eyebrow dark>Quem está por trás</Eyebrow>
            <h2 className="text-[30px] font-medium leading-[36px] text-[#DCE3EC] md:text-[40px] md:leading-[46px]">Pessoas reais<span className="text-[#E05829]">.</span><br />Responsabilidade técnica de verdade<span className="text-[#E05829]">.</span></h2>
          </FadeUp>

          <div className="grid gap-12 md:grid-cols-2 md:gap-6">
            {[
              { name: "Fernando Nunes", role: "Fundador e Consultor Técnico", image: "/institucional/asset-04.jpg", description: "Fundador da Instalsat em 1998, Fernando construiu a reputação da empresa projeto a projeto durante mais de duas décadas. Responsável pelo desenvolvimento técnico e pela expertise que define os padrões de execução da Instalsat até hoje." },
              { name: "Thiago Nunes", role: "Diretor de Operações", image: "/institucional/asset-06.jpg", description: "Engenheiro elétrico em formação, Thiago lidera a operação comercial e a gestão da Instalsat. Responsável pela estruturação dos processos, expansão do portfólio e pelo relacionamento com administradoras e clientes corporativos." },
            ].map((person, index) => (
              <FadeUp key={person.name} delay={index * 0.1} className="flex flex-col gap-6">
                <div className="relative flex min-h-[390px] flex-col justify-between overflow-hidden p-4 md:min-h-[439px]">
                  <Image src={person.image} alt={person.name} fill sizes="(max-width: 768px) 100vw, 628px" className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent from-50% to-[rgba(0,56,65,0.78)]" />
                  <span className="relative w-fit rounded-full bg-[#E05829] px-4 py-2 text-[14px] text-[#DCE3EC] md:text-[16px]">{person.role}</span>
                  <h3 className="relative p-3 text-[28px] font-medium leading-[34px] text-[#DCE3EC] md:text-[32px] md:leading-[38px]">{person.name}</h3>
                </div>
                <p className="text-[15px] leading-[23px] text-[#DCE3EC]">{person.description}</p>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#DCE3EC] px-5 py-16 md:px-20 md:py-[100px]">
        <FadeUp className="mx-auto flex max-w-[850px] flex-col items-center gap-10">
          <Eyebrow>O que nos move</Eyebrow>
          <div className="w-full">
            {pillars.map((pillar, index) => {
              const active = activePillar === index;
              return (
                <motion.div key={pillar.title} animate={{ backgroundColor: active ? "#003841" : "#CFD5DE" }} transition={ease} className="border-b border-[#DCE3EC]">
                  <button type="button" onClick={() => setActivePillar(active ? null : index)} className="flex min-h-[81px] w-full items-center justify-between gap-4 p-4 text-left" aria-expanded={active}>
                    <span className="flex items-center gap-3">
                      <Image src={pillar.icon} alt="" width={48} height={48} className="size-10 md:size-12" />
                      <motion.span animate={{ color: active ? "#DCE3EC" : "#003841" }} transition={ease} className="text-[22px] font-medium md:text-[24px]">{pillar.title}{active ? ":" : ""}</motion.span>
                    </span>
                    <motion.span animate={{ rotate: active ? 90 : -90 }} transition={ease} className="flex size-8 items-center justify-center">
                      <Image src="/institucional/accordion-arrow.svg" alt="" width={16} height={16} className="size-4 rotate-180" />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {active && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }} className="overflow-hidden">
                        <p className="px-6 pb-4 text-[14px] leading-[19.6px] text-[#DCE3EC]">{pillar.text}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </FadeUp>
      </section>

      <section className="bg-[#EEF5FF] px-5 py-16 md:px-20 md:py-[100px]">
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
    </main>
  );
}
