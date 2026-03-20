ALTER TABLE `stores` ADD `user_id` text NOT NULL DEFAULT '';
ALTER TABLE `categories` ADD `user_id` text NOT NULL DEFAULT '';
CREATE INDEX `idx_stores_user_id` ON `stores` (`user_id`);
CREATE INDEX `idx_categories_user_id` ON `categories` (`user_id`);
