import { Router } from "express";
import { db, artisansTable, insertArtisanSchema } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/artisans", async (req, res) => {
  const artisans = await db.select().from(artisansTable).orderBy(artisansTable.name);
  res.json(artisans.map(a => ({
    ...a,
    createdAt: a.createdAt.toISOString(),
  })));
});

router.post("/artisans", async (req, res) => {
  const parsed = insertArtisanSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input" });
  }
  const [artisan] = await db.insert(artisansTable).values(parsed.data).returning();
  res.status(201).json({ ...artisan, createdAt: artisan.createdAt.toISOString() });
});

router.get("/artisans/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
  const [artisan] = await db.select().from(artisansTable).where(eq(artisansTable.id, id));
  if (!artisan) return res.status(404).json({ error: "Not found" });
  res.json({ ...artisan, createdAt: artisan.createdAt.toISOString() });
});

export default router;
