-- AlterTable
ALTER TABLE "Projeto" ADD COLUMN     "linkDetalhes" TEXT;

-- CreateTable
CREATE TABLE "MidiaProjeto" (
    "id" TEXT NOT NULL,
    "projetoId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MidiaProjeto_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MidiaProjeto" ADD CONSTRAINT "MidiaProjeto_projetoId_fkey" FOREIGN KEY ("projetoId") REFERENCES "Projeto"("id") ON DELETE CASCADE ON UPDATE CASCADE;
