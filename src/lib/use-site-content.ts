"use client";

import { useEffect, useState } from "react";
import type { Testimonial } from "@/components/ui/testimonial-modal";

type SolucaoItem = { tag: string; title: string; img: string };
type ProjetoItem = { tag: string; title: string; desc: string; img: string };
type DepoimentoItem = { quote: string; name: string; role: string; img: string };
type ProcessoItem = { tag: string; num: string; title: string; desc: string; img: string };
type PessoaItem = { name: string; role: string; image: string; description: string };
type FaqItem = { question: string; answer: string };
export type ProjetoCaseItem = { tag: string; title: string; img: string; paragraphs: string[]; testimonial?: Testimonial };

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

  projetos_hero_eyebrow: "Projetos realizados",
  projetos_hero_titulo_1: "Infraestrutura que funciona",
  projetos_hero_titulo_2: "Projetos que ficam",
  projetos_hero_paragrafo: "Cada projeto começa por um diagnóstico real e termina com uma estrutura que a Instalsat continua acompanhando. Aqui estão alguns dos trabalhos que executamos para condomínios, administradoras e empresas da região.",

  contato_hero_eyebrow: "Entre em contato",
  contato_hero_titulo: "Antes de falar com a gente, talvez a resposta já esteja aqui",
  contato_hero_paragrafo: "Reunimos as dúvidas mais comuns de quem está conhecendo a Instalsat. Se não encontrar o que precisa, use o formulário ou fale direto pelo WhatsApp.",
};

const testimonialMauaSP: Testimonial = {
  photo: "/projetos/testimonial-patricia.jpg",
  name: "Patricia Lima",
  role: "Síndica, Condomínio Residencial",
  project: "Condomínio Residencial, Mauá SP",
  quote: "\"Antes da Instalsat, cada problema virava uma dor de cabeça diferente. Hoje eu sei que tem alguém responsável por tudo isso. A tranquilidade que isso traz para a gestão do condomínio não tem preço.\"",
};

export const DEFAULT_PROJETOS_CASES: ProjetoCaseItem[] = [
  {
    tag: "Segurança Eletrônica",
    title: "Condomínio Residencial, Mauá SP",
    img: "/projetos/case-01.png",
    paragraphs: [
      "O condomínio enfrentava problemas recorrentes de segurança perimetral e não tinha visibilidade sobre o fluxo de entrada e saída de veículos e visitantes. A administradora buscava uma solução integrada que eliminasse pontos cegos e reduzisse a dependência de porteiros para o controle de acesso.",
      "A Instalsat realizou o diagnóstico completo da infraestrutura existente e propôs a implantação de um sistema de CFTV com inteligência artificial, capaz de identificar rostos e placas em tempo real. O projeto incluiu ainda controle de acesso facial nas entradas sociais e automação completa do portão de veículos. Desde a entrega, a Instalsat mantém contrato de manutenção recorrente, com visitas programadas e atendimento prioritário para chamados.",
    ],
    testimonial: testimonialMauaSP,
  },
  {
    tag: "Instalações Elétricas",
    title: "Condomínio Comercial, Santo André SP",
    img: "/projetos/case-04.png",
    paragraphs: [
      "Com uma infraestrutura elétrica antiga e fora das normas vigentes, o condomínio corria riscos técnicos e legais que comprometiam a operação dos lojistas e a segurança do edifício. A administradora precisava de uma empresa que assumisse o projeto com responsabilidade técnica total, da documentação à execução. A Instalsat desenvolveu o projeto elétrico completo, substituiu o painel de distribuição principal e executou a infraestrutura de baixa tensão em todas as áreas comuns. Todo o trabalho foi entregue dentro do prazo acordado, acompanhado de documentação técnica completa e emissão de ART. O condomínio opera hoje dentro das normas e com um sistema elétrico dimensionado para os próximos anos.",
    ],
  },
  {
    tag: "Manutenção Predial",
    title: "Condomínio Residencial, São Bernardo do Campo SP",
    img: "/projetos/case-02.png",
    paragraphs: [
      "A síndica profissional responsável pelo condomínio tinha um histórico frustrante com prestadores que atendiam bem no início e sumiam após os primeiros meses. Ela buscava um parceiro que assumisse a manutenção com método e previsibilidade, sem surpresas no orçamento nem espera longa para atendimento. A Instalsat assumiu o contrato de manutenção nas modalidades corretiva, preventiva e preditiva, cobrindo todos os sistemas elétricos e eletrônicos do condomínio. Com visitas programadas mensalmente e relatórios de acompanhamento a cada ciclo, a gestão da síndica passou a ter visibilidade total sobre o estado da infraestrutura. A parceria está ativa há mais de três anos, com renovação contratual consecutiva.",
    ],
  },
  {
    tag: "Segurança Eletrônica",
    title: "Empresa de Reciclagem, Grande ABC",
    img: "/projetos/case-05.png",
    paragraphs: [
      "A empresa operava em uma área industrial com alto fluxo de veículos pesados e colaboradores em turnos alternados, sem nenhum sistema estruturado de monitoramento ou controle de acesso. A ausência de registro de entrada e saída gerava problemas operacionais e riscos de segurança que impactavam diretamente a operação. A Instalsat projetou e implantou um sistema de alarme perimetral com barreiras de infravermelho e cercas elétricas de alta confiabilidade, cobrindo todo o perímetro da área industrial. O controle de acesso foi implementado com tecnologia RFID para leitura automática de tags de frotas e crachás de colaboradores. O sistema de CFTV instalado permite monitoramento remoto em tempo real de qualquer dispositivo conectado à internet.",
    ],
  },
  {
    tag: "Manutenção Predial",
    title: "Condomínio Residencial, Mauá SP",
    img: "/projetos/case-03.png",
    paragraphs: [
      "O condomínio apresentava falhas recorrentes no sistema de iluminação de emergência e portões com manutenção irregular, problemas que geravam reclamações constantes dos moradores e preocupação da administração com conformidade legal. A cada falha, o processo de contratação de um prestador avulso consumia tempo e gerava custos imprevisíveis.",
      "A Instalsat realizou a modernização completa do sistema de iluminação de emergência, substituindo equipamentos obsoletos e adequando as instalações às normas técnicas vigentes. Os portões de veículos passaram por revisão geral com troca de componentes desgastados e ajuste de automação. Com o contrato de manutenção preventiva em vigor, as visitas são programadas e o atendimento de chamados ocorre em até 24 horas, eliminando as surpresas que comprometiam o orçamento do condomínio.",
    ],
    testimonial: testimonialMauaSP,
  },
];

export const DEFAULT_FAQS: FaqItem[] = [
  {
    question: "Qual é a área de atendimento da Instalsat?",
    answer: "Atendemos condomínios, administradoras e empresas em todo o Grande ABC e, para contratos de manutenção recorrente, em diversas regiões do estado de São Paulo.",
  },
  {
    question: "Como funciona o processo para contratar um serviço?",
    answer: "Começamos com uma visita técnica para diagnóstico real da estrutura. A partir disso, montamos uma proposta sob medida — nunca uma tabela genérica — e, após aprovação, seguimos com execução acompanhada e documentação técnica completa.",
  },
  {
    question: "A Instalsat atende chamados de emergência?",
    answer: "Sim. Clientes com contrato de manutenção recorrente têm atendimento prioritário, com prazo de resposta de até 24 horas para chamados urgentes.",
  },
  {
    question: "Vocês trabalham com contratos de manutenção recorrente?",
    answer: "Sim, é uma das nossas principais frentes. Trabalhamos com manutenção corretiva, preventiva e preditiva, com visitas programadas e relatórios de acompanhamento a cada ciclo.",
  },
  {
    question: "Qual o prazo médio de resposta após o contato?",
    answer: "Nosso time normalmente responde em até 1 dia útil para agendar a visita técnica de diagnóstico inicial.",
  },
  {
    question: "A Instalsat fornece laudo técnico e ART?",
    answer: "Sim. Todos os projetos de instalação elétrica são entregues com documentação técnica completa e emissão de ART, garantindo conformidade legal e segurança para o cliente.",
  },
];

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

export function useFaqs() {
  return useFetchedList<{ pergunta: string; resposta: string }, FaqItem>(
    "/api/faq",
    DEFAULT_FAQS,
    (item) => ({ question: item.pergunta, answer: item.resposta })
  );
}

export function useProjetosCases() {
  return useFetchedList<{ categoria: string; titulo: string; descricao: string; imagemUrl: string | null; depoimento: { texto: string; nome: string; cargo: string; fotoUrl: string | null } | null }, ProjetoCaseItem>(
    "/api/projetos-cases",
    DEFAULT_PROJETOS_CASES,
    (item) => ({
      tag: item.categoria,
      title: item.titulo,
      img: item.imagemUrl || "",
      paragraphs: item.descricao.split("\n\n"),
      testimonial: item.depoimento
        ? { photo: item.depoimento.fotoUrl || "", name: item.depoimento.nome, role: item.depoimento.cargo, project: item.titulo, quote: item.depoimento.texto }
        : undefined,
    })
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
