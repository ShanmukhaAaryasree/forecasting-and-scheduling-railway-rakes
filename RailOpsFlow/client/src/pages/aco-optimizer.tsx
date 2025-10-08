import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Play, Square, RotateCcw, Settings, Train, Package, TrendingDown } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AcoOptimization } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface OptimizationResult {
  allocations: Array<{
    rakeId: string;
    rakeNumber: string;
    trainId: string | null;
    trainNumber: string | null;
    fromStation: string;
    toStation: string | null;
    isEmptyMovement: boolean;
    distance: number;
  }>;
  totalEmptyMovements: number;
  totalDistance: number;
  emptyMovementsReduction: number;
  pheromoneMap: { [key: string]: number };
}

export default function AcoOptimizer() {
  const { toast } = useToast();
  const [isRunning, setIsRunning] = useState(false);
  const [currentIteration, setCurrentIteration] = useState(0);
  const [pheromoneStrength, setPheromoneStrength] = useState(1.5);
  const [evaporationRate, setEvaporationRate] = useState(0.5);
  const [iterations, setIterations] = useState(100);
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);

  const { data: optimizations } = useQuery<AcoOptimization[]>({
    queryKey: ["/api/aco/history"],
  });

  const runOptimizationMutation = useMutation({
    mutationFn: async () => {
      setIsRunning(true);
      setCurrentIteration(0);

      const interval = setInterval(() => {
        setCurrentIteration((prev) => {
          if (prev >= iterations) {
            clearInterval(interval);
            return iterations;
          }
          return prev + 1;
        });
      }, 30);

      const result = await apiRequest("POST", "/api/aco/run", {
        pheromoneStrength,
        evaporationRate,
        iterations,
      });

      clearInterval(interval);
      setCurrentIteration(iterations);
      return result;
    },
    onSuccess: (data: any) => {
      setIsRunning(false);
      setOptimizationResult(data);
      queryClient.invalidateQueries({ queryKey: ["/api/aco/history"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/rakes"] });
      toast({
        title: "Optimization Complete",
        description: `Reduced empty movements by ${data.emptyMovementsReduction?.toFixed(1)}%`,
      });
    },
    onError: () => {
      setIsRunning(false);
      setCurrentIteration(0);
      toast({
        title: "Optimization Failed",
        description: "An error occurred while running the ACO algorithm",
        variant: "destructive",
      });
    },
  });

  const handleReset = () => {
    setCurrentIteration(0);
    setOptimizationResult(null);
    setPheromoneStrength(1.5);
    setEvaporationRate(0.5);
    setIterations(100);
  };

  const latestOptimization = optimizations?.[0];

  return (
    <div className="space-y-6" data-testid="page-aco-optimizer">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">ACO Optimizer</h1>
        <p className="text-muted-foreground">
          Ant Colony Optimization for minimizing empty rake movements
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2" data-testid="card-aco-visualization">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Train className="h-5 w-5 text-primary" />
              Optimization Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Iteration</p>
                <p className="text-2xl font-bold font-mono" data-testid="text-aco-iteration">
                  {currentIteration} / {iterations}
                </p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-status-success" />
                  <p className="text-sm text-muted-foreground">Empty Reduction</p>
                </div>
                <p className="text-2xl font-bold text-status-success" data-testid="text-aco-reduction">
                  {optimizationResult?.emptyMovementsReduction?.toFixed(1) || latestOptimization?.emptyMovementsReduction.toFixed(1) || 0}%
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge
                  variant="outline"
                  className={
                    isRunning
                      ? "bg-status-success/20 text-status-success border-status-success/30"
                      : "bg-muted/50 text-muted-foreground border-muted"
                  }
                  data-testid="badge-aco-status"
                >
                  {isRunning ? "Running" : "Idle"}
                </Badge>
              </div>
            </div>

            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${(currentIteration / iterations) * 100}%` }}
              />
            </div>

            {optimizationResult && (
              <div className="mt-6 space-y-3">
                <h3 className="text-sm font-semibold">Optimization Results</h3>
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-md">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Allocations</p>
                    <p className="text-lg font-semibold">{optimizationResult.allocations?.length || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Empty Movements</p>
                    <p className="text-lg font-semibold text-status-warning">
                      {optimizationResult.totalEmptyMovements || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Distance</p>
                    <p className="text-lg font-semibold">{optimizationResult.totalDistance?.toFixed(0) || 0} km</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Loaded Movements</p>
                    <p className="text-lg font-semibold text-status-success">
                      {optimizationResult.allocations?.filter(a => !a.isEmptyMovement).length || 0}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card data-testid="card-aco-controls">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Parameters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pheromone">Pheromone Strength</Label>
              <Input
                id="pheromone"
                type="number"
                step="0.1"
                value={pheromoneStrength}
                onChange={(e) => setPheromoneStrength(parseFloat(e.target.value))}
                disabled={isRunning}
                data-testid="input-pheromone"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="evaporation">Evaporation Rate</Label>
              <Input
                id="evaporation"
                type="number"
                step="0.1"
                max="1"
                min="0"
                value={evaporationRate}
                onChange={(e) => setEvaporationRate(parseFloat(e.target.value))}
                disabled={isRunning}
                data-testid="input-evaporation"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="iterations">Iterations</Label>
              <Input
                id="iterations"
                type="number"
                value={iterations}
                onChange={(e) => setIterations(parseInt(e.target.value))}
                disabled={isRunning}
                data-testid="input-iterations"
              />
            </div>

            <div className="flex gap-2 pt-4">
              {!isRunning ? (
                <Button
                  onClick={() => runOptimizationMutation.mutate()}
                  className="flex-1"
                  data-testid="button-run-aco"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Run
                </Button>
              ) : (
                <Button
                  onClick={() => setIsRunning(false)}
                  variant="destructive"
                  className="flex-1"
                  data-testid="button-stop-aco"
                  disabled
                >
                  <Square className="h-4 w-4 mr-2" />
                  Running...
                </Button>
              )}
              <Button
                onClick={handleReset}
                variant="outline"
                disabled={isRunning}
                data-testid="button-reset-aco"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {optimizationResult && optimizationResult.allocations && optimizationResult.allocations.length > 0 && (
        <Card data-testid="card-allocations">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Rake Allocations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {optimizationResult.allocations.map((allocation, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-md"
                  data-testid={`allocation-${idx}`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <p className="font-mono font-semibold text-sm">{allocation.rakeNumber}</p>
                      {allocation.trainNumber && (
                        <>
                          <span className="text-muted-foreground">→</span>
                          <p className="font-mono text-sm">Train {allocation.trainNumber}</p>
                        </>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {allocation.fromStation} → {allocation.toStation || "Unassigned"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant="outline"
                      className={
                        allocation.isEmptyMovement
                          ? "bg-status-warning/20 text-status-warning border-status-warning/30"
                          : "bg-status-success/20 text-status-success border-status-success/30"
                      }
                    >
                      {allocation.isEmptyMovement ? "Empty" : "Loaded"}
                    </Badge>
                    <span className="text-sm font-mono text-muted-foreground">
                      {allocation.distance.toFixed(0)} km
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card data-testid="card-optimization-history">
        <CardHeader>
          <CardTitle>Optimization History</CardTitle>
        </CardHeader>
        <CardContent>
          {optimizations && optimizations.length > 0 ? (
            <div className="space-y-3">
              {optimizations.slice(0, 10).map((opt) => (
                <div
                  key={opt.id}
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-md hover-elevate"
                  data-testid={`optimization-${opt.id}`}
                >
                  <div className="space-y-1">
                    <p className="text-sm font-mono">
                      {format(new Date(opt.runDate), "MMM dd, yyyy HH:mm:ss")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {opt.iterations} iterations • {opt.executionTimeMs}ms • Score: {opt.optimizationScore.toFixed(3)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-status-success">
                      -{opt.emptyMovementsReduction.toFixed(1)}%
                    </p>
                    <p className="text-xs text-muted-foreground">Empty movements</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No optimization history available
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
