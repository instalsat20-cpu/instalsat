import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Em breve | Instalsat",
  description: "O novo site da Instalsat está sendo preparado.",
  robots: { index: false, follow: false },
};

const whatsappUrl = "https://wa.me/551145411316";

export default function EmBrevePage() {
  return (
    <main className="flex min-h-[100svh] items-center justify-center overflow-hidden bg-[#003741] px-5 py-10 text-[#DCE3EC] sm:px-8 lg:min-h-screen lg:py-[50px]">
      <section className="flex w-full max-w-[1024px] flex-col items-center text-center">
        <div className="relative size-[190px] shrink-0 sm:size-[250px] lg:size-[338px]">
          <video
            autoPlay
            muted
            loop
            playsInline
            poster="/em-breve/logo-3d.png"
            aria-label="Símbolo tridimensional animado da Instalsat"
            className="size-full object-contain"
          >
            <source src="/em-breve/logo-3d.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="mt-1 flex w-full flex-col items-center lg:mt-0">
          <h1 className="text-[34px] font-medium leading-[1.08] tracking-[-0.02em] sm:text-[46px] lg:text-[56px] lg:leading-[54px]">
            Algo novo está chegando<span className="font-bold text-[#E05829]">.</span>
          </h1>
          <p className="mt-6 max-w-[983px] text-[14px] leading-[22px] text-[#DCE3EC] sm:text-[16px] sm:leading-[23px]">
            <span className="block">O novo site da Instalsat está sendo preparado.</span>
            <span className="block">Em breve, você encontra aqui tudo sobre nossas soluções em segurança eletrônica e infraestrutura elétrica.</span>
          </p>
        </div>

        <div className="mt-10 flex flex-col items-center lg:mt-[34px]">
          <p className="max-w-[270px] text-[15px] font-medium leading-6 sm:text-[17px]">
            Enquanto isso, fale com a gente diretamente pelo QR Code.
          </p>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="Abrir conversa com a Instalsat pelo WhatsApp usando o QR Code" className="mt-5 bg-white p-[11px] transition-transform hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E05829]">
            <Image src="/em-breve/qr-whatsapp.png" alt="QR Code para falar com a Instalsat pelo WhatsApp" width={97} height={97} className="size-[97px]" />
          </a>
        </div>

        <div className="mt-9 flex flex-col items-center gap-[13px] lg:mt-[35px]">
          <p className="text-[16px] leading-[27px] sm:text-[18px]">Ou clique no botão abaixo</p>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex h-[52px] items-center justify-center gap-5 bg-[#E05829] px-6 text-[13px] font-bold uppercase tracking-[0.02em] text-[#DCE3EC] transition-colors hover:bg-[#AD4420] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#DCE3EC] sm:h-[52px] sm:text-[14px]">
            <Image src="/em-breve/whatsapp.svg" alt="" width={16} height={16} className="size-4" />
            Falar pelo WhatsApp
          </a>
        </div>
      </section>
    </main>
  );
}
