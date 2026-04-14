-- ============================================================================
-- Templates seed: 5 designs × 11 screen sizes = 55 variants
-- ============================================================================

-- Clean existing template variants (keep templates that may be linked to products)
DELETE FROM template_variants;
DELETE FROM templates;

-- ============================================================================
-- 5 Template designs
-- ============================================================================

INSERT INTO templates (id, name, description, kind, created_at) VALUES
  ('tpl_standard',  'Standard price tag', 'Clean layout with product name, price, and unit. Works for any retail shelf.',                  'price',    '2025-01-01T00:00:00Z'),
  ('tpl_promo',     'Promo highlight',    'Eye-catching sale banner with discount badge. Red accent header for promotions.',               'promo',    '2025-01-01T00:00:00Z'),
  ('tpl_minimal',   'Minimal',            'Ultra-clean design with large price and minimal text. Great for premium retail.',               'price',    '2025-01-01T00:00:00Z'),
  ('tpl_info',      'Info card',          'Product info layout with category, name, and price. Suitable for detailed displays.',           'info',     '2025-01-01T00:00:00Z'),
  ('tpl_bold',      'Bold shelf',         'High-contrast dark background with large bold price. Maximum visibility from distance.',        'price',    '2025-01-01T00:00:00Z');

-- ============================================================================
-- Screen sizes (unique resolutions)
-- ============================================================================
-- 1.54"  152×152   MTag15
-- 2.13"  250×122   DS021Q / STag21 / MTag21
-- 2.66"  296×152   DS026F / STag26
-- 2.67"  384×200   DS027Q
-- 2.9"   296×128   DS029Q / STag29 / MTag29
-- 3.5"   384×184   DS035Q
-- 4.2"   400×300   DS042Q / STag42 / MTag42
-- 4.3"   522×152   DS043Q
-- 5.83"  648×480   STag58 / MTag58
-- 7.5"   800×480   MTag75
-- 11.6"  960×640   DS116 / STag116

-- ============================================================================
-- tpl_standard — Standard price tag
-- ============================================================================

INSERT INTO template_variants (id, template_id, tag_model, width, height, layout_json) VALUES

-- 1.54" 152×152
('tv_std_154', 'tpl_standard', 'MTAG15', 152, 152,
 '{"width":152,"height":152,"background":"white","elements":[{"type":"text","field":"name","x":8,"y":24,"fontSize":14,"fontWeight":"bold","align":"left","color":"black","maxLines":2,"w":136},{"type":"line","x1":8,"y1":48,"x2":144,"y2":48,"color":"black","strokeWidth":1},{"type":"text","field":"price","x":8,"y":100,"fontSize":36,"fontWeight":"bold","align":"left","color":"black"},{"type":"text","field":"unit","x":8,"y":120,"fontSize":10,"fontWeight":"normal","align":"left","color":"black"}]}'),

-- 2.13" 250×122
('tv_std_213', 'tpl_standard', 'ESL-2.13', 250, 122,
 '{"width":250,"height":122,"background":"white","elements":[{"type":"text","field":"name","x":10,"y":24,"fontSize":16,"fontWeight":"bold","align":"left","color":"black","maxLines":2,"w":230},{"type":"line","x1":10,"y1":48,"x2":240,"y2":48,"color":"black","strokeWidth":1},{"type":"text","field":"price","x":10,"y":90,"fontSize":32,"fontWeight":"bold","align":"left","color":"black"},{"type":"text","field":"unit","x":10,"y":112,"fontSize":11,"fontWeight":"normal","align":"left","color":"black"}]}'),

-- 2.66" 296×152
('tv_std_266', 'tpl_standard', 'DS026F', 296, 152,
 '{"width":296,"height":152,"background":"white","elements":[{"type":"text","field":"name","x":12,"y":28,"fontSize":18,"fontWeight":"bold","align":"left","color":"black","maxLines":2,"w":272},{"type":"line","x1":12,"y1":56,"x2":284,"y2":56,"color":"black","strokeWidth":1},{"type":"text","field":"price","x":12,"y":108,"fontSize":36,"fontWeight":"bold","align":"left","color":"black"},{"type":"text","field":"unit","x":12,"y":138,"fontSize":12,"fontWeight":"normal","align":"left","color":"black"}]}'),

-- 2.67" 384×200
('tv_std_267', 'tpl_standard', 'DS027Q', 384, 200,
 '{"width":384,"height":200,"background":"white","elements":[{"type":"text","field":"name","x":16,"y":32,"fontSize":20,"fontWeight":"bold","align":"left","color":"black","maxLines":2,"w":352},{"type":"line","x1":16,"y1":64,"x2":368,"y2":64,"color":"black","strokeWidth":1},{"type":"text","field":"price","x":16,"y":130,"fontSize":44,"fontWeight":"bold","align":"left","color":"black"},{"type":"text","field":"unit","x":16,"y":180,"fontSize":14,"fontWeight":"normal","align":"left","color":"black"}]}'),

-- 2.9" 296×128
('tv_std_290', 'tpl_standard', 'ESL-2.9', 296, 128,
 '{"width":296,"height":128,"background":"white","elements":[{"type":"text","field":"name","x":12,"y":28,"fontSize":18,"fontWeight":"bold","align":"left","color":"black","maxLines":2,"w":272},{"type":"line","x1":12,"y1":52,"x2":284,"y2":52,"color":"black","strokeWidth":1},{"type":"text","field":"price","x":12,"y":95,"fontSize":36,"fontWeight":"bold","align":"left","color":"black"},{"type":"text","field":"unit","x":12,"y":118,"fontSize":12,"fontWeight":"normal","align":"left","color":"black"}]}'),

-- 3.5" 384×184
('tv_std_350', 'tpl_standard', 'DS035Q', 384, 184,
 '{"width":384,"height":184,"background":"white","elements":[{"type":"text","field":"name","x":16,"y":30,"fontSize":20,"fontWeight":"bold","align":"left","color":"black","maxLines":2,"w":352},{"type":"line","x1":16,"y1":60,"x2":368,"y2":60,"color":"black","strokeWidth":1},{"type":"text","field":"price","x":16,"y":120,"fontSize":42,"fontWeight":"bold","align":"left","color":"black"},{"type":"text","field":"unit","x":16,"y":168,"fontSize":13,"fontWeight":"normal","align":"left","color":"black"}]}'),

-- 4.2" 400×300
('tv_std_420', 'tpl_standard', 'ESL-4.2', 400, 300,
 '{"width":400,"height":300,"background":"white","elements":[{"type":"text","field":"name","x":20,"y":40,"fontSize":24,"fontWeight":"bold","align":"left","color":"black","maxLines":2,"w":360},{"type":"line","x1":20,"y1":80,"x2":380,"y2":80,"color":"black","strokeWidth":1},{"type":"text","field":"price","x":20,"y":180,"fontSize":64,"fontWeight":"bold","align":"left","color":"black"},{"type":"text","field":"unit","x":20,"y":260,"fontSize":16,"fontWeight":"normal","align":"left","color":"black"}]}'),

-- 4.3" 522×152
('tv_std_430', 'tpl_standard', 'DS043Q', 522, 152,
 '{"width":522,"height":152,"background":"white","elements":[{"type":"text","field":"name","x":16,"y":28,"fontSize":18,"fontWeight":"bold","align":"left","color":"black","maxLines":2,"w":240},{"type":"line","x1":16,"y1":56,"x2":506,"y2":56,"color":"black","strokeWidth":1},{"type":"text","field":"price","x":280,"y":100,"fontSize":48,"fontWeight":"bold","align":"left","color":"black"},{"type":"text","field":"unit","x":280,"y":136,"fontSize":13,"fontWeight":"normal","align":"left","color":"black"}]}'),

-- 5.83" 648×480
('tv_std_583', 'tpl_standard', 'ESL-5.83', 648, 480,
 '{"width":648,"height":480,"background":"white","elements":[{"type":"text","field":"name","x":30,"y":60,"fontSize":32,"fontWeight":"bold","align":"left","color":"black","maxLines":3,"w":588},{"type":"line","x1":30,"y1":120,"x2":618,"y2":120,"color":"black","strokeWidth":2},{"type":"text","field":"price","x":30,"y":280,"fontSize":96,"fontWeight":"bold","align":"left","color":"black"},{"type":"text","field":"unit","x":30,"y":400,"fontSize":22,"fontWeight":"normal","align":"left","color":"black"}]}'),

-- 7.5" 800×480
('tv_std_750', 'tpl_standard', 'ESL-7.5', 800, 480,
 '{"width":800,"height":480,"background":"white","elements":[{"type":"text","field":"name","x":40,"y":60,"fontSize":36,"fontWeight":"bold","align":"left","color":"black","maxLines":2,"w":720},{"type":"line","x1":40,"y1":110,"x2":760,"y2":110,"color":"black","strokeWidth":2},{"type":"text","field":"price","x":40,"y":280,"fontSize":108,"fontWeight":"bold","align":"left","color":"black"},{"type":"text","field":"unit","x":40,"y":420,"fontSize":24,"fontWeight":"normal","align":"left","color":"black"}]}'),

-- 11.6" 960×640
('tv_std_116', 'tpl_standard', 'ESL-11.6', 960, 640,
 '{"width":960,"height":640,"background":"white","elements":[{"type":"text","field":"name","x":48,"y":72,"fontSize":42,"fontWeight":"bold","align":"left","color":"black","maxLines":2,"w":864},{"type":"line","x1":48,"y1":140,"x2":912,"y2":140,"color":"black","strokeWidth":2},{"type":"text","field":"price","x":48,"y":360,"fontSize":128,"fontWeight":"bold","align":"left","color":"black"},{"type":"text","field":"unit","x":48,"y":540,"fontSize":28,"fontWeight":"normal","align":"left","color":"black"}]}');


-- ============================================================================
-- tpl_promo — Promo highlight (red banner + discount)
-- ============================================================================

INSERT INTO template_variants (id, template_id, tag_model, width, height, layout_json) VALUES

('tv_prm_154', 'tpl_promo', 'MTAG15', 152, 152,
 '{"width":152,"height":152,"background":"white","elements":[{"type":"rect","x":0,"y":0,"w":152,"h":30,"color":"red"},{"type":"label","text":"SALE","x":8,"y":22,"fontSize":14,"fontWeight":"bold","color":"white"},{"type":"text","field":"name","x":8,"y":52,"fontSize":13,"fontWeight":"bold","align":"left","color":"black","maxLines":2,"w":136},{"type":"text","field":"price","x":8,"y":100,"fontSize":32,"fontWeight":"bold","align":"left","color":"black"},{"type":"label","text":"Rabais de 20%","x":8,"y":138,"fontSize":9,"fontWeight":"bold","color":"red"}]}'),

('tv_prm_213', 'tpl_promo', 'ESL-2.13', 250, 122,
 '{"width":250,"height":122,"background":"white","elements":[{"type":"rect","x":0,"y":0,"w":250,"h":32,"color":"red"},{"type":"label","text":"SALE","x":10,"y":23,"fontSize":15,"fontWeight":"bold","color":"white"},{"type":"text","field":"name","x":10,"y":56,"fontSize":14,"fontWeight":"bold","align":"left","color":"black","maxLines":2,"w":230},{"type":"text","field":"price","x":10,"y":90,"fontSize":28,"fontWeight":"bold","align":"left","color":"black"},{"type":"label","text":"Rabais de 20%","x":130,"y":90,"fontSize":10,"fontWeight":"bold","color":"red"}]}'),

('tv_prm_266', 'tpl_promo', 'DS026F', 296, 152,
 '{"width":296,"height":152,"background":"white","elements":[{"type":"rect","x":0,"y":0,"w":296,"h":36,"color":"red"},{"type":"label","text":"SALE","x":12,"y":26,"fontSize":16,"fontWeight":"bold","color":"white"},{"type":"text","field":"name","x":12,"y":60,"fontSize":15,"fontWeight":"bold","align":"left","color":"black","maxLines":2,"w":272},{"type":"text","field":"price","x":12,"y":108,"fontSize":34,"fontWeight":"bold","align":"left","color":"black"},{"type":"label","text":"Rabais de 20%","x":150,"y":108,"fontSize":11,"fontWeight":"bold","color":"red"}]}'),

('tv_prm_267', 'tpl_promo', 'DS027Q', 384, 200,
 '{"width":384,"height":200,"background":"white","elements":[{"type":"rect","x":0,"y":0,"w":384,"h":40,"color":"red"},{"type":"label","text":"SALE","x":16,"y":30,"fontSize":18,"fontWeight":"bold","color":"white"},{"type":"text","field":"name","x":16,"y":68,"fontSize":18,"fontWeight":"bold","align":"left","color":"black","maxLines":2,"w":352},{"type":"text","field":"price","x":16,"y":135,"fontSize":42,"fontWeight":"bold","align":"left","color":"black"},{"type":"label","text":"Rabais de 20%","x":200,"y":135,"fontSize":13,"fontWeight":"bold","color":"red"}]}'),

('tv_prm_290', 'tpl_promo', 'ESL-2.9', 296, 128,
 '{"width":296,"height":128,"background":"white","elements":[{"type":"rect","x":0,"y":0,"w":296,"h":32,"color":"red"},{"type":"label","text":"SALE","x":12,"y":24,"fontSize":15,"fontWeight":"bold","color":"white"},{"type":"text","field":"name","x":12,"y":54,"fontSize":14,"fontWeight":"bold","align":"left","color":"black","maxLines":2,"w":272},{"type":"text","field":"price","x":12,"y":92,"fontSize":30,"fontWeight":"bold","align":"left","color":"black"},{"type":"label","text":"Rabais de 20%","x":140,"y":92,"fontSize":10,"fontWeight":"bold","color":"red"}]}'),

('tv_prm_350', 'tpl_promo', 'DS035Q', 384, 184,
 '{"width":384,"height":184,"background":"white","elements":[{"type":"rect","x":0,"y":0,"w":384,"h":38,"color":"red"},{"type":"label","text":"SALE","x":16,"y":28,"fontSize":17,"fontWeight":"bold","color":"white"},{"type":"text","field":"name","x":16,"y":62,"fontSize":17,"fontWeight":"bold","align":"left","color":"black","maxLines":2,"w":352},{"type":"text","field":"price","x":16,"y":126,"fontSize":40,"fontWeight":"bold","align":"left","color":"black"},{"type":"label","text":"Rabais de 20%","x":190,"y":126,"fontSize":12,"fontWeight":"bold","color":"red"}]}'),

('tv_prm_420', 'tpl_promo', 'ESL-4.2', 400, 300,
 '{"width":400,"height":300,"background":"white","elements":[{"type":"rect","x":0,"y":0,"w":400,"h":50,"color":"red"},{"type":"label","text":"SALE","x":20,"y":36,"fontSize":22,"fontWeight":"bold","color":"white"},{"type":"text","field":"name","x":20,"y":80,"fontSize":22,"fontWeight":"bold","align":"left","color":"black","maxLines":2,"w":360},{"type":"text","field":"price","x":20,"y":180,"fontSize":60,"fontWeight":"bold","align":"left","color":"black"},{"type":"label","text":"Rabais de 20%","x":20,"y":260,"fontSize":16,"fontWeight":"bold","color":"red"}]}'),

('tv_prm_430', 'tpl_promo', 'DS043Q', 522, 152,
 '{"width":522,"height":152,"background":"white","elements":[{"type":"rect","x":0,"y":0,"w":522,"h":34,"color":"red"},{"type":"label","text":"SALE","x":16,"y":25,"fontSize":16,"fontWeight":"bold","color":"white"},{"type":"text","field":"name","x":16,"y":56,"fontSize":16,"fontWeight":"bold","align":"left","color":"black","maxLines":2,"w":240},{"type":"text","field":"price","x":300,"y":90,"fontSize":42,"fontWeight":"bold","align":"left","color":"black"},{"type":"label","text":"Rabais de 20%","x":300,"y":136,"fontSize":11,"fontWeight":"bold","color":"red"}]}'),

('tv_prm_583', 'tpl_promo', 'ESL-5.83', 648, 480,
 '{"width":648,"height":480,"background":"white","elements":[{"type":"rect","x":0,"y":0,"w":648,"h":70,"color":"red"},{"type":"label","text":"SALE","x":30,"y":50,"fontSize":32,"fontWeight":"bold","color":"white"},{"type":"text","field":"name","x":30,"y":110,"fontSize":28,"fontWeight":"bold","align":"left","color":"black","maxLines":3,"w":588},{"type":"text","field":"price","x":30,"y":280,"fontSize":88,"fontWeight":"bold","align":"left","color":"black"},{"type":"label","text":"Rabais de 20%","x":30,"y":400,"fontSize":22,"fontWeight":"bold","color":"red"}]}'),

('tv_prm_750', 'tpl_promo', 'ESL-7.5', 800, 480,
 '{"width":800,"height":480,"background":"white","elements":[{"type":"rect","x":0,"y":0,"w":800,"h":70,"color":"red"},{"type":"label","text":"SALE","x":40,"y":50,"fontSize":34,"fontWeight":"bold","color":"white"},{"type":"text","field":"name","x":40,"y":110,"fontSize":30,"fontWeight":"bold","align":"left","color":"black","maxLines":2,"w":720},{"type":"text","field":"price","x":40,"y":270,"fontSize":100,"fontWeight":"bold","align":"left","color":"black"},{"type":"label","text":"Rabais de 20%","x":40,"y":410,"fontSize":24,"fontWeight":"bold","color":"red"}]}'),

('tv_prm_116', 'tpl_promo', 'ESL-11.6', 960, 640,
 '{"width":960,"height":640,"background":"white","elements":[{"type":"rect","x":0,"y":0,"w":960,"h":90,"color":"red"},{"type":"label","text":"SALE","x":48,"y":64,"fontSize":40,"fontWeight":"bold","color":"white"},{"type":"text","field":"name","x":48,"y":140,"fontSize":36,"fontWeight":"bold","align":"left","color":"black","maxLines":2,"w":864},{"type":"text","field":"price","x":48,"y":340,"fontSize":120,"fontWeight":"bold","align":"left","color":"black"},{"type":"label","text":"Rabais de 20%","x":48,"y":520,"fontSize":28,"fontWeight":"bold","color":"red"}]}');


-- ============================================================================
-- tpl_minimal — Minimal clean design
-- ============================================================================

INSERT INTO template_variants (id, template_id, tag_model, width, height, layout_json) VALUES

('tv_min_154', 'tpl_minimal', 'MTAG15', 152, 152,
 '{"width":152,"height":152,"background":"white","elements":[{"type":"text","field":"name","x":12,"y":40,"fontSize":13,"fontWeight":"normal","align":"center","color":"black","maxLines":2,"w":128},{"type":"text","field":"price","x":12,"y":100,"fontSize":36,"fontWeight":"bold","align":"center","color":"black","w":128},{"type":"text","field":"unit","x":12,"y":134,"fontSize":9,"fontWeight":"normal","align":"center","color":"black","w":128}]}'),

('tv_min_213', 'tpl_minimal', 'ESL-2.13', 250, 122,
 '{"width":250,"height":122,"background":"white","elements":[{"type":"text","field":"name","x":10,"y":30,"fontSize":13,"fontWeight":"normal","align":"center","color":"black","maxLines":2,"w":230},{"type":"text","field":"price","x":10,"y":82,"fontSize":36,"fontWeight":"bold","align":"center","color":"black","w":230},{"type":"text","field":"unit","x":10,"y":112,"fontSize":10,"fontWeight":"normal","align":"center","color":"black","w":230}]}'),

('tv_min_266', 'tpl_minimal', 'DS026F', 296, 152,
 '{"width":296,"height":152,"background":"white","elements":[{"type":"text","field":"name","x":12,"y":34,"fontSize":14,"fontWeight":"normal","align":"center","color":"black","maxLines":2,"w":272},{"type":"text","field":"price","x":12,"y":100,"fontSize":42,"fontWeight":"bold","align":"center","color":"black","w":272},{"type":"text","field":"unit","x":12,"y":140,"fontSize":11,"fontWeight":"normal","align":"center","color":"black","w":272}]}'),

('tv_min_267', 'tpl_minimal', 'DS027Q', 384, 200,
 '{"width":384,"height":200,"background":"white","elements":[{"type":"text","field":"name","x":16,"y":40,"fontSize":16,"fontWeight":"normal","align":"center","color":"black","maxLines":2,"w":352},{"type":"text","field":"price","x":16,"y":120,"fontSize":52,"fontWeight":"bold","align":"center","color":"black","w":352},{"type":"text","field":"unit","x":16,"y":178,"fontSize":13,"fontWeight":"normal","align":"center","color":"black","w":352}]}'),

('tv_min_290', 'tpl_minimal', 'ESL-2.9', 296, 128,
 '{"width":296,"height":128,"background":"white","elements":[{"type":"text","field":"name","x":12,"y":28,"fontSize":13,"fontWeight":"normal","align":"center","color":"black","maxLines":2,"w":272},{"type":"text","field":"price","x":12,"y":82,"fontSize":36,"fontWeight":"bold","align":"center","color":"black","w":272},{"type":"text","field":"unit","x":12,"y":116,"fontSize":10,"fontWeight":"normal","align":"center","color":"black","w":272}]}'),

('tv_min_350', 'tpl_minimal', 'DS035Q', 384, 184,
 '{"width":384,"height":184,"background":"white","elements":[{"type":"text","field":"name","x":16,"y":36,"fontSize":15,"fontWeight":"normal","align":"center","color":"black","maxLines":2,"w":352},{"type":"text","field":"price","x":16,"y":110,"fontSize":48,"fontWeight":"bold","align":"center","color":"black","w":352},{"type":"text","field":"unit","x":16,"y":168,"fontSize":12,"fontWeight":"normal","align":"center","color":"black","w":352}]}'),

('tv_min_420', 'tpl_minimal', 'ESL-4.2', 400, 300,
 '{"width":400,"height":300,"background":"white","elements":[{"type":"text","field":"name","x":20,"y":60,"fontSize":20,"fontWeight":"normal","align":"center","color":"black","maxLines":2,"w":360},{"type":"text","field":"price","x":20,"y":170,"fontSize":72,"fontWeight":"bold","align":"center","color":"black","w":360},{"type":"text","field":"unit","x":20,"y":260,"fontSize":16,"fontWeight":"normal","align":"center","color":"black","w":360}]}'),

('tv_min_430', 'tpl_minimal', 'DS043Q', 522, 152,
 '{"width":522,"height":152,"background":"white","elements":[{"type":"text","field":"name","x":16,"y":36,"fontSize":15,"fontWeight":"normal","align":"left","color":"black","maxLines":2,"w":240},{"type":"text","field":"price","x":280,"y":90,"fontSize":48,"fontWeight":"bold","align":"center","color":"black","w":226},{"type":"text","field":"unit","x":280,"y":138,"fontSize":11,"fontWeight":"normal","align":"center","color":"black","w":226}]}'),

('tv_min_583', 'tpl_minimal', 'ESL-5.83', 648, 480,
 '{"width":648,"height":480,"background":"white","elements":[{"type":"text","field":"name","x":30,"y":100,"fontSize":26,"fontWeight":"normal","align":"center","color":"black","maxLines":3,"w":588},{"type":"text","field":"price","x":30,"y":270,"fontSize":96,"fontWeight":"bold","align":"center","color":"black","w":588},{"type":"text","field":"unit","x":30,"y":400,"fontSize":20,"fontWeight":"normal","align":"center","color":"black","w":588}]}'),

('tv_min_750', 'tpl_minimal', 'ESL-7.5', 800, 480,
 '{"width":800,"height":480,"background":"white","elements":[{"type":"text","field":"name","x":40,"y":80,"fontSize":28,"fontWeight":"normal","align":"center","color":"black","maxLines":2,"w":720},{"type":"text","field":"price","x":40,"y":260,"fontSize":108,"fontWeight":"bold","align":"center","color":"black","w":720},{"type":"text","field":"unit","x":40,"y":410,"fontSize":22,"fontWeight":"normal","align":"center","color":"black","w":720}]}'),

('tv_min_116', 'tpl_minimal', 'ESL-11.6', 960, 640,
 '{"width":960,"height":640,"background":"white","elements":[{"type":"text","field":"name","x":48,"y":100,"fontSize":34,"fontWeight":"normal","align":"center","color":"black","maxLines":2,"w":864},{"type":"text","field":"price","x":48,"y":340,"fontSize":128,"fontWeight":"bold","align":"center","color":"black","w":864},{"type":"text","field":"unit","x":48,"y":530,"fontSize":26,"fontWeight":"normal","align":"center","color":"black","w":864}]}');


-- ============================================================================
-- tpl_info — Info card (category + name + price)
-- ============================================================================

INSERT INTO template_variants (id, template_id, tag_model, width, height, layout_json) VALUES

('tv_inf_154', 'tpl_info', 'MTAG15', 152, 152,
 '{"width":152,"height":152,"background":"white","elements":[{"type":"text","field":"category","x":8,"y":18,"fontSize":10,"fontWeight":"normal","align":"left","color":"black"},{"type":"text","field":"name","x":8,"y":40,"fontSize":15,"fontWeight":"bold","align":"left","color":"black","maxLines":2,"w":136},{"type":"line","x1":8,"y1":68,"x2":144,"y2":68,"color":"black","strokeWidth":1},{"type":"text","field":"price","x":92,"y":120,"fontSize":30,"fontWeight":"bold","align":"right","color":"black","w":52},{"type":"text","field":"unit","x":8,"y":138,"fontSize":9,"fontWeight":"normal","align":"left","color":"black"}]}'),

('tv_inf_213', 'tpl_info', 'ESL-2.13', 250, 122,
 '{"width":250,"height":122,"background":"white","elements":[{"type":"text","field":"category","x":10,"y":16,"fontSize":10,"fontWeight":"normal","align":"left","color":"black"},{"type":"text","field":"name","x":10,"y":38,"fontSize":16,"fontWeight":"bold","align":"left","color":"black","maxLines":2,"w":230},{"type":"line","x1":10,"y1":62,"x2":240,"y2":62,"color":"black","strokeWidth":1},{"type":"text","field":"price","x":150,"y":100,"fontSize":32,"fontWeight":"bold","align":"right","color":"black","w":90},{"type":"text","field":"unit","x":10,"y":108,"fontSize":10,"fontWeight":"normal","align":"left","color":"black"}]}'),

('tv_inf_266', 'tpl_info', 'DS026F', 296, 152,
 '{"width":296,"height":152,"background":"white","elements":[{"type":"text","field":"category","x":12,"y":18,"fontSize":11,"fontWeight":"normal","align":"left","color":"black"},{"type":"text","field":"name","x":12,"y":42,"fontSize":18,"fontWeight":"bold","align":"left","color":"black","maxLines":2,"w":272},{"type":"line","x1":12,"y1":72,"x2":284,"y2":72,"color":"black","strokeWidth":1},{"type":"text","field":"price","x":180,"y":120,"fontSize":36,"fontWeight":"bold","align":"right","color":"black","w":104},{"type":"text","field":"unit","x":12,"y":136,"fontSize":11,"fontWeight":"normal","align":"left","color":"black"}]}'),

('tv_inf_267', 'tpl_info', 'DS027Q', 384, 200,
 '{"width":384,"height":200,"background":"white","elements":[{"type":"text","field":"category","x":16,"y":22,"fontSize":12,"fontWeight":"normal","align":"left","color":"black"},{"type":"text","field":"name","x":16,"y":48,"fontSize":20,"fontWeight":"bold","align":"left","color":"black","maxLines":2,"w":352},{"type":"line","x1":16,"y1":84,"x2":368,"y2":84,"color":"black","strokeWidth":1},{"type":"text","field":"price","x":220,"y":150,"fontSize":44,"fontWeight":"bold","align":"right","color":"black","w":148},{"type":"text","field":"unit","x":16,"y":178,"fontSize":13,"fontWeight":"normal","align":"left","color":"black"}]}'),

('tv_inf_290', 'tpl_info', 'ESL-2.9', 296, 128,
 '{"width":296,"height":128,"background":"white","elements":[{"type":"text","field":"category","x":12,"y":16,"fontSize":10,"fontWeight":"normal","align":"left","color":"black"},{"type":"text","field":"name","x":12,"y":36,"fontSize":16,"fontWeight":"bold","align":"left","color":"black","maxLines":2,"w":272},{"type":"line","x1":12,"y1":60,"x2":284,"y2":60,"color":"black","strokeWidth":1},{"type":"text","field":"price","x":180,"y":100,"fontSize":32,"fontWeight":"bold","align":"right","color":"black","w":104},{"type":"text","field":"unit","x":12,"y":116,"fontSize":10,"fontWeight":"normal","align":"left","color":"black"}]}'),

('tv_inf_350', 'tpl_info', 'DS035Q', 384, 184,
 '{"width":384,"height":184,"background":"white","elements":[{"type":"text","field":"category","x":16,"y":20,"fontSize":12,"fontWeight":"normal","align":"left","color":"black"},{"type":"text","field":"name","x":16,"y":44,"fontSize":19,"fontWeight":"bold","align":"left","color":"black","maxLines":2,"w":352},{"type":"line","x1":16,"y1":78,"x2":368,"y2":78,"color":"black","strokeWidth":1},{"type":"text","field":"price","x":220,"y":140,"fontSize":40,"fontWeight":"bold","align":"right","color":"black","w":148},{"type":"text","field":"unit","x":16,"y":168,"fontSize":12,"fontWeight":"normal","align":"left","color":"black"}]}'),

('tv_inf_420', 'tpl_info', 'ESL-4.2', 400, 300,
 '{"width":400,"height":300,"background":"white","elements":[{"type":"text","field":"category","x":20,"y":30,"fontSize":14,"fontWeight":"normal","align":"left","color":"black"},{"type":"text","field":"name","x":20,"y":60,"fontSize":24,"fontWeight":"bold","align":"left","color":"black","maxLines":3,"w":360},{"type":"line","x1":20,"y1":120,"x2":380,"y2":120,"color":"black","strokeWidth":1},{"type":"text","field":"price","x":200,"y":220,"fontSize":60,"fontWeight":"bold","align":"right","color":"black","w":180},{"type":"text","field":"unit","x":20,"y":268,"fontSize":16,"fontWeight":"normal","align":"left","color":"black"}]}'),

('tv_inf_430', 'tpl_info', 'DS043Q', 522, 152,
 '{"width":522,"height":152,"background":"white","elements":[{"type":"text","field":"category","x":16,"y":18,"fontSize":11,"fontWeight":"normal","align":"left","color":"black"},{"type":"text","field":"name","x":16,"y":40,"fontSize":17,"fontWeight":"bold","align":"left","color":"black","maxLines":2,"w":250},{"type":"line","x1":280,"y1":16,"x2":280,"y2":136,"color":"black","strokeWidth":1},{"type":"text","field":"price","x":300,"y":80,"fontSize":42,"fontWeight":"bold","align":"left","color":"black"},{"type":"text","field":"unit","x":300,"y":130,"fontSize":12,"fontWeight":"normal","align":"left","color":"black"}]}'),

('tv_inf_583', 'tpl_info', 'ESL-5.83', 648, 480,
 '{"width":648,"height":480,"background":"white","elements":[{"type":"text","field":"category","x":30,"y":40,"fontSize":18,"fontWeight":"normal","align":"left","color":"black"},{"type":"text","field":"name","x":30,"y":80,"fontSize":30,"fontWeight":"bold","align":"left","color":"black","maxLines":3,"w":588},{"type":"line","x1":30,"y1":170,"x2":618,"y2":170,"color":"black","strokeWidth":2},{"type":"text","field":"price","x":300,"y":320,"fontSize":80,"fontWeight":"bold","align":"right","color":"black","w":318},{"type":"text","field":"unit","x":30,"y":400,"fontSize":20,"fontWeight":"normal","align":"left","color":"black"}]}'),

('tv_inf_750', 'tpl_info', 'ESL-7.5', 800, 480,
 '{"width":800,"height":480,"background":"white","elements":[{"type":"text","field":"category","x":40,"y":40,"fontSize":20,"fontWeight":"normal","align":"left","color":"black"},{"type":"text","field":"name","x":40,"y":80,"fontSize":34,"fontWeight":"bold","align":"left","color":"black","maxLines":2,"w":720},{"type":"line","x1":40,"y1":140,"x2":760,"y2":140,"color":"black","strokeWidth":2},{"type":"text","field":"price","x":400,"y":300,"fontSize":96,"fontWeight":"bold","align":"right","color":"black","w":360},{"type":"text","field":"unit","x":40,"y":420,"fontSize":22,"fontWeight":"normal","align":"left","color":"black"}]}'),

('tv_inf_116', 'tpl_info', 'ESL-11.6', 960, 640,
 '{"width":960,"height":640,"background":"white","elements":[{"type":"text","field":"category","x":48,"y":50,"fontSize":24,"fontWeight":"normal","align":"left","color":"black"},{"type":"text","field":"name","x":48,"y":100,"fontSize":40,"fontWeight":"bold","align":"left","color":"black","maxLines":2,"w":864},{"type":"line","x1":48,"y1":180,"x2":912,"y2":180,"color":"black","strokeWidth":2},{"type":"text","field":"price","x":500,"y":380,"fontSize":120,"fontWeight":"bold","align":"right","color":"black","w":412},{"type":"text","field":"unit","x":48,"y":540,"fontSize":26,"fontWeight":"normal","align":"left","color":"black"}]}');


-- ============================================================================
-- tpl_bold — Bold shelf (dark background)
-- ============================================================================

INSERT INTO template_variants (id, template_id, tag_model, width, height, layout_json) VALUES

('tv_bld_154', 'tpl_bold', 'MTAG15', 152, 152,
 '{"width":152,"height":152,"background":"black","elements":[{"type":"text","field":"name","x":8,"y":30,"fontSize":13,"fontWeight":"normal","align":"center","color":"white","maxLines":2,"w":136},{"type":"text","field":"price","x":8,"y":100,"fontSize":38,"fontWeight":"bold","align":"center","color":"white","w":136},{"type":"text","field":"unit","x":8,"y":140,"fontSize":9,"fontWeight":"normal","align":"center","color":"white","w":136}]}'),

('tv_bld_213', 'tpl_bold', 'ESL-2.13', 250, 122,
 '{"width":250,"height":122,"background":"black","elements":[{"type":"text","field":"name","x":10,"y":26,"fontSize":13,"fontWeight":"normal","align":"center","color":"white","maxLines":2,"w":230},{"type":"text","field":"price","x":10,"y":80,"fontSize":36,"fontWeight":"bold","align":"center","color":"white","w":230},{"type":"text","field":"unit","x":10,"y":112,"fontSize":10,"fontWeight":"normal","align":"center","color":"white","w":230}]}'),

('tv_bld_266', 'tpl_bold', 'DS026F', 296, 152,
 '{"width":296,"height":152,"background":"black","elements":[{"type":"text","field":"name","x":12,"y":30,"fontSize":14,"fontWeight":"normal","align":"center","color":"white","maxLines":2,"w":272},{"type":"text","field":"price","x":12,"y":100,"fontSize":42,"fontWeight":"bold","align":"center","color":"white","w":272},{"type":"text","field":"unit","x":12,"y":140,"fontSize":11,"fontWeight":"normal","align":"center","color":"white","w":272}]}'),

('tv_bld_267', 'tpl_bold', 'DS027Q', 384, 200,
 '{"width":384,"height":200,"background":"black","elements":[{"type":"text","field":"name","x":16,"y":36,"fontSize":16,"fontWeight":"normal","align":"center","color":"white","maxLines":2,"w":352},{"type":"text","field":"price","x":16,"y":124,"fontSize":52,"fontWeight":"bold","align":"center","color":"white","w":352},{"type":"text","field":"unit","x":16,"y":182,"fontSize":13,"fontWeight":"normal","align":"center","color":"white","w":352}]}'),

('tv_bld_290', 'tpl_bold', 'ESL-2.9', 296, 128,
 '{"width":296,"height":128,"background":"black","elements":[{"type":"text","field":"name","x":12,"y":26,"fontSize":13,"fontWeight":"normal","align":"center","color":"white","maxLines":2,"w":272},{"type":"text","field":"price","x":12,"y":82,"fontSize":36,"fontWeight":"bold","align":"center","color":"white","w":272},{"type":"text","field":"unit","x":12,"y":116,"fontSize":10,"fontWeight":"normal","align":"center","color":"white","w":272}]}'),

('tv_bld_350', 'tpl_bold', 'DS035Q', 384, 184,
 '{"width":384,"height":184,"background":"black","elements":[{"type":"text","field":"name","x":16,"y":34,"fontSize":15,"fontWeight":"normal","align":"center","color":"white","maxLines":2,"w":352},{"type":"text","field":"price","x":16,"y":116,"fontSize":48,"fontWeight":"bold","align":"center","color":"white","w":352},{"type":"text","field":"unit","x":16,"y":170,"fontSize":12,"fontWeight":"normal","align":"center","color":"white","w":352}]}'),

('tv_bld_420', 'tpl_bold', 'ESL-4.2', 400, 300,
 '{"width":400,"height":300,"background":"black","elements":[{"type":"text","field":"name","x":20,"y":50,"fontSize":20,"fontWeight":"normal","align":"center","color":"white","maxLines":2,"w":360},{"type":"text","field":"price","x":20,"y":170,"fontSize":72,"fontWeight":"bold","align":"center","color":"white","w":360},{"type":"text","field":"unit","x":20,"y":262,"fontSize":16,"fontWeight":"normal","align":"center","color":"white","w":360}]}'),

('tv_bld_430', 'tpl_bold', 'DS043Q', 522, 152,
 '{"width":522,"height":152,"background":"black","elements":[{"type":"text","field":"name","x":16,"y":32,"fontSize":15,"fontWeight":"normal","align":"left","color":"white","maxLines":2,"w":240},{"type":"text","field":"price","x":280,"y":96,"fontSize":48,"fontWeight":"bold","align":"center","color":"white","w":226},{"type":"text","field":"unit","x":280,"y":140,"fontSize":11,"fontWeight":"normal","align":"center","color":"white","w":226}]}'),

('tv_bld_583', 'tpl_bold', 'ESL-5.83', 648, 480,
 '{"width":648,"height":480,"background":"black","elements":[{"type":"text","field":"name","x":30,"y":80,"fontSize":26,"fontWeight":"normal","align":"center","color":"white","maxLines":3,"w":588},{"type":"text","field":"price","x":30,"y":270,"fontSize":96,"fontWeight":"bold","align":"center","color":"white","w":588},{"type":"text","field":"unit","x":30,"y":400,"fontSize":20,"fontWeight":"normal","align":"center","color":"white","w":588}]}'),

('tv_bld_750', 'tpl_bold', 'ESL-7.5', 800, 480,
 '{"width":800,"height":480,"background":"black","elements":[{"type":"text","field":"name","x":40,"y":70,"fontSize":28,"fontWeight":"normal","align":"center","color":"white","maxLines":2,"w":720},{"type":"text","field":"price","x":40,"y":264,"fontSize":108,"fontWeight":"bold","align":"center","color":"white","w":720},{"type":"text","field":"unit","x":40,"y":416,"fontSize":22,"fontWeight":"normal","align":"center","color":"white","w":720}]}'),

('tv_bld_116', 'tpl_bold', 'ESL-11.6', 960, 640,
 '{"width":960,"height":640,"background":"black","elements":[{"type":"text","field":"name","x":48,"y":90,"fontSize":34,"fontWeight":"normal","align":"center","color":"white","maxLines":2,"w":864},{"type":"text","field":"price","x":48,"y":340,"fontSize":128,"fontWeight":"bold","align":"center","color":"white","w":864},{"type":"text","field":"unit","x":48,"y":536,"fontSize":26,"fontWeight":"normal","align":"center","color":"white","w":864}]}');
