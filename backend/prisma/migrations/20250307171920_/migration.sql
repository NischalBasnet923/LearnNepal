-- CreateTable
CREATE TABLE `TeacherRequest` (
    `id` VARCHAR(191) NOT NULL,
    `fullname` VARCHAR(191) NOT NULL,
    `education` VARCHAR(191) NOT NULL,
    `experience` VARCHAR(191) NOT NULL,
    `certificate` VARCHAR(191) NOT NULL,
    `isVerified` BOOLEAN NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TeacherRequest` ADD CONSTRAINT `TeacherRequest_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
