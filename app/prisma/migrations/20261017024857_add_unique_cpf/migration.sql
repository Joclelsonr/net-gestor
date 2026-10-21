/*
  Warnings:

  - A unique constraint covering the columns `[cpf]` on the table `customer` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "customer_cpf_key" ON "customer"("cpf");
