ALTER TABLE `products` ADD `store_id` text REFERENCES `stores`(`id`) ON UPDATE no action ON DELETE no action;
CREATE INDEX `idx_products_store_id` ON `products` (`store_id`);
