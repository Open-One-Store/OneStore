/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Category` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "ItemType" ADD VALUE 'text';

-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "text" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");
