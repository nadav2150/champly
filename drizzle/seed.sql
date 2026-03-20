-- Default templates (system data)
INSERT INTO templates VALUES ('tpl_default', 'Standard price tag', 'Default shelf label', 'price_label', '2025-01-01T00:00:00Z');
INSERT INTO template_variants VALUES ('tv1', 'tpl_default', 'ESL-2.13', 296, 128, '{"version":1,"fields":["name","price","unit"]}', NULL);
INSERT INTO templates VALUES ('tpl_promo', 'Promo highlight', 'Sale / promo layout', 'promo', '2025-01-01T00:00:01Z');
INSERT INTO template_variants VALUES ('tv2', 'tpl_promo', 'ESL-2.13', 296, 128, '{"version":1,"fields":["name","price","badge"]}', NULL);
