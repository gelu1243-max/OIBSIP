-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pizza" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 100,
    "threshold" INTEGER NOT NULL DEFAULT 20,

    CONSTRAINT "Pizza_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PizzaBase" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 100,
    "threshold" INTEGER NOT NULL DEFAULT 20,

    CONSTRAINT "PizzaBase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sauce" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 100,
    "threshold" INTEGER NOT NULL DEFAULT 20,

    CONSTRAINT "Sauce_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cheese" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 100,
    "threshold" INTEGER NOT NULL DEFAULT 20,

    CONSTRAINT "Cheese_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vegetable" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 100,
    "threshold" INTEGER NOT NULL DEFAULT 20,

    CONSTRAINT "Vegetable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomPizza" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT,
    "description" TEXT,
    "baseId" INTEGER,
    "sauceId" INTEGER,
    "cheeseId" INTEGER,

    CONSTRAINT "CustomPizza_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'RECEIVED',
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "pizzaId" INTEGER,
    "customPizzaId" INTEGER,
    "quantity" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "razorpayId" TEXT,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CustomPizzaVegetables" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CustomPizzaVegetables_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_orderId_key" ON "Payment"("orderId");

-- CreateIndex
CREATE INDEX "_CustomPizzaVegetables_B_index" ON "_CustomPizzaVegetables"("B");

-- AddForeignKey
ALTER TABLE "CustomPizza" ADD CONSTRAINT "CustomPizza_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomPizza" ADD CONSTRAINT "CustomPizza_baseId_fkey" FOREIGN KEY ("baseId") REFERENCES "PizzaBase"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomPizza" ADD CONSTRAINT "CustomPizza_sauceId_fkey" FOREIGN KEY ("sauceId") REFERENCES "Sauce"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomPizza" ADD CONSTRAINT "CustomPizza_cheeseId_fkey" FOREIGN KEY ("cheeseId") REFERENCES "Cheese"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_pizzaId_fkey" FOREIGN KEY ("pizzaId") REFERENCES "Pizza"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_customPizzaId_fkey" FOREIGN KEY ("customPizzaId") REFERENCES "CustomPizza"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CustomPizzaVegetables" ADD CONSTRAINT "_CustomPizzaVegetables_A_fkey" FOREIGN KEY ("A") REFERENCES "CustomPizza"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CustomPizzaVegetables" ADD CONSTRAINT "_CustomPizzaVegetables_B_fkey" FOREIGN KEY ("B") REFERENCES "Vegetable"("id") ON DELETE CASCADE ON UPDATE CASCADE;
