import { Router } from "express";
import {
  categories,
  artisans,
  products,
  customizations,
  orders,
  createOrder,
} from "../dummy-data";

const router = Router();

router.get("/healthz", (_req, res) => {
  res.json({ status: "ok", mode: "dummy" });
});

router.get("/categories", (_req, res) => {
  const result = categories.map(c => ({
    ...c,
    productCount: products.filter(p => p.categoryId === c.id).length,
  }));
  res.json(result);
});

router.get("/artisans", (_req, res) => {
  const sorted = [...artisans].sort((a, b) => a.name.localeCompare(b.name));
  res.json(sorted);
});

router.post("/artisans", (req, res) => {
  const { name, specialty, location, bio, imageUrl } = req.body;
  if (!name) return res.status(400).json({ error: "name is required" });
  const newArtisan = {
    id: artisans.length + 1,
    name,
    specialty: specialty ?? null,
    location: location ?? null,
    bio: bio ?? null,
    imageUrl: imageUrl ?? null,
    rating: null,
    totalOrders: 0,
    createdAt: new Date().toISOString(),
  };
  artisans.push(newArtisan);
  res.status(201).json(newArtisan);
});

router.get("/artisans/:id", (req, res) => {
  const id = Number(req.params.id);
  const artisan = artisans.find(a => a.id === id);
  if (!artisan) return res.status(404).json({ error: "Not found" });
  res.json(artisan);
});

function mapProduct(p: (typeof products)[0]) {
  const artisan = artisans.find(a => a.id === p.artisanId);
  const category = categories.find(c => c.id === p.categoryId);
  return {
    ...p,
    artisanName: artisan?.name ?? null,
    categoryName: category?.name ?? null,
  };
}

router.get("/products/featured", (_req, res) => {
  const featured = products.filter(p => p.featured).map(mapProduct);
  res.json(featured);
});

router.get("/products", (req, res) => {
  const { categoryId, artisanId, search } = req.query;
  let result = [...products];
  if (categoryId) result = result.filter(p => p.categoryId === Number(categoryId));
  if (artisanId)  result = result.filter(p => p.artisanId  === Number(artisanId));
  if (search) {
    const q = String(search).toLowerCase();
    result = result.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.description ?? "").toLowerCase().includes(q)
    );
  }
  result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  res.json(result.map(mapProduct));
});

router.post("/products", (req, res) => {
  const { name, price, categoryId, artisanId } = req.body;
  if (!name || !price) return res.status(400).json({ error: "name and price are required" });
  const newProduct = {
    id: products.length + 1,
    name,
    description: req.body.description ?? null,
    price: Number(price),
    categoryId: Number(categoryId) || null,
    artisanId: Number(artisanId) || null,
    imageUrl: req.body.imageUrl ?? null,
    stock: req.body.stock ?? 0,
    featured: req.body.featured ?? false,
    leadTimeDays: req.body.leadTimeDays ?? 14,
    createdAt: new Date().toISOString(),
  };
  (products as any[]).push(newProduct);
  res.status(201).json(mapProduct(newProduct as any));
});

router.get("/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const product = products.find(p => p.id === id);
  if (!product) return res.status(404).json({ error: "Not found" });
  const artisan = artisans.find(a => a.id === product.artisanId);
  const opts = customizations.filter(c => c.productId === id);
  res.json({
    ...mapProduct(product),
    artisanBio: artisan?.bio ?? null,
    artisanLocation: artisan?.location ?? null,
    customizations: opts,
  });
});

router.get("/products/:id/customizations", (req, res) => {
  const id = Number(req.params.id);
  res.json(customizations.filter(c => c.productId === id));
});

router.patch("/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const idx = products.findIndex(p => p.id === id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  Object.assign(products[idx], req.body);
  res.json(mapProduct(products[idx]));
});

router.delete("/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const idx = products.findIndex(p => p.id === id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  products.splice(idx, 1);
  res.status(204).send();
});

router.get("/orders/recent", (_req, res) => {
  const sorted = [...orders].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 10);
  res.json(sorted);
});

router.get("/orders", (_req, res) => {
  const sorted = [...orders].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  res.json(sorted);
});

router.post("/orders", (req, res) => {
  const { contactName, contactEmail, items } = req.body;
  if (!contactName || !contactEmail || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const order = createOrder(req.body);
  if (!order) return res.status(400).json({ error: "One or more products not found" });
  res.status(201).json(order);
});

router.get("/orders/:id", (req, res) => {
  const id = Number(req.params.id);
  const order = orders.find(o => o.id === id);
  if (!order) return res.status(404).json({ error: "Not found" });
  res.json(order);
});

router.patch("/orders/:id", (req, res) => {
  const id = Number(req.params.id);
  const order = orders.find(o => o.id === id);
  if (!order) return res.status(404).json({ error: "Not found" });
  const valid = ["pending","confirmed","in_production","shipped","delivered","cancelled"];
  if (!valid.includes(req.body.status)) return res.status(400).json({ error: "Invalid status" });
  order.status = req.body.status;
  order.updatedAt = new Date().toISOString();
  res.json(order);
});

router.get("/dashboard/summary", (_req, res) => {
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingOrders = orders.filter(o => o.status === "pending").length;
  const inProductionOrders = orders.filter(o => o.status === "in_production").length;
  const cutoff = new Date(Date.now() - 7 * 86400000);
  const recentOrdersCount = orders.filter(o => new Date(o.createdAt) > cutoff).length;

  const catMap: Record<string, number> = {};
  products.forEach(p => {
    const cat = categories.find(c => c.id === p.categoryId);
    const name = cat?.name ?? "Unknown";
    catMap[name] = (catMap[name] ?? 0) + 1;
  });
  const topCategories = Object.entries(catMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  res.json({
    totalProducts: products.length,
    totalOrders: orders.length,
    totalRevenue,
    pendingOrders,
    inProductionOrders,
    recentOrdersCount,
    topCategories,
  });
});

export default router;
