ALTER TABLE `gateways` ADD `mqtt_broker_url` text;--> statement-breakpoint
ALTER TABLE `gateways` ADD `mqtt_status_topic` text;--> statement-breakpoint
ALTER TABLE `gateways` ADD `mqtt_action_topic` text;--> statement-breakpoint
ALTER TABLE `gateways` ADD `mqtt_response_topic` text;--> statement-breakpoint
CREATE TABLE `tag_commands` (
	`id` text PRIMARY KEY NOT NULL,
	`tag_id` text,
	`mac` text NOT NULL,
	`req_id` integer NOT NULL,
	`action` integer NOT NULL,
	`method` text NOT NULL,
	`payload_json` text NOT NULL,
	`status` text NOT NULL,
	`response_json` text,
	`error_message` text,
	`created_at` text NOT NULL,
	`completed_at` text,
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_tag_commands_req_id` ON `tag_commands` (`req_id`);--> statement-breakpoint
CREATE INDEX `idx_tag_commands_status` ON `tag_commands` (`status`);--> statement-breakpoint
ALTER TABLE `tags` ADD `mac` text;--> statement-breakpoint
ALTER TABLE `tags` ADD `ble_key` text;--> statement-breakpoint
ALTER TABLE `tags` ADD `gateway_id` text REFERENCES gateways(id);--> statement-breakpoint
ALTER TABLE `tags` ADD `rssi` integer;--> statement-breakpoint
ALTER TABLE `tags` ADD `last_advertised` text;--> statement-breakpoint
ALTER TABLE `tags` ADD `firmware_version` text;--> statement-breakpoint
ALTER TABLE `tags` ADD `tag_model` text;--> statement-breakpoint
CREATE UNIQUE INDEX `idx_tags_mac` ON `tags` (`mac`);
