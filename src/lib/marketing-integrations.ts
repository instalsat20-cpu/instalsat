import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

export const getMarketingIntegrations = unstable_cache(
  async () => {
    const integrations = await prisma.marketingIntegrations.findFirst();
    return {
      gtmId: integrations?.gtmId ?? null,
      ga4Id: integrations?.ga4Id ?? null,
      googleAdsId: integrations?.googleAdsId ?? null,
      googleAdsLabel: integrations?.googleAdsLabel ?? null,
      metaPixelId: integrations?.metaPixelId ?? null,
      whatsappNumber: integrations?.whatsappNumber ?? null,
      whatsappMessage: integrations?.whatsappMessage ?? null,
      chatProvider: integrations?.chatProvider ?? null,
      chatId: integrations?.chatId ?? null,
    };
  },
  ["marketing-integrations"],
  { revalidate: 60, tags: ["marketing-integrations"] }
);
