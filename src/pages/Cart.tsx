import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore, useAuthStore } from "@/store/useStore";

const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace("/api", "") || "http://localhost:5000";

const Cart = () => {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart, isLoading, syncWithBackend } = useCartStore();
  const { isLoggedIn } = useAuthStore();

  // Sync with backend on mount if logged in
  useEffect(() => {
    if (isLoggedIn) {
      syncWithBackend();
    }
  }, [isLoggedIn]);

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
        <span className="ml-3 text-muted-foreground">Loading cart...</span>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
          </div>
          <h1 className="font-serif text-3xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-6">
            Looks like you haven't added anything yet. Discover our amazing products!
          </p>
          <Link to="/products">
            <Button size="lg" className="gap-2">
              Browse Products
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const totalPrice = getTotalPrice();
  const shippingFree = totalPrice >= 500;
  const shippingCost = shippingFree ? 0 : 50;

  return (
    <div className="py-8 md:py-12">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold">Shopping Cart</h1>
            <p className="text-muted-foreground mt-1">{items.length} items in cart</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(({ product, quantity }) => {
              const productId = product._id || product.id;
              const productName = product.productName || product.name;
              const discountedPrice = product.finalPrice || (product.discount?.percentage
                ? product.price * (1 - product.discount.percentage / 100)
                : product.price);

              return (
                <div
                  key={productId}
                  className="flex gap-4 bg-card rounded-xl p-4 shadow-soft"
                >
                  <Link to={`/products/${productId}`} className="flex-shrink-0">
                    <img
                      src={getImageUrl(product.images?.[0])}
                      alt={productName}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/products/${productId}`}>
                      <h3 className="font-serif font-semibold hover:text-primary transition-colors line-clamp-1">
                        {productName}
                      </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground mb-2">{product.unit}</p>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-primary">₹{Math.round(discountedPrice)}</span>
                      {product.discount?.percentage && (
                        <span className="text-sm text-muted-foreground line-through">
                          ₹{product.price}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => removeItem(productId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(productId, Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center font-medium">{quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(productId, quantity + 1)}
                        disabled={quantity >= (product.stock || 99)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="flex justify-between items-center pt-4">
              <Button variant="ghost" className="text-destructive hover:text-destructive" onClick={clearCart}>
                Clear Cart
              </Button>
              <Link to="/products">
                <Button variant="outline">Continue Shopping</Button>
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl p-6 shadow-soft sticky top-24">
              <h2 className="font-serif text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{Math.round(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  {shippingFree ? (
                    <span className="text-green-600 font-medium">Free</span>
                  ) : (
                    <span>₹{shippingCost}</span>
                  )}
                </div>
                {!shippingFree && (
                  <p className="text-xs text-muted-foreground">
                    Add ₹{500 - totalPrice} more for free shipping!
                  </p>
                )}
                <div className="border-t pt-3 flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-primary">₹{Math.round(totalPrice + shippingCost)}</span>
                </div>
              </div>

              <Link to="/checkout">
                <Button className="w-full gap-2 h-12 text-base">
                  Proceed to Checkout
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>

              {!isLoggedIn && (
                <p className="text-xs text-center text-muted-foreground mt-4">
                  <Link to="/login" className="text-primary hover:underline">Log in</Link> to save your cart
                </p>
              )}

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t">
                <div className="grid grid-cols-2 gap-3 text-xs text-center text-muted-foreground">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-lg">🔒</span>
                    <span>Secure Checkout</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-lg">🚚</span>
                    <span>Fast Delivery</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-lg">↩️</span>
                    <span>Easy Returns</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-lg">💳</span>
                    <span>COD Available</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
