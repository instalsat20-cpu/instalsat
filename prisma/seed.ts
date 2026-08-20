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

  const solucoes = [
    { categoria: "Segurança eletrônica", titulo: "Video monitoramento, controle de acesso, alarmes e automação.", descricao: "Video monitoramento, controle de acesso, alarmes e automação.", imagemUrl: "https://www.figma.com/api/mcp/asset/2b52e036-221e-4f5a-8778-1cc8b79efa43.png", destaqueHome: true, ordem: 0 },
    { categoria: "Instalações elétricas", titulo: "Infraestrutura elétrica, painéis de comando e manutenção predial.", descricao: "Infraestrutura elétrica, painéis de comando e manutenção predial.", imagemUrl: "https://www.figma.com/api/mcp/asset/d3e2eeae-0a96-4f8a-ba1a-81d8db3d0e80.png", destaqueHome: true, ordem: 1 },
    { categoria: "Manutenção recorrente", titulo: "Presença recorrente. Corretiva, preventiva e preditiva.", descricao: "Presença recorrente. Corretiva, preventiva e preditiva.", imagemUrl: "https://www.figma.com/api/mcp/asset/562c812c-2956-49e9-acc0-75e3799974ba.png", destaqueHome: true, ordem: 2 },
  ];

  if ((await prisma.solucao.count()) === 0) {
    await prisma.solucao.createMany({ data: solucoes });
    console.log(`${solucoes.length} soluções criadas.`);
  } else {
    console.log("Soluções já populadas, seed ignorado.");
  }

  const projetosHome = [
    { categoria: "Segurança eletrônica", titulo: "Condomínio Residencial, Mauá SP", descricao: "Implantação de sistema de CFTV com IA, controle de acesso facial e automação de portão. Manutenção recorrente desde 2022.", imagemUrl: "https://www.figma.com/api/mcp/asset/83919e4a-7dfd-4ca6-9e70-5548c346cf74.png", destaqueHome: true, ordem: 0 },
    { categoria: "Instalação elétrica", titulo: "Empresa de reciclagem, Grande ABC", descricao: "Projeto e execução de painel de comando industrial e infraestrutura elétrica de baixa tensão.", imagemUrl: "https://www.figma.com/api/mcp/asset/633f4998-b903-46df-b005-4dc03bde51b3.png", destaqueHome: true, ordem: 1 },
    { categoria: "Manutenção predial", titulo: "Condomínio Comercial, São Bernardo do Campo SP", descricao: "Contrato de manutenção corretiva, preventiva e preditiva de sistemas elétricos e eletrônicos. Parceria ativa há 4 anos.", imagemUrl: "https://www.figma.com/api/mcp/asset/dc56e5a5-abf4-44c8-b560-d7e988aa657a.png", destaqueHome: true, ordem: 2 },
  ];

  if ((await prisma.projeto.count()) === 0) {
    await prisma.projeto.createMany({ data: projetosHome });
    console.log(`${projetosHome.length} projetos criados.`);
  } else {
    console.log("Projetos já populados, seed ignorado.");
  }

  const clientes = [
    { nome: "Cliente 1", logoUrl: "/logos/Company logo.svg", ordem: 0 },
    { nome: "Cliente 2", logoUrl: "/logos/Company logo-1.svg", ordem: 1 },
    { nome: "Cliente 3", logoUrl: "/logos/Company logo-2.svg", ordem: 2 },
    { nome: "Cliente 4", logoUrl: "/logos/Company logo-3.svg", ordem: 3 },
    { nome: "Cliente 5", logoUrl: "/logos/Company logo-4.svg", ordem: 4 },
    { nome: "Cliente 6", logoUrl: "/logos/Company logo-5.svg", ordem: 5 },
  ];

  if ((await prisma.cliente.count()) === 0) {
    await prisma.cliente.createMany({ data: clientes });
    console.log(`${clientes.length} clientes criados.`);
  } else {
    console.log("Clientes já populados, seed ignorado.");
  }

  // Nota: o 4º item repete o 1º de propósito — é o dado exato hoje hardcoded
  // no carrossel da Home (mantido para não alterar o comportamento visual).
  const depoimentos = [
    { texto: "Diferente de outras empresas que a gente já contratou, a Instalsat não sumiu depois da instalação. Qualquer problema, a Equipe atende.", nome: "Fausto Mazzatto", cargo: "Síndico — Condomínio Celta", fotoUrl: "https://www.figma.com/api/mcp/asset/2a34a719-456c-45bc-9dc1-67201a7757ac.png", ordem: 0 },
    { texto: "Indico para todos os condomínios da minha carteira sem hesitar. Nunca tive problema de retrabalho nem de prazo.", nome: "Alethia Machado", cargo: "Síndica — Condomínio Celta", fotoUrl: "https://www.figma.com/api/mcp/asset/d1f01abb-67b1-4766-87a4-1859b899c866.png", ordem: 1 },
    { texto: "A proposta deles é diferente. Eles vêm, analisam, e apresentam uma solução pensada pro nosso prédio. Não é uma lista de preços.", nome: "Mariana Moran", cargo: "Síndica — Condomínio Celta", fotoUrl: "https://www.figma.com/api/mcp/asset/2b52e036-221e-4f5a-8778-1cc8b79efa43.png", ordem: 2 },
    { texto: "Diferente de outras empresas que a gente já contratou, a Instalsat não sumiu depois da instalação. Qualquer problema, a Equipe atende.", nome: "Fausto Mazzatto", cargo: "Síndico — Condomínio Celta", fotoUrl: "https://www.figma.com/api/mcp/asset/2a34a719-456c-45bc-9dc1-67201a7757ac.png", ordem: 3 },
  ];

  if ((await prisma.depoimento.count()) === 0) {
    await prisma.depoimento.createMany({ data: depoimentos });
    console.log(`${depoimentos.length} depoimentos criados.`);
  } else {
    console.log("Depoimentos já populados, seed ignorado.");
  }

  let patriciaLima = await prisma.depoimento.findFirst({ where: { nome: "Patricia Lima" } });
  if (!patriciaLima) {
    patriciaLima = await prisma.depoimento.create({
      data: {
        texto: "Antes da Instalsat, cada problema virava uma dor de cabeça diferente. Hoje eu sei que tem alguém responsável por tudo isso. A tranquilidade que isso traz para a gestão do condomínio não tem preço.",
        nome: "Patricia Lima",
        cargo: "Síndica, Condomínio Residencial",
        fotoUrl: "/projetos/testimonial-patricia.jpg",
        ativo: true,
        ordem: 4,
      },
    });
    console.log("Depoimento de Patricia Lima criado.");
  } else {
    console.log("Depoimento de Patricia Lima já existe, seed ignorado.");
  }

  const projetosCases = [
    {
      categoria: "Segurança Eletrônica",
      titulo: "Condomínio Residencial, Mauá SP",
      descricao: [
        "O condomínio enfrentava problemas recorrentes de segurança perimetral e não tinha visibilidade sobre o fluxo de entrada e saída de veículos e visitantes. A administradora buscava uma solução integrada que eliminasse pontos cegos e reduzisse a dependência de porteiros para o controle de acesso.",
        "A Instalsat realizou o diagnóstico completo da infraestrutura existente e propôs a implantação de um sistema de CFTV com inteligência artificial, capaz de identificar rostos e placas em tempo real. O projeto incluiu ainda controle de acesso facial nas entradas sociais e automação completa do portão de veículos. Desde a entrega, a Instalsat mantém contrato de manutenção recorrente, com visitas programadas e atendimento prioritário para chamados.",
      ].join("\n\n"),
      imagemUrl: "/projetos/case-01.png",
      destaqueHome: false,
      ordem: 0,
      depoimentoId: patriciaLima.id,
    },
    {
      categoria: "Instalações Elétricas",
      titulo: "Condomínio Comercial, Santo André SP",
      descricao: "Com uma infraestrutura elétrica antiga e fora das normas vigentes, o condomínio corria riscos técnicos e legais que comprometiam a operação dos lojistas e a segurança do edifício. A administradora precisava de uma empresa que assumisse o projeto com responsabilidade técnica total, da documentação à execução. A Instalsat desenvolveu o projeto elétrico completo, substituiu o painel de distribuição principal e executou a infraestrutura de baixa tensão em todas as áreas comuns. Todo o trabalho foi entregue dentro do prazo acordado, acompanhado de documentação técnica completa e emissão de ART. O condomínio opera hoje dentro das normas e com um sistema elétrico dimensionado para os próximos anos.",
      imagemUrl: "/projetos/case-04.png",
      destaqueHome: false,
      ordem: 1,
    },
    {
      categoria: "Manutenção Predial",
      titulo: "Condomínio Residencial, São Bernardo do Campo SP",
      descricao: "A síndica profissional responsável pelo condomínio tinha um histórico frustrante com prestadores que atendiam bem no início e sumiam após os primeiros meses. Ela buscava um parceiro que assumisse a manutenção com método e previsibilidade, sem surpresas no orçamento nem espera longa para atendimento. A Instalsat assumiu o contrato de manutenção nas modalidades corretiva, preventiva e preditiva, cobrindo todos os sistemas elétricos e eletrônicos do condomínio. Com visitas programadas mensalmente e relatórios de acompanhamento a cada ciclo, a gestão da síndica passou a ter visibilidade total sobre o estado da infraestrutura. A parceria está ativa há mais de três anos, com renovação contratual consecutiva.",
      imagemUrl: "/projetos/case-02.png",
      destaqueHome: false,
      ordem: 2,
    },
    {
      categoria: "Segurança Eletrônica",
      titulo: "Empresa de Reciclagem, Grande ABC",
      descricao: "A empresa operava em uma área industrial com alto fluxo de veículos pesados e colaboradores em turnos alternados, sem nenhum sistema estruturado de monitoramento ou controle de acesso. A ausência de registro de entrada e saída gerava problemas operacionais e riscos de segurança que impactavam diretamente a operação. A Instalsat projetou e implantou um sistema de alarme perimetral com barreiras de infravermelho e cercas elétricas de alta confiabilidade, cobrindo todo o perímetro da área industrial. O controle de acesso foi implementado com tecnologia RFID para leitura automática de tags de frotas e crachás de colaboradores. O sistema de CFTV instalado permite monitoramento remoto em tempo real de qualquer dispositivo conectado à internet.",
      imagemUrl: "/projetos/case-05.png",
      destaqueHome: false,
      ordem: 3,
    },
    {
      categoria: "Manutenção Predial",
      titulo: "Condomínio Residencial, Mauá SP",
      descricao: [
        "O condomínio apresentava falhas recorrentes no sistema de iluminação de emergência e portões com manutenção irregular, problemas que geravam reclamações constantes dos moradores e preocupação da administração com conformidade legal. A cada falha, o processo de contratação de um prestador avulso consumia tempo e gerava custos imprevisíveis.",
        "A Instalsat realizou a modernização completa do sistema de iluminação de emergência, substituindo equipamentos obsoletos e adequando as instalações às normas técnicas vigentes. Os portões de veículos passaram por revisão geral com troca de componentes desgastados e ajuste de automação. Com o contrato de manutenção preventiva em vigor, as visitas são programadas e o atendimento de chamados ocorre em até 24 horas, eliminando as surpresas que comprometiam o orçamento do condomínio.",
      ].join("\n\n"),
      imagemUrl: "/projetos/case-03.png",
      destaqueHome: false,
      ordem: 4,
      depoimentoId: patriciaLima.id,
    },
  ];

  if ((await prisma.projeto.count({ where: { destaqueHome: false } })) === 0) {
    await prisma.projeto.createMany({ data: projetosCases });
    console.log(`${projetosCases.length} cases de projeto criados.`);
  } else {
    console.log("Cases de projeto já populados, seed ignorado.");
  }

  const faqs = [
    { pergunta: "Qual é a área de atendimento da Instalsat?", resposta: "Atendemos condomínios, administradoras e empresas em todo o Grande ABC e, para contratos de manutenção recorrente, em diversas regiões do estado de São Paulo.", ordem: 0 },
    { pergunta: "Como funciona o processo para contratar um serviço?", resposta: "Começamos com uma visita técnica para diagnóstico real da estrutura. A partir disso, montamos uma proposta sob medida — nunca uma tabela genérica — e, após aprovação, seguimos com execução acompanhada e documentação técnica completa.", ordem: 1 },
    { pergunta: "A Instalsat atende chamados de emergência?", resposta: "Sim. Clientes com contrato de manutenção recorrente têm atendimento prioritário, com prazo de resposta de até 24 horas para chamados urgentes.", ordem: 2 },
    { pergunta: "Vocês trabalham com contratos de manutenção recorrente?", resposta: "Sim, é uma das nossas principais frentes. Trabalhamos com manutenção corretiva, preventiva e preditiva, com visitas programadas e relatórios de acompanhamento a cada ciclo.", ordem: 3 },
    { pergunta: "Qual o prazo médio de resposta após o contato?", resposta: "Nosso time normalmente responde em até 1 dia útil para agendar a visita técnica de diagnóstico inicial.", ordem: 4 },
    { pergunta: "A Instalsat fornece laudo técnico e ART?", resposta: "Sim. Todos os projetos de instalação elétrica são entregues com documentação técnica completa e emissão de ART, garantindo conformidade legal e segurança para o cliente.", ordem: 5 },
  ];

  if ((await prisma.faq.count()) === 0) {
    await prisma.faq.createMany({ data: faqs });
    console.log(`${faqs.length} perguntas frequentes criadas.`);
  } else {
    console.log("FAQ já populada, seed ignorado.");
  }

  const blocosProjetosContato = [
    { chave: "projetos_hero_eyebrow", valor: "Projetos realizados", label: "Selo acima do título (Hero Projetos)", grupo: "Projetos — Hero" },
    { chave: "projetos_hero_titulo_1", valor: "Infraestrutura que funciona", label: "Título principal, parte 1 (Hero Projetos)", grupo: "Projetos — Hero" },
    { chave: "projetos_hero_titulo_2", valor: "Projetos que ficam", label: "Título principal, parte 2 (Hero Projetos)", grupo: "Projetos — Hero" },
    { chave: "projetos_hero_paragrafo", valor: "Cada projeto começa por um diagnóstico real e termina com uma estrutura que a Instalsat continua acompanhando. Aqui estão alguns dos trabalhos que executamos para condomínios, administradoras e empresas da região.", label: "Parágrafo do Hero (Projetos)", grupo: "Projetos — Hero" },

    { chave: "contato_hero_eyebrow", valor: "Entre em contato", label: "Selo acima do título (Hero Contato)", grupo: "Contato — Hero" },
    { chave: "contato_hero_titulo", valor: "Antes de falar com a gente, talvez a resposta já esteja aqui", label: "Título principal (Hero Contato)", grupo: "Contato — Hero" },
    { chave: "contato_hero_paragrafo", valor: "Reunimos as dúvidas mais comuns de quem está conhecendo a Instalsat. Se não encontrar o que precisa, use o formulário ou fale direto pelo WhatsApp.", label: "Parágrafo do Hero (Contato)", grupo: "Contato — Hero" },
  ];

  for (const bloco of blocosProjetosContato) {
    await prisma.blocoConteudo.upsert({
      where: { chave: bloco.chave },
      update: { valor: bloco.valor, label: bloco.label, grupo: bloco.grupo },
      create: bloco,
    });
  }
  console.log(`${blocosProjetosContato.length} blocos de conteúdo (Projetos/Contato) sincronizados.`);

  await prisma.configuracao.upsert({
    where: { chave: "contato_email_destino" },
    update: {},
    create: { chave: "contato_email_destino", valor: "" },
  });
  console.log("Configuração contato_email_destino garantida.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());