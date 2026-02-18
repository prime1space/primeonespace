-- Add event_registrations table
CREATE TABLE IF NOT EXISTS `event_registrations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `event_id` int NOT NULL,
  `user_id` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `event_registrations_event_id_fk` (`event_id`),
  KEY `event_registrations_user_id_fk` (`user_id`),
  UNIQUE KEY `unique_event_user` (`event_id`, `user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;