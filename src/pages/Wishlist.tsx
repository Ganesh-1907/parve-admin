import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, Trash2, Loader2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlistStore, useCartStore, useAuthStore } from "@/store/useStore";
import { toast } from "@/hooks/use-toast";
import { getProductsApi } from "@/api/products.api";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@/types";

const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace("/api", "") || "http://localhost:5000";

const Wishlist = () => {
  const { items, removeItem, isLoading, syncWithBackend, productCache } = useWishlistStore();
  const { addItem: addToCart } = useCartStore();
  const { isLoggedIn } = useAuthStore();

  // Fetch all products to match wishlist items
  const { data: productsData } = useQuery({
    queryKey: ["products"],
    queryFn: getProductsApi,
  });

  // Sync with backend on mount if logged in
  useEffect(() => {
    if (isLoggedIn) {
      syncWithBackend();
    }
  }, [isLoggedIn]);

  // Get wishlist products from either productCache (backend synced) or local match
  const wishlistProducts: Product[] = items
    .map((item) => {
      // First check productCache from backend sync
      const cachedProduct = productCache.find((p: Product) => (p._id || p.id) === item.productId);
      if (cachedProduct) return cachedProduct;
      
      // Fallback to matching with fetched products
      const fetchedProduct = productsData?.products?.find(
        (p: any) => p._id === item.productId
      );
      if (fetchedProduct) {
        return {
          ...fetchedProduct,
          id: fetchedProduct._id,
          name: fetchedProduct.productName,
        };
      }
      return null;
    })
    .filter(Boolean) as Product[];

  // Get image URL helper
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return "/placeholder.svg";
    if (imagePath.startsWith("http")) return imagePath;
    return `${API_BASE}${imagePath}`;
  };

  if (isLoading) {
    return (
      <div className="container py-16 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">Loading wishlist...</span>
      </div>
    );
  }

  if (wishlistProducts.length === 0) {
    return (
      <div className="container py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
            <Heart className="h-10 w-10 text-muted-foreground" />
          </div>
          <h1 className="font-serif text-3xl font-bold mb-4">Your Wishlist is Empty</h1>
          <p className="text-muted-foreground mb-6">
            Save items you love for later. Browse our collection and add your favorites!
          </p>
          <Link to="/products">
            <Button size="lg" className="gap-2">
              <ShoppingCart className="h-5 w-5" />
              Browse Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleMoveToCart = (product: Product) => {
    const productId = product._id || product.id;
    addToCart(product, 1);
    removeItem(productId);
    toast({
      title: "Moved to cart",
      description: `${product.productName || product.name} has been moved to your cart.`,
    });
  };

  const handleRemove = (product: Product) => {
    const productId = product._id || product.id;
    removeItem(productId);
    toast({
      title: "Removed from wishlist",
      description: `${product.productName || product.name} has been removed.`,
    });
  };

  return (
    <div className="py-8 md:py-12">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold">My Wishlist</h1>
            <p className="text-muted-foreground mt-1">{wishlistProducts.length} items saved</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {wishlistProducts.map((product) => {
            if (!product) return null;
            const productId = product._id || product.id;
            const productName = product.productName || product.name;
            const discountedPrice = product.finalPrice || (product.discount?.percentage
              ? product.price * (1 - product.discount.percentage / 100)
              : null);

            return (
              <div key={productId} className="bg-card rounded-xl overflow-hidden shadow-soft group">
                <Link to={`/products/${productId}`} className="block">
                  <div className="aspect-square bg-secondary relative overflow-hidden">
                    <img
                      src={getImageUrl(product.images?.[0])}
                      alt={productName}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {product.discount?.percentage && (
                      <div className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full">
                        -{product.discount.percentage}%
                      </div>
                    )}
                  </div>
                </Link>
                <div className="p-4">
                  <Link to={`/products/${productId}`}>
                    <h3 className="font-serif font-semibold hover:text-primary transition-colors line-clamp-1">
                      {productName}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground mb-2">{product.unit}</p>
                  <div className="flex items-center gap-2 mb-3">
                    {discountedPrice && discountedPrice !== product.price ? (
                      <>
                        <span className="font-bold text-primary">₹{Math.round(discountedPrice)}</span>
                        <span className="text-sm text-muted-foreground line-through">₹{product.price}</span>
                      </>
                    ) : (
                      <span className="font-bold">₹{product.price}</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => handleMoveToCart(product)}
                      disabled={product.stock <= 0}
                    >
                      {product.stock > 0 ? "Move to Cart" : "Out of Stock"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleRemove(product)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {!isLoggedIn && (
          <div className="mt-8 p-4 bg-muted rounded-lg text-center">
            <p className="text-sm text-muted-foreground">
              <Link to="/login" className="text-primary hover:underline font-medium">Log in</Link> to save your wishlist across devices.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
