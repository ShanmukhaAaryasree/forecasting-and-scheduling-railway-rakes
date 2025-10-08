import {
  type Rake, type InsertRake,
  type Train, type InsertTrain,
  type Route, type InsertRoute,
  type Schedule, type InsertSchedule,
  type Delay, type InsertDelay,
  type Event, type InsertEvent,
  type WeatherCondition, type InsertWeather,
  type AcoOptimization, type InsertAco,
  type DemandForecast, type InsertDemandForecast
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getRakes(): Promise<Rake[]>;
  getRake(id: string): Promise<Rake | undefined>;
  createRake(rake: InsertRake): Promise<Rake>;
  updateRake(id: string, rake: Partial<InsertRake>): Promise<Rake | undefined>;
  
  getTrains(): Promise<Train[]>;
  getTrain(id: string): Promise<Train | undefined>;
  createTrain(train: InsertTrain): Promise<Train>;
  updateTrain(id: string, train: Partial<InsertTrain>): Promise<Train | undefined>;
  
  getRoutes(): Promise<Route[]>;
  getRoute(id: string): Promise<Route | undefined>;
  createRoute(route: InsertRoute): Promise<Route>;
  
  getSchedules(): Promise<Schedule[]>;
  getSchedule(id: string): Promise<Schedule | undefined>;
  createSchedule(schedule: InsertSchedule): Promise<Schedule>;
  updateSchedule(id: string, schedule: Partial<InsertSchedule>): Promise<Schedule | undefined>;
  
  getDelays(): Promise<Delay[]>;
  getActiveDelays(): Promise<Delay[]>;
  createDelay(delay: InsertDelay): Promise<Delay>;
  resolveDelay(id: string): Promise<Delay | undefined>;
  
  getEvents(): Promise<Event[]>;
  getEvent(id: string): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  
  getWeatherConditions(): Promise<WeatherCondition[]>;
  createWeather(weather: InsertWeather): Promise<WeatherCondition>;
  
  getAcoOptimizations(): Promise<AcoOptimization[]>;
  createAcoOptimization(aco: InsertAco): Promise<AcoOptimization>;
  
  getDemandForecasts(): Promise<DemandForecast[]>;
  createDemandForecast(forecast: InsertDemandForecast): Promise<DemandForecast>;
}

export class MemStorage implements IStorage {
  private rakes: Map<string, Rake> = new Map();
  private trains: Map<string, Train> = new Map();
  private routes: Map<string, Route> = new Map();
  private schedules: Map<string, Schedule> = new Map();
  private delays: Map<string, Delay> = new Map();
  private events: Map<string, Event> = new Map();
  private weatherConditions: Map<string, WeatherCondition> = new Map();
  private acoOptimizations: Map<string, AcoOptimization> = new Map();
  private demandForecasts: Map<string, DemandForecast> = new Map();

  constructor() {
    this.initializeSampleData();
  }

  private initializeSampleData() {
    const route1: Route = {
      id: randomUUID(),
      name: "Mumbai-Delhi Express Route",
      origin: "Mumbai Central",
      destination: "New Delhi",
      distance: 1384.5,
      stations: ["Mumbai Central", "Vadodara", "Ahmedabad", "Jaipur", "New Delhi"],
      estimatedDuration: 960,
    };

    const route2: Route = {
      id: randomUUID(),
      name: "Chennai-Bangalore Route",
      origin: "Chennai Central",
      destination: "Bangalore",
      distance: 362.0,
      stations: ["Chennai Central", "Arakkonam", "Katpadi", "Bangalore"],
      estimatedDuration: 300,
    };

    this.routes.set(route1.id, route1);
    this.routes.set(route2.id, route2);

    const rake1: Rake = {
      id: randomUUID(),
      rakeNumber: "RK-2401",
      type: "ICF Coach",
      capacity: 72,
      status: "available",
      currentLocation: "Mumbai Central",
      isLoaded: false,
      assignedTrainId: null,
      lastUpdated: new Date(),
    };

    const rake2: Rake = {
      id: randomUUID(),
      rakeNumber: "RK-2402",
      type: "LHB Coach",
      capacity: 80,
      status: "in-transit",
      currentLocation: "Vadodara",
      isLoaded: true,
      assignedTrainId: randomUUID(),
      lastUpdated: new Date(),
    };

    const rake3: Rake = {
      id: randomUUID(),
      rakeNumber: "RK-2403",
      type: "ICF Coach",
      capacity: 72,
      status: "available",
      currentLocation: "Chennai Central",
      isLoaded: false,
      assignedTrainId: null,
      lastUpdated: new Date(),
    };

    this.rakes.set(rake1.id, rake1);
    this.rakes.set(rake2.id, rake2);
    this.rakes.set(rake3.id, rake3);

    const train1: Train = {
      id: randomUUID(),
      trainNumber: "12951",
      name: "Mumbai Rajdhani",
      route: "Mumbai-Delhi Express Route",
      currentStation: "Vadodara",
      status: "on-time",
      delayMinutes: 0,
      scheduledDeparture: new Date(Date.now() + 3600000),
      scheduledArrival: new Date(Date.now() + 57600000),
      actualDeparture: null,
      actualArrival: null,
    };

    const train2: Train = {
      id: randomUUID(),
      trainNumber: "12639",
      name: "Brindavan Express",
      route: "Chennai-Bangalore Route",
      currentStation: "Chennai Central",
      status: "delayed",
      delayMinutes: 25,
      scheduledDeparture: new Date(Date.now() - 900000),
      scheduledArrival: new Date(Date.now() + 10800000),
      actualDeparture: null,
      actualArrival: null,
    };

    this.trains.set(train1.id, train1);
    this.trains.set(train2.id, train2);

    const delay1: Delay = {
      id: randomUUID(),
      trainId: train2.id,
      reason: "Track maintenance delay",
      delayMinutes: 25,
      impactLevel: "medium",
      reportedAt: new Date(Date.now() - 900000),
      resolved: false,
    };

    this.delays.set(delay1.id, delay1);

    const weather1: WeatherCondition = {
      id: randomUUID(),
      location: "Mumbai Region",
      condition: "Heavy Rain",
      severity: "high",
      temperature: 28,
      forecast: "Thunderstorms expected",
      impactOnScheduling: "Reduced speed limits, expect 15-30 min delays",
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 21600000),
    };

    const weather2: WeatherCondition = {
      id: randomUUID(),
      location: "Delhi Region",
      condition: "Clear",
      severity: "low",
      temperature: 32,
      forecast: "Sunny and clear",
      impactOnScheduling: "Normal operations",
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 43200000),
    };

    this.weatherConditions.set(weather1.id, weather1);
    this.weatherConditions.set(weather2.id, weather2);

    const event1: Event = {
      id: randomUUID(),
      name: "Diwali Festival",
      type: "festival",
      date: new Date(Date.now() + 2592000000),
      endDate: new Date(Date.now() + 2678400000),
      impactLevel: "high",
      affectedRoutes: ["Mumbai-Delhi Express Route"],
      demandMultiplier: 2.5,
      description: "Major festival increasing passenger demand significantly",
    };

    this.events.set(event1.id, event1);

    const schedule1: Schedule = {
      id: randomUUID(),
      trainId: train1.id,
      rakeId: rake2.id,
      routeId: route1.id,
      departureTime: new Date(Date.now() + 3600000),
      arrivalTime: new Date(Date.now() + 57600000),
      status: "scheduled",
      isOptimized: true,
      optimizationScore: 0.89,
    };

    this.schedules.set(schedule1.id, schedule1);
  }

  async getRakes(): Promise<Rake[]> {
    return Array.from(this.rakes.values());
  }

  async getRake(id: string): Promise<Rake | undefined> {
    return this.rakes.get(id);
  }

  async createRake(insertRake: InsertRake): Promise<Rake> {
    const rake: Rake = {
      ...insertRake,
      id: randomUUID(),
      lastUpdated: new Date(),
    };
    this.rakes.set(rake.id, rake);
    return rake;
  }

  async updateRake(id: string, updates: Partial<InsertRake>): Promise<Rake | undefined> {
    const rake = this.rakes.get(id);
    if (!rake) return undefined;
    const updated = { ...rake, ...updates, lastUpdated: new Date() };
    this.rakes.set(id, updated);
    return updated;
  }

  async getTrains(): Promise<Train[]> {
    return Array.from(this.trains.values());
  }

  async getTrain(id: string): Promise<Train | undefined> {
    return this.trains.get(id);
  }

  async createTrain(insertTrain: InsertTrain): Promise<Train> {
    const train: Train = { ...insertTrain, id: randomUUID() };
    this.trains.set(train.id, train);
    return train;
  }

  async updateTrain(id: string, updates: Partial<InsertTrain>): Promise<Train | undefined> {
    const train = this.trains.get(id);
    if (!train) return undefined;
    const updated = { ...train, ...updates };
    this.trains.set(id, updated);
    return updated;
  }

  async getRoutes(): Promise<Route[]> {
    return Array.from(this.routes.values());
  }

  async getRoute(id: string): Promise<Route | undefined> {
    return this.routes.get(id);
  }

  async createRoute(insertRoute: InsertRoute): Promise<Route> {
    const route: Route = { ...insertRoute, id: randomUUID() };
    this.routes.set(route.id, route);
    return route;
  }

  async getSchedules(): Promise<Schedule[]> {
    return Array.from(this.schedules.values());
  }

  async getSchedule(id: string): Promise<Schedule | undefined> {
    return this.schedules.get(id);
  }

  async createSchedule(insertSchedule: InsertSchedule): Promise<Schedule> {
    const schedule: Schedule = { ...insertSchedule, id: randomUUID() };
    this.schedules.set(schedule.id, schedule);
    return schedule;
  }

  async updateSchedule(id: string, updates: Partial<InsertSchedule>): Promise<Schedule | undefined> {
    const schedule = this.schedules.get(id);
    if (!schedule) return undefined;
    const updated = { ...schedule, ...updates };
    this.schedules.set(id, updated);
    return updated;
  }

  async getDelays(): Promise<Delay[]> {
    return Array.from(this.delays.values());
  }

  async getActiveDelays(): Promise<Delay[]> {
    return Array.from(this.delays.values()).filter(d => !d.resolved);
  }

  async createDelay(insertDelay: InsertDelay): Promise<Delay> {
    const delay: Delay = {
      ...insertDelay,
      id: randomUUID(),
      reportedAt: new Date(),
      resolved: false,
    };
    this.delays.set(delay.id, delay);
    return delay;
  }

  async resolveDelay(id: string): Promise<Delay | undefined> {
    const delay = this.delays.get(id);
    if (!delay) return undefined;
    const updated = { ...delay, resolved: true };
    this.delays.set(id, updated);
    return updated;
  }

  async getEvents(): Promise<Event[]> {
    return Array.from(this.events.values());
  }

  async getEvent(id: string): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const event: Event = { ...insertEvent, id: randomUUID() };
    this.events.set(event.id, event);
    return event;
  }

  async getWeatherConditions(): Promise<WeatherCondition[]> {
    return Array.from(this.weatherConditions.values());
  }

  async createWeather(insertWeather: InsertWeather): Promise<WeatherCondition> {
    const weather: WeatherCondition = { ...insertWeather, id: randomUUID() };
    this.weatherConditions.set(weather.id, weather);
    return weather;
  }

  async getAcoOptimizations(): Promise<AcoOptimization[]> {
    return Array.from(this.acoOptimizations.values()).sort(
      (a, b) => new Date(b.runDate).getTime() - new Date(a.runDate).getTime()
    );
  }

  async createAcoOptimization(insertAco: InsertAco): Promise<AcoOptimization> {
    const aco: AcoOptimization = {
      ...insertAco,
      id: randomUUID(),
      runDate: new Date(),
    };
    this.acoOptimizations.set(aco.id, aco);
    return aco;
  }

  async getDemandForecasts(): Promise<DemandForecast[]> {
    return Array.from(this.demandForecasts.values());
  }

  async createDemandForecast(insertForecast: InsertDemandForecast): Promise<DemandForecast> {
    const forecast: DemandForecast = { ...insertForecast, id: randomUUID() };
    this.demandForecasts.set(forecast.id, forecast);
    return forecast;
  }
}

export const storage = new MemStorage();
