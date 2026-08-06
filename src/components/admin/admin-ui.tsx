"use client";

import { useEffect, useRef, useState, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

const iconPaths = {
  dashboard: "/admin-icons/dashboard.svg",
  staff: "/admin-icons/staff.svg",
  reports: "/admin-icons/reports.svg",
  data: "/admin-icons/data.svg",
  edit: "/admin-icons/edit.svg",
  remove: "/admin-icons/remove.svg",
  add: "/admin-icons/add.svg",
  "chevron-down": "/admin-icons/chevron-down.svg",
  "chevron-up": "/admin-icons/chevron-up.svg",
  menu: "/admin-icons/menu.svg",
  check: "/admin-icons/check.svg",
  "radio-selected": "/admin-icons/radio-selected.svg",
  calendar: "/admin-icons/calendar.svg",
  close: "/admin-icons/close.svg",
  "panel-edit": "/admin-icons/panel-edit.svg",
  "chevron-left": "/admin-icons/chevron-left.svg",
  "chevron-right": "/admin-icons/chevron-right.svg",
  success: "/admin-icons/success.svg",
  notification: "/admin-icons/notification.svg",
  qr: "/admin-icons/qr.svg",
  users: "/admin-icons/users.svg",
  settings: "/admin-icons/settings.svg",
} as const;

export type AdminIconName = keyof typeof iconPaths;

export function AdminIcon({ name, className = "size-5" }: { name: AdminIconName; className?: string }) {
  return <span aria-hidden="true" className={`inline-block shrink-0 bg-current ${className}`} style={{ WebkitMask: `url(${iconPaths[name]}) center / contain no-repeat`, mask: `url(${iconPaths[name]}) center / contain no-repeat` }} />;
}

type AdminButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
  size?: "small" | "large";
  icon?: AdminIconName;
};

export function AdminButton({ variant = "primary", size = "small", icon, className = "", children, ...props }: AdminButtonProps) {
  const variants = {
    primary: "border-[#E05829] bg-[#E05829] text-white hover:border-[#AD4420] hover:bg-[#AD4420]",
    secondary: "border-[#E05829] bg-transparent text-[#E05829] hover:bg-[#E05829] hover:text-white",
    danger: "border-red-200 bg-white text-red-700 hover:border-red-700 hover:bg-red-50",
  };
  return <button className={`inline-flex min-w-[120px] items-center justify-center gap-2 rounded-lg border text-[14px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E05829] disabled:pointer-events-none disabled:border-[#B9C8CC] disabled:bg-[#E0E8EA] disabled:text-[#829397] ${size === "large" ? "h-[54px] px-6" : "h-[38px] px-4"} ${variants[variant]} ${className}`} {...props}>{icon ? <AdminIcon name={icon} className="size-4" /> : null}{children}</button>;
}

type AdminFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  hint?: string;
  trailing?: ReactNode;
};

export function AdminField({ label, error, hint, trailing, className = "", ...props }: AdminFieldProps) {
  return <label className="block"><span className="mb-2 block text-[13px] font-medium text-[#003841]">{label}{props.required ? " *" : ""}</span><span className="relative block"><input className={`admin-field h-[52px] ${trailing ? "pr-11" : "pr-4"} disabled:bg-[#E0E8EA] disabled:text-[#829397] ${error ? "border-red-600 focus:border-red-600 focus:shadow-[0_0_0_3px_rgba(220,38,38,0.1)]" : ""} ${className}`} aria-invalid={Boolean(error)} {...props} />{trailing ? <span className="absolute inset-y-0 right-4 flex items-center text-[#63777B]">{trailing}</span> : null}</span>{error ? <span className="mt-1.5 block text-[11px] text-red-700">{error}</span> : hint ? <span className="mt-1.5 block text-[11px] text-[#63777B]">{hint}</span> : null}</label>;
}

type AdminTabsProps = {
  tabs: Array<{ id: string; label: string }>;
  active: string;
  onChange?: (id: string) => void;
  ariaLabel?: string;
};

export function AdminTabs({ tabs, active, onChange, ariaLabel = "Seções" }: AdminTabsProps) {
  return <div className="inline-flex h-10 max-w-full overflow-x-auto rounded-lg border border-[#B9C8CC] bg-white" role="tablist" aria-label={ariaLabel}>{tabs.map((tab, index) => <button key={tab.id} type="button" role="tab" aria-selected={active === tab.id} onClick={() => onChange?.(tab.id)} className={`min-w-[140px] border-r border-[#D7E1E5] px-5 text-[14px] font-medium transition-colors last:border-r-0 ${active === tab.id ? "bg-[#003841] text-white" : "text-[#63777B] hover:bg-[#EEF5FF] hover:text-[#003841]"}`}>{tab.label}<span className="sr-only">, aba {index + 1}</span></button>)}</div>;
}

type AdminStepperProps = {
  steps: string[];
  activeStep: number;
  className?: string;
};

export function AdminStepper({ steps, activeStep, className = "" }: AdminStepperProps) {
  return <ol className={`flex flex-wrap items-center gap-x-6 gap-y-3 ${className}`} aria-label="Progresso">{steps.map((step, index) => { const active = index === activeStep; const complete = index < activeStep; return <li key={step} className={`flex items-center gap-2 text-[14px] font-semibold ${active ? "text-[#003841]" : complete ? "text-[#128C7E]" : "text-[#829397]"}`} aria-current={active ? "step" : undefined}><span className={`grid size-10 place-items-center rounded-full border text-[14px] font-medium ${active ? "border-[#003841] bg-[#003841] text-white" : complete ? "border-[#128C7E] bg-[#128C7E] text-white" : "border-[#B9C8CC] bg-white text-[#829397]"}`}>{index + 1}</span>{step}</li>; })}</ol>;
}

type ChoiceProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & { label: string };

export function AdminCheckbox({ label, className = "", ...props }: ChoiceProps) {
  return <label className={`inline-flex cursor-pointer items-center gap-2 text-[14px] font-medium text-[#003841] has-[:disabled]:cursor-not-allowed has-[:disabled]:text-[#829397] ${className}`}><input type="checkbox" className="peer sr-only" {...props} /><span className="grid size-5 place-items-center rounded-[4px] border border-[#9DB0B5] bg-white text-transparent transition-colors peer-checked:border-[#E05829] peer-checked:bg-[#E05829] peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#E05829] peer-disabled:border-[#CFDCE0] peer-disabled:bg-[#E0E8EA]"><AdminIcon name="check" className="size-3" /></span>{label}</label>;
}

export function AdminRadio({ label, className = "", ...props }: ChoiceProps) {
  return <label className={`inline-flex cursor-pointer items-center gap-2 text-[14px] font-medium text-[#003841] has-[:disabled]:cursor-not-allowed has-[:disabled]:text-[#829397] ${className}`}><input type="radio" className="peer sr-only" {...props} /><span className="grid size-5 place-items-center rounded-full border border-[#9DB0B5] bg-white text-transparent transition-colors peer-checked:border-[#E05829] peer-checked:text-[#E05829] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#E05829] peer-disabled:border-[#CFDCE0] peer-disabled:bg-[#E0E8EA]"><AdminIcon name="radio-selected" className="size-5" /></span>{label}</label>;
}

export type AdminCalendarStatus = "completed" | "overtime" | "late" | "leave" | "pending";

type AdminCalendarProps = {
  year: number;
  monthIndex: number;
  selectedDate?: number;
  statuses?: Record<number, AdminCalendarStatus>;
  onSelect?: (date: number) => void;
  showLegend?: boolean;
  compact?: boolean;
};

const calendarStatusStyles: Record<AdminCalendarStatus, string> = {
  completed: "bg-[#128C7E] text-white",
  overtime: "bg-[#E05829] text-white",
  late: "bg-[#AD4420] text-white",
  leave: "bg-[#9DB0B5] text-white",
  pending: "bg-[#003841] text-white",
};

const calendarLegend: Array<[AdminCalendarStatus, string]> = [["completed", "Concluído"], ["overtime", "Hora extra"], ["late", "Atraso"], ["leave", "Ausência"], ["pending", "Pendente"]];

export function AdminCalendar({ year, monthIndex, selectedDate, statuses = {}, onSelect, showLegend = true, compact = false }: AdminCalendarProps) {
  const firstDay = new Date(year, monthIndex, 1).getDay();
  const mondayOffset = (firstDay + 6) % 7;
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const previousMonthDays = new Date(year, monthIndex, 0).getDate();
  const cells = Array.from({ length: 42 }, (_, index) => {
    const date = index - mondayOffset + 1;
    if (date < 1) return { date: previousMonthDays + date, current: false };
    if (date > daysInMonth) return { date: date - daysInMonth, current: false };
    return { date, current: true };
  });

  return <div className={`admin-surface w-full overflow-hidden p-3 ${compact ? "max-w-[327px]" : "max-w-[640px]"}`}><div className="grid grid-cols-7">{["S", "T", "Q", "Q", "S", "S", "D"].map((day, index) => <div key={`${day}-${index}`} className={`grid place-items-center font-medium text-[#63777B] ${compact ? "h-9 text-[13px]" : "h-12 text-[14px]"}`}>{day}</div>)}{cells.map((cell, index) => { const status = cell.current ? statuses[cell.date] : undefined; const selected = cell.current && selectedDate === cell.date; return <button key={`${cell.date}-${index}`} type="button" disabled={!cell.current} onClick={() => cell.current && onSelect?.(cell.date)} className={`grid place-items-center border border-white text-[14px] font-medium transition-colors ${compact ? "h-10" : "h-14"} ${!cell.current ? "text-[#B9C8CC]" : selected ? "bg-[#E05829] text-white ring-2 ring-inset ring-[#003841]" : status ? calendarStatusStyles[status] : "text-[#003841] hover:bg-[#EEF5FF]"}`}>{String(cell.date).padStart(2, "0")}</button>; })}</div>{showLegend ? <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 border-t border-[#E0E8EA] pt-3"><span className="text-[11px] text-[#63777B]">Legenda</span>{calendarLegend.map(([status, label]) => <span key={status} className="flex items-center gap-1.5 text-[11px] text-[#52666A]"><span className={`size-2.5 rounded-full ${calendarStatusStyles[status]}`} />{label}</span>)}</div> : null}</div>;
}

type AdminSidePanelProps = {
  open: boolean;
  title: string;
  subtitle?: string;
  children: ReactNode;
  onClose: () => void;
  onEdit?: () => void;
  footer?: ReactNode;
};

export function AdminSidePanel({ open, title, subtitle, children, onClose, onEdit, footer }: AdminSidePanelProps) {
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open, onClose]);

  if (!open) return null;
  return <div className="fixed inset-0 z-50 bg-[#001E23]/55" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="ml-auto flex h-full w-full max-w-[708px] flex-col bg-[#F8FAFC] shadow-[-16px_0_48px_rgba(0,30,35,0.18)]" role="dialog" aria-modal="true" aria-labelledby="admin-side-panel-title"><header className="flex min-h-[107px] items-center justify-between gap-5 border-b border-[#D7E1E5] px-6 sm:px-8"><div className="min-w-0"><h2 id="admin-side-panel-title" className="truncate text-[24px] font-semibold tracking-[-0.02em] text-[#003841]">{title}</h2>{subtitle ? <p className="mt-1 text-[13px] text-[#63777B]">{subtitle}</p> : null}</div><div className="flex gap-2">{onEdit ? <button type="button" onClick={onEdit} className="grid size-10 place-items-center rounded-full bg-[#EEF5FF] text-[#003841] hover:bg-[#DCE3EC]" aria-label="Editar"><AdminIcon name="panel-edit" className="size-5" /></button> : null}<button type="button" onClick={onClose} className="grid size-10 place-items-center rounded-full bg-[#EEF5FF] text-[#003841] hover:bg-[#DCE3EC]" aria-label="Fechar"><AdminIcon name="close" className="size-5" /></button></div></header><div className="min-h-0 flex-1 overflow-y-auto p-6 sm:p-8">{children}</div>{footer ? <footer className="border-t border-[#D7E1E5] bg-white p-5 sm:px-8">{footer}</footer> : null}</section></div>;
}

type AdminNavItemProps = {
  href: string;
  label: string;
  icon: AdminIconName;
  active?: boolean;
  count?: number;
  onClick?: () => void;
};

export function AdminNavItem({ href, label, icon, active = false, count, onClick }: AdminNavItemProps) {
  return <Link href={href} onClick={onClick} aria-current={active ? "page" : undefined} className={`flex h-10 w-full items-center gap-2 rounded-lg px-3 text-[14px] font-medium transition-colors ${active ? "bg-[#E05829] text-white shadow-sm" : "text-[#DCE3EC] hover:bg-white/8 hover:text-white"}`}><AdminIcon name={icon} className="size-5" /><span className="min-w-0 flex-1 truncate">{label}</span>{typeof count === "number" ? <span className={`rounded px-1.5 py-0.5 text-[11px] ${active ? "bg-white/20 text-white" : "bg-white/10 text-[#DCE3EC]"}`}>{count}</span> : null}</Link>;
}

type AdminDesktopHeaderProps = {
  title: string;
  variant?: "topbar" | "page" | "profile" | "compose";
  subtitle?: string;
  avatarUrl?: string;
  actions?: ReactNode;
};

export function AdminDesktopHeader({ title, variant = "page", subtitle, avatarUrl, actions }: AdminDesktopHeaderProps) {
  if (variant === "topbar") return <header className="flex h-20 items-center justify-between border-b border-[#D7E1E5] bg-white px-8"><p className="text-[15px] font-semibold text-[#003841]">{title}</p><div className="flex items-center gap-2 text-[#003841]"><button type="button" className="grid size-10 place-items-center rounded-lg hover:bg-[#EEF5FF]" aria-label="Notificações"><AdminIcon name="notification" /></button><button type="button" className="grid size-10 place-items-center rounded-lg hover:bg-[#EEF5FF]" aria-label="Código QR"><AdminIcon name="qr" /></button></div></header>;
  if (variant === "profile") return <header className="flex items-center justify-between gap-5 border-b border-[#D7E1E5] pb-4"><div className="flex min-w-0 items-center gap-4">{avatarUrl ? <Image src={avatarUrl} alt="" width={56} height={56} className="size-14 rounded-full object-cover" /> : <span className="grid size-14 place-items-center rounded-full bg-[#003841] text-lg font-semibold text-white">{title.charAt(0)}</span>}<div className="min-w-0"><h2 className="truncate text-[28px] font-semibold text-[#003841]">{title}</h2>{subtitle ? <p className="mt-1 truncate text-[13px] text-[#63777B]">{subtitle}</p> : null}</div></div>{actions}</header>;
  return <header className={`flex items-center justify-between gap-5 border-b border-[#D7E1E5] pb-4 ${variant === "compose" ? "min-h-16" : "min-h-20"}`}><div><h1 className={`${variant === "compose" ? "text-[28px]" : "text-[36px]"} font-semibold tracking-[-0.02em] text-[#003841]`}>{title}</h1>{subtitle ? <p className="mt-1 text-[13px] text-[#63777B]">{subtitle}</p> : null}</div>{actions}</header>;
}

type AdminMobileHeaderProps = {
  title: string;
  variant?: "main" | "back" | "success";
  onBack?: () => void;
};

export function AdminMobileHeader({ title, variant = "main", onBack }: AdminMobileHeaderProps) {
  return <header className={`flex min-h-[99px] bg-[#003841] px-6 pb-6 pt-10 text-white ${variant === "main" ? "items-center gap-4" : "flex-col items-start justify-center gap-4"}`}>{variant === "main" ? <Image src="/institucional/logo-symbol.svg" alt="" width={28} height={28} /> : variant === "back" ? <button type="button" onClick={onBack} className="grid size-8 place-items-center rounded-lg hover:bg-white/10" aria-label="Voltar"><AdminIcon name="chevron-left" /></button> : <span className="grid size-12 place-items-center rounded-full bg-white/10 text-[#DCE3EC]"><AdminIcon name="success" className="size-10" /></span>}<h1 className="text-[20px] font-semibold tracking-[0.01em]">{title}</h1></header>;
}

type AdminSidebarProfileProps = { name: string; role: string; avatarUrl?: string };

export function AdminSidebarProfile({ name, role, avatarUrl }: AdminSidebarProfileProps) {
  return <div className="flex h-[77px] items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-4">{avatarUrl ? <Image src={avatarUrl} alt="" width={32} height={32} className="size-8 rounded-full object-cover" /> : <span className="grid size-8 place-items-center rounded-full bg-[#E05829] text-[12px] font-semibold text-white">{name.charAt(0)}</span>}<div className="min-w-0"><p className="truncate text-[14px] font-medium text-white">{name}</p><p className="truncate text-[12px] text-[#DCE3EC]/65">{role}</p></div></div>;
}

type AdminDropdownOption = { value: string; label: string };

type AdminDropdownProps = {
  label?: string;
  value?: string;
  options: AdminDropdownOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

export function AdminDropdown({ label, value, options, onChange, placeholder = "Selecione", disabled = false, className = "" }: AdminDropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = options.find((option) => option.value === value);

  useEffect(() => {
    const close = (event: MouseEvent) => { if (!rootRef.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return <div ref={rootRef} className={`relative ${className}`}>{label ? <span className="mb-2 block text-[13px] font-medium text-[#003841]">{label}</span> : null}<button type="button" disabled={disabled} onClick={() => setOpen((current) => !current)} aria-haspopup="listbox" aria-expanded={open} className={`flex h-[52px] w-full min-w-[140px] items-center gap-4 rounded-lg border px-4 text-left text-[14px] font-medium transition-[border-color,box-shadow] disabled:cursor-not-allowed disabled:bg-[#E0E8EA] disabled:text-[#829397] ${open ? "border-[#E05829] bg-white text-[#003841] shadow-[0_0_0_3px_rgba(224,88,41,0.12)]" : selected ? "border-[#B9C8CC] bg-white text-[#003841]" : "border-[#B9C8CC] bg-white text-[#829397]"}`}><span className="min-w-0 flex-1 truncate">{selected?.label ?? placeholder}</span><AdminIcon name={open ? "chevron-up" : "chevron-down"} className="size-5" /></button>{open ? <div className="absolute left-0 right-0 z-50 mt-1 overflow-hidden rounded-lg border border-[#D7E1E5] bg-white p-2 shadow-[0_12px_32px_rgba(0,56,65,0.14)]" role="listbox">{options.map((option) => <button key={option.value} type="button" role="option" aria-selected={option.value === value} onClick={() => { onChange(option.value); setOpen(false); }} className={`flex h-10 w-full items-center rounded-md px-3 text-left text-[14px] font-medium transition-colors ${option.value === value ? "bg-[#003841] text-white" : "text-[#52666A] hover:bg-[#EEF5FF] hover:text-[#003841]"}`}>{option.label}</button>)}</div> : null}</div>;
}

type AdminPromptProps = {
  open: boolean;
  title: string;
  body: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "success" | "warning" | "danger";
  onConfirm: () => void;
  onCancel?: () => void;
};

export function AdminPrompt({ open, title, body, confirmLabel = "Confirmar", cancelLabel = "Cancelar", tone = "success", onConfirm, onCancel }: AdminPromptProps) {
  if (!open) return null;
  const toneStyles = { success: "text-[#128C7E]", warning: "text-[#E05829]", danger: "text-red-700" };
  return <div className="fixed inset-0 z-[60] grid place-items-center bg-[#001E23]/45 p-5" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onCancel?.(); }}><section className="w-full max-w-[340px] rounded-lg border border-white/15 bg-[#003841]/90 p-6 text-center shadow-[4px_4px_20px_rgba(0,30,35,0.2)] backdrop-blur-[10px]" role="alertdialog" aria-modal="true" aria-labelledby="admin-prompt-title" aria-describedby="admin-prompt-body"><div className={`mx-auto grid size-12 place-items-center ${toneStyles[tone]}`}><AdminIcon name="success" className="size-12" /></div><h2 id="admin-prompt-title" className="mt-1 text-[20px] font-semibold tracking-[0.01em] text-white">{title}</h2><p id="admin-prompt-body" className="mt-5 text-[13px] leading-5 text-[#DCE3EC]/75">{body}</p><div className="mt-6 flex gap-4">{onCancel ? <AdminButton type="button" variant="secondary" onClick={onCancel} className="min-w-0 flex-1 border-[#DCE3EC] text-[#DCE3EC] hover:border-[#E05829]">{cancelLabel}</AdminButton> : null}<AdminButton type="button" variant={tone === "danger" ? "danger" : "primary"} onClick={onConfirm} className="min-w-0 flex-1">{confirmLabel}</AdminButton></div></section></div>;
}

type AdminInfoCardProps = {
  title: string;
  description: string;
  imageUrl?: string;
  contact?: string;
  countLabel?: string;
  leadName?: string;
  leadRole?: string;
  leadContact?: string;
  leadAvatarUrl?: string;
  onClick?: () => void;
};

export function AdminInfoCard({ title, description, imageUrl, contact, countLabel, leadName, leadRole, leadContact, leadAvatarUrl, onClick }: AdminInfoCardProps) {
  const content = <><div className="h-[140px] w-full bg-[#DCE3EC] bg-cover bg-center" style={imageUrl ? { backgroundImage: `url(${JSON.stringify(imageUrl)})` } : undefined}>{!imageUrl ? <span className="grid h-full place-items-center text-[#63777B]"><AdminIcon name="data" className="size-8" /></span> : null}</div><div className="p-6"><h3 className="text-[20px] font-semibold tracking-[0.01em] text-[#003841]">{title}</h3><p className="mt-1 min-h-[38px] text-[14px] leading-5 text-[#63777B]">{description}</p>{contact || countLabel ? <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[14px] text-[#52666A]">{contact ? <span className="flex items-center gap-2"><AdminIcon name="staff" className="size-4" />{contact}</span> : null}{countLabel ? <span className="flex items-center gap-2"><AdminIcon name="reports" className="size-4" />{countLabel}</span> : null}</div> : null}{leadName ? <div className="mt-4 flex items-center gap-4 border-t border-[#D7E1E5] pt-4">{leadAvatarUrl ? <span className="size-12 shrink-0 rounded-full bg-cover bg-center" style={{ backgroundImage: `url(${JSON.stringify(leadAvatarUrl)})` }} /> : <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#003841] font-semibold text-white">{leadName.charAt(0)}</span>}<div className="min-w-0"><p className="truncate text-[16px] font-semibold text-[#003841]">{leadName}</p><p className="mt-1 truncate text-[12px] text-[#63777B]">{[leadContact, leadRole].filter(Boolean).join(" • ")}</p></div></div> : null}</div></>;
  return onClick ? <button type="button" onClick={onClick} className="admin-surface w-full max-w-[416px] overflow-hidden text-left transition-[border-color,transform,box-shadow] hover:-translate-y-0.5 hover:border-[#E05829] hover:shadow-[0_10px_28px_rgba(0,56,65,0.1)]">{content}</button> : <article className="admin-surface w-full max-w-[416px] overflow-hidden">{content}</article>;
}
