"use client";

import { useEffect, useState } from "react";

type SolucaoItem = { tag: string; title: string; img: string };
type ProjetoItem = { tag: string; title: string; desc: string; img: string };
type DepoimentoItem = { quote: string; name: string; role: string; img: string };
type ProcessoItem = { tag: string; num: string; title: string; desc: string; img: string };
type PessoaItem = { name: string; role: string; image: string; description: string };

const imgSeguranca = "https://www.figma.com/api/mcp/asset/2b52e036-221e-4f5a-8778-1cc8b79efa43.png";
const imgEletrica = "https://www.figma.com/api/mcp/asset/d3e2eeae-0a96-4f8a-ba1a-81d8db3d0e80.png";
const imgManutencao = "https://www.figma.com/api/mcp/asset/562c812c-2956-49e9-acc0-75e3799974ba.png";
const imgProcesso1 = "https://www.figma.com/api/mcp/asset/40b208b2-4705-41f6-87fa-e3163ec0ad04.png";
const imgProcesso2 = "https://www.figma.com/api/mcp/asset/d1f01abb-67b1-4766-87a4-1859b899c866.png";
const imgProcesso3 = "https://www.figma.com/api/mcp/asset/c7331991-be64-45b2-9eb9-1b4666423c72.png";
const imgProcesso4 = "https://www.figma.com/api/mcp/asset/38dbf60b-b270-42d6-8210-f4845ec11901.png";
const imgProjeto1 = "https://www.figma.com/api/mcp/asset/83919e4a-7dfd-4ca6-9e70-5548c346cf74.png";
const imgProjeto2 = "https://www.figma.com/api/mcp/asset/633f4998-b903-46df-b005-4dc03bde51b3.png";
const imgProjeto3 = "https://www.figma.com/api/mcp/asset/dc56e5a5-abf4-44c8-b560-d7e988aa657a.png";
const imgDep1 = "https://www.figma.com/api/mcp/asset/2a34a719-456c-45bc-9dc1-67201a7757ac.png";
const imgDep2 = "https://www.figma.com/api/mcp/asset/d1f01abb-67b1-4766-87a4-1859b899c866.png";
const imgDep3 = "https://www.figma.com/api/mcp/asset/2b52e036-221e-4f5a-8778-1cc8b79efa43.png";

const DEFAULT_SOLUCOES: SolucaoItem[] = [
  { tag: "Segurança eletrônica", title: "Video monitoramento, controle de acesso, alarmes e automação.", img: imgSeguranca },
  { tag: "Instalações elétricas", title: "Infraestrutura elétrica, painéis de comando e manutenção predial.", img: imgEletrica },
  { tag: "Manutenção recorrente", title: "Presença recorrente. Corretiva, preventiva e preditiva.", img: imgManutencao },
];

const DEFAULT_PROJETOS: ProjetoItem[] = [
  { tag: "Segurança eletrônica", title: "Condomínio Residencial, Mauá SP", desc: "Implantação de sistema de CFTV com IA, controle de acesso facial e automação de portão. Manutenção recorrente desde 2022.", img: imgProjeto1 },
  { tag: "Instalação elétrica", title: "Empresa de reciclagem, Grande ABC", desc: "Projeto e execução de painel de comando industrial e infraestrutura elétrica de baixa tensão.", img: imgProjeto2 },
  { tag: "Manutenção predial", title: "Condomínio Comercial, São Bernardo do Campo SP", desc: "Contrato de manutenção corretiva, preventiva e preditiva de sistemas elétricos e eletrônicos. Parceria ativa há 4 anos.", img: imgProjeto3 },
];

const DEFAULT_CLIENTES: string[] = [
  "/logos/Company logo.svg",
  "/logos/Company logo-1.svg",
  "/logos/Company logo-2.svg",
  "/logos/Company logo-3.svg",
  "/logos/Company logo-4.svg",
  "/logos/Company logo-5.svg",
];

const DEFAULT_DEPOIMENTOS: DepoimentoItem[] = [
  { quote: "Diferente de outras empresas que a gente já contratou, a Instalsat não sumiu depois da instalação. Qualquer problema, a Equipe atende.", name: "Fausto Mazzatto", role: "Síndico — Condomínio Celta", img: imgDep1 },
  { quote: "Indico para todos os condomínios da minha carteira sem hesitar. Nunca tive problema de retrabalho nem de prazo.", name: "Alethia Machado", role: "Síndica — Condomínio Celta", img: imgDep2 },
  { quote: "A proposta deles é diferente. Eles vêm, analisam, e apresentam uma solução pensada pro nosso prédio. Não é uma lista de preços.", name: "Mariana Moran", role: "Síndica — Condomínio Celta", img: imgDep3 },
  { quote: "Diferente de outras empresas que a gente já contratou, a Instalsat não sumiu depois da instalação. Qualquer problema, a Equipe atende.", name: "Fausto Mazzatto", role: "Síndico — Condomínio Celta", img: imgDep1 },
];

const DEFAULT_PROCESSOS: ProcessoItem[] = [
  { tag: "Diagnóstico", num: "01", title: "Visita Técnica", desc: "Todo projeto começa por um diagnóstico real. Nenhuma proposta sai de tabela genérica.", img: imgProcesso1 },
  { tag: "Execução", num: "02", title: "Execução estruturada", desc: "Roadmap claro, etapas definidas, responsabilidade técnica do início ao fim.", img: imgProcesso2 },
  { tag: "Recorrência", num: "03", title: "Acompanhamento", desc: "Visitas programadas, diagnóstico preventivo, atendimento antes que o problema apareça.", img: imgProcesso3 },
  { tag: "Presença", num: "04", title: "Presença contínua", desc: "O relacionamento não termina na nota fiscal. A Instalsat permanece.", img: imgProcesso4 },
];

const DEFAULT_PESSOAS: PessoaItem[] = [
  { name: "Fernando Nunes", role: "Fundador e Consultor Técnico", image: "/institucional/asset-04.jpg", description: "Fundador da Instalsat em 1998, Fernando construiu a reputação da empresa projeto a projeto durante mais de duas décadas. Responsável pelo desenvolvimento técnico e pela expertise que define os padrões de execução da Instalsat até hoje." },
  { name: "Thiago Nunes", role: "Diretor de Operações", image: "/institucional/asset-06.jpg", description: "Engenheiro elétrico em formação, Thiago lidera a operação comercial e a gestão da Instalsat. Responsável pela estruturação dos processos, expansão do portfólio e pelo relacionamento com administradoras e clientes corporativos." },
];

export const DEFAULT_CONTEUDO_INSTITUCIONAL: Record<string, string> = {
  home_hero_eyebrow: "A empresa que fica",
  home_hero_titulo: "Para administradoras, síndicos e construtoras",
  home_hero_paragrafo: "Segurança eletrônica e manutenção elétrica que não acabam quando a instalação termina.",

  cta_titulo: "Pronto para ter uma empresa que fica",
  cta_paragrafo: "Fale com a Instalsat e entenda como podemos estruturar a segurança e a infraestrutura do seu condomínio ou empresa.",

  institucional_hero_eyebrow: "Sobre a Instalsat",
  institucional_hero_titulo: "Quase três décadas construindo infraestrutura que funciona",
  institucional_hero_paragrafo: "Do Grande ABC para todo o estado. Da instalação à manutenção contínua. Da figura do fundador para uma empresa que opera com método, estrutura e presença.",

  institucional_historia_titulo: "1998. Uma empresa que nasceu resolvendo o que outros não conseguiam",
  institucional_historia_paragrafo_1: "A Instalsat foi fundada em Mauá, no Grande ABC paulista, num momento em que segurança eletrônica e infraestrutura elétrica eram territórios separados e mal atendidos. Desde o início, a empresa se recusou a operar com soluções de prateleira. Cada projeto exigia diagnóstico real, proposta construída sob medida e execução técnica sem atalhos.",
  institucional_historia_paragrafo_2: "Esse modelo gerou algo raro no setor: clientes que ficaram. Condomínios que renovam contratos há mais de uma década. Administradoras que indicam sem hesitar. Uma reputação construída projeto a projeto, sem marketing, sem site, sem Instagram. Só entrega.",
  institucional_historia_paragrafo_3: "Hoje, com mais de 28 anos de operação, a Instalsat passa por um movimento deliberado: transformar a solidez que sempre existiu em algo visível. Estruturar o que já funcionava. Comunicar o que sempre foi verdade.",
  institucional_historia_paragrafo_4: "O nome continua. O resto é novo.",

  institucional_pilar_1_titulo: "Missão",
  institucional_pilar_1_texto: "Entregar soluções técnicas seguras e duradouras, com diagnóstico real, execução responsável e presença contínua ao lado de cada cliente.",
  institucional_pilar_2_titulo: "Visão",
  institucional_pilar_2_texto: "Ser reconhecida como a empresa de infraestrutura que permanece, referência em confiança, método e relacionamento no estado de São Paulo.",
  institucional_pilar_3_titulo: "Valores",
  institucional_pilar_3_texto: "Responsabilidade técnica, transparência, compromisso com o cliente, qualidade sem atalhos e relações construídas para durar.",

  footer_tagline: "A empresa que fica",
  footer_whatsapp_numero: "(11) 4541-1316",
  footer_telefone_numero: "[11] 43901-2345",
  footer_email: "contato@instalsat.com.br",
  footer_copyright: "© 2026 • Instalsat Eletrônica Ltda • 02.515.886/0001-31 • Todos os direitos reservados",
};

function useFetchedList<TDb, TLocal>(endpoint: string, fallback: TLocal[], map: (item: TDb) => TLocal) {
  const [data, setData] = useState<TLocal[]>(fallback);

  useEffect(() => {
    let cancelled = false;

    fetch(endpoint, { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((items: TDb[]) => {
        if (cancelled || !Array.isArray(items) || items.length === 0) return;
        setData(items.map(map));
      })
      .catch(() => undefined);

    return () => { cancelled = true; };
  }, [endpoint]);

  return data;
}

export function useSolucoesDestaque() {
  return useFetchedList<{ categoria: string; titulo: string; imagemUrl: string | null }, SolucaoItem>(
    "/api/solucoes",
    DEFAULT_SOLUCOES,
    (item) => ({ tag: item.categoria, title: item.titulo, img: item.imagemUrl || "" })
  );
}

export function useProjetosDestaque() {
  return useFetchedList<{ categoria: string; titulo: string; descricao: string; imagemUrl: string | null }, ProjetoItem>(
    "/api/projetos",
    DEFAULT_PROJETOS,
    (item) => ({ tag: item.categoria, title: item.titulo, desc: item.descricao, img: item.imagemUrl || "" })
  );
}

export function useClientes() {
  return useFetchedList<{ logoUrl: string }, string>(
    "/api/clientes",
    DEFAULT_CLIENTES,
    (item) => item.logoUrl
  );
}

export function useDepoimentos() {
  return useFetchedList<{ texto: string; nome: string; cargo: string; fotoUrl: string | null }, DepoimentoItem>(
    "/api/depoimentos",
    DEFAULT_DEPOIMENTOS,
    (item) => ({ quote: item.texto, name: item.nome, role: item.cargo, img: item.fotoUrl || "" })
  );
}

export function useProcessos() {
  return useFetchedList<{ categoria: string; numero: string; titulo: string; descricao: string; imagemUrl: string | null }, ProcessoItem>(
    "/api/processos",
    DEFAULT_PROCESSOS,
    (item) => ({ tag: item.categoria, num: item.numero, title: item.titulo, desc: item.descricao, img: item.imagemUrl || "" })
  );
}

export function usePessoas() {
  return useFetchedList<{ nome: string; cargo: string; descricao: string; imagemUrl: string | null }, PessoaItem>(
    "/api/pessoas",
    DEFAULT_PESSOAS,
    (item) => ({ name: item.nome, role: item.cargo, description: item.descricao, image: item.imagemUrl || "" })
  );
}

export function useConteudoInstitucional() {
  const [conteudo, setConteudo] = useState<Record<string, string>>(DEFAULT_CONTEUDO_INSTITUCIONAL);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/conteudo-institucional", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data: Record<string, string>) => {
        if (cancelled) return;
        setConteudo((current) => ({ ...current, ...data }));
      })
      .catch(() => undefined);

    return () => { cancelled = true; };
  }, []);

  return conteudo;
}
