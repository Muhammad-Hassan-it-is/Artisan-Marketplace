import { Link } from "wouter";
import { motion } from "framer-motion";
import { MapPin, Star, Package } from "lucide-react";
import { FaUser } from "react-icons/fa";
import { useListArtisans } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";

function ArtisanCard({ artisan, index }: { artisan: any; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
    >
      <Link href={`/artisans/${artisan.id}`}>
        <div
          data-testid={`card-artisan-${artisan.id}`}
          className="group bg-card border border-border rounded-sm p-5 hover:shadow-md hover:border-primary/30 transition-all duration-200 cursor-pointer"
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-muted shrink-0 ring-2 ring-border group-hover:ring-primary/30 transition-all flex items-center justify-center">
              <FaUser className="w-7 h-7 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <h3
                data-testid={`text-artisan-name-${artisan.id}`}
                className="font-serif text-base font-medium group-hover:text-primary transition-colors"
              >
                {artisan.name}
              </h3>
              {artisan.specialty && (
                <p className="text-xs text-primary/80 font-medium mt-0.5">{artisan.specialty}</p>
              )}
              {artisan.location && (
                <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  <span>{artisan.location}</span>
                </div>
              )}
            </div>
          </div>
          {artisan.bio && (
            <p className="text-sm text-muted-foreground mt-3 line-clamp-2 leading-relaxed">
              {artisan.bio}
            </p>
          )}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
            {artisan.rating !== null && artisan.rating !== undefined && (
              <div className="flex items-center gap-1 text-xs">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                <span className="font-medium">{artisan.rating.toFixed(1)}</span>
              </div>
            )}
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Package className="w-3 h-3" />
              <span>{artisan.totalOrders} orders fulfilled</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function ArtisansPage() {
  const { data: artisans, isLoading } = useListArtisans();

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase mb-2">Our Makers</p>
        <h1 className="font-serif text-4xl font-medium mb-3">Artisan Directory</h1>
        <p className="text-muted-foreground max-w-xl">
          Vetted craftspeople from around the world, each with a distinct speciality and a track record of delivering exceptional trade work.
        </p>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-sm p-5 space-y-3">
              <div className="flex gap-4">
                <Skeleton className="w-14 h-14 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              </div>
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-4/5" />
            </div>
          ))}
        </div>
      ) : artisans && artisans.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {artisans.map((artisan, i) => (
            <ArtisanCard key={artisan.id} artisan={artisan} index={i} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-muted-foreground">
          <p className="font-serif text-lg mb-1">No artisans listed yet</p>
        </div>
      )}
    </div>
  );
}
