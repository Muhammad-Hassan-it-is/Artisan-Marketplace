import { pgTable, serial, text, integer, boolean, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const customizationOptionsTable = pgTable("customization_options", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(), // color, size, material, text, finish, style
  choices: text("choices").array().notNull().default([]),
  required: boolean("required").notNull().default(false),
  priceDelta: real("price_delta"),
});

export const insertCustomizationOptionSchema = createInsertSchema(customizationOptionsTable).omit({ id: true });
export type InsertCustomizationOption = z.infer<typeof insertCustomizationOptionSchema>;
export type CustomizationOption = typeof customizationOptionsTable.$inferSelect;
