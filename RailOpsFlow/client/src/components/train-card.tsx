import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Train as TrainIcon, MapPin, Clock, AlertTriangle } from "lucide-react";
import { Train } from "@shared/schema";
import { format } from "date-fns";

interface TrainCardProps {
  train: Train;
}

export function TrainCard({ train }: TrainCardProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "on-time":
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
    <Card className="hover-elevate" data-testid={`card-train-${train.id}`}>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10">
            <TrainIcon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-mono font-semibold" data-testid={`text-train-number-${train.id}`}>
              {train.trainNumber}
            </p>
            <p className="text-xs text-muted-foreground">{train.name}</p>
          </div>
        </div>
        <Badge className={getStatusColor(train.status)} variant="outline" data-testid={`badge-train-status-${train.id}`}>
          {train.status}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="text-foreground" data-testid={`text-train-station-${train.id}`}>{train.currentStation}</span>
        </div>
        <div className="text-sm">
          <p className="text-muted-foreground mb-1">Route</p>
          <p className="font-medium" data-testid={`text-train-route-${train.id}`}>{train.route}</p>
        </div>
        {train.delayMinutes > 0 && (
          <div className="flex items-center gap-2 text-sm bg-status-warning/10 p-2 rounded-md">
            <AlertTriangle className="h-4 w-4 text-status-warning" />
            <span className="text-status-warning font-medium" data-testid={`text-delay-${train.id}`}>
              Delayed by {train.delayMinutes} min
            </span>
          </div>
        )}
        <div className="pt-2 border-t border-border flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>Departure: {format(new Date(train.scheduledDeparture), "MMM dd, HH:mm")}</span>
        </div>
      </CardContent>
    </Card>
  );
}
