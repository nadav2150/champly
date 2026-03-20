-- System templates + variants (layout_json = declarative canvas layout)
-- Re-run safe: replaces rows by primary key (keep tpl_* ids for existing product FKs)

-- 1. Standard price tag — clean shelf label
INSERT OR REPLACE INTO templates VALUES (
  'tpl_default',
  'Standard price tag',
  'Default shelf label with name, price, and unit',
  'price',
  '2025-01-01T00:00:00Z'
);

INSERT OR REPLACE INTO template_variants VALUES (
  'tv1',
  'tpl_default',
  'ESL-2.13',
  296,
  128,
  '{"width":296,"height":128,"background":"white","elements":[{"type":"text","field":"name","x":12,"y":28,"fontSize":18,"fontWeight":"bold","align":"left","color":"black","maxLines":2,"w":272},{"type":"line","x1":12,"y1":52,"x2":284,"y2":52,"color":"black","strokeWidth":1},{"type":"text","field":"price","x":12,"y":95,"fontSize":36,"fontWeight":"bold","align":"left","color":"black"},{"type":"text","field":"unit","x":12,"y":118,"fontSize":12,"fontWeight":"normal","align":"left","color":"black"}]}',
  NULL
);

-- 2. Promo highlight — red header with sale badge
INSERT OR REPLACE INTO templates VALUES (
  'tpl_promo',
  'Promo highlight',
  'Sale tag with discount badge and bold price',
  'promo',
  '2025-01-01T00:00:01Z'
);

INSERT OR REPLACE INTO template_variants VALUES (
  'tv2',
  'tpl_promo',
  'ESL-2.13',
  296,
  128,
  '{"width":296,"height":128,"background":"white","elements":[{"type":"rect","x":0,"y":0,"w":296,"h":36,"color":"red"},{"type":"label","text":"SALE","x":12,"y":26,"fontSize":16,"fontWeight":"bold","color":"white"},{"type":"text","field":"name","x":12,"y":60,"fontSize":15,"fontWeight":"bold","align":"left","color":"black","maxLines":1,"w":180},{"type":"text","field":"price","x":12,"y":98,"fontSize":36,"fontWeight":"bold","align":"left","color":"red"},{"type":"badge","field":"discount","x":150,"y":78,"fontSize":12,"fontWeight":"bold","color":"white","bgColor":"red","radius":4,"paddingX":8,"paddingY":4},{"type":"text","field":"unit","x":12,"y":122,"fontSize":11,"fontWeight":"normal","align":"left","color":"black"}]}',
  NULL
);

-- 3. Product showcase — image + specs (like the Watch example)
INSERT OR REPLACE INTO templates VALUES (
  'tpl_showcase',
  'Product showcase',
  'Product with image, price, discount badge, and detail lines',
  'showcase',
  '2025-01-01T00:00:02Z'
);

INSERT OR REPLACE INTO template_variants VALUES (
  'tv3',
  'tpl_showcase',
  'ESL-2.13',
  296,
  128,
  '{"width":296,"height":128,"background":"white","elements":[{"type":"text","field":"name","x":8,"y":16,"fontSize":14,"fontWeight":"bold","align":"left","color":"black","maxLines":1,"w":170},{"type":"text","field":"price","x":8,"y":42,"fontSize":26,"fontWeight":"bold","align":"left","color":"black"},{"type":"badge","field":"discount","x":8,"y":52,"fontSize":10,"fontWeight":"bold","color":"white","bgColor":"red","radius":3,"paddingX":6,"paddingY":3},{"type":"label","text":"Details","x":8,"y":82,"fontSize":9,"fontWeight":"bold","color":"black"},{"type":"text","field":"detail1","x":8,"y":94,"fontSize":9,"fontWeight":"normal","align":"left","color":"black","maxLines":1,"w":170},{"type":"text","field":"detail2","x":8,"y":106,"fontSize":9,"fontWeight":"normal","align":"left","color":"black","maxLines":1,"w":170},{"type":"text","field":"detail3","x":8,"y":118,"fontSize":9,"fontWeight":"normal","align":"left","color":"black","maxLines":1,"w":170},{"type":"image","field":"imageUrl","x":190,"y":8,"w":98,"h":112}]}',
  NULL
);

-- 4. Info card — name, category, compact price, unit
INSERT OR REPLACE INTO templates VALUES (
  'tpl_info',
  'Info card',
  'Name, category, and compact price',
  'info',
  '2025-01-01T00:00:03Z'
);

INSERT OR REPLACE INTO template_variants VALUES (
  'tv4',
  'tpl_info',
  'ESL-2.13',
  296,
  128,
  '{"width":296,"height":128,"background":"white","elements":[{"type":"text","field":"name","x":12,"y":24,"fontSize":17,"fontWeight":"bold","align":"left","color":"black","maxLines":2,"w":272},{"type":"text","field":"category","x":12,"y":48,"fontSize":12,"fontWeight":"normal","align":"left","color":"black","maxLines":1},{"type":"line","x1":12,"y1":62,"x2":284,"y2":62,"color":"black","strokeWidth":1},{"type":"text","field":"price","x":12,"y":100,"fontSize":28,"fontWeight":"bold","align":"left","color":"black"},{"type":"text","field":"unit","x":284,"y":100,"fontSize":12,"fontWeight":"normal","align":"right","color":"black"}]}',
  NULL
);

-- 5. Minimal — centered name and price only
INSERT OR REPLACE INTO templates VALUES (
  'tpl_minimal',
  'Minimal',
  'Centered name and price only',
  'price',
  '2025-01-01T00:00:04Z'
);

INSERT OR REPLACE INTO template_variants VALUES (
  'tv5',
  'tpl_minimal',
  'ESL-2.13',
  296,
  128,
  '{"width":296,"height":128,"background":"white","elements":[{"type":"text","field":"name","x":148,"y":48,"fontSize":15,"fontWeight":"bold","align":"center","color":"black","maxLines":2},{"type":"text","field":"price","x":148,"y":98,"fontSize":34,"fontWeight":"bold","align":"center","color":"black"}]}',
  NULL
);

-- 6. Bold shelf — black header bar with white text, large price below
INSERT OR REPLACE INTO templates VALUES (
  'tpl_bold',
  'Bold shelf',
  'Black header bar with large price and description',
  'price',
  '2025-01-01T00:00:05Z'
);

INSERT OR REPLACE INTO template_variants VALUES (
  'tv6',
  'tpl_bold',
  'ESL-2.13',
  296,
  128,
  '{"width":296,"height":128,"background":"white","elements":[{"type":"rect","x":0,"y":0,"w":296,"h":34,"color":"black"},{"type":"text","field":"name","x":12,"y":24,"fontSize":15,"fontWeight":"bold","align":"left","color":"white","maxLines":1,"w":272},{"type":"text","field":"price","x":148,"y":82,"fontSize":32,"fontWeight":"bold","align":"center","color":"black"},{"type":"text","field":"description","x":148,"y":108,"fontSize":11,"fontWeight":"normal","align":"center","color":"black","maxLines":1,"w":272},{"type":"text","field":"unit","x":148,"y":122,"fontSize":10,"fontWeight":"normal","align":"center","color":"black"}]}',
  NULL
);
