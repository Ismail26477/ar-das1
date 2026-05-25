import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Package, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useOrdersWithBuyers } from "@/hooks/useSupabase";

const statusStyles: Record<string, { bg: string; text: string; label: string }> = {
  processing: {
    bg: "bg-blue-500/10",
    text: "text-blue-500",
    label: "Processing",
  },
  shipped: {
    bg: "bg-purple-500/10",
    text: "text-purple-500",
    label: "Shipped",
  },
  delivered: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-500",
    label: "Delivered",
  },
  cancelled: {
    bg: "bg-red-500/10",
    text: "text-red-500",
    label: "Cancelled",
  },
  returned: {
    bg: "bg-orange-500/10",
    text: "text-orange-500",
    label: "Returned",
  },
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  
  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours} hours ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

export function RecentOrders() {
  const { data: orders, isLoading, error } = useOrdersWithBuyers();

  return (
    <Card className="animate-fade-in stagger-3">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Recent Orders</CardTitle>
        <Button variant="ghost" size="sm" className="text-primary gap-1">
          View All
          <ArrowRight className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-muted-foreground">
            Failed to load orders
          </div>
        ) : (
          <div className="space-y-4">
            {orders?.slice(0, 5).map((order: any) => {
              const status = statusStyles[order.status] || statusStyles.processing;
              return (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                      <Package className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{order.buyer_name}</p>
                      <p className="text-xs text-muted-foreground">
                        #{order.order_number}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <div>
                      <p className="font-semibold text-sm">{formatCurrency(order.total)}</p>
                      <p className="text-xs text-muted-foreground">{formatTimeAgo(order.created_at)}</p>
                    </div>
                    <Badge
                      className={cn(
                        "text-xs font-medium",
                        status.bg,
                        status.text,
                        "border-0"
                      )}
                    >
                      {status.label}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
