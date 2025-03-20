-- CreateEnum
CREATE TYPE "Status" AS ENUM ('cleared', 'excess');

-- CreateTable
CREATE TABLE "InvoiceStore" (
    "invoice_id" SERIAL NOT NULL,
    "s3_url" TEXT NOT NULL,
    "zoho_po_number" TEXT,
    "scanned_data" JSONB,
    "zoho_bill_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InvoiceStore_pkey" PRIMARY KEY ("invoice_id")
);

-- CreateTable
CREATE TABLE "DecrementCache" (
    "zoho_po_number" TEXT NOT NULL,
    "original_items" JSONB NOT NULL,
    "remaining_items" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DecrementCache_pkey" PRIMARY KEY ("zoho_po_number")
);

-- CreateTable
CREATE TABLE "ReceiptTable" (
    "receipt_id" SERIAL NOT NULL,
    "zoho_po_number" TEXT NOT NULL,
    "items" JSONB,
    "status" "Status" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReceiptTable_pkey" PRIMARY KEY ("receipt_id")
);

-- CreateTable
CREATE TABLE "SystemLogs" (
    "log_id" SERIAL NOT NULL,
    "log_type" TEXT NOT NULL,
    "zoho_po_number" TEXT NOT NULL,
    "attachment" JSONB,
    "log_message" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SystemLogs_pkey" PRIMARY KEY ("log_id")
);

-- CreateTable
CREATE TABLE "ThreeWayValidator" (
    "zoho_po_number" INTEGER NOT NULL,
    "invoice_status" BOOLEAN NOT NULL DEFAULT false,
    "receipt_status" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ThreeWayValidator_pkey" PRIMARY KEY ("zoho_po_number")
);

-- CreateTable
CREATE TABLE "RaiseFlags" (
    "flag_id" SERIAL NOT NULL,
    "zoho_po_number" TEXT,
    "flag_type" TEXT NOT NULL,
    "flag_description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RaiseFlags_pkey" PRIMARY KEY ("flag_id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "emp_id" SERIAL NOT NULL,
    "emp_name" TEXT NOT NULL,
    "emp_email" TEXT NOT NULL,
    "role_lvl" TEXT NOT NULL,
    "sup_id" INTEGER NOT NULL,
    "workload" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("emp_id")
);

-- CreateTable
CREATE TABLE "Threshold" (
    "category" TEXT NOT NULL,
    "min_rank_req" TEXT NOT NULL,
    "min_amount" INTEGER NOT NULL,
    "max_amount" INTEGER NOT NULL,

    CONSTRAINT "Threshold_pkey" PRIMARY KEY ("category")
);

-- CreateTable
CREATE TABLE "Approval" (
    "approval_id" TEXT NOT NULL,
    "invoice_id" INTEGER NOT NULL,
    "emp_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approved_at" TIMESTAMP(3),
    "approval_level" INTEGER NOT NULL,
    "category" TEXT NOT NULL,

    CONSTRAINT "Approval_pkey" PRIMARY KEY ("approval_id")
);

-- CreateTable
CREATE TABLE "Auth" (
    "emp_id" INTEGER NOT NULL,
    "password" TEXT NOT NULL,
    "access_token" TEXT NOT NULL,
    "refresh_token" TEXT NOT NULL,

    CONSTRAINT "Auth_pkey" PRIMARY KEY ("emp_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Approval_invoice_id_key" ON "Approval"("invoice_id");

-- AddForeignKey
ALTER TABLE "Approval" ADD CONSTRAINT "Approval_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "InvoiceStore"("invoice_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Approval" ADD CONSTRAINT "Approval_emp_id_fkey" FOREIGN KEY ("emp_id") REFERENCES "Employee"("emp_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Auth" ADD CONSTRAINT "Auth_emp_id_fkey" FOREIGN KEY ("emp_id") REFERENCES "Employee"("emp_id") ON DELETE RESTRICT ON UPDATE CASCADE;
