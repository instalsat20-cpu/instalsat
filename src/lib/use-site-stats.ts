"use client";

import { useEffect, useState } from "react";

export type SiteStats = {
  anos: number;
  clientes: number;
  atendimentos: number;
  contratos: number;
};

export const DEFAULT_SITE_STATS: SiteStats = {
  anos: 28,
  clientes: 2,
  atendimentos: 3,
  contratos: 30,
};

function parseStat(value: unknown, fallback: number) {
  const number = typeof value === "string" ? Number(value) : Number.NaN;
  return Number.isFinite(number) && number >= 0 ? number : fallback;
}

export function useSiteStats() {
  const [stats, setStats] = useState(DEFAULT_SITE_STATS);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/configuracoes", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data: Record<string, string>) => {
        if (cancelled) return;
        setStats({
          anos: parseStat(data.stat_anos, DEFAULT_SITE_STATS.anos),
          clientes: parseStat(data.stat_clientes, DEFAULT_SITE_STATS.clientes),
          atendimentos: parseStat(data.stat_atendimentos, DEFAULT_SITE_STATS.atendimentos),
          contratos: parseStat(data.stat_contratos, DEFAULT_SITE_STATS.contratos),
        });
      })
      .catch(() => undefined);

    return () => { cancelled = true; };
  }, []);

  return stats;
}
