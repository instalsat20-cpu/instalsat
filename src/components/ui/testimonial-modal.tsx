"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

const ease = { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const };

export type Testimonial = {
  photo: string;
  name: string;
  role: string;
  project: string;
  quote: string;
};

export function TestimonialModal({ testimonial, onClose }: { testimonial: Testimonial | null; onClose: () => void }) {
  useEffect(() => {
    if (!testimonial) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [testimonial, onClose]);

  return (
    <AnimatePresence>
      {testimonial && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`Depoimento de ${testimonial.name}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={ease}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#003841]/60 p-5"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={ease}
            className="relative flex w-full max-w-[984px] flex-col items-end bg-[#DCE3EC]"
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" onClick={onClose} aria-label="Fechar" className="flex shrink-0 items-center justify-center bg-[#E05829] p-2">
              <Image src="/projetos/modal-close.svg" alt="" width={16} height={16} className="size-4" />
            </button>

            <div className="flex w-full flex-col items-center gap-6 px-5 pb-8 md:flex-row md:items-center md:gap-8 md:px-10 md:pb-10">
              <div className="relative h-[280px] w-full shrink-0 overflow-hidden bg-white md:h-[224px] md:w-[200px]">
                <Image src={testimonial.photo} alt={testimonial.name} fill sizes="(max-width: 768px) 100vw, 200px" className="object-cover" />
              </div>
              <div className="flex flex-col items-start gap-4">
                <div className="flex flex-col gap-4">
                  <div className="text-[#003841]">
                    <p className="text-[26px] font-medium leading-[32px] md:text-[32px] md:leading-[38.4px]">{testimonial.name}</p>
                    <p className="text-[16px] font-medium leading-[22.4px]">{testimonial.role}</p>
                  </div>
                  <p className="text-[16px] font-medium leading-[22.4px] text-[#E05829]">{testimonial.project}</p>
                </div>
                <p className="text-[15px] leading-[23px] text-[#003841]">{testimonial.quote}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
