/*
  Warnings:

  - Added the required column `expertise` to the `TeacherRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `teacherrequest` ADD COLUMN `expertise` VARCHAR(191) NOT NULL;
