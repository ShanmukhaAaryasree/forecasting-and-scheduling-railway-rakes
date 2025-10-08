import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Train, MapPin, Package } from "lucide-react";
import { Rake } from "@shared/schema";
import { format } from "date-fns";

interface RakeCardProps {
  rake: Rake;
}

export function RakeCard({ rake }: RakeCardProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "available":
        return "bg-status-success/20 text-status-success border-status-success/30";
      case "in-transit":
        return "bg-status-loadedRake/20 text-status-loadedRake border-status-loadedRake/30";
      case "maintenance":
        return "bg-status-warning/20 text-status-warning border-status-warning/30";
      case "delayed":
        return "bg-status-critical/20 text-status-critical border-status-critical/30";
      default:
        return "bg-muted/50 text-muted-foreground border-muted";
    }
  };

  const getLoadStatusColor = (isLoaded: boolean) => {
    return isLoaded
      ? "bg-status-loadedRake/20 text-status-loadedRake border-status-loadedRake/30"
      : "bg-status-emptyRake/20 text-status-emptyRake border-status-emptyRake/30";
  };

  return (
    <Card className="hover-elevate" data-testid={`card-rake-${rake.id}`}>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10">
            <Train className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-mono font-semibold" data-testid={`text-rake-number-${rake.id}`}>
              {rake.rakeNumber}
            </p>
            <p className="text-xs text-muted-foreground">{rake.type}</p>
          </div>
        </div>
        <Badge className={getStatusColor(rake.status)} variant="outline" data-testid={`badge-status-${rake.id}`}>
          {rake.status}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground" data-testid={`text-location-${rake.id}`}>{rake.currentLocation}</span>
          </div>
          <Badge className={getLoadStatusColor(rake.isLoaded)} variant="outline">
            {rake.isLoaded ? "Loaded" : "Empty"}
          </Badge>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Capacity:</span>
          </div>
          <span className="font-medium font-mono">{rake.capacity}</span>
        </div>
        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Updated: {format(new Date(rake.lastUpdated), "MMM dd, HH:mm")}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
