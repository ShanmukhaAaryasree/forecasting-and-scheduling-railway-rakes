interface ForecastFactors {
  isWeekend: boolean;
  isFestival: boolean;
  weatherImpact: number;
  historicalAverage: number;
  seasonalMultiplier: number;
}

export function forecastDemand(
  route: any,
  date: Date,
  events: any[],
  weather: any[]
): {
  predictedDemand: number;
  confidence: number;
  factors: string[];
} {
  const factors: string[] = [];
  let demandMultiplier = 1.0;
  let confidence = 0.75;

  const dayOfWeek = date.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  
  if (isWeekend) {
    demandMultiplier *= 0.7;
    factors.push("weekend");
    confidence -= 0.05;
  } else {
    factors.push("weekday");
  }

  const relevantEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    const timeDiff = Math.abs(eventDate.getTime() - date.getTime());
    const daysDiff = timeDiff / (1000 * 3600 * 24);
    return daysDiff <= 3 && event.affectedRoutes.includes(route.name);
  });

  if (relevantEvents.length > 0) {
    const maxImpact = Math.max(...relevantEvents.map((e: any) => e.demandMultiplier));
    demandMultiplier *= maxImpact;
    factors.push(`event-${relevantEvents[0].type}`);
    confidence += 0.1;
  }

  const relevantWeather = weather.find((w: any) => 
    route.origin.includes(w.location.split(' ')[0]) || 
    route.destination.includes(w.location.split(' ')[0])
  );

  if (relevantWeather) {
    if (relevantWeather.severity === "high") {
      demandMultiplier *= 0.6;
      confidence -= 0.15;
      factors.push("adverse-weather");
    } else if (relevantWeather.severity === "medium") {
      demandMultiplier *= 0.85;
      confidence -= 0.05;
      factors.push("moderate-weather");
    } else {
      factors.push("clear-weather");
    }
  }

  const month = date.getMonth();
  if (month >= 9 && month <= 11) {
    demandMultiplier *= 1.3;
    factors.push("festival-season");
  } else if (month >= 4 && month <= 6) {
    demandMultiplier *= 0.8;
    factors.push("summer-low");
  }

  const baselineDemand = route.distance > 1000 ? 500 : route.distance > 500 ? 300 : 150;
  const predictedDemand = Math.round(baselineDemand * demandMultiplier);

  confidence = Math.max(0.5, Math.min(confidence, 0.95));

  return {
    predictedDemand,
    confidence,
    factors,
  };
}

export function calculateWeatherImpact(
  weather: any[],
  schedule: any
): {
  delayProbability: number;
  expectedDelayMinutes: number;
  adjustedSchedule: any;
} {
  const highSeverityWeather = weather.find((w: any) => w.severity === "high");
  
  if (highSeverityWeather) {
    return {
      delayProbability: 0.75,
      expectedDelayMinutes: 30,
      adjustedSchedule: {
        ...schedule,
        arrivalTime: new Date(new Date(schedule.arrivalTime).getTime() + 30 * 60000),
      },
    };
  }

  const mediumSeverityWeather = weather.find((w: any) => w.severity === "medium");
  
  if (mediumSeverityWeather) {
    return {
      delayProbability: 0.4,
      expectedDelayMinutes: 15,
      adjustedSchedule: {
        ...schedule,
        arrivalTime: new Date(new Date(schedule.arrivalTime).getTime() + 15 * 60000),
      },
    };
  }

  return {
    delayProbability: 0.1,
    expectedDelayMinutes: 0,
    adjustedSchedule: schedule,
  };
}
