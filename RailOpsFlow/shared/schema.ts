import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, real, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const rakes = pgTable("rakes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  rakeNumber: text("rake_number").notNull().unique(),
  type: text("type").notNull(),
  capacity: integer("capacity").notNull(),
  status: text("status").notNull(),
  currentLocation: text("current_location").notNull(),
  isLoaded: boolean("is_loaded").notNull().default(false),
  assignedTrainId: varchar("assigned_train_id"),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
});

export const trains = pgTable("trains", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  trainNumber: text("train_number").notNull().unique(),
  name: text("name").notNull(),
  route: text("route").notNull(),
  currentStation: text("current_station").notNull(),
  status: text("status").notNull(),
  delayMinutes: integer("delay_minutes").notNull().default(0),
  scheduledDeparture: timestamp("scheduled_departure").notNull(),
  scheduledArrival: timestamp("scheduled_arrival").notNull(),
  actualDeparture: timestamp("actual_departure"),
  actualArrival: timestamp("actual_arrival"),
});

export const routes = pgTable("routes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  origin: text("origin").notNull(),
  destination: text("destination").notNull(),
  distance: real("distance").notNull(),
  stations: text("stations").array().notNull(),
  estimatedDuration: integer("estimated_duration").notNull(),
});

export const schedules = pgTable("schedules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  trainId: varchar("train_id").notNull(),
  rakeId: varchar("rake_id"),
  routeId: varchar("route_id").notNull(),
  departureTime: timestamp("departure_time").notNull(),
  arrivalTime: timestamp("arrival_time").notNull(),
  status: text("status").notNull(),
  isOptimized: boolean("is_optimized").notNull().default(false),
  optimizationScore: real("optimization_score"),
});

export const delays = pgTable("delays", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  trainId: varchar("train_id").notNull(),
  reason: text("reason").notNull(),
  delayMinutes: integer("delay_minutes").notNull(),
  impactLevel: text("impact_level").notNull(),
  reportedAt: timestamp("reported_at").notNull().defaultNow(),
  resolved: boolean("resolved").notNull().default(false),
});

export const events = pgTable("events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(),
  date: timestamp("date").notNull(),
  endDate: timestamp("end_date"),
  impactLevel: text("impact_level").notNull(),
  affectedRoutes: text("affected_routes").array().notNull(),
  demandMultiplier: real("demand_multiplier").notNull().default(1.0),
  description: text("description"),
});

export const weatherConditions = pgTable("weather_conditions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  location: text("location").notNull(),
  condition: text("condition").notNull(),
  severity: text("severity").notNull(),
  temperature: real("temperature"),
  forecast: text("forecast").notNull(),
  impactOnScheduling: text("impact_on_scheduling").notNull(),
  validFrom: timestamp("valid_from").notNull(),
  validUntil: timestamp("valid_until").notNull(),
});

export const acoOptimizations = pgTable("aco_optimizations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  runDate: timestamp("run_date").notNull().defaultNow(),
  pheromoneStrength: real("pheromone_strength").notNull(),
  evaporationRate: real("evaporation_rate").notNull(),
  iterations: integer("iterations").notNull(),
  emptyMovementsReduction: real("empty_movements_reduction").notNull(),
  optimizationScore: real("optimization_score").notNull(),
  executionTimeMs: integer("execution_time_ms").notNull(),
  status: text("status").notNull(),
});

export const demandForecasts = pgTable("demand_forecasts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  routeId: varchar("route_id").notNull(),
  forecastDate: timestamp("forecast_date").notNull(),
  predictedDemand: integer("predicted_demand").notNull(),
  actualDemand: integer("actual_demand"),
  accuracy: real("accuracy"),
  factors: text("factors").array().notNull(),
  confidence: real("confidence").notNull(),
});

export const insertRakeSchema = createInsertSchema(rakes).omit({ id: true, lastUpdated: true });
export const insertTrainSchema = createInsertSchema(trains).omit({ id: true });
export const insertRouteSchema = createInsertSchema(routes).omit({ id: true });
export const insertScheduleSchema = createInsertSchema(schedules).omit({ id: true });
export const insertDelaySchema = createInsertSchema(delays).omit({ id: true, reportedAt: true });
export const insertEventSchema = createInsertSchema(events).omit({ id: true });
export const insertWeatherSchema = createInsertSchema(weatherConditions).omit({ id: true });
export const insertAcoSchema = createInsertSchema(acoOptimizations).omit({ id: true, runDate: true });
export const insertDemandForecastSchema = createInsertSchema(demandForecasts).omit({ id: true });

export type Rake = typeof rakes.$inferSelect;
export type InsertRake = z.infer<typeof insertRakeSchema>;
export type Train = typeof trains.$inferSelect;
export type InsertTrain = z.infer<typeof insertTrainSchema>;
export type Route = typeof routes.$inferSelect;
export type InsertRoute = z.infer<typeof insertRouteSchema>;
export type Schedule = typeof schedules.$inferSelect;
export type InsertSchedule = z.infer<typeof insertScheduleSchema>;
export type Delay = typeof delays.$inferSelect;
export type InsertDelay = z.infer<typeof insertDelaySchema>;
export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type WeatherCondition = typeof weatherConditions.$inferSelect;
export type InsertWeather = z.infer<typeof insertWeatherSchema>;
export type AcoOptimization = typeof acoOptimizations.$inferSelect;
export type InsertAco = z.infer<typeof insertAcoSchema>;
export type DemandForecast = typeof demandForecasts.$inferSelect;
export type InsertDemandForecast = z.infer<typeof insertDemandForecastSchema>;
