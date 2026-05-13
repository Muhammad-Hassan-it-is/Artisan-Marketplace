import { Link } from "wouter";
import { motion } from "framer-motion";
import { Package, ShoppingBag, DollarSign, Clock, TrendingUp, Activity } from "lucide-react";
import { useGetDashboardSummary, useListRecentOrders } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "./orders";

function StatCard({ icon: Icon, label, value, sub, index }: { icon: any; label: string; value: string; sub?: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-card border border-border rounded-sm p-5"
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">{label}</p>
        <div className="w-8 h-8 rounded-sm bg-secondary flex items-center justify-center">
          <Icon className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
      <p data-testid={`stat-${label.toLowerCase().replace(/\s+/g, "-")}`} className="font-serif text-3xl font-medium">{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
    </motion.div>
  );
}

export default function DashboardPage() {
  const { data: summary, isLoading: sumLoading } = useGetDashboardSummary();
  const { data: recent, isLoading: recLoading } = useListRecentOrders();

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase mb-2">Overview</p>
        <h1 className="font-serif text-4xl font-medium">Dashboard</h1>
      </motion.div>

      {/* Stats */}
      {sumLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-sm" />)}
        </div>
      ) : summary ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Package} label="Products" value={summary.totalProducts.toLocaleString()} index={0} />
          <StatCard icon={ShoppingBag} label="Total Orders" value={summary.totalOrders.toLocaleString()} index={1} />
          <StatCard
            icon={DollarSign}
            label="Revenue"
            value={`$${summary.totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
            index={2}
          />
          <StatCard
            icon={Clock}
            label="Pending"
            value={summary.pendingOrders.toLocaleString()}
            sub={`${summary.inProductionOrders} in production`}
            index={3}
          />
        </div>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Categories */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="bg-card border border-border rounded-sm p-5 h-full">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
              <h2 className="font-serif text-base font-medium">Top Categories</h2>
            </div>
            {sumLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-8" />)}
              </div>
            ) : summary?.topCategories && summary.topCategories.length > 0 ? (
              <div className="space-y-2">
                {summary.topCategories.map((cat, i) => {
                  const max = summary.topCategories[0]?.count ?? 1;
                  const pct = Math.round((cat.count / max) * 100);
                  return (
                    <div key={cat.name} data-testid={`stat-category-${i}`}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-sm truncate">{cat.name}</span>
                        <span className="text-xs text-muted-foreground ml-2 shrink-0">{cat.count}</span>
                      </div>
                      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.6, delay: 0.3 + i * 0.05 }}
                          className="h-full bg-primary rounded-full"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No category data available.</p>
            )}
          </div>
        </motion.div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="lg:col-span-2"
        >
          <div className="bg-card border border-border rounded-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-muted-foreground" />
                <h2 className="font-serif text-base font-medium">Recent Activity</h2>
              </div>
              <Link href="/orders">
                <button className="text-xs text-primary hover:underline">View all</button>
              </Link>
            </div>
            {recLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14" />)}
              </div>
            ) : recent && recent.length > 0 ? (
              <div className="space-y-2">
                {recent.map((order, i) => (
                  <motion.div key={order.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.04 }}>
                    <Link href={`/orders/${order.id}`}>
                      <div
                        data-testid={`recent-order-${order.id}`}
                        className="flex items-center gap-3 p-3 rounded-sm hover:bg-secondary/40 transition-colors cursor-pointer group"
                      >
                        <div className="w-8 h-8 rounded-sm bg-secondary flex items-center justify-center shrink-0 text-xs font-medium text-muted-foreground">
                          #{order.id}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium group-hover:text-primary transition-colors truncate">
                              {order.companyName || order.contactName}
                            </span>
                            <StatusBadge status={order.status} />
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {order.items.map(i => i.productName).join(", ")}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-semibold">${order.totalAmount.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground py-4 text-center">No orders yet.</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
