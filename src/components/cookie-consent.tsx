"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";

const STORAGE_KEY = "instalsat-cookie-consent";
const CONSENT_EVENT = "instalsat-cookie-consent-change";

type ConsentValue = "accepted" | "essential" | "pending" | "loading";

function subscribe(onStoreChange: () => void) {
  const handleChange = () => onStoreChange();
  window.addEventListener("storage", handleChange);
  window.addEventListener(CONSENT_EVENT, handleChange);

  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener(CONSENT_EVENT, handleChange);
  };
}

function getSnapshot(): ConsentValue {
  try {
    const savedValue = window.localStorage.getItem(STORAGE_KEY);
    return savedValue === "accepted" || savedValue === "essential" ? savedValue : "pending";
  } catch {
    return "pending";
  }
}

function getServerSnapshot(): ConsentValue {
  return "loading";
}

function saveConsent(value: "accepted" | "essential") {
  try {
    window.localStorage.setItem(STORAGE_KEY, value);
  } finally {
    window.dispatchEvent(new Event(CONSENT_EVENT));
  }
}

export function CookieConsent() {
  const pathname = usePathname();
  const consent = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const reduceMotion = useReducedMotion();
  const isSpecialPage = pathname === "/em-breve" || pathname === "/manutencao";
  const visible = consent === "pending" && !isSpecialPage;

  return (
    <AnimatePresence initial={false}>
      {visible ? (
        <motion.aside
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
          transition={reduceMotion ? { duration: 0.01 } : { duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
          className="fixed inset-x-5 bottom-5 z-[80] border-t-4 border-[#E05829] bg-[#003841] px-5 py-5 shadow-[0_16px_48px_rgba(0,56,65,0.28)] md:inset-x-20 md:bottom-8 md:px-8 md:py-6"
          aria-label="Preferências de cookies"
          aria-live="polite"
        >
          <div className="mx-auto flex max-w-[1280px] flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex max-w-[760px] items-start gap-4">
              <span className="mt-1 size-3 shrink-0 bg-[#E05829]" aria-hidden="true" />
              <div className="flex flex-col gap-2">
                <h2 className="text-[20px] font-medium leading-6 text-[#DCE3EC]">Sua privacidade importa<span className="text-[#E05829]">.</span></h2>
                <p className="text-[14px] leading-[21px] text-[#DCE3EC]">
                  Utilizamos cookies necessários para o funcionamento do site e, com sua autorização, cookies opcionais para entender a navegação e melhorar sua experiência. Você pode aceitar todos ou continuar apenas com os necessários.
                </p>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row lg:shrink-0">
              <motion.button
                type="button"
                onClick={() => saveConsent("essential")}
                whileHover={{ backgroundColor: "#E05829", color: "#EEF5FF" }}
                transition={{ duration: 0.3 }}
                className="h-[52px] border border-[#E05829] px-6 text-[15px] font-medium text-[#DCE3EC]"
              >
                Apenas necessários
              </motion.button>
              <motion.button
                type="button"
                onClick={() => saveConsent("accepted")}
                whileHover={{ backgroundColor: "#AD4420" }}
                transition={{ duration: 0.3 }}
                className="h-[52px] bg-[#E05829] px-6 text-[15px] font-medium text-[#EEF5FF]"
              >
                Aceitar todos
              </motion.button>
            </div>
          </div>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}
