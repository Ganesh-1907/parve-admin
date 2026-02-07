import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types";
import { useCartStore, useWishlistStore, useAuthStore } from "@/store/useStore";
import { toast } from "@/hooks/use-toast";

const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace("/api", "") || "http://localhost:5000";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  const { isInWishlist, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlistStore();
  const { isLoggedIn } = useAuthStore();
  
  const productId = product._id || product.id || "";
  const productName = product.productName || product.name || "Product";
  const inWishlist = isInWishlist(productId);

  // Use finalPrice from backend if available, otherwise calculate
  const discountedPrice = product.finalPrice || (product.discount?.percentage
    ? product.price * (1 - product.discount.percentage / 100)
    : null);
  
  const isDiscountActive = Boolean(discountedPrice && discountedPrice !== product.price);

  // Get image URL helper
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return "/placeholder.svg";
    if (imagePath.startsWith("http")) return imagePath;
    return `${API_BASE}${imagePath}`;
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Require login for cart
    if (!isLoggedIn) {
      toast({
        title: "Login Required",
        description: "Please login to add items to your cart.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    addItem(product, 1);
    toast({
      title: "Added to cart",
      description: `${productName} has been added to your cart.`,
    });
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Require login for wishlist
    if (!isLoggedIn) {
      toast({
        title: "Login Required",
        description: "Please login to add items to your wishlist.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (inWishlist) {
      removeFromWishlist(productId);
      toast({
        title: "Removed from wishlist",
        description: `${productName} has been removed from your wishlist.`,
      });
    } else {
      addToWishlist(productId);
      toast({
        title: "Added to wishlist",
        description: `${productName} has been added to your wishlist.`,
      });
    }
  };

  return (
    <Link to={`/products/${productId}`} className="group block">
      <div className="relative bg-card rounded-xl overflow-hidden shadow-soft hover-lift transition-all duration-300">
        {/* Image */}
        <div className="aspect-[4/3] relative overflow-hidden bg-secondary p-4">
          <img
            src={getImageUrl(product.images?.[0])}
            alt={productName}
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Discount Badge */}
          {/* Discount Badge */}
          {isDiscountActive && product.discount?.percentage && (
            <Badge className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 shadow-md">
              -{product.discount.percentage}%
            </Badge>
          )}
          
          {/* Wishlist Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm hover:bg-white shadow-md"
            onClick={handleWishlistToggle}
          >
            <Heart className={`h-4 w-4 transition-colors ${inWishlist ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
          </Button>

          {/* Cart Button (New) */}
          <Button
            size="icon"
            className="absolute bottom-3 right-3 rounded-full shadow-md z-10 w-8 h-8"
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-1">
            {productName}
          </h3>
          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
            {product.description || "Discover nature's finest ingredients for your skin."}
          </p>
          
          <div className="flex items-center justify-between gap-2 mt-2">
            {/* Price (Left) */}
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground font-normal text-sm">Price: </span>
              {isDiscountActive ? (
                <>
                  <span className="font-bold text-lg text-primary">₹{Math.round(discountedPrice!)}</span>
                  <span className="text-sm text-muted-foreground line-through">₹{product.price}</span>
                </>
              ) : (
                <span className="font-bold text-lg text-primary">₹{product.price}</span>
              )}
            </div>

            {/* Unit (Right) */}
            <p className="text-sm font-medium text-foreground">
              <span className="text-muted-foreground font-normal text-xs">Qty: </span>
              {product.unit}{/[a-zA-Z]/.test(String(product.unit)) ? "" :" g"}
            </p>
          </div>

          {/* Stock indicator */}
          {product.stock <= 5 && product.stock > 0 && (
            <p className="text-xs text-orange-500 mt-2">Only {product.stock} left!</p>
          )}
          {product.stock <= 0 && (
            <p className="text-xs text-red-500 mt-2">Out of Stock</p>
          )}
        </div>
      </div>
    </Link>
  );
}
