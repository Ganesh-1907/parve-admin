import { Link, Navigate } from "react-router-dom";
import { Package, ChevronRight, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useStore";
import { useQuery } from "@tanstack/react-query";
import { getMyOrdersApi } from "@/api/order.api";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  out_for_delivery: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  processing: "Processing",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace("/api", "") || "";

const Orders = () => {
  const { isLoggedIn } = useAuthStore();

  const { data, isLoading, error } = useQuery({
    queryKey: ["my-orders"],
    queryFn: getMyOrdersApi,
    enabled: isLoggedIn,
  });

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  // Get image URL helper
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return "/placeholder.svg";
    if (imagePath.startsWith("http")) return imagePath;
    return `${API_BASE}${imagePath}`;
  };

  if (isLoading) {
    return (
      <div className="container py-16 flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <p className="text-muted-foreground">Loading your orders...</p>
      </div>
    );
  }

  const userOrders = data?.orders || [];

  if (userOrders.length === 0) {
    return (
      <div className="container py-16 text-center">
        <div className="bg-muted w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Package className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="font-serif text-3xl font-bold mb-4">No Orders Yet</h1>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          You haven't placed any orders yet. Start shopping to fill your beauty box!
        </p>
        <Link to="/products">
          <Button size="lg">Browse Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8 md:py-12">
      <div className="container max-w-3xl">
        <h1 className="font-serif text-3xl md:text-4xl font-bold mb-8">My Orders</h1>

        <div className="space-y-6">
          {userOrders.map((order: any) => (
            <div key={order._id} className="bg-card rounded-xl border p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">Order #{order.orderId}</span>
                    <Badge variant="secondary" className={statusColors[order.status] || "bg-gray-100"}>
                      {statusLabels[order.status] || order.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">₹{order.totalAmount}</p>
                  <p className="text-xs text-muted-foreground uppercase">{order.paymentMethod} • {order.paymentStatus}</p>
                </div>
              </div>

              <div className="space-y-4">
                {order.items.map((item: any) => (
                  <div key={item._id} className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-secondary rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={getImageUrl(item.product?.images?.[0])}
                        alt={item.product?.productName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium line-clamp-1">{item.product?.productName}</h4>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-medium">₹{item.price * item.quantity}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;
