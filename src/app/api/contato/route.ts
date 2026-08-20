import { prisma } from "@/lib/prisma";
import { resend, RESEND_FROM } from "@/lib/resend";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DESTINO_DOMAIN = "@instalsat.com.br";

export async function POST(request: Request) {
  const body = await request.json();
  const { nome, telefone, email, cidade, estado, assunto, mensagem } = body as Record<string, string | undefined>;

  if (!nome?.trim() || !telefone?.trim() || !email?.trim() || !assunto?.trim() || !mensagem?.trim()) {
    return Response.json({ error: "Preencha nome, telefone, e-mail, assunto e mensagem." }, { status: 400 });
  }
  if (!EMAIL_REGEX.test(email.trim())) {
    return Response.json({ error: "Informe um e-mail válido." }, { status: 400 });
  }

  const lead = await prisma.lead.create({
    data: {
      nome: nome.trim(),
      email: email.trim(),
      telefone: telefone.trim(),
      cidade: cidade?.trim() || null,
      estado: estado?.trim() || null,
      assunto: assunto.trim(),
      mensagem: mensagem.trim(),
    },
  });

  const destinoConfig = await prisma.configuracao.findUnique({ where: { chave: "contato_email_destino" } });
  const destino = destinoConfig?.valor?.trim();

  if (!resend) {
    console.error("[contato] Envio de e-mail pulado: RESEND_API_KEY não configurada.");
    return Response.json({ ok: true, leadId: lead.id });
  }

  if (!destino || !destino.toLowerCase().endsWith(DESTINO_DOMAIN)) {
    console.error(`[contato] Envio de e-mail pulado: e-mail de destino não configurado ou fora do domínio ${DESTINO_DOMAIN} (valor atual: ${destino || "vazio"}).`);
    return Response.json({ ok: true, leadId: lead.id });
  }

  try {
    const result = await resend.emails.send({
      from: RESEND_FROM,
      to: destino,
      replyTo: email.trim(),
      subject: `Novo contato via site — ${assunto.trim()}`,
      text: [
        `Nome: ${nome.trim()}`,
        `Telefone: ${telefone.trim()}`,
        `E-mail: ${email.trim()}`,
        cidade || estado ? `Local: ${[cidade, estado].filter(Boolean).join(" - ")}` : null,
        `Assunto: ${assunto.trim()}`,
        "",
        mensagem.trim(),
      ].filter(Boolean).join("\n"),
    });

    if (result.error) {
      console.error("[contato] Falha ao enviar e-mail via Resend:", result.error);
    } else {
      await prisma.lead.update({ where: { id: lead.id }, data: { emailEnviado: true } });
    }
  } catch (error) {
    console.error("[contato] Falha inesperada ao enviar e-mail via Resend:", error);
  }

  return Response.json({ ok: true, leadId: lead.id });
}
