import { Switch, Route, Router as WouterRouter, Link, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Store, Hammer, ShoppingBag, LayoutDashboard, User, Menu, Search } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

import NotFound from "@/pages/not-found";
import CatalogPage from "@/pages/catalog";
import ProductDetailPage from "@/pages/product-detail";
import ArtisansPage from "@/pages/artisans";
import ArtisanProfilePage from "@/pages/artisan-profile";
import OrdersPage from "@/pages/orders";
import OrderDetailPage from "@/pages/order-detail";
import DashboardPage from "@/pages/dashboard";

const queryClient = new QueryClient();

const navItems = [
  { href: "/", label: "Catalog", icon: Store },
  { href: "/artisans", label: "Artisans", icon: Hammer },
  { href: "/orders", label: "Orders", icon: ShoppingBag },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <header className="border-b bg-card sticky top-0 z-20 shadow-sm">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between max-w-7xl">
          <div className="flex items-center gap-6">
            <Link href="/">
              <span className="font-serif text-lg font-medium tracking-tight text-foreground hover:text-primary transition-colors cursor-pointer">
                Artisan Market
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-0.5">
              {navItems.map((item) => {
                const isActive =
                  location === item.href ||
                  (item.href !== "/" && location.startsWith(item.href));
                return (
                  <Link key={item.href} href={item.href}>
                    <span
                      data-testid={`nav-${item.label.toLowerCase()}`}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-sm transition-colors cursor-pointer ${
                        isActive
                          ? "bg-primary text-primary-foreground font-medium"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      <item.icon className="w-3.5 h-3.5" />
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground border border-border rounded-sm px-3 py-1.5 bg-background">
              <Search className="w-3 h-3" />
              <span>Trade portal</span>
            </div>
            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-primary" />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              data-testid="button-mobile-menu"
            >
              <Menu className="w-4 h-4" />
            </Button>
          </div>
        </div>
        {/* Mobile nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-card px-4 py-2 flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive =
                location === item.href ||
                (item.href !== "/" && location.startsWith(item.href));
              return (
                <Link key={item.href} href={item.href}>
                  <span
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-sm text-sm cursor-pointer transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground font-medium"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        Artisan Market — Trade Procurement Platform
      </footer>
    </div>
  );
}

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={CatalogPage} />
        <Route path="/products/:id" component={ProductDetailPage} />
        <Route path="/artisans" component={ArtisansPage} />
        <Route path="/artisans/:id" component={ArtisanProfilePage} />
        <Route path="/orders" component={OrdersPage} />
        <Route path="/orders/:id" component={OrderDetailPage} />
        <Route path="/dashboard" component={DashboardPage} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
