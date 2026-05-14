const now = new Date().toISOString();
const d = (daysAgo: number) => new Date(Date.now() - daysAgo * 86400000).toISOString();

export const categories = [
  { id: 1, name: "Ceramics & Pottery", slug: "ceramics-pottery", description: "Handthrown and hand-built ceramic works." },
  { id: 2, name: "Glass Art",          slug: "glass-art",         description: "Blown, fused, and cast glass pieces." },
  { id: 3, name: "Leather Goods",      slug: "leather-goods",     description: "Full-grain and vegetable-tanned leather products." },
  { id: 4, name: "Metalwork & Jewelry",slug: "metalwork-jewelry", description: "Forged, cast, and fabricated metal objects." },
  { id: 5, name: "Textiles & Weaving", slug: "textiles-weaving",  description: "Hand-loomed rugs, tapestries, and woven textiles." },
  { id: 6, name: "Woodworking",        slug: "woodworking",       description: "Furniture, joinery, and turned wooden objects." },
];

export const artisans = [
  { id: 1, name: "Clara Bautista",  specialty: "Metalwork & Jewelry", location: "Barcelona, Spain",  bio: "Metalsmith and jeweler working from her Barcelona studio. Clara creates architectural jewelry and sculptural objects using ancient lost-wax casting techniques.", rating: 4.7, totalOrders: 55,  imageUrl: null, createdAt: d(200) },
  { id: 2, name: "Elena Marchetti", specialty: "Ceramics & Stoneware", location: "Florence, Italy",   bio: "Third-generation ceramicist trained in Florence. Elena's work bridges classical Italian majolica tradition with a minimal modern aesthetic.", rating: 4.9, totalOrders: 142, imageUrl: null, createdAt: d(180) },
  { id: 3, name: "Ingrid Solberg",  specialty: "Fine Leatherwork",    location: "Oslo, Norway",       bio: "Norwegian leatherworker trained under a Hermès artisan. Ingrid produces bespoke leather goods using only full-grain hides and hand-stitching.", rating: 4.9, totalOrders: 67,  imageUrl: null, createdAt: d(160) },
  { id: 4, name: "James Okafor",    specialty: "Textiles & Tapestries",location: "Lagos, Nigeria",    bio: "Master weaver and textile artist working with hand-loomed West African patterns. James collaborates with local dye houses to produce colourfast, archive-quality textiles.", rating: 4.8, totalOrders: 89,  imageUrl: null, createdAt: d(150) },
  { id: 5, name: "Riku Heinonen",   specialty: "Studio Glass",        location: "Helsinki, Finland",  bio: "Finnish glassblower with 20 years of studio practice. Riku's work appears in Scandinavian design museums and private collections worldwide.", rating: 4.8, totalOrders: 38,  imageUrl: null, createdAt: d(120) },
  { id: 6, name: "Takeshi Mori",    specialty: "Furniture & Joinery", location: "Kyoto, Japan",       bio: "Fourth-generation woodworker from Kyoto's Higashiyama district. Specializes in shou sugi ban and traditional joinery without nails or glue.", rating: 5.0, totalOrders: 203, imageUrl: null, createdAt: d(100) },
];

export const products = [
  { id: 1,  name: "Matte Stoneware Dinnerware Set",      description: "A 16-piece dinnerware set in iron-rich stoneware with a matte ash glaze. Each piece is hand-thrown and food-safe.", price: 480,  categoryId: 1, artisanId: 2, imageUrl: null, stock: 12, featured: true,  leadTimeDays: 21, createdAt: d(30) },
  { id: 2,  name: "Hand-loomed Wool Runner",              description: "A 2.5m hand-loomed runner woven from undyed Icelandic wool. Naturally moth-resistant and highly durable.", price: 320,  categoryId: 5, artisanId: 4, imageUrl: null, stock: 8,  featured: true,  leadTimeDays: 30, createdAt: d(28) },
  { id: 3,  name: "Executive Portfolio — Full Grain",     description: "A slim A4 portfolio in full-grain saddle leather with a hand-stitched spine and pen loop. Develops a rich patina over time.", price: 295,  categoryId: 3, artisanId: 3, imageUrl: null, stock: 20, featured: true,  leadTimeDays: 14, createdAt: d(25) },
  { id: 4,  name: "Blown Glass Vessel Set",               description: "A trio of mouth-blown vessels in borosilicate glass with organic pulled-neck forms. Each set is unique.", price: 560,  categoryId: 2, artisanId: 5, imageUrl: null, stock: 5,  featured: false, leadTimeDays: 45, createdAt: d(22) },
  { id: 5,  name: "Sterling Signet Ring",                 description: "Cast from recycled sterling silver using the lost-wax technique. Available in sizes 48–64 with optional monogram engraving.", price: 185,  categoryId: 4, artisanId: 1, imageUrl: null, stock: 30, featured: false, leadTimeDays: 10, createdAt: d(20) },
  { id: 6,  name: "Walnut Side Table",                    description: "A solid American walnut side table with butterfly key joints and a natural oil finish. Flat-packed for shipping.", price: 1200, categoryId: 6, artisanId: 6, imageUrl: null, stock: 3,  featured: false, leadTimeDays: 60, createdAt: d(18) },
  { id: 7,  name: "Raku Tea Bowl",                        description: "A single raku-fired tea bowl in the Japanese tradition. Carbon-blackened body with crackle glaze interior. Each unique.", price: 145,  categoryId: 1, artisanId: 2, imageUrl: null, stock: 15, featured: false, leadTimeDays: 18, createdAt: d(15) },
  { id: 8,  name: "Bridle Leather Tote",                  description: "A roomy tote in bridle-tanned cowhide with a riveted base and natural brass hardware. Holds up to 15kg.", price: 420,  categoryId: 3, artisanId: 3, imageUrl: null, stock: 10, featured: false, leadTimeDays: 21, createdAt: d(12) },
  { id: 9,  name: "Copper Wall Panel",                    description: "Repoussé copper panel depicting a botanical motif. Each piece hammered, chased, and patinated by hand.", price: 890,  categoryId: 4, artisanId: 1, imageUrl: null, stock: 4,  featured: false, leadTimeDays: 35, createdAt: d(10) },
  { id: 10, name: "Indigo Flatweave Rug 2×3m",            description: "A 200×300cm flatweave rug in naturally fermented indigo and undyed cotton. Reversible and suitable for high traffic.", price: 680,  categoryId: 5, artisanId: 4, imageUrl: null, stock: 6,  featured: false, leadTimeDays: 40, createdAt: d(8)  },
  { id: 11, name: "Fused Glass Panel",                    description: "A 40×60cm kiln-formed fused glass panel with dichroic inclusions. Wall-mounted with stainless steel standoffs.", price: 730,  categoryId: 2, artisanId: 5, imageUrl: null, stock: 7,  featured: false, leadTimeDays: 50, createdAt: d(5)  },
  { id: 12, name: "Shou Sugi Ban Shelf",                  description: "A 120cm floating shelf in charred and wire-brushed cedar with a linseed oil finish. Rated to 40kg.", price: 390,  categoryId: 6, artisanId: 6, imageUrl: null, stock: 9,  featured: false, leadTimeDays: 28, createdAt: d(3)  },
];

export const customizations: any[] = [
  { id: 1,  productId: 1,  name: "Glaze Colour",   type: "select", choices: ["Ash White","Iron Black","Ocean Blue","Terracotta"], required: true,  priceDelta: 0    },
  { id: 2,  productId: 1,  name: "Piece Count",    type: "select", choices: ["8-piece","12-piece","16-piece"],                    required: true,  priceDelta: null },
  { id: 3,  productId: 2,  name: "Colourway",      type: "select", choices: ["Natural","Slate","Ochre","Forest"],                 required: true,  priceDelta: 0    },
  { id: 4,  productId: 2,  name: "Length",         type: "select", choices: ["1.5m","2m","2.5m","3m"],                           required: true,  priceDelta: null },
  { id: 5,  productId: 3,  name: "Leather Colour", type: "select", choices: ["Tan","Dark Brown","Black","Cognac"],               required: true,  priceDelta: 0    },
  { id: 6,  productId: 3,  name: "Monogram",       type: "text",   choices: [],                                                  required: false, priceDelta: 25   },
  { id: 7,  productId: 5,  name: "Ring Size",      type: "select", choices: ["48","50","52","54","56","58","60","62","64"],      required: true,  priceDelta: 0    },
  { id: 8,  productId: 5,  name: "Engraving",      type: "text",   choices: [],                                                  required: false, priceDelta: 40   },
  { id: 9,  productId: 6,  name: "Finish",         type: "select", choices: ["Natural Oil","Hard Wax","Unfinished"],             required: true,  priceDelta: 0    },
  { id: 10, productId: 12, name: "Length",         type: "select", choices: ["80cm","100cm","120cm","150cm"],                   required: true,  priceDelta: null },
];

let nextOrderId = 4;

export const orders: any[] = [
  {
    id: 1,
    companyName: "Nordic Interiors AB",
    contactName: "Sofie Lindqvist",
    contactEmail: "sofie@nordic-interiors.se",
    shippingAddress: "Strandvägen 12, Stockholm, Sweden",
    notes: "Please include a certificate of authenticity.",
    totalAmount: 800,
    status: "delivered",
    createdAt: d(45),
    updatedAt: d(30),
    items: [
      { id: 1, orderId: 1, productId: 1, productName: "Matte Stoneware Dinnerware Set", quantity: 1, unitPrice: 480, customizations: { "Glaze Colour": "Ash White", "Piece Count": "16-piece" } },
      { id: 2, orderId: 1, productId: 2, productName: "Hand-loomed Wool Runner",        quantity: 1, unitPrice: 320, customizations: { "Colourway": "Natural", "Length": "2.5m" } },
    ],
  },
  {
    id: 2,
    companyName: "Maison Dupont",
    contactName: "Émile Dupont",
    contactEmail: "emile@maisondupont.fr",
    shippingAddress: "14 Rue du Faubourg Saint-Honoré, Paris, France",
    notes: null,
    totalAmount: 590,
    status: "in_production",
    createdAt: d(10),
    updatedAt: d(8),
    items: [
      { id: 3, orderId: 2, productId: 3, productName: "Executive Portfolio — Full Grain", quantity: 2, unitPrice: 295, customizations: { "Leather Colour": "Dark Brown", "Monogram": "ED" } },
    ],
  },
  {
    id: 3,
    companyName: "Tokyo Design Studio",
    contactName: "Yuki Tanaka",
    contactEmail: "yuki@tds.jp",
    shippingAddress: "2-3-1 Aoyama, Minato-ku, Tokyo, Japan",
    notes: "Fragile — please double-box.",
    totalAmount: 560,
    status: "pending",
    createdAt: d(2),
    updatedAt: d(2),
    items: [
      { id: 4, orderId: 3, productId: 4, productName: "Blown Glass Vessel Set", quantity: 1, unitPrice: 560, customizations: {} },
    ],
  },
];

export function createOrder(body: any): any {
  const { companyName, contactName, contactEmail, shippingAddress, notes, items } = body;
  let totalAmount = 0;
  const resolvedItems: any[] = [];
  let nextItemId = orders.reduce((max, o) => Math.max(max, ...o.items.map((i: any) => i.id)), 0) + 1;

  for (const item of items) {
    const product = products.find(p => p.id === item.productId);
    if (!product) return null;
    totalAmount += product.price * item.quantity;
    resolvedItems.push({
      id: nextItemId++,
      orderId: nextOrderId,
      productId: product.id,
      productName: product.name,
      quantity: item.quantity,
      unitPrice: product.price,
      customizations: item.customizations ?? {},
    });
  }

  const ts = new Date().toISOString();
  const order = {
    id: nextOrderId++,
    companyName,
    contactName,
    contactEmail,
    shippingAddress: shippingAddress ?? null,
    notes: notes ?? null,
    totalAmount,
    status: "pending",
    createdAt: ts,
    updatedAt: ts,
    items: resolvedItems,
  };
  orders.push(order);
  return order;
}
