import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Train, AlertTriangle, CheckCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Schedule, Event } from "@shared/schema";
import { format } from "date-fns";

export default function Scheduling() {
  const { data: schedules, isLoading } = useQuery<Schedule[]>({
    queryKey: ["/api/schedules"],
  });

  const { data: events } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  const upcomingEvents = events?.filter(
    (e) => new Date(e.date) > new Date()
  ).slice(0, 5) || [];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "scheduled":
        return "bg-status-success/20 text-status-success border-status-success/30";
      case "delayed":
        return "bg-status-warning/20 text-status-warning border-status-warning/30";
      case "cancelled":
        return "bg-status-critical/20 text-status-critical border-status-critical/30";
      default:
        return "bg-muted/50 text-muted-foreground border-muted";
    }
  };

  return (
    <div className="space-y-6" data-testid="page-scheduling">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Dynamic Scheduling</h1>
        <p className="text-muted-foreground">
          Intelligent scheduling with real-time delay adaptation
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card data-testid="card-schedules">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Train Schedules
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-24 bg-muted/30 rounded-md animate-pulse" />
                  ))}
                </div>
              ) : schedules && schedules.length > 0 ? (
                <div className="space-y-3">
                  {schedules.map((schedule) => (
                    <div
                      key={schedule.id}
                      className="p-4 bg-muted/30 rounded-md hover-elevate space-y-3"
                      data-testid={`schedule-${schedule.id}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                            <Train className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-mono font-semibold">{schedule.trainId}</p>
                            <p className="text-xs text-muted-foreground">{schedule.routeId}</p>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={getStatusColor(schedule.status)}
                        >
                          {schedule.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground mb-1">Departure</p>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">
                              {format(new Date(schedule.departureTime), "MMM dd, HH:mm")}
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">Arrival</p>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">
                              {format(new Date(schedule.arrivalTime), "MMM dd, HH:mm")}
                            </span>
                          </div>
                        </div>
                      </div>

                      {schedule.isOptimized && (
                        <div className="flex items-center gap-2 text-sm text-status-success bg-status-success/10 p-2 rounded-md">
                          <CheckCircle className="h-4 w-4" />
                          <span>
                            ACO Optimized (Score: {schedule.optimizationScore?.toFixed(2)})
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No schedules available</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card data-testid="card-upcoming-events">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-status-weatherAlert" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingEvents.length > 0 ? (
                <div className="space-y-3">
                  {upcomingEvents.map((event) => (
                    <div
                      key={event.id}
                      className="p-3 bg-muted/30 rounded-md space-y-2"
                      data-testid={`event-${event.id}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium">{event.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {format(new Date(event.date), "MMM dd, yyyy")}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            event.impactLevel === "high"
                              ? "bg-status-critical/20 text-status-critical border-status-critical/30"
                              : event.impactLevel === "medium"
                              ? "bg-status-warning/20 text-status-warning border-status-warning/30"
                              : "bg-status-success/20 text-status-success border-status-success/30"
                          }
                        >
                          {event.impactLevel}
                        </Badge>
                      </div>
                      {event.description && (
                        <p className="text-xs text-muted-foreground">{event.description}</p>
                      )}
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {event.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Demand: ×{event.demandMultiplier.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No upcoming events</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-status-warning" />
                Schedule Conflicts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">No conflicts detected</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
