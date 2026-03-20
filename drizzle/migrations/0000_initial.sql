CREATE TABLE `stores` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`address` text NOT NULL,
	`last_sync` text
);

CREATE TABLE `categories` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`icon` text NOT NULL
);

CREATE TABLE `templates` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`kind` text NOT NULL,
	`created_at` text NOT NULL
);

CREATE TABLE `template_variants` (
	`id` text PRIMARY KEY NOT NULL,
	`template_id` text NOT NULL,
	`tag_model` text NOT NULL,
	`width` integer NOT NULL,
	`height` integer NOT NULL,
	`layout_json` text NOT NULL,
	`preview_url` text,
	FOREIGN KEY (`template_id`) REFERENCES `templates`(`id`) ON UPDATE no action ON DELETE no action
);

CREATE TABLE `zones` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`store_id` text,
	FOREIGN KEY (`store_id`) REFERENCES `stores`(`id`) ON UPDATE no action ON DELETE no action
);

CREATE TABLE `products` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`price_cents` integer NOT NULL,
	`currency` text DEFAULT 'ILS' NOT NULL,
	`category_id` text,
	`unit` text NOT NULL,
	`sync_status` text DEFAULT 'updated' NOT NULL,
	`template_id` text,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`template_id`) REFERENCES `templates`(`id`) ON UPDATE no action ON DELETE no action
);

CREATE INDEX `idx_products_category_id` ON `products` (`category_id`);
CREATE INDEX `idx_products_template_id` ON `products` (`template_id`);

CREATE TABLE `tags` (
	`id` text PRIMARY KEY NOT NULL,
	`tag_id` text NOT NULL,
	`linked_product_id` text,
	`battery` integer DEFAULT 100 NOT NULL,
	`signal` text DEFAULT 'strong' NOT NULL,
	`status` text DEFAULT 'online' NOT NULL,
	`last_sync` text,
	`zone_id` text,
	FOREIGN KEY (`linked_product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`zone_id`) REFERENCES `zones`(`id`) ON UPDATE no action ON DELETE no action
);

CREATE UNIQUE INDEX `tags_tag_id_unique` ON `tags` (`tag_id`);
CREATE INDEX `idx_tags_zone_id` ON `tags` (`zone_id`);
CREATE INDEX `idx_tags_linked_product_id` ON `tags` (`linked_product_id`);

CREATE TABLE `sync_jobs` (
	`id` text PRIMARY KEY NOT NULL,
	`store_id` text NOT NULL,
	`product_id` text,
	`tag_id` text,
	`token` integer,
	`status` text NOT NULL,
	`error_message` text,
	`created_at` text NOT NULL,
	`sent_at` text,
	`completed_at` text,
	FOREIGN KEY (`store_id`) REFERENCES `stores`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE no action
);

CREATE INDEX `idx_sync_jobs_status` ON `sync_jobs` (`status`);
