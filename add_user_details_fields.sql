-- Add additional user details fields to the user table
ALTER TABLE `user` 
ADD COLUMN `phone` VARCHAR(20) NULL AFTER `email`,
ADD COLUMN `nic_passport` VARCHAR(50) NULL AFTER `phone`,
ADD COLUMN `address` TEXT NULL AFTER `nic_passport`,
ADD COLUMN `date_of_birth` DATE NULL AFTER `address`,
ADD COLUMN `gender` ENUM('male', 'female', 'other') NULL AFTER `date_of_birth`,
ADD COLUMN `emergency_contact_name` VARCHAR(255) NULL AFTER `gender`,
ADD COLUMN `emergency_contact_phone` VARCHAR(20) NULL AFTER `emergency_contact_name`;