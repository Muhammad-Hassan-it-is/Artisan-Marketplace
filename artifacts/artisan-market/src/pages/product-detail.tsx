import { useState } from "react";
import { useParams, useLocation, Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Package, MapPin, ChevronDown } from "lucide-react";
import {
  useGetProduct,
  getGetProductQueryKey,
  useCreateOrder,
  getListOrdersQueryKey,
  getListRecentOrdersQueryKey,
  getGetDashboardSummaryQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type CustomizationValues = Record<string, string>;

function CustomizationField({
  option,
  value,
  onChange,
}: {
  option: any;
  value: string;
  onChange: (v: string) => void;
}) {
  const { name, type, choices, required, priceDelta } = option;

  if (type === "text") {
    return (
      <div className="space-y-1.5">
        <label className="text-sm font-medium">
          {name}
          {required && <span className="text-destructive ml-1">*</span>}
          {priceDelta ? <span className="text-xs text-muted-foreground ml-2">+${priceDelta}</span> : null}
        </label>
        <Input
          data-testid={`input-customization-${name.toLowerCase().replace(/\s+/g, "-")}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Enter ${name.toLowerCase()}...`}
          className="h-9 text-sm"
        />
      </div>
    );
  }

  if (type === "color") {
    return (
      <div className="space-y-1.5">
        <label className="text-sm font-medium">
          {name}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
        <div className="flex flex-wrap gap-2">
          {choices.map((choice: string) => (
            <button
              key={choice}
              data-testid={`button-color-${choice.toLowerCase().replace(/\s+/g, "-")}`}
              onClick={() => onChange(choice)}
              className={`px-3 py-1.5 text-xs rounded-sm border transition-all ${
                value === choice
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {choice}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">
        {name}
        {required && <span className="text-destructive ml-1">*</span>}
        {priceDelta ? <span className="text-xs text-muted-foreground ml-2">+${priceDelta}</span> : null}
      </label>
      <div className="flex flex-wrap gap-2">
        {choices.map((choice: string) => (
          <button
            key={choice}
            data-testid={`button-choice-${choice.toLowerCase().replace(/\s+/g, "-")}`}
            onClick={() => onChange(choice)}
            className={`px-3 py-1.5 text-xs rounded-sm border transition-all ${
              value === choice
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border hover:border-primary/50"
            }`}
          >
            {choice}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: product, isLoading } = useGetProduct(id, {
    query: { enabled: !!id, queryKey: getGetProductQueryKey(id) },
  });

  const [customizations, setCustomizations] = useState<CustomizationValues>({});
  const [quantity, setQuantity] = useState(1);
  const [showOrderForm, setShowOrderForm] = useState(false);

  const createOrder = useCreateOrder();

  const form = useForm({
    defaultValues: {
      companyName: "",
      contactName: "",
      contactEmail: "",
      shippingAddress: "",
      notes: "",
    },
  });

  const totalPriceDelta = product?.customizations?.reduce((acc, opt) => {
    if (customizations[opt.name] && opt.priceDelta) return acc + opt.priceDelta;
    return acc;
  }, 0) ?? 0;

  const configuredPrice = product ? (product.price + totalPriceDelta) * quantity : 0;

  const handleCustomizationChange = (name: string, value: string) => {
    setCustomizations((prev) => ({ ...prev, [name]: value }));
  };

  const canPlaceOrder = product?.customizations
    ?.filter((o) => o.required)
    .every((o) => customizations[o.name]) ?? true;

  const onSubmitOrder = form.handleSubmit(async (values) => {
    if (!product) return;

    createOrder.mutate(
      {
        data: {
          ...values,
          items: [
            {
              productId: product.id,
              quantity,
              customizations,
            },
          ],
        },
      },
      {
        onSuccess: (order) => {
          queryClient.invalidateQueries({ queryKey: getListOrdersQueryKey() });
          queryClient.invalidateQueries({ queryKey: getListRecentOrdersQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() });
          toast({
            title: "Order placed successfully",
            description: `Order #${order.id} has been received. We'll confirm shortly.`,
          });
          setLocation(`/orders/${order.id}`);
        },
        onError: () => {
          toast({ title: "Failed to place order", variant: "destructive" });
        },
      }
    );
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Skeleton className="h-4 w-24 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <Skeleton className="aspect-square rounded-sm" />
          <div className="space-y-4">
            <Skeleton className="h-7 w-3/4" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="font-serif text-xl text-muted-foreground">Product not found.</p>
        <Link href="/" className="text-sm text-primary underline mt-4 inline-block">Back to catalog</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Link href="/">
        <button data-testid="button-back-catalog" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Catalog
        </button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image */}
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-3">
          <div className="aspect-square rounded-sm overflow-hidden bg-muted">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">No image</div>
            )}
          </div>
          {product.artisanName && (
            <Link href={product.artisanId ? `/artisans/${product.artisanId}` : "#"}>
              <div className="flex items-center gap-3 p-3 bg-secondary/40 rounded-sm border border-border hover:border-primary/30 transition-colors cursor-pointer group">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-serif text-primary shrink-0">
                  {product.artisanName[0]}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Made by</p>
                  <p className="text-sm font-medium group-hover:text-primary transition-colors">{product.artisanName}</p>
                </div>
                {product.artisanLocation && (
                  <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    {product.artisanLocation}
                  </div>
                )}
              </div>
            </Link>
          )}
        </motion.div>

        {/* Details + Configurator */}
        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <div>
            <div className="flex items-start gap-3 mb-1">
              <h1 data-testid="text-product-name" className="font-serif text-3xl font-medium flex-1">{product.name}</h1>
              {product.featured && <Badge variant="secondary" className="mt-1 shrink-0">Featured</Badge>}
            </div>
            {product.categoryName && (
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">{product.categoryName}</p>
            )}
          </div>

          {product.description && (
            <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
          )}

          <div className="flex items-center gap-6 text-sm py-4 border-y border-border">
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Base price</p>
              <p className="font-serif text-2xl font-medium">${product.price.toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{product.leadTimeDays}-day lead time</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Package className="w-4 h-4" />
              <span>{product.stock} in stock</span>
            </div>
          </div>

          {/* Customization Options */}
          {product.customizations && product.customizations.length > 0 && (
            <div className="space-y-5">
              <h2 className="font-serif text-lg font-medium">Configure Your Order</h2>
              {product.customizations.map((opt) => (
                <CustomizationField
                  key={opt.id}
                  option={opt}
                  value={customizations[opt.name] ?? ""}
                  onChange={(v) => handleCustomizationChange(opt.name, v)}
                />
              ))}
            </div>
          )}

          {/* Quantity */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Quantity</label>
            <div className="flex items-center gap-3">
              <button
                data-testid="button-qty-decrease"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-sm border border-input flex items-center justify-center hover:bg-secondary transition-colors text-sm"
              >
                −
              </button>
              <span data-testid="text-quantity" className="font-medium w-8 text-center">{quantity}</span>
              <button
                data-testid="button-qty-increase"
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-sm border border-input flex items-center justify-center hover:bg-secondary transition-colors text-sm"
              >
                +
              </button>
            </div>
          </div>

          {/* Configured Total */}
          <div className="p-4 bg-secondary/40 rounded-sm border border-border">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Configured total</span>
              <span data-testid="text-configured-price" className="font-serif text-xl font-medium">${configuredPrice.toLocaleString()}</span>
            </div>
          </div>

          {/* Order Button */}
          {!showOrderForm ? (
            <Button
              data-testid="button-place-order"
              className="w-full"
              disabled={!canPlaceOrder || product.stock === 0}
              onClick={() => setShowOrderForm(true)}
            >
              {product.stock === 0 ? "Out of Stock" : canPlaceOrder ? "Place Order" : "Complete Required Options"}
            </Button>
          ) : (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="border border-border rounded-sm p-5 space-y-4">
              <h3 className="font-serif text-base font-medium">Order Details</h3>
              <Form {...form}>
                <form onSubmit={onSubmitOrder} className="space-y-3">
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Company Name</FormLabel>
                        <FormControl>
                          <Input data-testid="input-company-name" {...field} className="h-9 text-sm" placeholder="Your company" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="contactName"
                      rules={{ required: "Required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Contact Name *</FormLabel>
                          <FormControl>
                            <Input data-testid="input-contact-name" {...field} className="h-9 text-sm" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="contactEmail"
                      rules={{ required: "Required", pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email" } }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Email *</FormLabel>
                          <FormControl>
                            <Input data-testid="input-contact-email" type="email" {...field} className="h-9 text-sm" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="shippingAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Shipping Address</FormLabel>
                        <FormControl>
                          <Input data-testid="input-shipping-address" {...field} className="h-9 text-sm" placeholder="Delivery address" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Notes</FormLabel>
                        <FormControl>
                          <Textarea data-testid="input-notes" {...field} className="text-sm resize-none" rows={2} placeholder="Any special instructions..." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-2 pt-1">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setShowOrderForm(false)}
                      data-testid="button-cancel-order"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={createOrder.isPending}
                      data-testid="button-submit-order"
                    >
                      {createOrder.isPending ? "Placing..." : `Confirm Order — $${configuredPrice.toLocaleString()}`}
                    </Button>
                  </div>
                </form>
              </Form>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Artisan Bio */}
      {product.artisanBio && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-12 border-t border-border pt-8">
          <h2 className="font-serif text-xl mb-3">About the Maker</h2>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">{product.artisanBio}</p>
        </motion.div>
      )}
    </div>
  );
}
