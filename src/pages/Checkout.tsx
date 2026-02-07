import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CreditCard, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCartStore, useAuthStore } from "@/store/useStore";
import { toast } from "@/hooks/use-toast";
import { createRazorpayOrderApi, verifyPaymentApi } from "@/api/payment.api";
import axios from "axios";

interface PaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

const Checkout = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { isLoggedIn, user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState("");
  const [saveAddress, setSaveAddress] = useState(false);
  
  const token = localStorage.getItem("token");

  // Initialize address from user profile
  useEffect(() => {
    if (user?.address) {
      setAddress(user.address);
    }
  }, [user]);

  const handlePayment = async () => {
    try {
      if (!address.trim()) {
         toast({
          title: "Address Required",
          description: "Please enter a valid delivery address.",
          variant: "destructive",
        });
        return;
      }

      setLoading(true);

      // Save address if checked
      if (saveAddress && token) {
        try {
           await axios.put(
            `${import.meta.env.VITE_API_BASE_URL}/users/profile`,
            { address },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
        } catch (err) {
          console.error("Failed to save address", err);
        }
      }

      const amount = getTotalPrice();
      // Prepare order data
      const orderData = {
        items: items.map(item => ({
          productId: item.product._id || item.product.id,
          quantity: item.quantity,
          price: item.product.finalPrice || item.product.price // Pass price too
        })),
        address: address // Use the edited address
      };

      // 1. Create Order on Backend
      const data = await createRazorpayOrderApi(orderData);
      
      if (!data.success) {
        throw new Error(data.message || "Failed to create order");
      }

      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: "INR",
        name: "PARVE Beauty",
        description: "Payment for order",
        image: "/logo.parve.png",
        order_id: data.order.id, 
        handler: async function (response: PaymentResponse) {
          try {
            // 2. Verify Payment on Backend
            const verifyData = {
              ...response,
              orderItems: data.orderItems, // Use items from backend response to be safe
              address: address, // consistent with created order
              totalAmount: data.amount,
            };

            const verification = await verifyPaymentApi(verifyData);

            if (verification.success) {
              toast({
                title: "Order Placed Successfully!",
                description: "Thank you for your purchase. Confirmation email sent.",
              });
              clearCart();
              // Await a bit to let the user see the success
              setTimeout(() => navigate("/orders"), 1000); 
            } else {
              throw new Error(verification.message || "Payment verification failed");
            }
          } catch (error: any) {
            console.error("Verification Error:", error);
            toast({
              title: "Payment Verification Failed",
              description: error.message || "Please contact support.",
              variant: "destructive",
            });
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: user?.phone
        },
        notes: {
          address: address
        },
        theme: {
          color: "#0ea5e9"
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        toast({
          title: "Payment Failed",
          description: response.error.description,
          variant: "destructive",
        });
      });
      rzp.open();

    } catch (error: any) {
      console.error("Payment Error:", error);
      toast({
        title: "Something went wrong",
        description: error.message || "Unable to initiate payment",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = getTotalPrice();
  const shippingFree = totalPrice >= 500;
  const shippingCost = shippingFree ? 0 : 50;
  const finalTotal = totalPrice + shippingCost;

  return (
    <div className="py-8 md:py-12">
      <div className="container max-w-4xl">
        <h1 className="font-serif text-3xl md:text-4xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Shipping Info */}
          <div className="space-y-6">
            <div className="bg-card rounded-xl p-6 shadow-soft">
              <h2 className="font-serif text-xl font-semibold mb-4">Shipping Details</h2>
              <div className="space-y-4">
                <div>
                  <Label>Name</Label>
                  <Input defaultValue={user?.name} disabled />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input defaultValue={user?.email} disabled />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input defaultValue={user?.phone} disabled />
                </div>
                <div>
                  <Label>Address (Delivery Location)</Label>
                  <textarea
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your delivery address"
                  />
                  <div className="flex items-center space-x-2 mt-2">
                    <input 
                      type="checkbox" 
                      id="saveAddress" 
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      checked={saveAddress}
                      onChange={(e) => setSaveAddress(e.target.checked)}
                    />
                    <label 
                      htmlFor="saveAddress" 
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Save as default address
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800">
              <p><strong>Note:</strong> We will deliver to this address. Please ensure it is correct.</p>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-card rounded-xl p-6 shadow-soft sticky top-24">
              <h2 className="font-serif text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-2">
                {items.map(({ product, quantity }) => {
                  const productId = product._id || product.id;
                  const price = product.finalPrice || (product.discount?.percentage
                    ? product.price * (1 - product.discount.percentage / 100)
                    : product.price);
                    
                  return (
                    <div key={productId} className="flex justify-between text-sm py-2 border-b last:border-0">
                      <div>
                        <span className="font-medium">{product.productName || product.name}</span>
                        <div className="text-muted-foreground text-xs">x {quantity}</div>
                      </div>
                      <span>₹{Math.round(price * quantity)}</span>
                    </div>
                  );
                })}
              </div>

              <div className="border-t pt-4 space-y-2 mb-6">
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
                <div className="flex justify-between font-semibold text-lg pt-2 border-t mt-2">
                  <span>Total Payable</span>
                  <span className="text-primary">₹{Math.round(finalTotal)}</span>
                </div>
              </div>

              <Button 
                className="w-full gap-2 h-12" 
                size="lg" 
                onClick={handlePayment} 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5" />
                    Pay Now
                  </>
                )}
              </Button>
              
              <div className="mt-4 flex justify-between items-center text-xs text-muted-foreground px-2">
                <span>Secure Payment by Razorpay</span>
                <div className="flex gap-2">
                  <span>Visa</span>
                  <span>Mastercard</span>
                  <span>UPI</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
