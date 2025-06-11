/*
  Warnings:

  - The values [PETROL] on the enum `FuelType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "FuelType_new" AS ENUM ('GASOLINE', 'DIESEL', 'ELECTRIC', 'HYBRID');
ALTER TABLE "Car" ALTER COLUMN "fuelType" DROP DEFAULT;
ALTER TABLE "Car" ALTER COLUMN "fuelType" TYPE "FuelType_new" USING ("fuelType"::text::"FuelType_new");
ALTER TYPE "FuelType" RENAME TO "FuelType_old";
ALTER TYPE "FuelType_new" RENAME TO "FuelType";
DROP TYPE "FuelType_old";
ALTER TABLE "Car" ALTER COLUMN "fuelType" SET DEFAULT 'GASOLINE';
COMMIT;

-- AlterTable
ALTER TABLE "Car" ALTER COLUMN "fuelType" SET DEFAULT 'GASOLINE';
