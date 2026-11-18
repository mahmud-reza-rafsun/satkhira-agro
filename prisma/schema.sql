-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "EntryKind" AS ENUM ('PURCHASE_EXPENSE', 'SALE_INCOME');

-- CreateEnum
CREATE TYPE "ContactKind" AS ENUM ('BUYER', 'SELLER');

-- CreateTable
CREATE TABLE "Batch" (
    "id" TEXT NOT NULL,
    "flock" TEXT NOT NULL,
    "subFlock" TEXT,
    "name" TEXT NOT NULL,
    "batchNo" INTEGER NOT NULL,
    "rate" DOUBLE PRECISION,
    "totalValue" DOUBLE PRECISION,
    "source" TEXT,
    "remark" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "growthRate" DOUBLE PRECISION,
    "growthMonths" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Batch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LedgerEntry" (
    "id" TEXT NOT NULL,
    "kind" "EntryKind" NOT NULL,
    "flock" TEXT NOT NULL,
    "batchNo" INTEGER,
    "batchId" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "category" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LedgerEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FixedInvestment" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "category" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FixedInvestment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "kind" "ContactKind" NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "remark" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Staff" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "salary" DOUBLE PRECISION NOT NULL,
    "paid" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Due" (
    "id" TEXT NOT NULL,
    "person" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3),
    "note" TEXT,
    "settled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Due_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Todo" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "done" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Todo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessPlan" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stock" (
    "id" TEXT NOT NULL,
    "flock" TEXT NOT NULL,
    "batchNo" INTEGER NOT NULL,
    "current" INTEGER NOT NULL,
    "batchId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GrowthProduct" (
    "id" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "flock" TEXT,
    "quantity" DOUBLE PRECISION NOT NULL,
    "growthRate" DOUBLE PRECISION,
    "months" INTEGER,
    "batchId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GrowthProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Backup" (
    "id" TEXT NOT NULL,
    "label" TEXT,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Backup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Setting" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Setting_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE INDEX "Batch_flock_idx" ON "Batch"("flock");

-- CreateIndex
CREATE UNIQUE INDEX "Batch_flock_batchNo_key" ON "Batch"("flock", "batchNo");

-- CreateIndex
CREATE INDEX "LedgerEntry_flock_batchNo_idx" ON "LedgerEntry"("flock", "batchNo");

-- CreateIndex
CREATE INDEX "LedgerEntry_kind_date_idx" ON "LedgerEntry"("kind", "date");

-- CreateIndex
CREATE INDEX "FixedInvestment_category_date_idx" ON "FixedInvestment"("category", "date");

-- CreateIndex
CREATE INDEX "Contact_kind_name_idx" ON "Contact"("kind", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Staff_name_month_key" ON "Staff"("name", "month");

-- CreateIndex
CREATE INDEX "Due_settled_idx" ON "Due"("settled");

-- CreateIndex
CREATE UNIQUE INDEX "Stock_batchId_key" ON "Stock"("batchId");

-- CreateIndex
CREATE UNIQUE INDEX "Stock_flock_batchNo_key" ON "Stock"("flock", "batchNo");

-- AddForeignKey
ALTER TABLE "LedgerEntry" ADD CONSTRAINT "LedgerEntry_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GrowthProduct" ADD CONSTRAINT "GrowthProduct_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

