/*
  Warnings:

  - Added the required column `price` to the `Cheese` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `PizzaBase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Sauce` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Vegetable` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cheese" ADD COLUMN     "price" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "PizzaBase" ADD COLUMN     "price" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Sauce" ADD COLUMN     "price" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Vegetable" ADD COLUMN     "price" DOUBLE PRECISION NOT NULL;
