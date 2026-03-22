import {
  pgTable,
  text,
  real,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const meals = pgTable('meals', {
  id:        uuid('id').primaryKey().defaultRandom(),
  userId:    text('user_id').notNull(),
  name:      text('name').notNull(),
  eatenAt:   timestamp('eaten_at', { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const foodItems = pgTable('food_items', {
  id:          uuid('id').primaryKey().defaultRandom(),
  name:        text('name').notNull(),
  calories:    real('calories').notNull().default(0),
  createdAt:   timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt:   timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const mealFoodItems = pgTable('meal_food_items', {
  id:          uuid('id').primaryKey().defaultRandom(),
  mealId:      uuid('meal_id').notNull().references(() => meals.id, { onDelete: 'cascade' }),
  foodItemId:  uuid('food_item_id').notNull().references(() => foodItems.id, { onDelete: 'restrict' }),
  quantity:    real('quantity').notNull().default(1),
});

export const mealsRelations = relations(meals, ({ many }) => ({
  mealFoodItems: many(mealFoodItems),
}));

export const foodItemsRelations = relations(foodItems, ({ many }) => ({
  mealFoodItems: many(mealFoodItems),
}));

export const mealFoodItemsRelations = relations(mealFoodItems, ({ one }) => ({
  meal:     one(meals,     { fields: [mealFoodItems.mealId],     references: [meals.id] }),
  foodItem: one(foodItems, { fields: [mealFoodItems.foodItemId], references: [foodItems.id] }),
}));
