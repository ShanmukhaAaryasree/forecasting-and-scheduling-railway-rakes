interface RakeAllocation {
  rakeId: string;
  rakeNumber: string;
  trainId: string | null;
  trainNumber: string | null;
  fromStation: string;
  toStation: string | null;
  isEmptyMovement: boolean;
  distance: number;
}

interface OptimizationResult {
  allocations: RakeAllocation[];
  totalEmptyMovements: number;
  totalDistance: number;
  emptyMovementsReduction: number;
  optimizationScore: number;
  pheromoneMap: { [key: string]: number };
}

interface AntSolution {
  allocations: RakeAllocation[];
  totalEmptyMovements: number;
  totalDistance: number;
  fitness: number;
}

export class AntColonyOptimizer {
  private pheromoneStrength: number;
  private evaporationRate: number;
  private alpha = 1.0;
  private beta = 2.5;
  private pheromones: Map<string, number> = new Map();
  
  private rakes: any[];
  private trains: any[];
  private routes: any[];
  private stations: Set<string> = new Set();

  constructor(pheromoneStrength: number, evaporationRate: number) {
    this.pheromoneStrength = pheromoneStrength;
    this.evaporationRate = evaporationRate;
  }

  initialize(rakes: any[], trains: any[], routes: any[]) {
    this.rakes = rakes;
    this.trains = trains;
    this.routes = routes;

    routes.forEach(route => {
      route.stations.forEach((station: string) => this.stations.add(station));
    });

    this.stations.forEach(stationA => {
      this.stations.forEach(stationB => {
        if (stationA !== stationB) {
          const key = `${stationA}-${stationB}`;
          this.pheromones.set(key, this.pheromoneStrength);
        }
      });
    });
  }

  async optimize(iterations: number): Promise<OptimizationResult> {
    let bestSolution: AntSolution | null = null;
    const numAnts = Math.max(10, this.rakes.length);

    for (let iter = 0; iter < iterations; iter++) {
      const solutions: AntSolution[] = [];

      for (let antIdx = 0; antIdx < numAnts; antIdx++) {
        const solution = this.constructSolution();
        solutions.push(solution);

        if (!bestSolution || solution.fitness > bestSolution.fitness) {
          bestSolution = solution;
        }
      }

      this.updatePheromones(solutions);
    }

    const baselineEmptyMovements = this.calculateBaselineEmptyMovements();
    const reduction = ((baselineEmptyMovements - (bestSolution?.totalEmptyMovements || 0)) / baselineEmptyMovements) * 100;

    return {
      allocations: bestSolution?.allocations || [],
      totalEmptyMovements: bestSolution?.totalEmptyMovements || 0,
      totalDistance: bestSolution?.totalDistance || 0,
      emptyMovementsReduction: Math.max(0, reduction),
      optimizationScore: bestSolution?.fitness || 0,
      pheromoneMap: this.getPheromoneSnapshot(),
    };
  }

  private constructSolution(): AntSolution {
    const allocations: RakeAllocation[] = [];
    const assignedRakes = new Set<string>();
    const assignedTrains = new Set<string>();
    let totalEmptyMovements = 0;
    let totalDistance = 0;

    const unassignedTrains = [...this.trains].filter(t => !assignedTrains.has(t.id));
    const availableRakes = [...this.rakes].filter(r => !assignedRakes.has(r.id));

    for (const train of unassignedTrains) {
      if (availableRakes.length === 0) break;

      const trainStation = train.currentStation;
      let bestRake: any = null;
      let bestProbability = -1;

      for (const rake of availableRakes) {
        if (assignedRakes.has(rake.id)) continue;

        const rakeStation = rake.currentLocation;
        const distance = this.getDistance(rakeStation, trainStation);
        const pheromoneKey = `${rakeStation}-${trainStation}`;
        const pheromone = this.pheromones.get(pheromoneKey) || this.pheromoneStrength;

        const pheromoneFactor = Math.pow(pheromone, this.alpha);
        const heuristicFactor = Math.pow(1 / (distance + 1), this.beta);
        const loadedBonus = rake.isLoaded ? 2.0 : 1.0;
        const probability = pheromoneFactor * heuristicFactor * loadedBonus;

        if (probability > bestProbability) {
          bestProbability = probability;
          bestRake = rake;
        }
      }

      if (bestRake) {
        const rakeStation = bestRake.currentLocation;
        const trainStation = train.currentStation;
        const distance = this.getDistance(rakeStation, trainStation);
        const isEmpty = !bestRake.isLoaded;

        allocations.push({
          rakeId: bestRake.id,
          rakeNumber: bestRake.rakeNumber,
          trainId: train.id,
          trainNumber: train.trainNumber,
          fromStation: rakeStation,
          toStation: trainStation,
          isEmptyMovement: isEmpty,
          distance: distance,
        });

        if (isEmpty) {
          totalEmptyMovements++;
        }
        totalDistance += distance;

        assignedRakes.add(bestRake.id);
        assignedTrains.add(train.id);
        const idx = availableRakes.findIndex(r => r.id === bestRake.id);
        if (idx >= 0) availableRakes.splice(idx, 1);
      }
    }

    for (const rake of availableRakes) {
      if (assignedRakes.has(rake.id)) continue;

      const nearestStation = Array.from(this.stations)[Math.floor(Math.random() * this.stations.size)];
      const distance = this.getDistance(rake.currentLocation, nearestStation);

      allocations.push({
        rakeId: rake.id,
        rakeNumber: rake.rakeNumber,
        trainId: null,
        trainNumber: null,
        fromStation: rake.currentLocation,
        toStation: nearestStation,
        isEmptyMovement: true,
        distance: distance,
      });

      totalEmptyMovements++;
      totalDistance += distance;
    }

    const fitness = this.calculateFitness(totalEmptyMovements, totalDistance);

    return {
      allocations,
      totalEmptyMovements,
      totalDistance,
      fitness,
    };
  }

  private getDistance(stationA: string, stationB: string): number {
    if (stationA === stationB) return 0;

    for (const route of this.routes) {
      const indexA = route.stations.indexOf(stationA);
      const indexB = route.stations.indexOf(stationB);

      if (indexA >= 0 && indexB >= 0) {
        const stationCount = Math.abs(indexB - indexA);
        return (route.distance / (route.stations.length - 1)) * stationCount;
      }
    }

    let shortestDistance = Infinity;
    for (const route of this.routes) {
      const indexA = route.stations.indexOf(stationA);
      const indexB = route.stations.indexOf(stationB);

      if (indexA >= 0 || indexB >= 0) {
        if (indexA >= 0) {
          const avgDistance = route.distance / (route.stations.length - 1);
          shortestDistance = Math.min(shortestDistance, avgDistance * route.stations.length);
        }
        if (indexB >= 0) {
          const avgDistance = route.distance / (route.stations.length - 1);
          shortestDistance = Math.min(shortestDistance, avgDistance * route.stations.length);
        }
      }
    }

    if (shortestDistance !== Infinity) {
      return shortestDistance;
    }

    return 500;
  }

  private calculateFitness(emptyMovements: number, totalDistance: number): number {
    const emptyPenalty = emptyMovements * 1000;
    const distancePenalty = totalDistance;
    return 1 / (1 + emptyPenalty + distancePenalty * 0.1);
  }

  private updatePheromones(solutions: AntSolution[]) {
    this.pheromones.forEach((value, key) => {
      this.pheromones.set(key, value * (1 - this.evaporationRate));
    });

    for (const solution of solutions) {
      const deposit = solution.fitness * 100;

      for (const allocation of solution.allocations) {
        if (allocation.toStation) {
          const key = `${allocation.fromStation}-${allocation.toStation}`;
          const current = this.pheromones.get(key) || this.pheromoneStrength;
          const bonus = allocation.isEmptyMovement ? deposit * 0.5 : deposit * 2.0;
          this.pheromones.set(key, current + bonus);
        }
      }
    }
  }

  private calculateBaselineEmptyMovements(): number {
    return this.rakes.filter(r => !r.isLoaded).length;
  }

  private getPheromoneSnapshot(): { [key: string]: number } {
    const snapshot: { [key: string]: number } = {};
    this.pheromones.forEach((value, key) => {
      snapshot[key] = value;
    });
    return snapshot;
  }
}

export function runAcoOptimization(
  rakes: any[],
  trains: any[],
  routes: any[],
  params: { pheromoneStrength: number; evaporationRate: number; iterations: number }
): Promise<OptimizationResult> {
  const aco = new AntColonyOptimizer(params.pheromoneStrength, params.evaporationRate);
  aco.initialize(rakes, trains, routes);
  return aco.optimize(params.iterations);
}
