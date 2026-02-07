import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Search, SlidersHorizontal, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { ProductCard } from "@/components/ProductCard";
import { getProductsApi } from "@/api/products.api";
import { skinConcerns } from "@/data/mockData";
import { Product } from "@/types";

const categories = [
  { id: "all", name: "All Products" },
  { id: "facewash", name: "Facewash" },
  { id: "serums", name: "Serums" },
  { id: "creams", name: "Creams" },
];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(searchParams.get("category") || "all");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [sortBy, setSortBy] = useState("featured");

  // Fetch products from backend API
  const { data, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: getProductsApi,
  });

  const products: Product[] = useMemo(() => {
    if (!data?.products) return [];
    // Map backend fields to frontend interface
    return data.products.map((p: any) => ({
      ...p,
      id: p._id,
      name: p.productName,
    }));
  }, [data]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const productName = product.productName || product.name || "";
      const matchesSearch = productName.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "all" || product.category === category;
      const price = product.finalPrice || product.price;
      const matchesPrice = price >= priceRange[0] && price <= priceRange[1];
      return matchesSearch && matchesCategory && matchesPrice;
    }).sort((a, b) => {
      const priceA = a.finalPrice || a.price;
      const priceB = b.finalPrice || b.price;
      
      switch (sortBy) {
        case "price-low":
          return priceA - priceB;
        case "price-high":
          return priceB - priceA;
        default:
          return 0; // Featured (default order)
      }
    });
  }, [products, search, category, priceRange, sortBy]);

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    const newParams = new URLSearchParams(searchParams);
    if (value === "all") {
      newParams.delete("category");
    } else {
      newParams.set("category", value);
    }
    setSearchParams(newParams);
  };



  const FilterContent = () => (
    <div className="space-y-6">
      {/* Sort By */}
      <div>
        <h4 className="font-semibold mb-3">Sort By</h4>
        <div className="space-y-2">
          {["price-low", "price-high"].map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <input
                type="radio"
                id={option}
                name="sortBy"
                value={option}
                checked={sortBy === option}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
              />
              <label htmlFor={option} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize cursor-pointer">
                {option === "price-low" ? "Price: Low to High" : "Price: High to Low"}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Category */}
      <div>
        <h4 className="font-semibold mb-3">Category</h4>
        <div className="grid grid-cols-2 gap-2">
          {categories.map((cat) => (
            <Badge
              key={cat.id}
              variant={category === cat.id ? "default" : "outline"}
              className="cursor-pointer justify-center py-2 h-auto text-center"
              onClick={() => handleCategoryChange(cat.id)}
            >
              {cat.name}
            </Badge>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="font-semibold mb-3">Price Range</h4>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          max={5000}
          step={100}
          className="mb-2"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>₹{priceRange[0]}</span>
          <span>₹{priceRange[1]}</span>
        </div>
      </div>
    </div>
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="py-8 md:py-12">
        <div className="container">
          <div className="mb-8">
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">Our Products</h1>
            <p className="text-muted-foreground">
              Discover skincare crafted with nature's finest ingredients
            </p>
          </div>
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">Loading products...</span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="py-8 md:py-12">
        <div className="container">
          <div className="mb-8">
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">Our Products</h1>
          </div>
          <div className="text-center py-16">
            <p className="text-destructive mb-4">Failed to load products. Please try again.</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 md:py-12">
      <div className="container">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">Our Products</h1>
          <p className="text-muted-foreground">
            Discover skincare crafted with nature's finest ingredients
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 bg-card rounded-xl p-6 shadow-soft">
              <h3 className="font-serif text-lg font-semibold mb-4">Filters</h3>
              <FilterContent />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search and Mobile Filter */}
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Mobile Filter */}
              <Sheet>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="outline" size="icon">
                    <SlidersHorizontal className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterContent />
                  </div>
                </SheetContent>
              </Sheet>


            </div>

            {/* Results Count */}
            <p className="text-sm text-muted-foreground mb-4">
              Showing {filteredProducts.length} products
            </p>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                {filteredProducts.map((product, index) => (
                  <div key={product._id || product.id} className={`animate-fade-in-up stagger-${(index % 5) + 1}`}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No products found matching your criteria.</p>
                <Button variant="outline" className="mt-4" onClick={() => {
                  setSearch("");
                  setCategory("all");
                  setPriceRange([0, 5000]);
                  setSortBy("featured");
                  setSearchParams({});
                }}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
