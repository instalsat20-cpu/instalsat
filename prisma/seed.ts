import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const senha = await bcrypt.hash("metacube2026", 10);

  const studio = await prisma.user.upsert({
    where: { email: "alison@metacube.me" },
    update: { password: senha },
    create: {
      name: "Alison — MetaCube Studio",
      email: "alison@metacube.me",
      password: senha,
      role: "STUDIO",
    },
  });

  console.log("Usuário studio criado:", studio.email);

  const integrations = await prisma.marketingIntegrations.findFirst();
  if (!integrations) {
    await prisma.marketingIntegrations.create({ data: { id: "singleton" } });
    console.log("Registro de integrações de marketing criado.");
  }

  const processos = [
    {
      categoria: "Diagnóstico",
      numero: "01",
      titulo: "Visita Técnica",
      descricao: "Todo projeto começa por um diagnóstico real. Nenhuma proposta sai de tabela genérica.",
      imagemUrl: "https://www.figma.com/api/mcp/asset/40b208b2-4705-41f6-87fa-e3163ec0ad04.png",
      ordem: 0,
    },
    {
      categoria: "Execução",
      numero: "02",
      titulo: "Execução estruturada",
      descricao: "Roadmap claro, etapas definidas, responsabilidade técnica do início ao fim.",
      imagemUrl: "https://www.figma.com/api/mcp/asset/d1f01abb-67b1-4766-87a4-1859b899c866.png",
      ordem: 1,
    },
    {
      categoria: "Recorrência",
      numero: "03",
      titulo: "Acompanhamento",
      descricao: "Visitas programadas, diagnóstico preventivo, atendimento antes que o problema apareça.",
      imagemUrl: "https://www.figma.com/api/mcp/asset/c7331991-be64-45b2-9eb9-1b4666423c72.png",
      ordem: 2,
    },
    {
      categoria: "Presença",
      numero: "04",
      titulo: "Presença contínua",
      descricao: "O relacionamento não termina na nota fiscal. A Instalsat permanece.",
      imagemUrl: "https://www.figma.com/api/mcp/asset/38dbf60b-b270-42d6-8210-f4845ec11901.png",
      ordem: 3,
    },
  ];

  if ((await prisma.processo.count()) === 0) {
    await prisma.processo.createMany({ data: processos });
    console.log(`${processos.length} processos criados.`);
  } else {
    console.log("Processos já populados, seed ignorado.");
  }

  const pessoas = [
    {
      nome: "Fernando Nunes",
      cargo: "Fundador e Consultor Técnico",
      descricao: "Fundador da Instalsat em 1998, Fernando construiu a reputação da empresa projeto a projeto durante mais de duas décadas. Responsável pelo desenvolvimento técnico e pela expertise que define os padrões de execução da Instalsat até hoje.",
      imagemUrl: "/institucional/asset-04.jpg",
      ordem: 0,
    },
    {
      nome: "Thiago Nunes",
      cargo: "Diretor de Operações",
      descricao: "Engenheiro elétrico em formação, Thiago lidera a operação comercial e a gestão da Instalsat. Responsável pela estruturação dos processos, expansão do portfólio e pelo relacionamento com administradoras e clientes corporativos.",
      imagemUrl: "/institucional/asset-06.jpg",
      ordem: 1,
    },
  ];

  if ((await prisma.pessoa.count()) === 0) {
    await prisma.pessoa.createMany({ data: pessoas });
    console.log(`${pessoas.length} pessoas criadas.`);
  } else {
    console.log("Pessoas já populadas, seed ignorado.");
  }

  const blocosConteudo = [
    { chave: "home_hero_eyebrow", valor: "A empresa que fica", label: "Selo acima do título (Hero Home)", grupo: "Home — Hero" },
    { chave: "home_hero_titulo", valor: "Para administradoras, síndicos e construtoras", label: "Título principal do Hero (Home)", grupo: "Home — Hero" },
    { chave: "home_hero_paragrafo", valor: "Segurança eletrônica e manutenção elétrica que não acabam quando a instalação termina.", label: "Parágrafo do Hero (Home)", grupo: "Home — Hero" },

    { chave: "cta_titulo", valor: "Pronto para ter uma empresa que fica", label: "Título da chamada final (CTA)", grupo: "CTA final (Home e Institucional)" },
    { chave: "cta_paragrafo", valor: "Fale com a Instalsat e entenda como podemos estruturar a segurança e a infraestrutura do seu condomínio ou empresa.", label: "Texto da chamada final (CTA)", grupo: "CTA final (Home e Institucional)" },

    { chave: "institucional_hero_eyebrow", valor: "Sobre a Instalsat", label: "Selo acima do título (Hero Institucional)", grupo: "Institucional — Hero" },
    { chave: "institucional_hero_titulo", valor: "Quase três décadas construindo infraestrutura que funciona", label: "Título principal do Hero (Institucional)", grupo: "Institucional — Hero" },
    { chave: "institucional_hero_paragrafo", valor: "Do Grande ABC para todo o estado. Da instalação à manutenção contínua. Da figura do fundador para uma empresa que opera com método, estrutura e presença.", label: "Parágrafo do Hero (Institucional)", grupo: "Institucional — Hero" },

    { chave: "institucional_historia_titulo", valor: "1998. Uma empresa que nasceu resolvendo o que outros não conseguiam", label: "Título da seção Nossa História", grupo: "Institucional — Nossa história" },
    { chave: "institucional_historia_paragrafo_1", valor: "A Instalsat foi fundada em Mauá, no Grande ABC paulista, num momento em que segurança eletrônica e infraestrutura elétrica eram territórios separados e mal atendidos. Desde o início, a empresa se recusou a operar com soluções de prateleira. Cada projeto exigia diagnóstico real, proposta construída sob medida e execução técnica sem atalhos.", label: "Parágrafo 1 da Nossa História", grupo: "Institucional — Nossa história" },
    { chave: "institucional_historia_paragrafo_2", valor: "Esse modelo gerou algo raro no setor: clientes que ficaram. Condomínios que renovam contratos há mais de uma década. Administradoras que indicam sem hesitar. Uma reputação construída projeto a projeto, sem marketing, sem site, sem Instagram. Só entrega.", label: "Parágrafo 2 da Nossa História", grupo: "Institucional — Nossa história" },
    { chave: "institucional_historia_paragrafo_3", valor: "Hoje, com mais de 28 anos de operação, a Instalsat passa por um movimento deliberado: transformar a solidez que sempre existiu em algo visível. Estruturar o que já funcionava. Comunicar o que sempre foi verdade.", label: "Parágrafo 3 da Nossa História", grupo: "Institucional — Nossa história" },
    { chave: "institucional_historia_paragrafo_4", valor: "O nome continua. O resto é novo.", label: "Parágrafo 4 da Nossa História", grupo: "Institucional — Nossa história" },

    { chave: "institucional_pilar_1_titulo", valor: "Missão", label: "Título do Pilar 1 (Missão)", grupo: "Institucional — Pilares" },
    { chave: "institucional_pilar_1_texto", valor: "Entregar soluções técnicas seguras e duradouras, com diagnóstico real, execução responsável e presença contínua ao lado de cada cliente.", label: "Texto do Pilar 1 (Missão)", grupo: "Institucional — Pilares" },
    { chave: "institucional_pilar_2_titulo", valor: "Visão", label: "Título do Pilar 2 (Visão)", grupo: "Institucional — Pilares" },
    { chave: "institucional_pilar_2_texto", valor: "Ser reconhecida como a empresa de infraestrutura que permanece, referência em confiança, método e relacionamento no estado de São Paulo.", label: "Texto do Pilar 2 (Visão)", grupo: "Institucional — Pilares" },
    { chave: "institucional_pilar_3_titulo", valor: "Valores", label: "Título do Pilar 3 (Valores)", grupo: "Institucional — Pilares" },
    { chave: "institucional_pilar_3_texto", valor: "Responsabilidade técnica, transparência, compromisso com o cliente, qualidade sem atalhos e relações construídas para durar.", label: "Texto do Pilar 3 (Valores)", grupo: "Institucional — Pilares" },

    { chave: "footer_tagline", valor: "A empresa que fica", label: "Frase abaixo do logo (Rodapé)", grupo: "Rodapé" },
    { chave: "footer_whatsapp_numero", valor: "(11) 4541-1316", label: "Número de WhatsApp (Rodapé)", grupo: "Rodapé" },
    { chave: "footer_telefone_numero", valor: "[11] 43901-2345", label: "Número de telefone (Rodapé)", grupo: "Rodapé" },
    { chave: "footer_email", valor: "contato@instalsat.com.br", label: "E-mail de contato (Rodapé)", grupo: "Rodapé" },
    { chave: "footer_copyright", valor: "© 2026 • Instalsat Eletrônica Ltda • 02.515.886/0001-31 • Todos os direitos reservados", label: "Texto de direitos autorais (Rodapé)", grupo: "Rodapé" },
  ];

  for (const bloco of blocosConteudo) {
    await prisma.blocoConteudo.upsert({
      where: { chave: bloco.chave },
      update: { valor: bloco.valor, label: bloco.label, grupo: bloco.grupo },
      create: bloco,
    });
  }
  console.log(`${blocosConteudo.length} blocos de conteúdo sincronizados.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());