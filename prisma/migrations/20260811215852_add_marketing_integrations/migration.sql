-- CreateTable
CREATE TABLE "MarketingIntegrations" (
    "id" TEXT NOT NULL,
    "gtmId" TEXT,
    "ga4Id" TEXT,
    "googleAdsId" TEXT,
    "googleAdsLabel" TEXT,
    "metaPixelId" TEXT,
    "whatsappNumber" TEXT,
    "whatsappMessage" TEXT,
    "chatProvider" TEXT,
    "chatId" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarketingIntegrations_pkey" PRIMARY KEY ("id")
);
