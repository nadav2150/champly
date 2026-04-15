-- ============================================================================
-- 11. SHOWCASE PREMIUM — Rich product display with image, badge, details
-- Inspired by premium retail tags: red accent band, large price,
-- product image, badge label, and 3 detail lines.
-- Eye catches: Red band + product name, then price, then image & details
-- ============================================================================

INSERT OR IGNORE INTO templates (id, name, description, kind, created_at, purpose, when_to_use) VALUES
  ('tpl_showcase', 'Premium Showcase', 'Premium product display — red accent band, large name, price, product image area, badge, and three detail lines for rich product info.', 'showcase', '2025-01-01T00:00:00Z', 'Premium branded product showcase with full details', 'Use for high-value or featured products that need maximum visual impact — image, badge, price, and detailed specs.');


-- ============================================================================
-- MTAG15 — 152×152 (square, compact)
-- ============================================================================
INSERT INTO template_variants (id, template_id, tag_model, width, height, layout_json) VALUES
('tv_shw_154','tpl_showcase','MTAG15',152,152,
'{"width":152,"height":152,"background":"white","elements":[{"type":"rect","x":0,"y":0,"w":152,"h":24,"color":"red"},{"type":"text","field":"name","x":8,"y":48,"fontSize":13,"fontWeight":"bold","align":"left","color":"black","maxLines":2,"w":136},{"type":"text","field":"price","x":8,"y":82,"fontSize":28,"fontWeight":"bold","align":"left","color":"black","w":80},{"type":"badge","text":"★","x":92,"y":66,"w":52,"h":20,"fontSize":10,"fontWeight":"bold","color":"white","bgColor":"red","radius":4,"paddingX":6,"paddingY":3},{"type":"line","x1":8,"y1":96,"x2":144,"y2":96,"color":"black","strokeWidth":1},{"type":"text","field":"detail1","x":8,"y":112,"fontSize":8,"fontWeight":"normal","align":"left","color":"black","w":136,"maxLines":1},{"type":"text","field":"detail2","x":8,"y":124,"fontSize":8,"fontWeight":"normal","align":"left","color":"black","w":136,"maxLines":1},{"type":"text","field":"detail3","x":8,"y":136,"fontSize":8,"fontWeight":"normal","align":"left","color":"black","w":136,"maxLines":1}]}');


-- ============================================================================
-- ESL-2.13 — 250×122
-- ============================================================================
INSERT INTO template_variants (id, template_id, tag_model, width, height, layout_json) VALUES
('tv_shw_213','tpl_showcase','ESL-2.13',250,122,
'{"width":250,"height":122,"background":"white","elements":[{"type":"rect","x":0,"y":0,"w":250,"h":26,"color":"red"},{"type":"text","field":"name","x":10,"y":48,"fontSize":14,"fontWeight":"bold","align":"left","color":"black","maxLines":1,"w":230},{"type":"text","field":"price","x":10,"y":78,"fontSize":26,"fontWeight":"bold","align":"left","color":"black","w":120},{"type":"badge","field":"discount","x":140,"y":60,"w":100,"h":22,"fontSize":10,"fontWeight":"bold","color":"white","bgColor":"red","radius":4,"paddingX":8,"paddingY":4},{"type":"line","x1":10,"y1":90,"x2":240,"y2":90,"color":"black","strokeWidth":1},{"type":"text","field":"detail1","x":10,"y":104,"fontSize":8,"fontWeight":"normal","align":"left","color":"black","w":110,"maxLines":1},{"type":"text","field":"detail2","x":10,"y":114,"fontSize":8,"fontWeight":"normal","align":"left","color":"black","w":110,"maxLines":1},{"type":"text","field":"detail3","x":130,"y":104,"fontSize":8,"fontWeight":"normal","align":"left","color":"black","w":110,"maxLines":1}]}');


-- ============================================================================
-- DS026F — 296×152
-- ============================================================================
INSERT INTO template_variants (id, template_id, tag_model, width, height, layout_json) VALUES
('tv_shw_266','tpl_showcase','DS026F',296,152,
'{"width":296,"height":152,"background":"white","elements":[{"type":"rect","x":0,"y":0,"w":296,"h":28,"color":"red"},{"type":"text","field":"name","x":12,"y":52,"fontSize":15,"fontWeight":"bold","align":"left","color":"black","maxLines":1,"w":272},{"type":"text","field":"price","x":12,"y":88,"fontSize":30,"fontWeight":"bold","align":"left","color":"black","w":140},{"type":"badge","field":"discount","x":164,"y":70,"w":120,"h":24,"fontSize":11,"fontWeight":"bold","color":"white","bgColor":"red","radius":4,"paddingX":8,"paddingY":4},{"type":"line","x1":12,"y1":102,"x2":284,"y2":102,"color":"black","strokeWidth":1},{"type":"text","field":"detail1","x":12,"y":118,"fontSize":9,"fontWeight":"normal","align":"left","color":"black","w":130,"maxLines":1},{"type":"text","field":"detail2","x":12,"y":132,"fontSize":9,"fontWeight":"normal","align":"left","color":"black","w":130,"maxLines":1},{"type":"text","field":"detail3","x":154,"y":118,"fontSize":9,"fontWeight":"normal","align":"left","color":"black","w":130,"maxLines":1}]}');


-- ============================================================================
-- DS027Q — 384×200
-- ============================================================================
INSERT INTO template_variants (id, template_id, tag_model, width, height, layout_json) VALUES
('tv_shw_267','tpl_showcase','DS027Q',384,200,
'{"width":384,"height":200,"background":"white","elements":[{"type":"rect","x":0,"y":0,"w":384,"h":32,"color":"red"},{"type":"text","field":"name","x":16,"y":60,"fontSize":17,"fontWeight":"bold","align":"left","color":"black","maxLines":1,"w":352},{"type":"text","field":"price","x":16,"y":104,"fontSize":38,"fontWeight":"bold","align":"left","color":"black","w":180},{"type":"badge","field":"discount","x":210,"y":82,"w":158,"h":28,"fontSize":13,"fontWeight":"bold","color":"white","bgColor":"red","radius":4,"paddingX":10,"paddingY":5},{"type":"line","x1":16,"y1":120,"x2":368,"y2":120,"color":"black","strokeWidth":1},{"type":"text","field":"detail1","x":16,"y":140,"fontSize":10,"fontWeight":"normal","align":"left","color":"black","w":170,"maxLines":1},{"type":"text","field":"detail2","x":16,"y":156,"fontSize":10,"fontWeight":"normal","align":"left","color":"black","w":170,"maxLines":1},{"type":"text","field":"detail3","x":16,"y":172,"fontSize":10,"fontWeight":"normal","align":"left","color":"black","w":170,"maxLines":1},{"type":"image","field":"imageUrl","x":264,"y":128,"w":104,"h":64}]}');


-- ============================================================================
-- ESL-2.9 — 296×128
-- ============================================================================
INSERT INTO template_variants (id, template_id, tag_model, width, height, layout_json) VALUES
('tv_shw_290','tpl_showcase','ESL-2.9',296,128,
'{"width":296,"height":128,"background":"white","elements":[{"type":"rect","x":0,"y":0,"w":296,"h":26,"color":"red"},{"type":"text","field":"name","x":12,"y":46,"fontSize":14,"fontWeight":"bold","align":"left","color":"black","maxLines":1,"w":272},{"type":"text","field":"price","x":12,"y":78,"fontSize":26,"fontWeight":"bold","align":"left","color":"black","w":140},{"type":"badge","field":"discount","x":162,"y":62,"w":122,"h":22,"fontSize":10,"fontWeight":"bold","color":"white","bgColor":"red","radius":4,"paddingX":8,"paddingY":4},{"type":"line","x1":12,"y1":90,"x2":284,"y2":90,"color":"black","strokeWidth":1},{"type":"text","field":"detail1","x":12,"y":104,"fontSize":8,"fontWeight":"normal","align":"left","color":"black","w":130,"maxLines":1},{"type":"text","field":"detail2","x":12,"y":116,"fontSize":8,"fontWeight":"normal","align":"left","color":"black","w":130,"maxLines":1},{"type":"text","field":"detail3","x":154,"y":104,"fontSize":8,"fontWeight":"normal","align":"left","color":"black","w":130,"maxLines":1}]}');


-- ============================================================================
-- DS035Q — 384×184
-- ============================================================================
INSERT INTO template_variants (id, template_id, tag_model, width, height, layout_json) VALUES
('tv_shw_350','tpl_showcase','DS035Q',384,184,
'{"width":384,"height":184,"background":"white","elements":[{"type":"rect","x":0,"y":0,"w":384,"h":30,"color":"red"},{"type":"text","field":"name","x":16,"y":56,"fontSize":16,"fontWeight":"bold","align":"left","color":"black","maxLines":1,"w":352},{"type":"text","field":"price","x":16,"y":96,"fontSize":36,"fontWeight":"bold","align":"left","color":"black","w":180},{"type":"badge","field":"discount","x":208,"y":76,"w":160,"h":26,"fontSize":12,"fontWeight":"bold","color":"white","bgColor":"red","radius":4,"paddingX":10,"paddingY":5},{"type":"line","x1":16,"y1":110,"x2":368,"y2":110,"color":"black","strokeWidth":1},{"type":"text","field":"detail1","x":16,"y":128,"fontSize":9,"fontWeight":"normal","align":"left","color":"black","w":170,"maxLines":1},{"type":"text","field":"detail2","x":16,"y":142,"fontSize":9,"fontWeight":"normal","align":"left","color":"black","w":170,"maxLines":1},{"type":"text","field":"detail3","x":16,"y":156,"fontSize":9,"fontWeight":"normal","align":"left","color":"black","w":170,"maxLines":1},{"type":"image","field":"imageUrl","x":260,"y":118,"w":108,"h":58}]}');


-- ============================================================================
-- ESL-4.2 — 400×300 (medium, more room for image)
-- ============================================================================
INSERT INTO template_variants (id, template_id, tag_model, width, height, layout_json) VALUES
('tv_shw_420','tpl_showcase','ESL-4.2',400,300,
'{"width":400,"height":300,"background":"white","elements":[{"type":"rect","x":0,"y":0,"w":400,"h":40,"color":"red"},{"type":"text","field":"name","x":16,"y":72,"fontSize":20,"fontWeight":"bold","align":"left","color":"black","maxLines":2,"w":368},{"type":"text","field":"price","x":16,"y":130,"fontSize":48,"fontWeight":"bold","align":"left","color":"black","w":200},{"type":"badge","field":"discount","x":230,"y":104,"w":154,"h":32,"fontSize":14,"fontWeight":"bold","color":"white","bgColor":"red","radius":6,"paddingX":12,"paddingY":6},{"type":"line","x1":16,"y1":152,"x2":384,"y2":152,"color":"black","strokeWidth":1},{"type":"image","field":"imageUrl","x":256,"y":164,"w":128,"h":120},{"type":"text","field":"detail1","x":16,"y":180,"fontSize":11,"fontWeight":"normal","align":"left","color":"black","w":228,"maxLines":1},{"type":"text","field":"detail2","x":16,"y":200,"fontSize":11,"fontWeight":"normal","align":"left","color":"black","w":228,"maxLines":1},{"type":"text","field":"detail3","x":16,"y":220,"fontSize":11,"fontWeight":"normal","align":"left","color":"black","w":228,"maxLines":1},{"type":"text","field":"unit","x":16,"y":268,"fontSize":10,"fontWeight":"bold","align":"left","color":"red","w":228}]}');


-- ============================================================================
-- DS043Q — 522×152 (wide landscape)
-- ============================================================================
INSERT INTO template_variants (id, template_id, tag_model, width, height, layout_json) VALUES
('tv_shw_430','tpl_showcase','DS043Q',522,152,
'{"width":522,"height":152,"background":"white","elements":[{"type":"rect","x":0,"y":0,"w":522,"h":26,"color":"red"},{"type":"text","field":"name","x":16,"y":50,"fontSize":15,"fontWeight":"bold","align":"left","color":"black","maxLines":1,"w":280},{"type":"text","field":"price","x":16,"y":86,"fontSize":32,"fontWeight":"bold","align":"left","color":"black","w":160},{"type":"badge","field":"discount","x":184,"y":66,"w":130,"h":24,"fontSize":11,"fontWeight":"bold","color":"white","bgColor":"red","radius":4,"paddingX":8,"paddingY":4},{"type":"line","x1":330,"y1":34,"x2":330,"y2":144,"color":"black","strokeWidth":1},{"type":"image","field":"imageUrl","x":344,"y":34,"w":80,"h":80},{"type":"text","field":"detail1","x":434,"y":52,"fontSize":9,"fontWeight":"normal","align":"left","color":"black","w":80,"maxLines":1},{"type":"text","field":"detail2","x":434,"y":66,"fontSize":9,"fontWeight":"normal","align":"left","color":"black","w":80,"maxLines":1},{"type":"text","field":"detail3","x":434,"y":80,"fontSize":9,"fontWeight":"normal","align":"left","color":"black","w":80,"maxLines":1},{"type":"text","field":"detail1","x":16,"y":108,"fontSize":8,"fontWeight":"normal","align":"left","color":"black","w":140,"maxLines":1},{"type":"text","field":"detail2","x":16,"y":122,"fontSize":8,"fontWeight":"normal","align":"left","color":"black","w":140,"maxLines":1},{"type":"text","field":"detail3","x":16,"y":136,"fontSize":8,"fontWeight":"normal","align":"left","color":"black","w":140,"maxLines":1}]}');

-- Wait, the wide layout has duplicate detail fields. Let me fix this by using the vertical divider approach with image on the right side.

DELETE FROM template_variants WHERE id = 'tv_shw_430';

INSERT INTO template_variants (id, template_id, tag_model, width, height, layout_json) VALUES
('tv_shw_430','tpl_showcase','DS043Q',522,152,
'{"width":522,"height":152,"background":"white","elements":[{"type":"rect","x":0,"y":0,"w":522,"h":26,"color":"red"},{"type":"text","field":"name","x":16,"y":50,"fontSize":15,"fontWeight":"bold","align":"left","color":"black","maxLines":2,"w":280},{"type":"text","field":"price","x":16,"y":88,"fontSize":32,"fontWeight":"bold","align":"left","color":"black","w":160},{"type":"badge","field":"discount","x":184,"y":68,"w":126,"h":24,"fontSize":11,"fontWeight":"bold","color":"white","bgColor":"red","radius":4,"paddingX":8,"paddingY":4},{"type":"line","x1":324,"y1":34,"x2":324,"y2":144,"color":"black","strokeWidth":1},{"type":"image","field":"imageUrl","x":340,"y":34,"w":86,"h":86},{"type":"text","field":"detail1","x":340,"y":134,"fontSize":8,"fontWeight":"normal","align":"left","color":"black","w":166,"maxLines":1},{"type":"text","field":"detail2","x":340,"y":144,"fontSize":8,"fontWeight":"normal","align":"left","color":"black","w":166,"maxLines":1},{"type":"line","x1":16,"y1":100,"x2":310,"y2":100,"color":"black","strokeWidth":1},{"type":"text","field":"detail3","x":16,"y":118,"fontSize":9,"fontWeight":"normal","align":"left","color":"black","w":294,"maxLines":1},{"type":"text","field":"unit","x":16,"y":136,"fontSize":9,"fontWeight":"bold","align":"left","color":"red","w":294}]}');


-- ============================================================================
-- ESL-5.83 — 648×480 (large, hero layout)
-- ============================================================================
INSERT INTO template_variants (id, template_id, tag_model, width, height, layout_json) VALUES
('tv_shw_583','tpl_showcase','ESL-5.83',648,480,
'{"width":648,"height":480,"background":"white","elements":[{"type":"rect","x":0,"y":0,"w":648,"h":52,"color":"red"},{"type":"text","field":"name","x":24,"y":92,"fontSize":26,"fontWeight":"bold","align":"left","color":"black","maxLines":2,"w":600},{"type":"text","field":"price","x":24,"y":168,"fontSize":64,"fontWeight":"bold","align":"left","color":"black","w":320},{"type":"badge","field":"discount","x":360,"y":128,"w":264,"h":40,"fontSize":18,"fontWeight":"bold","color":"white","bgColor":"red","radius":6,"paddingX":14,"paddingY":8},{"type":"line","x1":24,"y1":196,"x2":624,"y2":196,"color":"black","strokeWidth":1},{"type":"image","field":"imageUrl","x":400,"y":216,"w":224,"h":200},{"type":"text","field":"detail1","x":24,"y":236,"fontSize":14,"fontWeight":"normal","align":"left","color":"black","w":360,"maxLines":1},{"type":"text","field":"detail2","x":24,"y":264,"fontSize":14,"fontWeight":"normal","align":"left","color":"black","w":360,"maxLines":1},{"type":"text","field":"detail3","x":24,"y":292,"fontSize":14,"fontWeight":"normal","align":"left","color":"black","w":360,"maxLines":1},{"type":"text","field":"unit","x":24,"y":340,"fontSize":13,"fontWeight":"bold","align":"left","color":"red","w":360},{"type":"text","field":"category","x":24,"y":440,"fontSize":12,"fontWeight":"normal","align":"left","color":"black","w":360}]}');


-- ============================================================================
-- ESL-7.5 — 800×480 (wide hero)
-- ============================================================================
INSERT INTO template_variants (id, template_id, tag_model, width, height, layout_json) VALUES
('tv_shw_750','tpl_showcase','ESL-7.5',800,480,
'{"width":800,"height":480,"background":"white","elements":[{"type":"rect","x":0,"y":0,"w":800,"h":52,"color":"red"},{"type":"text","field":"name","x":32,"y":92,"fontSize":28,"fontWeight":"bold","align":"left","color":"black","maxLines":2,"w":736},{"type":"text","field":"price","x":32,"y":176,"fontSize":72,"fontWeight":"bold","align":"left","color":"black","w":400},{"type":"badge","field":"discount","x":450,"y":132,"w":318,"h":44,"fontSize":20,"fontWeight":"bold","color":"white","bgColor":"red","radius":6,"paddingX":16,"paddingY":8},{"type":"line","x1":32,"y1":200,"x2":768,"y2":200,"color":"black","strokeWidth":1},{"type":"image","field":"imageUrl","x":520,"y":220,"w":248,"h":220},{"type":"text","field":"detail1","x":32,"y":244,"fontSize":15,"fontWeight":"normal","align":"left","color":"black","w":470,"maxLines":1},{"type":"text","field":"detail2","x":32,"y":274,"fontSize":15,"fontWeight":"normal","align":"left","color":"black","w":470,"maxLines":1},{"type":"text","field":"detail3","x":32,"y":304,"fontSize":15,"fontWeight":"normal","align":"left","color":"black","w":470,"maxLines":1},{"type":"text","field":"unit","x":32,"y":356,"fontSize":14,"fontWeight":"bold","align":"left","color":"red","w":470},{"type":"text","field":"category","x":32,"y":440,"fontSize":13,"fontWeight":"normal","align":"left","color":"black","w":470}]}');


-- ============================================================================
-- ESL-11.6 — 960×640 (extra large, full showcase)
-- ============================================================================
INSERT INTO template_variants (id, template_id, tag_model, width, height, layout_json) VALUES
('tv_shw_116','tpl_showcase','ESL-11.6',960,640,
'{"width":960,"height":640,"background":"white","elements":[{"type":"rect","x":0,"y":0,"w":960,"h":64,"color":"red"},{"type":"text","field":"name","x":40,"y":112,"fontSize":34,"fontWeight":"bold","align":"left","color":"black","maxLines":2,"w":880},{"type":"text","field":"price","x":40,"y":220,"fontSize":90,"fontWeight":"bold","align":"left","color":"black","w":480},{"type":"badge","field":"discount","x":540,"y":168,"w":380,"h":52,"fontSize":24,"fontWeight":"bold","color":"white","bgColor":"red","radius":8,"paddingX":18,"paddingY":10},{"type":"line","x1":40,"y1":252,"x2":920,"y2":252,"color":"black","strokeWidth":2},{"type":"image","field":"imageUrl","x":600,"y":280,"w":320,"h":300},{"type":"text","field":"detail1","x":40,"y":306,"fontSize":18,"fontWeight":"normal","align":"left","color":"black","w":540,"maxLines":1},{"type":"text","field":"detail2","x":40,"y":342,"fontSize":18,"fontWeight":"normal","align":"left","color":"black","w":540,"maxLines":1},{"type":"text","field":"detail3","x":40,"y":378,"fontSize":18,"fontWeight":"normal","align":"left","color":"black","w":540,"maxLines":1},{"type":"text","field":"unit","x":40,"y":436,"fontSize":16,"fontWeight":"bold","align":"left","color":"red","w":540},{"type":"text","field":"category","x":40,"y":580,"fontSize":16,"fontWeight":"normal","align":"left","color":"black","w":540}]}');
