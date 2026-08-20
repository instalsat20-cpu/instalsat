"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const ease = { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const };

export type DropdownOption = { label: string; value: string };

type DropdownProps = {
  icon: string;
  placeholder: string;
  options: string[] | DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  name?: string;
  className?: string;
};

function toOptions(options: string[] | DropdownOption[]): DropdownOption[] {
  return options.map((option) => (typeof option === "string" ? { label: option, value: option } : option));
}

export function Dropdown({ icon, placeholder, options, value, onChange, required, name, className = "" }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const opts = toOptions(options);
  const selected = opts.find((option) => option.value === value);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={`relative flex w-full flex-col items-start ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex h-[52px] w-full items-center justify-between border border-[#CFD5DE] bg-[#EEF5FF] p-4"
      >
        <span className="flex items-center gap-2">
          <span className="flex size-5 shrink-0 items-center justify-center">
            <Image src={icon} alt="" width={20} height={20} className="size-auto max-h-5 max-w-5 object-contain" />
          </span>
          <span className={`text-[16px] ${selected ? "text-[#003841]" : "text-[#969BA1]"}`}>{selected ? selected.label : placeholder}</span>
        </span>
        <motion.span animate={{ rotate: open ? -90 : 90 }} transition={ease} className="flex size-4 shrink-0 items-center justify-center">
          <Image src="/contato/icon-faq-arrow.svg" alt="" width={16} height={16} className="size-4" />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={ease}
            className="absolute top-full z-20 flex w-full flex-col gap-4 overflow-hidden border-b border-l border-r border-[#CFD5DE] bg-[#EEF5FF] p-4"
          >
            {opts.map((option) => (
              <li key={option.value} role="option" aria-selected={option.value === value}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={`w-full text-left text-[16px] transition-colors hover:text-[#E05829] ${option.value === value ? "font-medium text-[#003841]" : "text-[#969BA1]"}`}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

      {required && (
        <select aria-hidden tabIndex={-1} required value={value} name={name} onChange={() => {}} className="sr-only">
          <option value="" />
          {opts.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      )}
    </div>
  );
}
