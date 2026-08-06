export function PageHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) {
  return (
    <header className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="mb-3 flex h-7 w-fit items-center gap-2 rounded-full bg-[#E05829]/10 px-3 text-[12px] font-medium text-[#AD4420]">
          <span className="size-2 bg-[#E05829]" />
          {eyebrow}
        </div>
        <h1 className="text-[30px] font-semibold leading-tight tracking-[-0.02em] text-[#003841] sm:text-[36px]">{title}<span className="text-[#E05829]">.</span></h1>
        <p className="mt-2 max-w-2xl text-[14px] leading-6 text-[#52666A]">{description}</p>
      </div>
      {action}
    </header>
  );
}
