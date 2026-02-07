import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { getProductsApi } from "@/api/products.api";
import { Product } from "@/types";

export function FeaturedProducts() {
  // Fetch products from backend API
  const { data, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: getProductsApi,
  });

  // Get first 4 products as featured
  const featuredProducts: Product[] = data?.products
    ?.slice(0, 4)
    .map((p: any) => ({
      ...p,
      id: p._id,
      name: p.productName,
    })) || [];

  if (isLoading) {
    return (
      <section className="py-8 md:py-4">
        <div className="container">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-2 ">
                Featured Products
              </h2>
              <p className="text-muted-foreground">
                Discover our most loved skincare essentials
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">Loading products...</span>
          </div>
        </div>
      </section>
    );
  }

  if (error || featuredProducts.length === 0) {
    return (
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-2">
                Featured Products
              </h2>
              <p className="text-muted-foreground">
                Discover our most loved skincare essentials
              </p>
            </div>
          </div>
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No products available yet.</p>
            <Link to="/products">
              <Button variant="outline">Browse All Products</Button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-12 mt-12">
      <div className="container">
        <div className="mb-16 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            Featured Products
          </h2>
          <p className="text-muted-foreground">
            Discover our most loved skincare essentials Handpicked for you - glow, nourish, and love your skin daily.
          </p>
         
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
          {featuredProducts.map((product, index) => (
            <div key={product._id || product.id} className={`animate-fade-in-up stagger-${index + 1}`}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Desktop View All Button below cards, centered */}
        <div className="mt-12 text-center hidden md:block">
          <Link to="/products">
            <Button variant="secondary" >View All Products</Button>
          </Link>
        </div>

        {/* Mobile View All Button below cards, centered */}
        <div className="mt-8 text-center md:hidden">
          <Link to="/products">
            <Button variant="secondary">View All Products</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
