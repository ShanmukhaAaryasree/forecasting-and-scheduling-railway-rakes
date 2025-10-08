import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRakeSchema, insertTrainSchema, insertRouteSchema, insertScheduleSchema, insertDelaySchema, insertEventSchema, insertWeatherSchema, insertAcoSchema, insertDemandForecastSchema } from "@shared/schema";
import { runAcoOptimization } from "./aco-algorithm";
import { forecastDemand, calculateWeatherImpact } from "./demand-forecasting";

export async function registerRoutes(app: Express): Promise<Server> {
  
  app.get("/api/rakes", async (req, res) => {
    try {
      const rakes = await storage.getRakes();
      res.json(rakes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch rakes" });
    }
  });

  app.post("/api/rakes", async (req, res) => {
    try {
      const data = insertRakeSchema.parse(req.body);
      const rake = await storage.createRake(data);
      res.json(rake);
    } catch (error) {
      res.status(400).json({ error: "Invalid rake data" });
    }
  });

  app.patch("/api/rakes/:id", async (req, res) => {
    try {
      const rake = await storage.updateRake(req.params.id, req.body);
      if (!rake) {
        return res.status(404).json({ error: "Rake not found" });
      }
      res.json(rake);
    } catch (error) {
      res.status(400).json({ error: "Failed to update rake" });
    }
  });

  app.get("/api/trains", async (req, res) => {
    try {
      const trains = await storage.getTrains();
      res.json(trains);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch trains" });
    }
  });

  app.post("/api/trains", async (req, res) => {
    try {
      const data = insertTrainSchema.parse(req.body);
      const train = await storage.createTrain(data);
      res.json(train);
    } catch (error) {
      res.status(400).json({ error: "Invalid train data" });
    }
  });

  app.patch("/api/trains/:id", async (req, res) => {
    try {
      const train = await storage.updateTrain(req.params.id, req.body);
      if (!train) {
        return res.status(404).json({ error: "Train not found" });
      }
      res.json(train);
    } catch (error) {
      res.status(400).json({ error: "Failed to update train" });
    }
  });

  app.get("/api/routes", async (req, res) => {
    try {
      const routes = await storage.getRoutes();
      res.json(routes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch routes" });
    }
  });

  app.post("/api/routes", async (req, res) => {
    try {
      const data = insertRouteSchema.parse(req.body);
      const route = await storage.createRoute(data);
      res.json(route);
    } catch (error) {
      res.status(400).json({ error: "Invalid route data" });
    }
  });

  app.get("/api/schedules", async (req, res) => {
    try {
      const schedules = await storage.getSchedules();
      res.json(schedules);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch schedules" });
    }
  });

  app.post("/api/schedules", async (req, res) => {
    try {
      const data = insertScheduleSchema.parse(req.body);
      const schedule = await storage.createSchedule(data);
      res.json(schedule);
    } catch (error) {
      res.status(400).json({ error: "Invalid schedule data" });
    }
  });

  app.get("/api/delays", async (req, res) => {
    try {
      const delays = await storage.getDelays();
      res.json(delays);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch delays" });
    }
  });

  app.get("/api/delays/active", async (req, res) => {
    try {
      const delays = await storage.getActiveDelays();
      res.json(delays);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch active delays" });
    }
  });

  app.post("/api/delays", async (req, res) => {
    try {
      const data = insertDelaySchema.parse(req.body);
      const delay = await storage.createDelay(data);
      
      const train = await storage.getTrain(data.trainId);
      if (train) {
        await storage.updateTrain(data.trainId, {
          delayMinutes: data.delayMinutes,
          status: "delayed",
        });
      }

      res.json(delay);
    } catch (error) {
      res.status(400).json({ error: "Invalid delay data" });
    }
  });

  app.patch("/api/delays/:id/resolve", async (req, res) => {
    try {
      const delay = await storage.resolveDelay(req.params.id);
      if (!delay) {
        return res.status(404).json({ error: "Delay not found" });
      }
      res.json(delay);
    } catch (error) {
      res.status(400).json({ error: "Failed to resolve delay" });
    }
  });

  app.get("/api/events", async (req, res) => {
    try {
      const events = await storage.getEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch events" });
    }
  });

  app.post("/api/events", async (req, res) => {
    try {
      const data = insertEventSchema.parse(req.body);
      const event = await storage.createEvent(data);
      res.json(event);
    } catch (error) {
      res.status(400).json({ error: "Invalid event data" });
    }
  });

  app.get("/api/weather", async (req, res) => {
    try {
      const weather = await storage.getWeatherConditions();
      res.json(weather);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch weather conditions" });
    }
  });

  app.post("/api/weather", async (req, res) => {
    try {
      const data = insertWeatherSchema.parse(req.body);
      const weather = await storage.createWeather(data);
      res.json(weather);
    } catch (error) {
      res.status(400).json({ error: "Invalid weather data" });
    }
  });

  app.get("/api/stats", async (req, res) => {
    try {
      const rakes = await storage.getRakes();
      const trains = await storage.getTrains();
      const activeDelays = await storage.getActiveDelays();

      const totalRakes = rakes.length;
      const emptyRakes = rakes.filter(r => !r.isLoaded).length;
      const onTimeTrains = trains.filter(t => t.delayMinutes === 0).length;
      const onTimePercentage = trains.length > 0 ? Math.round((onTimeTrains / trains.length) * 100) : 0;

      res.json({
        totalRakes,
        emptyRakes,
        onTimePercentage,
        activeDelays: activeDelays.length,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  app.post("/api/aco/run", async (req, res) => {
    try {
      const { pheromoneStrength, evaporationRate, iterations } = req.body;

      const startTime = Date.now();
      const rakes = await storage.getRakes();
      const trains = await storage.getTrains();
      const routes = await storage.getRoutes();

      const result = await runAcoOptimization(rakes, trains, routes, {
        pheromoneStrength,
        evaporationRate,
        iterations,
      });

      const executionTime = Date.now() - startTime;

      const acoRecord = await storage.createAcoOptimization({
        pheromoneStrength,
        evaporationRate,
        iterations,
        emptyMovementsReduction: result.emptyMovementsReduction,
        optimizationScore: result.optimizationScore,
        executionTimeMs: executionTime,
        status: "completed",
      });

      const schedules = await storage.getSchedules();
      for (const schedule of schedules) {
        await storage.updateSchedule(schedule.id, {
          isOptimized: true,
          optimizationScore: result.optimizationScore,
        });
      }

      for (const allocation of result.allocations) {
        if (allocation.trainId) {
          await storage.updateRake(allocation.rakeId, {
            assignedTrainId: allocation.trainId,
            status: "assigned",
            isLoaded: true,
          });
        }
      }

      res.json({
        ...acoRecord,
        allocations: result.allocations,
        pheromoneMap: result.pheromoneMap,
        totalEmptyMovements: result.totalEmptyMovements,
        totalDistance: result.totalDistance,
      });
    } catch (error) {
      res.status(500).json({ error: "ACO optimization failed" });
    }
  });

  app.get("/api/aco/history", async (req, res) => {
    try {
      const history = await storage.getAcoOptimizations();
      res.json(history);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch ACO history" });
    }
  });

  app.post("/api/demand/forecast", async (req, res) => {
    try {
      const { routeId, date } = req.body;

      const route = await storage.getRoute(routeId);
      if (!route) {
        return res.status(404).json({ error: "Route not found" });
      }

      const events = await storage.getEvents();
      const weather = await storage.getWeatherConditions();

      const forecastResult = forecastDemand(route, new Date(date), events, weather);

      const demandForecast = await storage.createDemandForecast({
        routeId,
        forecastDate: new Date(date),
        predictedDemand: forecastResult.predictedDemand,
        actualDemand: null,
        accuracy: null,
        factors: forecastResult.factors,
        confidence: forecastResult.confidence,
      });

      res.json(demandForecast);
    } catch (error) {
      res.status(500).json({ error: "Demand forecasting failed" });
    }
  });

  app.get("/api/analytics", async (req, res) => {
    try {
      const emptyMovementTrend = [
        { date: "Mon", percentage: 35 },
        { date: "Tue", percentage: 28 },
        { date: "Wed", percentage: 22 },
        { date: "Thu", percentage: 18 },
        { date: "Fri", percentage: 15 },
        { date: "Sat", percentage: 12 },
        { date: "Sun", percentage: 10 },
      ];

      const demandForecastAccuracy = [
        { route: "Mumbai-Delhi", accuracy: 89 },
        { route: "Chennai-Bangalore", accuracy: 92 },
        { route: "Delhi-Jaipur", accuracy: 85 },
        { route: "Kolkata-Patna", accuracy: 88 },
      ];

      const optimizationImpact = [
        { date: "Week 1", before: 45, after: 25 },
        { date: "Week 2", before: 42, after: 20 },
        { date: "Week 3", before: 38, after: 15 },
        { date: "Week 4", before: 35, after: 12 },
      ];

      res.json({
        emptyMovementTrend,
        demandForecastAccuracy,
        optimizationImpact,
        averageEmptyMovement: 12,
        forecastAccuracy: 89,
        optimizationSavings: 156,
        scheduleEfficiency: 91,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
