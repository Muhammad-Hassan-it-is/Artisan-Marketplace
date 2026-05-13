import { Router } from "express";
import { db, categoriesTable } from "@workspace/db";
import { sql } from "drizzle-orm";

const router = Router();

router.get("/categories", async (req, res) => {
  const rows = await db.execute(sql`
    SELECT c.id, c.name, c.slug, c.description,
      COUNT(p.id)::int AS "productCount"
    FROM categories c
    LEFT JOIN products p ON p.category_id = c.id
    GROUP BY c.id
    ORDER BY c.name
  `);
  res.json(rows.rows);
});

export default router;
