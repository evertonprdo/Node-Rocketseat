/*
  Warnings:

  - Changed the type of `age` on the `pets` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `energy_level` on table `pets` required. This step will fail if there are existing NULL values in that column.
  - Made the column `environment_need` on table `pets` required. This step will fail if there are existing NULL values in that column.
  - Made the column `independence_level` on table `pets` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "Age" AS ENUM ('PUPPY', 'ADULT', 'SENIOR');

-- AlterTable
ALTER TABLE "pets" DROP COLUMN "age",
ADD COLUMN     "age" "Age" NOT NULL,
ALTER COLUMN "energy_level" SET NOT NULL,
ALTER COLUMN "environment_need" SET NOT NULL,
ALTER COLUMN "independence_level" SET NOT NULL;
