import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Network, Activity, TrendingDown } from "lucide-react";
import { useEffect, useState } from "react";

interface AcoVisualizerProps {
  isRunning: boolean;
  iterations: number;
  currentIteration: number;
  emptyMovementReduction: number;
}

export function AcoVisualizer({
  isRunning,
  iterations,
  currentIteration,
  emptyMovementReduction,
}: AcoVisualizerProps) {
  const [paths, setPaths] = useState<Array<{ x1: number; y1: number; x2: number; y2: number; intensity: number }>>([]);

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        const newPaths = Array.from({ length: 5 }, () => ({
          x1: Math.random() * 100,
          y1: Math.random() * 100,
          x2: Math.random() * 100,
          y2: Math.random() * 100,
          intensity: Math.random(),
        }));
        setPaths(newPaths);
      }, 200);
      return () => clearInterval(interval);
    }
  }, [isRunning]);

  return (
    <Card data-testid="card-aco-visualizer">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Network className="h-5 w-5 text-primary" />
          Ant Colony Optimization
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Status:</span>
          </div>
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

        <div className="relative h-64 bg-muted/30 rounded-md border border-border overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {paths.map((path, i) => (
              <line
                key={i}
                x1={path.x1}
                y1={path.y1}
                x2={path.x2}
                y2={path.y2}
                stroke={`hsl(var(--primary) / ${path.intensity})`}
                strokeWidth="0.5"
                className="transition-all duration-300"
              />
            ))}
            {Array.from({ length: 8 }).map((_, i) => (
              <circle
                key={i}
                cx={(i % 4) * 30 + 10}
                cy={Math.floor(i / 4) * 60 + 20}
                r="2"
                fill="hsl(var(--primary))"
                className={isRunning ? "animate-pulse" : ""}
              />
            ))}
          </svg>
        </div>

        <div className="grid grid-cols-2 gap-4">
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
              {emptyMovementReduction.toFixed(1)}%
            </p>
          </div>
        </div>

        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${(currentIteration / iterations) * 100}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
