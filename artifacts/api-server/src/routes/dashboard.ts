import { Router } from "express";
import { db, ordersTable, productsTable, categoriesTable } from "@workspace/db";
import { sql, count } from "drizzle-orm";

const router = Router();

router.get("/dashboard/summary", async (req, res) => {
  const [productCount] = await db.select({ count: count() }).from(productsTable);
  const [orderCount] = await db.select({ count: count() }).from(ordersTable);

  const revenueResult = await db.execute(sql`SELECT COALESCE(SUM(total_amount), 0)::float AS revenue FROM orders`);
  const pendingResult = await db.execute(sql`SELECT COUNT(*)::int AS cnt FROM orders WHERE status = 'pending'`);
  const inProdResult = await db.execute(sql`SELECT COUNT(*)::int AS cnt FROM orders WHERE status = 'in_production'`);
  const recentResult = await db.execute(sql`SELECT COUNT(*)::int AS cnt FROM orders WHERE created_at > NOW() - INTERVAL '7 days'`);

  const topCatResult = await db.execute(sql`
    SELECT c.name, COUNT(p.id)::int AS count
    FROM categories c
    LEFT JOIN products p ON p.category_id = c.id
    GROUP BY c.name
    ORDER BY count DESC
    LIMIT 5
  `);

  res.json({
    totalProducts: productCount.count,
    totalOrders: orderCount.count,
    totalRevenue: (revenueResult.rows[0] as any).revenue,
    pendingOrders: (pendingResult.rows[0] as any).cnt,
    inProductionOrders: (inProdResult.rows[0] as any).cnt,
    recentOrdersCount: (recentResult.rows[0] as any).cnt,
    topCategories: topCatResult.rows.map((r: any) => ({ name: r.name, count: r.count })),
  });
});

export default router;
