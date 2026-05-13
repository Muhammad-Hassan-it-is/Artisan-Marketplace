import { Link, useParams } from "wouter";
import { motion } from "framer-motion";
import { MapPin, Star, Package, ArrowLeft, Clock } from "lucide-react";
import { useGetArtisan, getGetArtisanQueryKey, useListProducts, getListProductsQueryKey } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function ArtisanProfilePage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  const { data: artisan, isLoading: artisanLoading } = useGetArtisan(id, {
    query: { enabled: !!id, queryKey: getGetArtisanQueryKey(id) },
  });

  const { data: products, isLoading: prodLoading } = useListProducts(
    { artisanId: id },
    { query: { enabled: !!id, queryKey: getListProductsQueryKey({ artisanId: id }) } }
  );

  if (artisanLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Skeleton className="h-4 w-24 mb-6" />
        <div className="flex gap-6 mb-8">
          <Skeleton className="w-24 h-24 rounded-full shrink-0" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/5" />
          </div>
        </div>
        <Skeleton className="h-20 w-full mb-8" />
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="aspect-[4/3]" />)}
        </div>
      </div>
    );
  }

  if (!artisan) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="font-serif text-xl text-muted-foreground">Artisan not found.</p>
        <Link href="/artisans" className="text-sm text-primary underline mt-4 inline-block">Back to directory</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Link href="/artisans">
        <button data-testid="button-back-artisans" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          All Artisans
        </button>
      </Link>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-muted ring-2 ring-border shrink-0">
            {artisan.imageUrl ? (
              <img src={artisan.imageUrl} alt={artisan.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-serif text-3xl text-muted-foreground">
                {artisan.name[0]}
              </div>
            )}
          </div>
          <div className="flex-1">
            <h1 data-testid="text-artisan-name" className="font-serif text-3xl font-medium mb-1">{artisan.name}</h1>
            {artisan.specialty && (
              <p className="text-primary font-medium text-sm mb-2">{artisan.specialty}</p>
            )}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              {artisan.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {artisan.location}
                </div>
              )}
              {artisan.rating != null && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span className="font-medium text-foreground">{artisan.rating.toFixed(1)}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Package className="w-4 h-4" />
                {artisan.totalOrders} orders fulfilled
              </div>
            </div>
          </div>
        </div>

        {artisan.bio && (
          <div className="mt-6 p-5 bg-secondary/40 rounded-sm border border-border">
            <p className="text-sm leading-relaxed text-foreground">{artisan.bio}</p>
          </div>
        )}
      </motion.div>

      <div>
        <h2 className="font-serif text-xl mb-4">Works by {artisan.name}</h2>
        {prodLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-sm overflow-hidden">
                <Skeleton className="aspect-[4/3] w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((product, i) => (
              <motion.div key={product.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Link href={`/products/${product.id}`}>
                  <div data-testid={`card-artisan-product-${product.id}`} className="group bg-card border border-border rounded-sm overflow-hidden hover:shadow-md transition-all cursor-pointer">
                    <div className="aspect-[4/3] overflow-hidden bg-muted">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">No image</div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-serif text-sm font-medium group-hover:text-primary transition-colors line-clamp-2">{product.name}</h3>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm font-semibold">${product.price.toLocaleString()}</span>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {product.leadTimeDays}d lead
                        </div>
                      </div>
                      {product.featured && <Badge variant="secondary" className="text-xs mt-2">Featured</Badge>}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm py-10 text-center">No products listed for this artisan.</p>
        )}
      </div>
    </div>
  );
}
