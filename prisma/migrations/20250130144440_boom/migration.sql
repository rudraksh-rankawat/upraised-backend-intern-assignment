-- CreateTable
CREATE TABLE "gadgets" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Available',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "decomissioned_at" TIMESTAMP(3),

    CONSTRAINT "gadgets_pkey" PRIMARY KEY ("id")
);
