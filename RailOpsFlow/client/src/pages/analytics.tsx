import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/metric-card";
import { TrendingDown, TrendingUp, Activity, Target } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function Analytics() {
  const { data: analytics } = useQuery<{
    emptyMovementTrend: Array<{ date: string; percentage: number }>;
    demandForecastAccuracy: Array<{ route: string; accuracy: number }>;
    optimizationImpact: Array<{ date: string; before: number; after: number }>;
    averageEmptyMovement: number;
    forecastAccuracy: number;
    optimizationSavings: number;
    scheduleEfficiency: number;
  }>({
    queryKey: ["/api/analytics"],
  });

  return (
    <div className="space-y-6" data-testid="page-analytics">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Performance metrics and optimization insights
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Avg Empty Movement"
          value={analytics?.averageEmptyMovement || 0}
          icon={TrendingDown}
          suffix="%"
          trend={{ value: -8.3, isPositive: true }}
          testId="metric-avg-empty"
        />
        <MetricCard
          title="Forecast Accuracy"
          value={analytics?.forecastAccuracy || 0}
          icon={Target}
          suffix="%"
          trend={{ value: 5.2, isPositive: true }}
          testId="metric-forecast-accuracy"
        />
        <MetricCard
          title="Optimization Savings"
          value={analytics?.optimizationSavings || 0}
          icon={TrendingUp}
          suffix="hrs"
          trend={{ value: 12.1, isPositive: true }}
          testId="metric-optimization-savings"
        />
        <MetricCard
          title="Schedule Efficiency"
          value={analytics?.scheduleEfficiency || 0}
          icon={Activity}
          suffix="%"
          trend={{ value: 3.7, isPositive: true }}
          testId="metric-schedule-efficiency"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card data-testid="card-empty-movement-trend">
          <CardHeader>
            <CardTitle>Empty Movement Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics?.emptyMovementTrend || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="percentage"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--chart-1))", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card data-testid="card-forecast-accuracy">
          <CardHeader>
            <CardTitle>Demand Forecast Accuracy by Route</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics?.demandForecastAccuracy || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="route" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                  }}
                />
                <Bar dataKey="accuracy" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2" data-testid="card-optimization-impact">
          <CardHeader>
            <CardTitle>ACO Optimization Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics?.optimizationImpact || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="before"
                  stroke="hsl(var(--chart-3))"
                  strokeWidth={2}
                  name="Before Optimization"
                  dot={{ fill: "hsl(var(--chart-3))", r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="after"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                  name="After Optimization"
                  dot={{ fill: "hsl(var(--chart-2))", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
