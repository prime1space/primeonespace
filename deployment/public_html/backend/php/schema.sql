CREATE TABLE `account` (
	`id` varchar(255) NOT NULL,
	`account_id` varchar(255) NOT NULL,
	`provider_id` varchar(255) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` timestamp,
	`refresh_token_expires_at` timestamp,
	`scope` text,
	`password` text,
	`created_at` timestamp NOT NULL,
	`updated_at` timestamp NOT NULL,
	CONSTRAINT `account_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `announcements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`is_active` boolean DEFAULT true,
	`created_at` varchar(255) NOT NULL,
	CONSTRAINT `announcements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `bookings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`space_id` int NOT NULL,
	`booking_date` varchar(255) NOT NULL,
	`start_time` varchar(255) NOT NULL,
	`end_time` varchar(255) NOT NULL,
	`duration_type` varchar(255) NOT NULL,
	`total_amount` double NOT NULL,
	`payment_status` varchar(255) NOT NULL DEFAULT 'pending',
	`booking_status` varchar(255) NOT NULL DEFAULT 'pending',
	`created_at` varchar(255) NOT NULL,
	CONSTRAINT `bookings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`event_date` varchar(255) NOT NULL,
	`image_url` text,
	`published` boolean DEFAULT false,
	`created_at` varchar(255) NOT NULL,
	CONSTRAINT `events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `offers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`code` varchar(255),
	`discount_percentage` double,
	`image_url` text,
	`is_active` boolean DEFAULT true,
	`valid_until` varchar(255),
	`created_at` varchar(255) NOT NULL,
	CONSTRAINT `offers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`booking_id` int NOT NULL,
	`amount` double NOT NULL,
	`currency` varchar(3) DEFAULT 'LKR',
	`status` varchar(255) NOT NULL DEFAULT 'pending',
	`provider` varchar(255) DEFAULT 'stripe',
	`transaction_id` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `payments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pricing` (
	`id` int AUTO_INCREMENT NOT NULL,
	`space_type` varchar(255) NOT NULL,
	`hourly_rate` double,
	`daily_rate` double,
	`monthly_rate` double,
	`features` json,
	CONSTRAINT `pricing_id` PRIMARY KEY(`id`),
	CONSTRAINT `pricing_space_type_unique` UNIQUE(`space_type`)
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` varchar(255) NOT NULL,
	`expires_at` timestamp NOT NULL,
	`token` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL,
	`updated_at` timestamp NOT NULL,
	`ip_address` varchar(255),
	`user_agent` text,
	`user_id` varchar(255) NOT NULL,
	CONSTRAINT `session_id` PRIMARY KEY(`id`),
	CONSTRAINT `session_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` varchar(255) NOT NULL,
	`value` text NOT NULL,
	`updated_at` varchar(255) NOT NULL,
	CONSTRAINT `settings_id` PRIMARY KEY(`id`),
	CONSTRAINT `settings_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE TABLE `spaces` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` varchar(255) NOT NULL,
	`capacity` int NOT NULL,
	`amenities` json,
	`image_url` text,
	`description` text,
	`available` boolean DEFAULT true,
	CONSTRAINT `spaces_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `testimonials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`role` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`rating` int NOT NULL,
	`image_url` text,
	`approved` boolean DEFAULT false,
	`created_at` varchar(255) NOT NULL,
	CONSTRAINT `testimonials_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`email_verified` boolean NOT NULL DEFAULT false,
	`image` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `verification` (
	`id` varchar(255) NOT NULL,
	`identifier` varchar(255) NOT NULL,
	`value` text NOT NULL,
	`expires_at` timestamp NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `verification_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `account` ADD CONSTRAINT `account_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_space_id_spaces_id_fk` FOREIGN KEY (`space_id`) REFERENCES `spaces`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payments` ADD CONSTRAINT `payments_booking_id_bookings_id_fk` FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `session` ADD CONSTRAINT `session_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;