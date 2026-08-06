"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const navItems = [
  { label: "Início", href: "/" },
  { label: "Institucional", href: "/institucional" },
  { label: "Soluções", href: "/solucoes" },
  { label: "Projetos", href: "/projetos" },
  { label: "Contato", href: "/contato" },
];

const transition = { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const };

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.555 4.122 1.528 5.855L.057 23.886a.5.5 0 0 0 .612.612l6.031-1.471A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.686-.522-5.204-1.428l-.374-.222-3.878.945.964-3.878-.244-.386A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
    </svg>
  );
}

export function SiteHeader({ activePath }: { activePath: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showScrollMenu, setShowScrollMenu] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const updateScrollMenu = () => setShowScrollMenu(window.scrollY > 120);

    updateScrollMenu();
    window.addEventListener("scroll", updateScrollMenu, { passive: true });

    return () => window.removeEventListener("scroll", updateScrollMenu);
  }, []);

  return (
    <>
      <nav className="relative z-50 flex items-center justify-between px-5 py-7 md:px-20" aria-label="Navegação principal">
        <Link href="/" className="flex items-center gap-3" aria-label="Instalsat, página inicial">
          <Image src="/institucional/logo-symbol.svg" alt="" width={40} height={40} className="size-10" />
          <Image src="/institucional/logo-wordmark.svg" alt="Instalsat" width={140} height={26} className="hidden h-[26px] w-[140px] sm:block" />
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <motion.div key={item.href} whileHover={{ color: "#E05829" }} transition={transition} className={activePath === item.href ? "text-[#E05829]" : "text-[#DCE3EC]"}>
              <Link href={item.href} className="block px-2 py-2 text-[14px]">{item.label}</Link>
            </motion.div>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <motion.a href="https://wa.me/5511989012345" target="_blank" rel="noopener noreferrer" whileHover={{ backgroundColor: "#0E6B5E" }} transition={transition} className="flex h-[52px] items-center justify-between gap-3 bg-[#128C7E] px-6 text-[15px] font-medium text-[#EEF5FF]">
            <span>Fale Conosco</span>
            <WhatsAppIcon />
          </motion.a>
          <motion.a href="/contato" whileHover={{ backgroundColor: "#AD4420" }} transition={transition} className="flex h-[52px] items-center justify-center bg-[#E05829] px-6 text-[15px] font-medium text-[#EEF5FF]">
            Solicite uma análise
          </motion.a>
        </div>

        <button type="button" className="flex flex-col gap-[5px] p-2 md:hidden" onClick={() => setMenuOpen((open) => !open)} aria-label="Abrir menu" aria-expanded={menuOpen}>
          <motion.span animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 7 : 0 }} className="block h-0.5 w-6 bg-[#DCE3EC]" />
          <motion.span animate={{ opacity: menuOpen ? 0 : 1 }} className="block h-0.5 w-6 bg-[#DCE3EC]" />
          <motion.span animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -7 : 0 }} className="block h-0.5 w-6 bg-[#DCE3EC]" />
        </button>
      </nav>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div initial={{ opacity: 0, x: "100%" }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: "100%" }} transition={transition} className="fixed inset-0 z-40 flex flex-col items-start justify-center gap-8 bg-[#003841] px-8 md:hidden">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className={`text-[32px] font-medium transition-colors hover:text-[#E05829] ${activePath === item.href ? "text-[#E05829]" : "text-[#DCE3EC]"}`}>
                {item.label}
              </Link>
            ))}
            <div className="mt-4 flex w-full flex-col gap-4">
              <a href="https://wa.me/5511989012345" target="_blank" rel="noopener noreferrer" className="flex h-[52px] items-center justify-between bg-[#128C7E] px-6 text-[15px] font-medium text-[#EEF5FF]">
                <span>Fale Conosco</span><WhatsAppIcon />
              </a>
              <a href="/contato" className="flex h-[52px] items-center justify-center bg-[#E05829] px-6 text-[15px] font-medium text-[#EEF5FF]">Solicite uma análise</a>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {showScrollMenu ? (
          <motion.nav
            initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -76 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -76 }}
            transition={reduceMotion ? { duration: 0.01 } : { duration: 0.42, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-x-0 top-0 z-[60] hidden h-[76px] items-center justify-between bg-[#003841] px-20 md:flex"
            aria-label="Navegação fixa"
          >
            <Link href="/" className="flex w-[164px] items-center gap-[6.5px]" aria-label="Instalsat, página inicial">
              <Image src="/institucional/logo-symbol.svg" alt="" width={33} height={33} className="size-[33px]" />
              <Image src="/institucional/logo-wordmark.svg" alt="Instalsat" width={125} height={24} className="h-6 w-[125px]" />
            </Link>

            <div className="flex items-center gap-4">
              {navItems.map((item) => (
                <motion.div key={item.href} whileHover={{ color: "#E05829" }} transition={transition} className={activePath === item.href ? "text-[#E05829]" : "text-[#DCE3EC]"}>
                  <Link href={item.href} className="block p-2 text-[14px]">{item.label}</Link>
                </motion.div>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <motion.a href="https://wa.me/5511989012345" target="_blank" rel="noopener noreferrer" whileHover={{ backgroundColor: "#0E6B5E" }} transition={transition} className="flex h-[52px] w-[172px] items-center justify-between bg-[#128C7E] px-6 text-[15px] font-medium text-[#EEF5FF]">
                <span>Fale Conosco</span>
                <WhatsAppIcon />
              </motion.a>
              <motion.a href="/contato" whileHover={{ backgroundColor: "#E05829" }} transition={transition} className="flex h-[52px] w-[210px] items-center justify-between border border-[#E05829] px-6 text-[15px] font-medium text-[#EEF5FF]">
                <span>Solicite uma análise</span>
                <Image src="/institucional/scroll-menu-arrow.svg" alt="" width={14} height={14} className="size-[14px] rotate-180" />
              </motion.a>
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </>
  );
}
