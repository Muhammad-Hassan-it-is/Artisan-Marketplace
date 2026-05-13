import { pgTable, serial, text, real, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const artisansTable = pgTable("artisans", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  bio: text("bio"),
  location: text("location"),
  specialty: text("specialty"),
  imageUrl: text("image_url"),
  rating: real("rating"),
  totalOrders: integer("total_orders").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertArtisanSchema = createInsertSchema(artisansTable).omit({ id: true, totalOrders: true, createdAt: true });
export type InsertArtisan = z.infer<typeof insertArtisanSchema>;
export type Artisan = typeof artisansTable.$inferSelect;
