import { Router } from "express";
import { db, productsTable, artisansTable, categoriesTable, customizationOptionsTable, insertProductSchema } from "@workspace/db";
import { eq, and, ilike, isNull, sql } from "drizzle-orm";

const router = Router();

function mapProduct(p: any) {
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.price,
    categoryId: p.categoryId,
    categoryName: p.categoryName ?? null,
    artisanId: p.artisanId,
    artisanName: p.artisanName ?? null,
    imageUrl: p.imageUrl,
    stock: p.stock,
    featured: p.featured,
    leadTimeDays: p.leadTimeDays,
    createdAt: p.createdAt instanceof Date ? p.createdAt.toISOString() : p.createdAt,
  };
}

router.get("/products", async (req, res) => {
  const { categoryId, artisanId, search } = req.query;
  const rows = await db.execute(sql`
    SELECT p.*, a.name AS "artisanName", c.name AS "categoryName"
    FROM products p
    LEFT JOIN artisans a ON a.id = p.artisan_id
    LEFT JOIN categories c ON c.id = p.category_id
    WHERE (${categoryId ? sql`p.category_id = ${Number(categoryId)}` : sql`true`})
      AND (${artisanId ? sql`p.artisan_id = ${Number(artisanId)}` : sql`true`})
      AND (${search ? sql`(p.name ILIKE ${'%' + search + '%'} OR p.description ILIKE ${'%' + search + '%'})` : sql`true`})
    ORDER BY p.featured DESC, p.created_at DESC
  `);
  res.json(rows.rows.map(mapProduct));
});

router.post("/products", async (req, res) => {
  const parsed = insertProductSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
  const [product] = await db.insert(productsTable).values(parsed.data).returning();
  res.status(201).json(mapProduct({ ...product, artisanName: null, categoryName: null }));
});

router.get("/products/featured", async (req, res) => {
  const rows = await db.execute(sql`
    SELECT p.*, a.name AS "artisanName", c.name AS "categoryName"
    FROM products p
    LEFT JOIN artisans a ON a.id = p.artisan_id
    LEFT JOIN categories c ON c.id = p.category_id
    WHERE p.featured = true
    ORDER BY p.created_at DESC
    LIMIT 12
  `);
  res.json(rows.rows.map(mapProduct));
});

router.get("/products/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

  const rows = await db.execute(sql`
    SELECT p.*, a.name AS "artisanName", a.bio AS "artisanBio", a.location AS "artisanLocation",
           c.name AS "categoryName"
    FROM products p
    LEFT JOIN artisans a ON a.id = p.artisan_id
    LEFT JOIN categories c ON c.id = p.category_id
    WHERE p.id = ${id}
  `);
  const product = rows.rows[0];
  if (!product) return res.status(404).json({ error: "Not found" });

  const customizations = await db.select().from(customizationOptionsTable)
    .where(eq(customizationOptionsTable.productId, id));

  res.json({
    ...mapProduct(product),
    artisanBio: (product as any).artisanBio ?? null,
    artisanLocation: (product as any).artisanLocation ?? null,
    customizations: customizations.map(c => ({
      id: c.id,
      productId: c.productId,
      name: c.name,
      type: c.type,
      choices: c.choices,
      required: c.required,
      priceDelta: c.priceDelta,
    })),
  });
});

router.patch("/products/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
  const [updated] = await db.update(productsTable).set(req.body).where(eq(productsTable.id, id)).returning();
  if (!updated) return res.status(404).json({ error: "Not found" });
  res.json(mapProduct({ ...updated, artisanName: null, categoryName: null }));
});

router.delete("/products/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
  await db.delete(productsTable).where(eq(productsTable.id, id));
  res.status(204).send();
});

router.get("/products/:id/customizations", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
  const options = await db.select().from(customizationOptionsTable)
    .where(eq(customizationOptionsTable.productId, id));
  res.json(options);
});

export default router;
