/*
  Warnings:

  - Added the required column `title` to the `calendar_entries` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "calendar_entries" ADD COLUMN     "title" VARCHAR(100) NOT NULL;
