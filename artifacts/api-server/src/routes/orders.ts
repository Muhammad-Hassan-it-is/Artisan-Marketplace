import { Router } from "express";
import { db, ordersTable, orderItemsTable, productsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router = Router();

async function getOrderWithItems(orderId: number) {
  const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, orderId));
  if (!order) return null;
  const items = await db.select().from(orderItemsTable).where(eq(orderItemsTable.orderId, orderId));
  return {
    ...order,
    status: order.status,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    items: items.map(i => ({
      id: i.id,
      orderId: i.orderId,
      productId: i.productId,
      productName: i.productName,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
      customizations: i.customizations as Record<string, string>,
    })),
  };
}

router.get("/orders", async (req, res) => {
  const orders = await db.select().from(ordersTable).orderBy(desc(ordersTable.createdAt));
  const result = await Promise.all(orders.map(o => getOrderWithItems(o.id)));
  res.json(result);
});

router.post("/orders", async (req, res) => {
  const { companyName, contactName, contactEmail, shippingAddress, notes, items } = req.body;
  if (!contactName || !contactEmail || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  let totalAmount = 0;
  const resolvedItems: { productId: number; productName: string; quantity: number; unitPrice: number; customizations: Record<string, string> }[] = [];

  for (const item of items) {
    const [product] = await db.select().from(productsTable).where(eq(productsTable.id, item.productId));
    if (!product) return res.status(400).json({ error: `Product ${item.productId} not found` });
    const unitPrice = product.price;
    totalAmount += unitPrice * item.quantity;
    resolvedItems.push({
      productId: product.id,
      productName: product.name,
      quantity: item.quantity,
      unitPrice,
      customizations: item.customizations ?? {},
    });
  }

  const [order] = await db.insert(ordersTable).values({
    companyName,
    contactName,
    contactEmail,
    shippingAddress,
    notes,
    totalAmount,
    status: "pending",
  }).returning();

  for (const item of resolvedItems) {
    await db.insert(orderItemsTable).values({ ...item, orderId: order.id });
  }

  // Update artisan totalOrders
  const full = await getOrderWithItems(order.id);
  res.status(201).json(full);
});

router.get("/orders/recent", async (req, res) => {
  const orders = await db.select().from(ordersTable)
    .orderBy(desc(ordersTable.createdAt))
    .limit(10);
  const result = await Promise.all(orders.map(o => getOrderWithItems(o.id)));
  res.json(result);
});

router.get("/orders/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
  const order = await getOrderWithItems(id);
  if (!order) return res.status(404).json({ error: "Not found" });
  res.json(order);
});

router.patch("/orders/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
  const { status } = req.body;
  const validStatuses = ["pending", "confirmed", "in_production", "shipped", "delivered", "cancelled"];
  if (!validStatuses.includes(status)) return res.status(400).json({ error: "Invalid status" });

  const [updated] = await db.update(ordersTable)
    .set({ status, updatedAt: new Date() })
    .where(eq(ordersTable.id, id))
    .returning();
  if (!updated) return res.status(404).json({ error: "Not found" });
  const full = await getOrderWithItems(id);
  res.json(full);
});

export default router;
