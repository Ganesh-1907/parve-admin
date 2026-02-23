import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, Heart, Minus, Plus, ShoppingCart, Loader2, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getSingleProductApi, getProductsApi } from "@/api/products.api";
import { useCartStore, useWishlistStore, useAuthStore } from "@/store/useStore";
import { toast } from "@/hooks/use-toast";
import { ProductCard } from "@/components/ProductCard";
import { Product } from "@/types";

const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace("/api", "") || "";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { addItem } = useCartStore();
  const { isInWishlist, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlistStore();
  const { isLoggedIn } = useAuthStore();

  // Fetch product from API
  const { data: productData, isLoading, error } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getSingleProductApi(id!),
    enabled: !!id,
  });

  // Fetch related products
  const { data: allProductsData } = useQuery({
    queryKey: ["products"],
    queryFn: getProductsApi,
  });

  // Map backend product to frontend interface
  const product: Product | null = productData ? {
    ...productData,
    id: productData._id,
    name: productData.productName,
  } : null;

  // Get related products (same category, excluding current)
  const relatedProducts: Product[] = allProductsData?.products
    ?.filter((p: any) => p.category === product?.category && p._id !== id)
    .slice(0, 4)
    .map((p: any) => ({
      ...p,
      id: p._id,
      name: p.productName,
    })) || [];

  // Get image URL helper
  const getImageUrl = (imagePath: string) => {
    if (imagePath.startsWith("http")) return imagePath;
    return `${API_BASE}${imagePath}`;
  };

  // Reset selected image when product changes
  useEffect(() => {
    setSelectedImageIndex(0);
    setQuantity(1);
  }, [id]);

  if (isLoading) {
    return (
      <div className="container py-16 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">Loading product...</span>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container py-16 text-center">
        <h1 className="font-serif text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-muted-foreground mb-4">The product you're looking for doesn't exist or has been removed.</p>
        <Link to="/products">
          <Button>Browse Products</Button>
        </Link>
      </div>
    );
  }

  const productId = product._id || product.id;
  const productName = product.productName || product.name;
  const inWishlist = isInWishlist(productId);
  
  // Use finalPrice from backend if available, otherwise calculate
  const discountedPrice = product.finalPrice || (product.discount?.percentage
    ? product.price * (1 - product.discount.percentage / 100)
    : null);
  
  const hasDiscount = product.discount?.percentage && product.discount.percentage > 0;

  const handleAddToCart = () => {
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

    addItem(product, quantity);
    toast({
      title: "Added to cart",
      description: `${quantity} x ${productName} added to your cart.`,
    });
  };

  const handleWishlistToggle = () => {
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
      toast({ title: "Removed from wishlist" });
    } else {
      addToWishlist(productId);
      toast({ title: "Added to wishlist" });
    }
  };

  const images = product.images || [];
  const mainImage = images[0];
  const subImages = images.slice(1, 5); // Get up to 4 sub images

  return (
    <div className="py-8 md:py-12">
      <div className="container">
        {/* Breadcrumb */}
        <Link to="/products" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
          <ChevronLeft className="h-4 w-4" />
          Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-stretch">
          {/* Main Image at top left, content at right, same height */}
          <div className="flex flex-col h-full">
            <div className="flex-1 min-h-0">
              <div className="h-full rounded-2xl overflow-hidden bg-secondary relative group cursor-pointer mb-4 aspect-[3/4] lg:aspect-auto" style={{height: '100%'}} onClick={() => setSelectedImageIndex(0)}>
                <img
                  src={getImageUrl(mainImage)}
                  alt={productName}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  style={{height: '100%'}}
                />
                {hasDiscount && (
                  <Badge className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 text-sm px-3 py-1 shadow-lg">
                    -{product.discount!.percentage}% OFF
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6 flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline" className="capitalize text-sm">{product.category}</Badge>
                {hasDiscount && (
                  <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0">
                    -{product.discount!.percentage}% OFF
                  </Badge>
                )}
              </div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">
                {productName}
              </h1>
              <p className="text-muted-foreground text-lg">{product.unit} gms</p>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 flex-wrap">
              {discountedPrice && discountedPrice !== product.price ? (
                <>
                  <span className="font-serif text-4xl font-bold text-primary">
                    ₹{Math.round(discountedPrice)}
                  </span>
                  <span className="text-2xl text-muted-foreground line-through">₹{product.price}</span>
                  <Badge variant="secondary" className="text-green-600 bg-green-50">
                    Save ₹{Math.round(product.price - discountedPrice)}
                  </Badge>
                </>
              ) : (
                <span className="font-serif text-4xl font-bold">₹ {product.price}</span>
              )}
            </div>

            {/* Description */}
            <div className="prose prose-sm max-w-none">
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2 p-3 rounded-lg">
              {product.stock > 0 ? (
                <>
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-green-600 font-medium">In Stock</span>
                  <span className="text-muted-foreground">• {product.stock} available</span>
                </>
              ) : (
                <>
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-red-600 font-medium">Out of Stock</span>
                </>
              )}
            </div>

            {/* Quantity */}
            {product.stock > 0 && (
              <div className="flex items-center gap-4">
                <span className="font-medium">Quantity:</span>
                <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium text-lg">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                size="lg" 
                className="flex-1 gap-2 h-14 text-base" 
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
              >
                {!isLoggedIn ? (
                  <>
                    <LogIn className="h-5 w-5" />
                    Login to Add to Cart
                  </>
                ) : product.stock > 0 ? (
                  <>
                    <ShoppingCart className="h-5 w-5" />
                    Add to Cart
                  </>
                ) : (
                  "Out of Stock"
                )}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="gap-2 h-14"
                onClick={handleWishlistToggle}
              >
                <Heart className={`h-5 w-5 ${inWishlist ? "fill-red-500 text-red-500" : ""}`} />
                {!isLoggedIn ? "Login to Wishlist" : inWishlist ? "In Wishlist" : "Add to Wishlist"}
              </Button>
            </div>

            {/* Login hint */}
            {!isLoggedIn && (
              <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
                <p className="text-sm text-amber-800">
                  <Link to="/login" className="font-medium underline hover:no-underline">Login</Link> or{" "}
                  <Link to="/signup" className="font-medium underline hover:no-underline">Sign up</Link> to add items to your cart and wishlist.
                </p>
              </div>
            )}

            {/* Skin Concerns */}
            {product.concerns && product.concerns.length > 0 && (
              <div className="pt-4 border-t">
                <span className="font-medium mb-3 block">Recommended for:</span>
                <div className="flex flex-wrap gap-2">
                  {product.concerns.map((concern) => (
                    <Badge key={concern} variant="secondary" className="capitalize text-sm px-3 py-1">
                      {concern} skin
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Product Images Heading */}
        <h3 className="text-3xl font-bold mb-3 mt-10 pb-12">Product Images</h3>
        {/* Sub Images Grid below both image and content, full width */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
          {subImages.length > 0 ? (
            subImages.map((img, index) => (
              <div
                key={index}
                className={`aspect-square rounded-xl overflow-hidden bg-secondary cursor-pointer transition-all duration-200 ${
                  selectedImageIndex === index + 1 
                    ? "ring-2 ring-primary ring-offset-2" 
                    : "hover:opacity-80"
                }`}
                onClick={() => setSelectedImageIndex(index + 1)}
              >
                <img
                  src={getImageUrl(img)}
                  alt={`${productName} - Image ${index + 2}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))
          ) : (
            // Placeholder for products with only 1 image
            <>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square rounded-xl bg-secondary/50 flex items-center justify-center">
                  <span className="text-muted-foreground text-xs">No image</span>
                </div>
              ))}
            </>
          )}
          {/* Fill remaining spots if less than 4 sub images */}
          {subImages.length > 0 && subImages.length < 4 && (
            Array(4 - subImages.length).fill(0).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square rounded-xl bg-secondary/30" />
            ))
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="font-serif text-2xl font-bold mb-6">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct._id || relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
