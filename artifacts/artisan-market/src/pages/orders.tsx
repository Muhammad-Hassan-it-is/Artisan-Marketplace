import { Link } from "wouter";
import { motion } from "framer-motion";
import { Package, Calendar, Building2 } from "lucide-react";
import { useListOrders } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  confirmed: "bg-blue-100 text-blue-800 border-blue-200",
  in_production: "bg-purple-100 text-purple-800 border-purple-200",
  shipped: "bg-cyan-100 text-cyan-800 border-cyan-200",
  delivered: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  in_production: "In Production",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-medium border ${STATUS_STYLES[status] ?? "bg-muted text-muted-foreground"}`}>
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

export default function OrdersPage() {
  const { data: orders, isLoading } = useListOrders();

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase mb-2">Procurement</p>
        <h1 className="font-serif text-4xl font-medium">Orders</h1>
      </motion.div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-sm p-4 flex gap-4">
              <Skeleton className="w-12 h-12 rounded-sm shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-1/4" />
              </div>
              <Skeleton className="h-6 w-20 self-start" />
            </div>
          ))}
        </div>
      ) : orders && orders.length > 0 ? (
        <div className="space-y-2">
          {orders.map((order, i) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Link href={`/orders/${order.id}`}>
                <div
                  data-testid={`row-order-${order.id}`}
                  className="group bg-card border border-border rounded-sm p-4 hover:shadow-sm hover:border-primary/30 transition-all cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-sm bg-secondary flex items-center justify-center shrink-0">
                      <Package className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-sm group-hover:text-primary transition-colors">
                          Order #{order.id}
                        </span>
                        <StatusBadge status={order.status} />
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground flex-wrap">
                        {order.companyName && (
                          <div className="flex items-center gap-1">
                            <Building2 className="w-3 h-3" />
                            {order.companyName}
                          </div>
                        )}
                        <span>{order.contactName}</span>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(order.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                        {" — "}
                        {order.items.map(i => i.productName).join(", ")}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p data-testid={`text-order-amount-${order.id}`} className="font-semibold text-sm">${order.totalAmount.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-muted-foreground">
          <Package className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-serif text-lg mb-1">No orders yet</p>
          <p className="text-sm mb-4">Browse the catalog to place your first order.</p>
          <Link href="/">
            <button className="text-sm text-primary underline">Go to Catalog</button>
          </Link>
        </div>
      )}
    </div>
  );
}
