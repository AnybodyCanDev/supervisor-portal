/*
  Warnings:

  - The primary key for the `ThreeWayValidator` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "ThreeWayValidator" DROP CONSTRAINT "ThreeWayValidator_pkey",
ALTER COLUMN "zoho_po_number" SET DATA TYPE TEXT,
ADD CONSTRAINT "ThreeWayValidator_pkey" PRIMARY KEY ("zoho_po_number");
