/*
  Warnings:

  - You are about to drop the column `name` on the `Publication` table. All the data in the column will be lost.
  - Added the required column `description` to the `Publication` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fuel` to the `Publication` table without a default value. This is not possible if the table is not empty.
  - Added the required column `km` to the `Publication` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Publication` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transmission` to the `Publication` table without a default value. This is not possible if the table is not empty.
  - Added the required column `version` to the `Publication` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `Publication` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Publication_name_key";

-- AlterTable
ALTER TABLE "Publication" DROP COLUMN "name",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "fuel" TEXT NOT NULL,
ADD COLUMN     "km" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "transmission" TEXT NOT NULL,
ADD COLUMN     "version" TEXT NOT NULL,
ADD COLUMN     "year" TEXT NOT NULL;
