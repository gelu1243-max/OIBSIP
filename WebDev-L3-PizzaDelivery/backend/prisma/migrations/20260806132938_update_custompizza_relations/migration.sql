/*
  Warnings:

  - Made the column `baseId` on table `CustomPizza` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sauceId` on table `CustomPizza` required. This step will fail if there are existing NULL values in that column.
  - Made the column `cheeseId` on table `CustomPizza` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "CustomPizza" DROP CONSTRAINT "CustomPizza_baseId_fkey";

-- DropForeignKey
ALTER TABLE "CustomPizza" DROP CONSTRAINT "CustomPizza_cheeseId_fkey";

-- DropForeignKey
ALTER TABLE "CustomPizza" DROP CONSTRAINT "CustomPizza_sauceId_fkey";

-- AlterTable
ALTER TABLE "CustomPizza" ALTER COLUMN "baseId" SET NOT NULL,
ALTER COLUMN "sauceId" SET NOT NULL,
ALTER COLUMN "cheeseId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "CustomPizza" ADD CONSTRAINT "CustomPizza_baseId_fkey" FOREIGN KEY ("baseId") REFERENCES "PizzaBase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomPizza" ADD CONSTRAINT "CustomPizza_sauceId_fkey" FOREIGN KEY ("sauceId") REFERENCES "Sauce"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomPizza" ADD CONSTRAINT "CustomPizza_cheeseId_fkey" FOREIGN KEY ("cheeseId") REFERENCES "Cheese"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
