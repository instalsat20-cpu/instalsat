import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import { CookieConsent } from "@/components/cookie-consent";
import "./globals.css";

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-rubik",
});

export const metadata: Metadata = {
  title: "Instalsat | Segurança Eletrônica e Manutenção Elétrica",
  description: "A empresa que fica. Segurança eletrônica e manutenção elétrica para administradoras, síndicos e construtoras na Grande ABC.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${rubik.variable} font-sans antialiased`}>
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
