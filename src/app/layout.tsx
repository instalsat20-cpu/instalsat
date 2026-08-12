import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import Script from "next/script";
import { CookieConsent } from "@/components/cookie-consent";
import { WhatsappFloatButton } from "@/components/whatsapp-float-button";
import { getMarketingIntegrations } from "@/lib/marketing-integrations";
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

const chatScriptSrc: Record<string, (chatId: string) => string> = {
  tidio: (chatId) => `//code.tidio.co/${chatId}.js`,
  jivochat: (chatId) => `//code.jivosite.com/widget/${chatId}`,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const integrations = await getMarketingIntegrations();
  const useGtm = Boolean(integrations.gtmId);

  return (
    <html lang="pt-BR">
      <head>
        {useGtm ? (
          <Script id="gtm-init" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${integrations.gtmId}');`}
          </Script>
        ) : null}

        {!useGtm && integrations.ga4Id ? (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${integrations.ga4Id}`} strategy="afterInteractive" />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];\nfunction gtag(){dataLayer.push(arguments);}\ngtag('js', new Date());\ngtag('config', '${integrations.ga4Id}');`}
            </Script>
          </>
        ) : null}

        {!useGtm && integrations.googleAdsId ? (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${integrations.googleAdsId}`} strategy="afterInteractive" />
            <Script id="google-ads-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];\nfunction gtag(){dataLayer.push(arguments);}\ngtag('js', new Date());\ngtag('config', '${integrations.googleAdsId}');`}
            </Script>
          </>
        ) : null}

        {!useGtm && integrations.metaPixelId ? (
          <Script id="meta-pixel-init" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s)\n{if(f.fbq)return;n=f.fbq=function(){n.callMethod?\nn.callMethod.apply(n,arguments):n.queue.push(arguments)};\nif(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';\nn.queue=[];t=b.createElement(e);t.async=!0;\nt.src=v;s=b.getElementsByTagName(e)[0];\ns.parentNode.insertBefore(t,s)}(window, document,'script',\n'https://connect.facebook.net/en_US/fbevents.js');\nfbq('init', '${integrations.metaPixelId}');\nfbq('track', 'PageView');`}
          </Script>
        ) : null}

        {integrations.chatProvider === "crisp" && integrations.chatId ? (
          <Script id="crisp-init" strategy="lazyOnload">
            {`window.$crisp=[];window.CRISP_WEBSITE_ID="${integrations.chatId}";(function(){var d=document,s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();`}
          </Script>
        ) : null}

        {(integrations.chatProvider === "tidio" || integrations.chatProvider === "jivochat") && integrations.chatId ? (
          <Script src={chatScriptSrc[integrations.chatProvider](integrations.chatId)} strategy="lazyOnload" />
        ) : null}
      </head>
      <body className={`${rubik.variable} font-sans antialiased`}>
        {useGtm ? (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${integrations.gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        ) : null}

        {!useGtm && integrations.metaPixelId ? (
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height="1"
              width="1"
              alt=""
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${integrations.metaPixelId}&ev=PageView&noscript=1`}
            />
          </noscript>
        ) : null}

        {children}
        <CookieConsent />
        {integrations.whatsappNumber ? (
          <WhatsappFloatButton number={integrations.whatsappNumber} message={integrations.whatsappMessage} />
        ) : null}
      </body>
    </html>
  );
}
