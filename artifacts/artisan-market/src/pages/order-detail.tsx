import { Link, useParams } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Building2, Mail, MapPin, FileText } from "lucide-react";
import {
  useGetOrder,
  getGetOrderQueryKey,
  useUpdateOrderStatus,
  getListOrdersQueryKey,
  getListRecentOrdersQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./orders";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

const ALL_STATUSES = ["pending", "confirmed", "in_production", "shipped", "delivered", "cancelled"] as const;
const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  in_production: "In Production",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: order, isLoading } = useGetOrder(id, {
    query: { enabled: !!id, queryKey: getGetOrderQueryKey(id) },
  });

  const updateStatus = useUpdateOrderStatus();
  const [newStatus, setNewStatus] = useState<string>("");

  const handleStatusUpdate = () => {
    if (!newStatus || !order) return;
    updateStatus.mutate(
      { id, data: { status: newStatus as any } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetOrderQueryKey(id) });
          queryClient.invalidateQueries({ queryKey: getListOrdersQueryKey() });
          queryClient.invalidateQueries({ queryKey: getListRecentOrdersQueryKey() });
          toast({ title: "Order status updated" });
          setNewStatus("");
        },
        onError: () => toast({ title: "Failed to update status", variant: "destructive" }),
      }
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Skeleton className="h-4 w-24 mb-6" />
        <Skeleton className="h-7 w-1/3 mb-4" />
        <div className="grid grid-cols-2 gap-4 mb-6">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16" />)}
        </div>
        <Skeleton className="h-40" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="font-serif text-xl text-muted-foreground">Order not found.</p>
        <Link href="/orders" className="text-sm text-primary underline mt-4 inline-block">Back to orders</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link href="/orders">
        <button data-testid="button-back-orders" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Orders
        </button>
      </Link>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="font-serif text-3xl font-medium mb-2">Order #{order.id}</h1>
            <div className="flex items-center gap-3">
              <StatusBadge status={order.status} />
              <span className="text-xs text-muted-foreground">
                Placed {new Date(order.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground mb-0.5">Total</p>
            <p data-testid="text-order-total" className="font-serif text-2xl font-medium">${order.totalAmount.toLocaleString()}</p>
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {order.companyName && (
            <div className="p-4 bg-card border border-border rounded-sm">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <Building2 className="w-3 h-3" />
                Company
              </div>
              <p className="font-medium text-sm">{order.companyName}</p>
            </div>
          )}
          <div className="p-4 bg-card border border-border rounded-sm">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <Mail className="w-3 h-3" />
              Contact
            </div>
            <p className="font-medium text-sm">{order.contactName}</p>
            <p className="text-xs text-muted-foreground">{order.contactEmail}</p>
          </div>
          {order.shippingAddress && (
            <div className="p-4 bg-card border border-border rounded-sm">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <MapPin className="w-3 h-3" />
                Shipping Address
              </div>
              <p className="text-sm">{order.shippingAddress}</p>
            </div>
          )}
          {order.notes && (
            <div className="p-4 bg-card border border-border rounded-sm">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <FileText className="w-3 h-3" />
                Notes
              </div>
              <p className="text-sm">{order.notes}</p>
            </div>
          )}
        </div>

        {/* Order Items */}
        <div className="mb-6">
          <h2 className="font-serif text-lg mb-3">Items</h2>
          <div className="border border-border rounded-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Product</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Customizations</th>
                  <th className="text-right px-4 py-2.5 text-xs font-medium text-muted-foreground">Qty</th>
                  <th className="text-right px-4 py-2.5 text-xs font-medium text-muted-foreground">Unit Price</th>
                  <th className="text-right px-4 py-2.5 text-xs font-medium text-muted-foreground">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, i) => (
                  <tr key={item.id} className={i > 0 ? "border-t border-border" : ""}>
                    <td data-testid={`text-item-name-${item.id}`} className="px-4 py-3 font-medium">{item.productName}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(item.customizations).map(([k, v]) => (
                          <span key={k} className="inline-flex items-center gap-1 text-xs bg-secondary rounded-sm px-1.5 py-0.5">
                            <span className="text-muted-foreground">{k}:</span> {String(v)}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-muted-foreground">{item.quantity}</td>
                    <td className="px-4 py-3 text-right text-muted-foreground">${item.unitPrice.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right font-medium">${(item.unitPrice * item.quantity).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Update Status */}
        <div className="p-4 bg-secondary/30 rounded-sm border border-border">
          <h3 className="font-medium text-sm mb-3">Update Status</h3>
          <div className="flex items-center gap-3">
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger data-testid="select-status" className="w-48 h-9 text-sm">
                <SelectValue placeholder="Select new status" />
              </SelectTrigger>
              <SelectContent>
                {ALL_STATUSES.filter(s => s !== order.status).map(s => (
                  <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              data-testid="button-update-status"
              size="sm"
              disabled={!newStatus || updateStatus.isPending}
              onClick={handleStatusUpdate}
            >
              {updateStatus.isPending ? "Updating..." : "Update"}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
