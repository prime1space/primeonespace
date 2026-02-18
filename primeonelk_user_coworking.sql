-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jan 13, 2026 at 04:38 PM
-- Server version: 11.4.9-MariaDB
-- PHP Version: 8.4.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `primeonelk_user_coworking`
--

-- --------------------------------------------------------

--
-- Table structure for table `account`
--

CREATE TABLE `account` (
  `id` varchar(255) NOT NULL,
  `account_id` varchar(255) NOT NULL,
  `provider_id` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `access_token` text DEFAULT NULL,
  `refresh_token` text DEFAULT NULL,
  `id_token` text DEFAULT NULL,
  `access_token_expires_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `refresh_token_expires_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `scope` text DEFAULT NULL,
  `password` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `account`
--

INSERT INTO `account` (`id`, `account_id`, `provider_id`, `user_id`, `access_token`, `refresh_token`, `id_token`, `access_token_expires_at`, `refresh_token_expires_at`, `scope`, `password`, `created_at`, `updated_at`) VALUES
('1f63a4712aed0eae28060c7c2d26f11d', 'ac18af304a03c7fff723666da42e9a6e', 'email', 'ac18af304a03c7fff723666da42e9a6e', NULL, NULL, NULL, '2026-01-12 07:08:59', '0000-00-00 00:00:00', NULL, '$2y$10$BH4sNx4EM6vn0mrkM2UQouS3JHNnqZ6gRTfAf3HAPbETqFpTXudpa', '2026-01-12 07:08:59', '2026-01-12 07:08:59'),
('7cb751e4f44e2342354e68ac7a0dba36', 'd6d6cc94f1da6f1669ce2c232b504f28', 'email', 'd6d6cc94f1da6f1669ce2c232b504f28', NULL, NULL, NULL, '2026-01-12 06:07:32', '0000-00-00 00:00:00', NULL, '$2y$10$BmRyrsWw.GyGkBcCN69nO.K2lJSKJHZtS3BWyA95Q6/gBefIbit5O', '2026-01-12 06:07:32', '2026-01-12 06:07:32'),
('7fc4ea1baf88f1c8a5b5a924a9485d90', '71c32a71cb93ae1caed2db463f59b370', 'email', '71c32a71cb93ae1caed2db463f59b370', NULL, NULL, NULL, '2026-01-12 07:12:08', '0000-00-00 00:00:00', NULL, '$2y$10$Vpl9XQLVU2FImO0pGtWr5.pJFvbfiWizmONTx0SMqAyIQ6XLbEx72', '2026-01-12 07:12:08', '2026-01-12 07:12:08'),
('9112c044d4b6ce532811759434408ffe', 'd184240c27357d7d4bee99600ea36fc6', 'email', 'd184240c27357d7d4bee99600ea36fc6', NULL, NULL, NULL, '2026-01-12 06:05:16', '0000-00-00 00:00:00', NULL, '$2y$10$jCQG28ogYhaZdsFrwE2tu.FsfYVGDJtz8mdH0evb3hGcqdj4yDpTa', '2026-01-12 06:05:16', '2026-01-12 06:05:16');

-- --------------------------------------------------------

--
-- Table structure for table `announcements`
--

CREATE TABLE `announcements` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `announcements`
--

INSERT INTO `announcements` (`id`, `title`, `content`, `is_active`, `created_at`) VALUES
(7, 'Monthly Networking Event', 'Join us every first Friday for networking and collaboration.', 1, '2026-01-12 11:26:01'),
(8, 'Extended Hours', 'We are now open 24/7 for dedicated desk and private office members.', 1, '2026-01-12 11:26:01');

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `id` int(11) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `space_id` int(11) NOT NULL,
  `booking_date` varchar(255) NOT NULL,
  `start_time` varchar(255) NOT NULL,
  `end_time` varchar(255) NOT NULL,
  `duration_type` varchar(255) NOT NULL,
  `total_amount` double NOT NULL,
  `payment_status` varchar(255) NOT NULL DEFAULT 'pending',
  `booking_status` varchar(255) NOT NULL DEFAULT 'pending',
  `created_at` varchar(255) NOT NULL,
  `guest_phone` varchar(20) DEFAULT NULL,
  `seat_number` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`id`, `user_id`, `space_id`, `booking_date`, `start_time`, `end_time`, `duration_type`, `total_amount`, `payment_status`, `booking_status`, `created_at`, `guest_phone`, `seat_number`) VALUES
(6, 'NBYrofhtOVGls0oYKLrqzR8ajKV9QqOf', 1, '2024-02-12', '10:00', '18:00', 'daily', 540, 'completed', 'confirmed', '2026-01-12 11:26:01', NULL, NULL),
(7, 'user-id-456', 3, '2024-02-15', '14:00', '16:00', 'hourly', 4000, 'pending', 'pending', '2026-01-12 11:26:01', NULL, NULL),
(8, 'QMA07zITdar0ZXQWaMa2j6oBxF2piyaw', 4, '2024-02-20', '08:00', '12:00', 'hourly', 800, 'completed', 'confirmed', '2026-01-12 11:26:01', NULL, NULL),
(9, 'd6d6cc94f1da6f1669ce2c232b504f28', 2, '2026-01-14', '16:17', '19:16', 'hourly', 4475, 'pending', 'pending', '2026-01-12 09:47:13', '0766444945', '5'),
(10, 'd184240c27357d7d4bee99600ea36fc6', 2, '2026-01-21', '20:22', '21:22', 'daily', 20000, 'pending', 'confirmed', '2026-01-12 09:52:56', '0766414945', '2, 5'),
(11, 'd184240c27357d7d4bee99600ea36fc6', 4, '2026-01-21', '17:38', '20:38', 'hourly', 600, 'pending', 'confirmed', '2026-01-12 11:08:43', '0766414947', '2'),
(12, 'd6d6cc94f1da6f1669ce2c232b504f28', 7, '2026-01-14', '18:42', '19:42', 'hourly', 222, 'pending', 'pending', '2026-01-12 12:13:11', '09876543', '1');

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `event_date` varchar(255) NOT NULL,
  `image_url` text DEFAULT NULL,
  `published` tinyint(1) DEFAULT 0,
  `created_at` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `title`, `description`, `event_date`, `image_url`, `published`, `created_at`) VALUES
(6, 'Digital Marketing Workshop', 'Learn latest digital marketing strategies from experts', '2024-02-22 14:00:00', '/uploads/marketing-workshop.jpg', 1, '2026-01-12 11:26:01'),
(7, 'Tech Talk: AI in Business', 'Explore how AI is transforming businesses across industries', '2024-03-08 16:00:00', '/uploads/ai-tech-talk.jpg', 1, '2026-01-12 11:26:01'),
(8, 'Networking Coffee Morning', 'Casual networking over coffee for all members', '2024-03-15 08:00:00', '/backend/php/api/uploads/6966225b20f286.43316253.png', 1, '2026-01-12 11:26:01'),
(10, 'Startup Pitch Night', 'Join local startups pitching to investors and community', '2026-02-13T09:00', '/backend/php/api/uploads/6965c99fd70bd9.60778290.jpg', 1, '2026-01-13 04:27:15');

-- --------------------------------------------------------

--
-- Table structure for table `offers`
--

CREATE TABLE `offers` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `code` varchar(255) DEFAULT NULL,
  `discount_percentage` double DEFAULT NULL,
  `image_url` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `valid_until` varchar(255) DEFAULT NULL,
  `created_at` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `offers`
--

INSERT INTO `offers` (`id`, `title`, `description`, `code`, `discount_percentage`, `image_url`, `is_active`, `valid_until`, `created_at`) VALUES
(7, 'Weekend Special', 'Weekend bookings get 25% discount', 'WEEKEND25', 25, '/uploads/weekend-offer.jpg', 1, '2024-12-31', '2026-01-12 11:26:01'),
(8, 'Early Bird', 'Book before 9 AM and save 15%', 'EARLYBIRD15', 15, '/uploads/early-bird.jpg', 1, '2024-12-31', '2026-01-12 11:26:01'),
(9, 'test', 'test', 'test', 5, '', 1, '', '2026-01-12 06:19:47'),
(10, 'Pongal', 'pongal celebration', 'PON26', 15, '/backend/php/api/uploads/69661b4ec6dcb1.87839460.jpg', 1, '', '2026-01-13 10:16:00');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `booking_id` int(11) NOT NULL,
  `amount` double NOT NULL,
  `currency` varchar(3) DEFAULT 'LKR',
  `status` varchar(255) NOT NULL DEFAULT 'pending',
  `provider` varchar(255) DEFAULT 'stripe',
  `transaction_id` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pricing`
--

CREATE TABLE `pricing` (
  `id` int(11) NOT NULL,
  `space_type` varchar(255) NOT NULL,
  `hourly_rate` double DEFAULT NULL,
  `daily_rate` double DEFAULT NULL,
  `monthly_rate` double DEFAULT NULL,
  `features` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`features`))
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `pricing`
--

INSERT INTO `pricing` (`id`, `space_type`, `hourly_rate`, `daily_rate`, `monthly_rate`, `features`) VALUES
(8, 'dedicated_desk', 20, 200, 2000, '[\"power\"]'),
(9, 'meeting_room', 1500, 10000, 48000, '[\"Projector\", \"Whiteboard\", \"Video conferencing\", \"Complimentary refreshments\"]'),
(10, 'private_office', 2000, 15000, 120000, '[\"Standing desk\", \"Private entrance\", \"Storage\", \"Mail handling\", \"Meeting room credits\"]'),
(11, 'High_Table', 200, 1600, 48000, '[\"Starlink WiFi\",\"Adjustable Monitor\",\"Power outlets\"]'),
(12, 'test', 25, 0, 0, '[]');

-- --------------------------------------------------------

--
-- Table structure for table `session`
--

CREATE TABLE `session` (
  `id` varchar(255) NOT NULL,
  `expires_at` timestamp NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL,
  `updated_at` timestamp NOT NULL,
  `ip_address` varchar(255) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `user_id` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `session`
--

INSERT INTO `session` (`id`, `expires_at`, `token`, `created_at`, `updated_at`, `ip_address`, `user_agent`, `user_id`) VALUES
('26662eff149f9a00103ca51448fd0f38', '2026-01-19 06:39:40', '0dca98c60472b23989aaa540d96a18b0184ffda393c080127df087abf42f9e9e', '2026-01-12 12:09:40', '2026-01-12 12:09:40', NULL, NULL, 'd6d6cc94f1da6f1669ce2c232b504f28'),
('4e09889946b8c4bf06d143ae05d72c02', '2026-01-19 22:48:33', '93bdeb0bd7dd3f50512fcbd1ad5e2e50071ea73a9c5ab41bba714d5f3ab831e9', '2026-01-13 04:18:33', '2026-01-13 04:18:33', NULL, NULL, 'd6d6cc94f1da6f1669ce2c232b504f28'),
('5fe6ab19e68d308074df89c0c376acf7', '2026-01-19 23:31:59', 'f84365ee2420a76cf5daf7052aa9f4f39513bedc3ac561e7ee05ebe70636cbcb', '2026-01-13 05:01:59', '2026-01-13 05:01:59', NULL, NULL, 'd6d6cc94f1da6f1669ce2c232b504f28'),
('6329b2f86b8da373405235f540c88051', '2026-01-20 04:43:20', 'b83c6872ebbf776dce2e17ac08236e7d0e25f1d2ad3e025f729fc02df9eec9fa', '2026-01-13 10:13:20', '2026-01-13 10:13:20', NULL, NULL, 'd6d6cc94f1da6f1669ce2c232b504f28'),
('79d5dab1d867a6b9356cdf88fed7a8ed', '2026-01-19 04:22:16', '21a652e1c76a41abf7901eab3f9ea79941cf3b47eaa4e3bccef71f9f912524e0', '2026-01-12 09:52:16', '2026-01-12 09:52:16', NULL, NULL, 'd184240c27357d7d4bee99600ea36fc6'),
('92527430ede1b13599e48a70dc69fe73', '2026-01-19 01:43:22', '03bd8d5a94be3dce66db9b3f556c04c5f25549bba09cc4805e7e9609345fe27c', '2026-01-12 07:13:22', '2026-01-12 07:13:22', NULL, NULL, 'd6d6cc94f1da6f1669ce2c232b504f28'),
('dcbde1d0478d6cbf611f41c589fc9b42', '2026-01-19 01:38:59', '3717086550e23c868f00f30721ecdd9a8d9d29beb6f0ffa650984e89c4236d4b', '2026-01-12 07:08:59', '2026-01-12 07:08:59', NULL, NULL, 'ac18af304a03c7fff723666da42e9a6e'),
('e8ae642d820b312efde95e775820ea0d', '2026-01-19 04:43:04', '59b3862f7a970e7ecc4a6a9653028bbe00fff671c28b14fb29c99ce9a88d797f', '2026-01-12 10:13:04', '2026-01-12 10:13:04', NULL, NULL, 'd6d6cc94f1da6f1669ce2c232b504f28');

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `id` int(11) NOT NULL,
  `key` varchar(255) NOT NULL,
  `value` text NOT NULL,
  `updated_at` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `settings`
--

INSERT INTO `settings` (`id`, `key`, `value`, `updated_at`) VALUES
(9, 'site_name', 'Prime One Coworking Space', '2026-01-12 11:26:01'),
(10, 'site_description', 'Premium coworking space for entrepreneurs and professionals', '2026-01-12 11:26:01'),
(11, 'contact_email', 'info@primeone.lk', '2026-01-12 11:26:01'),
(12, 'contact_phone', '+94 11 234 5678', '2026-01-12 11:26:01'),
(13, 'address', 'Colombo, Sri Lanka', '2026-01-12 11:26:01'),
(14, 'working_hours', '24/7 for members, 8:00 AM - 8:00 PM for visitors', '2026-01-12 11:26:01'),
(15, 'booking_advance_days', '30', '2026-01-12 11:26:01'),
(16, 'cancellation_hours', '24', '2026-01-12 11:26:01');

-- --------------------------------------------------------

--
-- Table structure for table `spaces`
--

CREATE TABLE `spaces` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `capacity` int(11) NOT NULL,
  `amenities` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`amenities`)),
  `image_url` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `available` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `spaces`
--

INSERT INTO `spaces` (`id`, `name`, `type`, `capacity`, `amenities`, `image_url`, `description`, `available`) VALUES
(1, 'Dedicated Desk', 'dedicated_desk', 1, '[\"Starlink\", \"Power\", \"Ergonomic chair\", \"Power outlets\"]', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800', 'Your own dedicated workspace with high-speed Starlink internet and premium amenities.', 1),
(2, 'Meeting Room', 'meeting_room', 8, '[\"Projector\", \"Whiteboard\", \"Video conferencing\", \"High-speed WiFi\", \"Coffee/Tea\"]', 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800', 'Professional meeting space equipped with presentation tools and video conferencing facilities.', 1),
(3, 'Private Office', 'private_office', 4, '[\"Standing desk\", \"Private entrance\", \"Storage cabinet\", \"Air conditioning\", \"24/7 access\", \"Starlink WiFi\"]', 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800', 'Fully equipped private office with premium amenities and 24/7 access for your team.', 1),
(4, 'High Table', 'High_Table', 6, '[\"Adjustable Monitor\",\"Power outlets\"]', '/backend/php/api/uploads/6965c5f91e35c4.27736863.jpg', 'Standing workspace with adjustable monitor and power outlets.', 1),
(7, 'test', 'dedicated_desk', 1, '[]', '/backend/php/api/uploads/6965c58e200e65.47119071.webp', 'Fun with ', 1),
(9, 'test img', 'dedicated_desk', 9, '[\"wifi\"]', '/backend/php/api/uploads/6965c55c428484.82857518.jpg', 'testing image', 1);

-- --------------------------------------------------------

--
-- Table structure for table `testimonials`
--

CREATE TABLE `testimonials` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `rating` int(11) NOT NULL,
  `image_url` text DEFAULT NULL,
  `approved` tinyint(1) DEFAULT 0,
  `created_at` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `testimonials`
--

INSERT INTO `testimonials` (`id`, `name`, `role`, `content`, `rating`, `image_url`, `approved`, `created_at`) VALUES
(5, 'Sarah Johnson', 'Freelance Designer', 'Prime One has been a game-changer for my business. Great networking opportunities!', 5, '/uploads/sarah-testimonial.jpg', 1, '2026-01-12 11:26:01'),
(6, 'David Chen', 'Startup Founder', 'The meeting rooms are excellent and high-speed internet is perfect for our needs.', 5, '/uploads/david-testimonial.jpg', 1, '2026-01-12 11:26:01'),
(7, 'Maria Rodriguez', 'Marketing Consultant', 'Love the flexibility and professional environment. Highly recommended!', 4, '/uploads/maria-testimonial.jpg', 1, '2026-01-12 11:26:01'),
(8, 'James Wilson', 'Software Developer', 'Great community and excellent facilities. Made valuable connections here.', 5, '/uploads/james-testimonial.jpg', 1, '2026-01-12 11:26:01');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified` tinyint(1) NOT NULL DEFAULT 0,
  `image` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `name`, `email`, `email_verified`, `image`, `created_at`, `updated_at`) VALUES
('71c32a71cb93ae1caed2db463f59b370', 'gowtham', 'gowtham@gmail.com', 1, NULL, '2026-01-12 07:12:08', '2026-01-12 07:12:08'),
('ac18af304a03c7fff723666da42e9a6e', 'wiraj', 'wiraj@gmail.com', 1, NULL, '2026-01-12 07:08:59', '2026-01-12 07:08:59'),
('d184240c27357d7d4bee99600ea36fc6', 'test', 'test@gmail.com', 1, NULL, '2026-01-12 06:05:16', '2026-01-12 06:05:16'),
('d6d6cc94f1da6f1669ce2c232b504f28', 'Prime Admin', 'prime1@gmail.com', 1, NULL, '2026-01-12 06:07:32', '2026-01-12 06:07:32'),
('NBYrofhtOVGls0oYKLrqzR8ajKV9QqOf', 'Ariyadas Bathushan', 'bathu@gmail.com', 1, NULL, '2026-01-12 05:56:01', '2026-01-12 05:56:01'),
('QMA07zITdar0ZXQWaMa2j6oBxF2piyaw', 'Sharanyan', 'sharanyan@gmail.com', 1, NULL, '2026-01-12 05:56:01', '2026-01-12 05:56:01'),
('user-id-456', 'John Doe', 'john@example.com', 1, NULL, '2026-01-12 05:56:01', '2026-01-12 05:56:01');

-- --------------------------------------------------------

--
-- Table structure for table `verification`
--

CREATE TABLE `verification` (
  `id` varchar(255) NOT NULL,
  `identifier` varchar(255) NOT NULL,
  `value` text NOT NULL,
  `expires_at` timestamp NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `account`
--
ALTER TABLE `account`
  ADD PRIMARY KEY (`id`),
  ADD KEY `account_user_id_user_id_fk` (`user_id`);

--
-- Indexes for table `announcements`
--
ALTER TABLE `announcements`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `bookings_user_id_user_id_fk` (`user_id`),
  ADD KEY `bookings_space_id_spaces_id_fk` (`space_id`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `offers`
--
ALTER TABLE `offers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `payments_booking_id_bookings_id_fk` (`booking_id`);

--
-- Indexes for table `pricing`
--
ALTER TABLE `pricing`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `pricing_space_type_unique` (`space_type`);

--
-- Indexes for table `session`
--
ALTER TABLE `session`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `session_token_unique` (`token`),
  ADD KEY `session_user_id_user_id_fk` (`user_id`);

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `settings_key_unique` (`key`);

--
-- Indexes for table `spaces`
--
ALTER TABLE `spaces`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `testimonials`
--
ALTER TABLE `testimonials`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_email_unique` (`email`);

--
-- Indexes for table `verification`
--
ALTER TABLE `verification`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `announcements`
--
ALTER TABLE `announcements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `offers`
--
ALTER TABLE `offers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `pricing`
--
ALTER TABLE `pricing`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `settings`
--
ALTER TABLE `settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `spaces`
--
ALTER TABLE `spaces`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `testimonials`
--
ALTER TABLE `testimonials`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_space_id_spaces_id_fk` FOREIGN KEY (`space_id`) REFERENCES `spaces` (`id`),
  ADD CONSTRAINT `bookings_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_booking_id_bookings_id_fk` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`);

--
-- Constraints for table `session`
--
ALTER TABLE `session`
  ADD CONSTRAINT `session_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
