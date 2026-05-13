import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, Star, Clock } from "lucide-react";
import { useListProducts, useListCategories, useListFeaturedProducts } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

function ProductCard({ product, index }: { product: any; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link href={`/products/${product.id}`}>
        <div
          data-testid={`card-product-${product.id}`}
          className="group bg-card border border-border rounded-sm overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer"
        >
          <div className="aspect-[4/3] overflow-hidden bg-muted">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                No image
              </div>
            )}
          </div>
          <div className="p-4">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-serif text-base font-medium leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                {product.name}
              </h3>
              {product.featured && (
                <Badge variant="secondary" className="shrink-0 text-xs">Featured</Badge>
              )}
            </div>
            {product.artisanName && (
              <p className="text-xs text-muted-foreground mb-2">{product.artisanName}</p>
            )}
            <div className="flex items-center justify-between mt-3">
              <span data-testid={`text-price-${product.id}`} className="text-sm font-semibold">
                ${product.price.toLocaleString()}
              </span>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>{product.leadTimeDays}d lead</span>
              </div>
            </div>
            {product.categoryName && (
              <p className="text-xs text-muted-foreground mt-1">{product.categoryName}</p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function ProductSkeleton() {
  return (
    <div className="bg-card border border-border rounded-sm overflow-hidden">
      <Skeleton className="aspect-[4/3] w-full" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex justify-between mt-3">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  );
}

export default function CatalogPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const { data: categories, isLoading: catLoading } = useListCategories();
  const { data: featured, isLoading: featLoading } = useListFeaturedProducts();
  const { data: products, isLoading: prodLoading } = useListProducts({
    categoryId: selectedCategory ?? undefined,
    search: debouncedSearch || undefined,
  });

  const handleSearch = (val: string) => {
    setSearch(val);
    clearTimeout((window as any)._searchTimeout);
    (window as any)._searchTimeout = setTimeout(() => setDebouncedSearch(val), 350);
  };

  const showFeatured = !selectedCategory && !debouncedSearch && featured && featured.length > 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase mb-2">
          Trade Procurement Platform
        </p>
        <h1 className="font-serif text-4xl font-medium text-foreground mb-3">
          Handmade, Built to Order
        </h1>
        <p className="text-muted-foreground max-w-xl">
          Source exceptional handmade goods from verified artisans worldwide. Every piece made to your specifications.
        </p>
      </motion.div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="search"
            data-testid="input-search"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full h-10 pl-9 pr-4 border border-input bg-background rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            data-testid="button-filter-all"
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1.5 text-xs rounded-sm border transition-colors ${
              !selectedCategory
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:border-primary hover:text-foreground"
            }`}
          >
            All
          </button>
          {categories?.map((cat) => (
            <button
              key={cat.id}
              data-testid={`button-filter-${cat.slug}`}
              onClick={() => setSelectedCategory(cat.id === selectedCategory ? null : cat.id)}
              className={`px-3 py-1.5 text-xs rounded-sm border transition-colors ${
                cat.id === selectedCategory
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:border-primary hover:text-foreground"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Section */}
      {showFeatured && (
        <div className="mb-10">
          <h2 className="font-serif text-xl mb-4 text-foreground">Featured Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featLoading
              ? Array.from({ length: 3 }).map((_, i) => <ProductSkeleton key={i} />)
              : featured?.slice(0, 3).map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
          </div>
          <div className="my-8 border-t border-border" />
          <h2 className="font-serif text-xl mb-4 text-foreground">All Products</h2>
        </div>
      )}

      {/* Products Grid */}
      {prodLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)}
        </div>
      ) : products && products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-muted-foreground">
          <SlidersHorizontal className="w-8 h-8 mx-auto mb-3 opacity-40" />
          <p className="font-serif text-lg mb-1">No products found</p>
          <p className="text-sm">Try adjusting your search or filter</p>
        </div>
      )}
    </div>
  );
}
