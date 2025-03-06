-- CreateEnum
CREATE TYPE "EnergyLevel" AS ENUM ('VERY_LOW', 'LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH');

-- CreateEnum
CREATE TYPE "EnvironmentNeed" AS ENUM ('SPACIOUS', 'COMPACT', 'BOTH');

-- CreateEnum
CREATE TYPE "IndependenceLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- AlterTable
ALTER TABLE "pets" ADD COLUMN     "energy_level" "EnergyLevel",
ADD COLUMN     "environment_need" "EnvironmentNeed",
ADD COLUMN     "independence_level" "IndependenceLevel";
