"use client";

import Image from "next/image";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { useSiteStats } from "@/lib/use-site-stats";
import { useSolucoesDestaque, useProjetosDestaque, useClientes, useDepoimentos, useProcessos, useConteudoInstitucional } from "@/lib/use-site-content";

const imgArrow = "https://www.figma.com/api/mcp/asset/f7f40b33-c5c4-4e53-bc0f-494309f024ef.svg";
const imgArrow2 = "https://www.figma.com/api/mcp/asset/310a0780-cc17-4db0-97c4-44b6bce277e0.svg";

const ease = { duration: 0.3, ease: [0.4, 0, 0.2, 1] };
const CARD_WIDTH = 302;
const PHOTO_WIDTH = 302;
const GAP = 12;
const ITEM_WIDTH = CARD_WIDTH + PHOTO_WIDTH + GAP;
const DEP_WIDTH = 424;

function FadeUp({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} initial={false} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay, ease: [0.4, 0, 0.2, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

function AnimatedNumber({ target, prefix = "", suffix = "" }: { target: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / 1800, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
      else setCount(target);
    };
    requestAnimationFrame(step);
  }, [inView, target]);
  return <span ref={ref}>{prefix}{count}{suffix}</span>;
}

function Eyebrow01({ text, variant = "light-bg" }: { text: string; variant?: "light-bg" | "dark-bg" }) {
  return (
    <div className={`border rounded-full flex items-center justify-center px-[10px] h-[28px] w-fit ${variant === "dark-bg" ? "border-[#3A99A8] text-[#DCE3EC]" : "border-[#E05829] text-[#003841]"}`}>
      <span className="text-[13px] font-['Rubik'] leading-none whitespace-nowrap">{text}</span>
    </div>
  );
}

function Eyebrow02({ text, variant = "light-bg" }: { text: string; variant?: "light-bg" | "dark-bg" }) {
  return (
    <div className={`border rounded-full flex items-center gap-2 px-[10px] h-[28px] w-fit ${variant === "dark-bg" ? "border-[#3A99A8] text-[#DCE3EC]" : "border-[#969BA1] text-[#003841]"}`}>
      <div className="bg-[#E05829] w-[8px] h-[8px] shrink-0" />
      <span className="text-[13px] font-['Rubik'] leading-none whitespace-nowrap">{text}</span>
    </div>
  );
}

function BtPrimary({ text, className = "" }: { text: string; className?: string }) {
  return (
    <motion.button whileHover={{ backgroundColor: "#AD4420" }} transition={ease}
      className={`bg-[#E05829] h-[52px] px-6 text-[#EEF5FF] text-[15px] font-medium font-['Rubik'] whitespace-nowrap cursor-pointer ${className}`}>
      {text}
    </motion.button>
  );
}

function BtPrimaryArrow({ text, className = "" }: { text: string; className?: string }) {
  return (
    <motion.button whileHover={{ backgroundColor: "#AD4420" }} transition={ease}
      className={`bg-[#E05829] h-[52px] px-6 flex items-center gap-3 text-[#EEF5FF] text-[15px] font-medium font-['Rubik'] whitespace-nowrap cursor-pointer ${className}`}>
      {text}
      <Image src={imgArrow} alt="" width={14} height={14} className="rotate-180" />
    </motion.button>
  );
}

function BtOutlineArrow({ text, dark = true }: { text: string; dark?: boolean }) {
  return (
    <motion.button whileHover={{ backgroundColor: "#E05829", color: "#EEF5FF" }} transition={ease}
      className={`border border-[#E05829] h-[52px] px-6 flex items-center gap-3 text-[15px] font-medium font-['Rubik'] whitespace-nowrap cursor-pointer ${dark ? "text-[#EEF5FF]" : "text-[#003841]"}`}>
      {text}
      <Image src={imgArrow} alt="" width={14} height={14} className="rotate-180" />
    </motion.button>
  );
}

function BtWhatsApp({ text }: { text: string }) {
  return (
    <motion.button whileHover={{ backgroundColor: "#0e6b5e" }} transition={ease}
      className="bg-[#128C7E] flex items-center justify-between gap-3 h-[52px] px-6 text-[#EEF5FF] text-[15px] font-medium font-['Rubik'] whitespace-nowrap cursor-pointer leading-none">
      <span>{text}</span>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.555 4.122 1.528 5.855L.057 23.886a.5.5 0 0 0 .612.612l6.031-1.471A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.686-.522-5.204-1.428l-.374-.222-3.878.945.964-3.878-.244-.386A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
      </svg>
    </motion.button>
  );
}

function BtText({ text }: { text: string }) {
  return (
    <motion.div className="flex flex-col gap-2 w-fit cursor-pointer" whileHover="hover" initial="rest">
      <motion.div variants={{ rest: { color: "#003841" }, hover: { color: "#E05829" } }} transition={ease}
        className="flex items-center gap-3 text-[15px] font-medium font-['Rubik']">
        <span>{text}</span>
        <Image src={imgArrow2} alt="" width={14} height={14} className="rotate-180" />
      </motion.div>
      <motion.div variants={{ rest: { backgroundColor: "#003841" }, hover: { backgroundColor: "#E05829" } }} transition={ease} className="h-px w-full" />
    </motion.div>
  );
}

function ArrowBtn({ direction, onClick }: { direction: "left" | "right"; onClick?: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        width: 45, height: 45, borderRadius: "50%",
        border: `1.5px solid ${hovered ? "#E05829" : "#DCE3EC"}`,
        backgroundColor: hovered ? "#E05829" : "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)", flexShrink: 0,
      }}>
      {direction === "left" ? (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M7.5 1.5L3 6L7.5 10.5" stroke={hovered ? "#EEF5FF" : "#E05829"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M4.5 1.5L9 6L4.5 10.5" stroke={hovered ? "#EEF5FF" : "#E05829"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}

function ProjetoItem({ proj, delay, isFirst }: {
  proj: { tag: string; title: string; desc: string; img: string };
  delay: number;
  isFirst: boolean;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} initial={false} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.4, 0, 0.2, 1] }}>
      {/* DESKTOP */}
      <div className="hidden md:flex h-[526px] relative">
        <div className="w-[526px] shrink-0 overflow-hidden relative bg-[#003841]">
          <Image src={proj.img} alt={proj.title} fill className="object-cover" />
        </div>
        <div className="relative shrink-0" style={{ width: 114 }}>
          <div className="absolute bg-[#DCDCDC]" style={{ right: 0, width: 1, top: isFirst ? -44 : -32, bottom: -32 }} />
        </div>
        <div className="flex-1 flex items-center" style={{ paddingLeft: 117 }}>
          <div className="flex flex-col gap-4">
            <Eyebrow02 text={proj.tag} />
            <h3 className="text-[#003841] text-[32px] font-medium font-['Rubik'] leading-[38px] w-[440px]">
              {proj.title}<span className="text-[#E05829]">.</span>
            </h3>
            <p className="text-[#003841] text-[14px] font-['Rubik'] leading-5 w-[440px]">{proj.desc}</p>
          </div>
        </div>
      </div>

      {/* MOBILE */}
      <div className="flex md:hidden flex-col border-b border-[#DCDCDC] pb-10">
        <div className="w-full h-[240px] relative bg-[#003841] overflow-hidden mb-6">
          <Image src={proj.img} alt={proj.title} fill className="object-cover" />
        </div>
        <div className="flex flex-col gap-3">
          <Eyebrow02 text={proj.tag} />
          <h3 className="text-[#003841] text-[24px] font-medium font-['Rubik'] leading-[30px]">
            {proj.title}<span className="text-[#E05829]">.</span>
          </h3>
          <p className="text-[#003841] text-[14px] font-['Rubik'] leading-5">{proj.desc}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const siteStats = useSiteStats();
  const conteudo = useConteudoInstitucional();
  const solucoes = useSolucoesDestaque();
  const projetos = useProjetosDestaque();
  const logos = useClientes();
  const depoimentos = useDepoimentos();
  const processos = useProcessos();
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [depIndex, setDepIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 767px)");
    const updateMobile = () => setIsMobile(mobileQuery.matches);

    updateMobile();
    mobileQuery.addEventListener("change", updateMobile);

    return () => mobileQuery.removeEventListener("change", updateMobile);
  }, []);

  useEffect(() => {
    if (!isMobile || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timeout = window.setTimeout(() => {
      setDepIndex((i) => (i === depoimentos.length - 1 ? 0 : i + 1));
    }, 5500);

    return () => window.clearTimeout(timeout);
  }, [depIndex, isMobile]);

  const prev = () => setCarouselIndex((i) => (i === 0 ? processos.length - 1 : i - 1));
  const next = () => setCarouselIndex((i) => (i === processos.length - 1 ? 0 : i + 1));
  const depPrev = () => setDepIndex((i) => (i === 0 ? depoimentos.length - 1 : i - 1));
  const depNext = () => setDepIndex((i) => (i === depoimentos.length - 1 ? 0 : i + 1));

  const row1 = [...logos, ...logos, ...logos, ...logos];
  const row2 = [...logos.slice().reverse(), ...logos.slice().reverse(), ...logos.slice().reverse(), ...logos.slice().reverse()];
  const homeStats = [
    { label: "Anos de experiência", value: siteStats.anos, prefix: "", suffix: "", sub: "anos de mercado" },
    { label: "Clientes", value: siteStats.clientes, prefix: "+", suffix: " mil", sub: "clientes" },
    { label: "Atendimentos", value: siteStats.atendimentos, prefix: "+", suffix: " mil", sub: "atendimentos/ano" },
  ];

  return (
    <main className="bg-[#EEF5FF] w-full overflow-x-hidden">

      {/* WHATSAPP FLUTUANTE */}
      <a href="https://wa.me/551145411316" target="_blank" rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#128C7E] w-[56px] h-[56px] rounded-full flex items-center justify-center shadow-lg md:hidden"
        style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.2)" }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.555 4.122 1.528 5.855L.057 23.886a.5.5 0 0 0 .612.612l6.031-1.471A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.686-.522-5.204-1.428l-.374-.222-3.878.945.964-3.878-.244-.386A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
        </svg>
      </a>

      {/* HERO */}
      <section className="relative bg-[#003841] w-full h-[630px] md:h-[630px]">
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover opacity-30">
          <source src="/hero.mp4" type="video/mp4" />
        </video>

        <SiteHeader activePath="/" />

        {/* HERO CONTENT — DESKTOP */}
        <div className="hidden md:flex relative z-10 px-20 items-end justify-between mt-14">
          <motion.div initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }} className="flex flex-col gap-6 w-[600px]">
            <Eyebrow02 text={conteudo.home_hero_eyebrow} variant="dark-bg" />
            <h1 className="text-[#DCE3EC] text-[56px] font-medium font-['Rubik'] leading-[60px]">
              {conteudo.home_hero_titulo}<span className="text-[#E05829]">.</span>
            </h1>
          </motion.div>
          <motion.div initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15, ease: [0.4, 0, 0.2, 1] }} className="flex flex-col gap-7 w-[480px]">
            <p className="text-[#DCE3EC] text-[20px] font-['Rubik'] leading-7">
              {conteudo.home_hero_paragrafo}
            </p>
            <div className="flex gap-3 items-center">
              <BtPrimary text="Solicite uma análise" />
              <BtOutlineArrow text="Conheça as soluções" dark />
            </div>
          </motion.div>
        </div>

        {/* HERO CONTENT — MOBILE */}
        <div className="flex md:hidden relative z-10 px-5 flex-col gap-6 mt-8">
          <motion.div initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }} className="flex flex-col gap-4">
            <Eyebrow02 text={conteudo.home_hero_eyebrow} variant="dark-bg" />
            <h1 className="text-[#DCE3EC] text-[36px] font-medium font-['Rubik'] leading-[42px]">
              {conteudo.home_hero_titulo}<span className="text-[#E05829]">.</span>
            </h1>
          </motion.div>
          <motion.div initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15, ease: [0.4, 0, 0.2, 1] }} className="flex flex-col gap-5">
            <p className="text-[#DCE3EC] text-[16px] font-['Rubik'] leading-6">
              {conteudo.home_hero_paragrafo}
            </p>
            <div className="flex flex-col gap-3">
              <BtPrimary text="Solicite uma análise" className="w-full flex items-center justify-center" />
              <BtOutlineArrow text="Conheça as soluções" dark />
            </div>
          </motion.div>
        </div>

        {/* STATS — DESKTOP */}
        <div className="hidden md:flex absolute bottom-[-88px] left-20 right-20 gap-3 z-20">
          {homeStats.map((stat) => (
            <div key={stat.label} className="bg-[#DCE3EC] flex-1 flex flex-col gap-11 px-4 py-4">
              <Eyebrow02 text={stat.label} />
              <div className="flex flex-col gap-3">
                <p className="text-[#E05829] text-[56px] font-medium font-['Rubik'] leading-[44px]">
                  <AnimatedNumber target={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                </p>
                <p className="text-[#003841] text-[16px] font-['Rubik']">{stat.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* STATS — MOBILE */}
      <div className="flex md:hidden flex-col gap-3 px-5 py-8 bg-[#EEF5FF]">
        {homeStats.map((stat) => (
          <div key={stat.label} className="bg-[#DCE3EC] flex flex-col gap-4 px-4 py-4">
            <Eyebrow02 text={stat.label} />
            <div className="flex flex-col gap-1">
              <p className="text-[#E05829] text-[40px] font-medium font-['Rubik'] leading-[44px]">
                <AnimatedNumber target={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
              </p>
              <p className="text-[#003841] text-[14px] font-['Rubik']">{stat.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* SOLUÇÕES */}
      <section className="bg-[#EEF5FF] w-full px-5 md:px-20" style={{ paddingTop: "clamp(64px, 10vw, 192px)", paddingBottom: 104 }}>
        <FadeUp>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-11 pb-11 border-b border-[#DCE3EC] gap-6">
            <div className="flex flex-col gap-3 md:w-[580px]">
              <Eyebrow01 text="O que fazemos" />
              <h2 className="text-[#003841] text-[32px] md:text-[48px] font-medium font-['Rubik'] leading-[38px] md:leading-[48px]">
                Nossas Soluções<span className="text-[#E05829]">.</span>
              </h2>
              <p className="text-[#003841] text-[15px] font-['Rubik'] leading-[23px]">
                Da instalação à manutenção contínua, a Instalsat está presente em cada etapa da infraestrutura do seu condomínio ou empresa.
              </p>
            </div>
            <BtPrimaryArrow text="Explore nossas soluções" />
          </div>
        </FadeUp>
        <div className="flex flex-col">
          {solucoes.map((sol, i, arr) => (
            <FadeUp key={i} delay={i * 0.1}>
              <div className={`flex flex-col md:flex-row md:gap-28 md:items-center py-10 gap-6 ${i < arr.length - 1 ? "border-b border-[#DCE3EC]" : ""}`}>
                <div className="bg-[#003841] w-full md:w-[526px] h-[220px] md:h-[327px] shrink-0 overflow-hidden relative">
                  <Image src={sol.img} alt={sol.tag} fill className="object-cover" />
                </div>
                <div className="flex flex-col gap-4">
                  <Eyebrow02 text={sol.tag} />
                  <h3 className="text-[#003841] text-[24px] md:text-[32px] font-medium font-['Rubik'] leading-[30px] md:leading-[38px] md:w-[480px]">{sol.title}</h3>
                  <BtText text="Explore a solução" />
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* COMO TRABALHAMOS */}
      <section className="bg-[#003841] w-full py-[64px] md:py-[104px] overflow-hidden">
        {/* DESKTOP */}
        <div className="hidden md:flex gap-[54px] items-center pl-20">
          <FadeUp className="flex flex-col gap-8 w-[593px] shrink-0">
            <div className="flex flex-col gap-4">
              <Eyebrow01 text="Como trabalhamos" variant="dark-bg" />
              <div className="flex flex-col">
                <h2 className="text-[#DCE3EC] text-[48px] font-medium font-['Rubik'] leading-[52px]">
                  A maioria instala e some<span className="text-[#E05829]">.</span>
                </h2>
                <h2 className="text-[#E05829] text-[48px] font-medium font-['Rubik'] leading-[52px]">
                  A Instalsat fica<span className="text-[#DCE3EC]">.</span>
                </h2>
              </div>
              <p className="text-[#DCE3EC] text-[15px] font-['Rubik'] leading-[23px]">
                Manutenção não é cláusula de contrato para nós. É a razão de existir.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex gap-3">
                <ArrowBtn direction="left" onClick={prev} />
                <ArrowBtn direction="right" onClick={next} />
              </div>
              <BtPrimaryArrow text="Conheça nossa abordagem" />
            </div>
          </FadeUp>
          <div className="flex-1 overflow-hidden">
            <motion.div className="flex gap-3"
              animate={{ x: -(carouselIndex * (ITEM_WIDTH + GAP)) }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}>
              {processos.map((card, i) => (
                <div key={i} className="flex gap-3 shrink-0">
                  <div className="bg-[#DCE3EC] w-[302px] h-[322px] flex flex-col justify-between p-4">
                    <Eyebrow02 text={card.tag} />
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-1 text-[20px] font-medium font-['Rubik']">
                        <span className="text-[#003841]">{card.num}</span>
                        <span className="text-[#E05829]">.</span>
                        <span className="text-[#003841] ml-1">{card.title}</span>
                      </div>
                      <p className="text-[#003841] text-[14px] font-['Rubik'] leading-5">{card.desc}</p>
                    </div>
                  </div>
                  <div className="bg-[#DCE3EC] w-[302px] h-[322px] overflow-hidden relative shrink-0">
                    <Image src={card.img} alt={card.title} fill className="object-cover" />
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* MOBILE */}
        <div className="flex md:hidden flex-col gap-8 px-5">
          <FadeUp className="flex flex-col gap-4">
            <Eyebrow01 text="Como trabalhamos" variant="dark-bg" />
            <div className="flex flex-col">
              <h2 className="text-[#DCE3EC] text-[32px] font-medium font-['Rubik'] leading-[38px]">
                A maioria instala e some<span className="text-[#E05829]">.</span>
              </h2>
              <h2 className="text-[#E05829] text-[32px] font-medium font-['Rubik'] leading-[38px]">
                A Instalsat fica<span className="text-[#DCE3EC]">.</span>
              </h2>
            </div>
            <p className="text-[#DCE3EC] text-[15px] font-['Rubik'] leading-[23px]">
              Manutenção não é cláusula de contrato para nós. É a razão de existir.
            </p>
            <BtPrimaryArrow text="Conheça nossa abordagem" />
          </FadeUp>
          <div className="flex flex-col gap-4">
            {processos.map((card, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <div className="flex flex-col gap-0">
                  <div className="bg-[#DCE3EC] w-full h-[280px] overflow-hidden relative">
                    <Image src={card.img} alt={card.title} fill className="object-cover" />
                  </div>
                  <div className="bg-[#DCE3EC] w-full p-4 flex flex-col gap-3">
                    <Eyebrow02 text={card.tag} />
                    <div className="flex items-center gap-1 text-[18px] font-medium font-['Rubik']">
                      <span className="text-[#003841]">{card.num}</span>
                      <span className="text-[#E05829]">.</span>
                      <span className="text-[#003841] ml-1">{card.title}</span>
                    </div>
                    <p className="text-[#003841] text-[14px] font-['Rubik'] leading-5">{card.desc}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* PROJETOS */}
      <section className="bg-[#EEF5FF] w-full px-5 md:px-20 py-[64px] md:py-[104px]">
        <FadeUp>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-11 pb-11 border-b border-[#DCDCDC] gap-4">
            <div className="flex flex-col gap-3 md:w-[640px]">
              <Eyebrow01 text="Quem está por trás" />
              <h2 className="text-[#003841] text-[28px] md:text-[40px] font-medium font-['Rubik'] leading-[34px] md:leading-[46px]">
                Infraestrutura que funciona<span className="text-[#E05829]">.</span> Projetos que ficam<span className="text-[#E05829]">.</span>
              </h2>
            </div>
            <BtPrimaryArrow text="Veja mais projetos" />
          </div>
        </FadeUp>
        <div className="flex flex-col gap-10 md:gap-16">
          {projetos.map((proj, i) => (
            <ProjetoItem key={i} proj={proj} delay={i * 0.1} isFirst={i === 0} />
          ))}
        </div>
      </section>

      {/* CLIENTES */}
      <section className="bg-[#DCE3EC] w-full py-[64px] md:py-[104px] overflow-hidden">
        <FadeUp>
          <div className="flex flex-col items-center gap-3 text-center mb-12 px-5 md:px-20">
            <Eyebrow01 text="Quem confia na Instalsat" />
            <h2 className="text-[#003841] text-[28px] md:text-[40px] font-medium font-['Rubik'] leading-[34px] md:leading-[46px] max-w-[700px]">
              Administradoras e empresas que indicam sem hesitar<span className="text-[#E05829]">.</span>
            </h2>
            <p className="text-[#003841] text-[14px] font-['Rubik'] leading-5 max-w-[700px]">
              Administradoras, condomínios e empresas que renovam porque o serviço continua.
            </p>
          </div>
        </FadeUp>
        <div className="flex overflow-hidden mb-8">
          <motion.div className="flex gap-16 shrink-0"
            animate={{ x: ["0%", "-25%"] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            style={{ width: "max-content" }}>
            {row1.map((src, i) => (
              <div key={i} className="h-[40px] w-[120px] md:w-[140px] relative shrink-0">
                <Image src={src} alt={`Cliente ${i}`} fill className="object-contain" />
              </div>
            ))}
          </motion.div>
        </div>
        <div className="flex overflow-hidden">
          <motion.div className="flex gap-16 shrink-0"
            animate={{ x: ["-25%", "0%"] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            style={{ width: "max-content" }}>
            {row2.map((src, i) => (
              <div key={i} className="h-[40px] w-[120px] md:w-[140px] relative shrink-0">
                <Image src={src} alt={`Cliente ${i}`} fill className="object-contain" />
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* DEPOIMENTOS */}
      <section className="bg-[#EEF5FF] w-full py-[64px] md:py-[104px] overflow-hidden">
        <FadeUp>
          <div className="flex flex-col items-center gap-3 mb-12 text-center px-5 md:px-20">
            <Eyebrow01 text="O que dizem sobre a Instalsat" />
            <h2 className="text-[#003841] text-[28px] md:text-[48px] font-medium font-['Rubik'] leading-[34px] md:leading-[48px] max-w-[700px]">
              A percepção de quem já confia<span className="text-[#E05829]">.</span>
            </h2>
          </div>
        </FadeUp>

        <div className="flex justify-center gap-3 mb-10">
          <ArrowBtn direction="left" onClick={depPrev} />
          <ArrowBtn direction="right" onClick={depNext} />
        </div>

        {/* DESKTOP */}
        <div className="hidden md:block overflow-hidden pl-20">
          <motion.div
            className="flex"
            animate={{ x: -(depIndex * DEP_WIDTH) }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          >
            {depoimentos.map((dep, i) => (
              <div
                key={i}
                className="shrink-0 flex flex-col justify-between py-10 border-t border-b border-[#DCE3EC]"
                style={{ width: DEP_WIDTH, borderRight: "1px solid #DCE3EC", paddingRight: 40, paddingLeft: i === 0 ? 0 : 40 }}
              >
                <p className="text-[#003841] text-[16px] font-['Rubik'] leading-6 mb-10">&ldquo;{dep.quote}&rdquo;</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden relative shrink-0">
                    <Image src={dep.img} alt={dep.name} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="text-[#003841] text-[16px] font-medium font-['Rubik']">{dep.name}</p>
                    <p className="text-[#003841] text-[14px] font-['Rubik']">{dep.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* MOBILE — troca manual e automática com transição suave */}
        <div className="flex md:hidden flex-col px-5">
          <div className="border-t border-b border-[#DCE3EC] overflow-hidden">
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={depIndex}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.42, ease: "easeIn" }}
                className="py-8"
              >
                <p className="text-[#003841] text-[15px] font-['Rubik'] leading-6 mb-8">
                  &ldquo;{depoimentos[depIndex].quote}&rdquo;
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden relative shrink-0">
                    <Image src={depoimentos[depIndex].img} alt={depoimentos[depIndex].name} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="text-[#003841] text-[15px] font-medium font-['Rubik']">{depoimentos[depIndex].name}</p>
                    <p className="text-[#003841] text-[13px] font-['Rubik']">{depoimentos[depIndex].role}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="flex justify-center mt-12">
          <BtPrimaryArrow text="Ver no Google" />
        </div>
      </section>
      {/* CTA FINAL */}
      <section className="bg-[#EEF5FF] w-full px-5 md:px-20 pb-[64px] md:pb-[104px]">
        <FadeUp>
          <div className="bg-[#003841] w-full py-14 md:py-20 flex flex-col items-center gap-8 md:gap-10 px-5 md:px-0">
            <div className="flex flex-col gap-4 items-center text-center max-w-[600px]">
              <h2 className="text-[#DCE3EC] text-[28px] md:text-[48px] font-medium font-['Rubik'] leading-[34px] md:leading-[48px]">
                {conteudo.cta_titulo}?
              </h2>
              <p className="text-[#DCE3EC] text-[15px] font-['Rubik'] leading-[23px]">
                {conteudo.cta_paragrafo}
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-3 items-center w-full md:w-auto">
              <BtWhatsApp text="Falar pelo WhatsApp" />
              <BtOutlineArrow text="Solicite uma análise" dark />
            </div>
          </div>
        </FadeUp>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#EEF5FF] w-full px-5 md:px-20 pt-12 md:pt-16 pb-8 border-t border-[#DCE3EC]">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-0 mb-12 md:mb-16">
          <div className="flex flex-col gap-4 md:w-[230px] pb-10 md:pb-0 border-b md:border-b-0 border-[#DCE3EC]">
            <div className="relative w-[160px] h-[45px]">
              <Image src="/LOGO.svg" alt="Instalsat" fill className="object-contain object-left" />
            </div>
            <p className="text-[#003841] text-[16px] font-medium font-['Rubik']">
              {conteudo.footer_tagline}<span className="text-[#E05829]">.</span>
            </p>
          </div>

          <div className="grid grid-cols-2 md:flex md:gap-20 gap-8 py-10 md:py-0 border-b md:border-b-0 border-[#DCE3EC]">
            <div className="flex flex-col gap-3">
              <p className="text-[#003841] text-[18px] font-medium font-['Rubik']">Navegação</p>
              {["Início", "Sobre", "Soluções", "Projetos", "Contato", "Solicite uma análise"].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="bg-[#E05829] w-[5px] h-[5px] shrink-0" />
                  <motion.a href="#" whileHover={{ color: "#E05829" }} transition={ease} className="text-[#003841] text-[14px] font-['Rubik']">{item}</motion.a>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-[#003841] text-[18px] font-medium font-['Rubik']">Soluções</p>
              {["Segurança eletrônica", "Instalações elétricas", "Contratos de manutenção"].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="bg-[#E05829] w-[5px] h-[5px] shrink-0" />
                  <motion.a href="#" whileHover={{ color: "#E05829" }} transition={ease} className="text-[#003841] text-[14px] font-['Rubik']">{item}</motion.a>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 md:w-[223px] pt-10 md:pt-0">
            <p className="text-[#003841] text-[18px] font-medium font-['Rubik']">Contato</p>
            <div>
              <p className="text-[#003841] text-[14px] font-['Rubik']">WhatsApp</p>
              <a href="https://wa.me/551145411316" target="_blank" rel="noopener noreferrer" className="text-[#E05829] text-[14px] font-semibold font-['Rubik'] hover:underline">{conteudo.footer_whatsapp_numero}</a>
            </div>
            <div>
              <p className="text-[#003841] text-[14px] font-['Rubik']">Telefone</p>
              <a href="tel:+551143901-2345" className="text-[#E05829] text-[14px] font-semibold font-['Rubik'] hover:underline">{conteudo.footer_telefone_numero}</a>
            </div>
            <div>
              <p className="text-[#003841] text-[14px] font-['Rubik']">E-mail</p>
              <a href="mailto:contato@instalsat.com.br" className="text-[#E05829] text-[14px] font-semibold font-['Rubik'] hover:underline">{conteudo.footer_email}</a>
            </div>
          </div>
        </div>

        <div className="border-t border-[#DCE3EC] pt-6 flex flex-col items-center gap-1">
          <p className="text-[#003841] text-[14px] font-['Rubik'] text-center">
            {conteudo.footer_copyright}
          </p>
          <p className="text-[#003841] text-[14px] font-['Rubik'] text-center">
            Termos de Uso • Desenvolvido por <a href="https://metacube.studio" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#E05829] transition-colors">MetaCube Studio</a>
          </p>
        </div>
      </footer>
    </main>
  );
}
