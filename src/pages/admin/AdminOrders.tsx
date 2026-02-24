import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { getAllOrdersApi, updateOrderStatusApi } from "@/api/orders.api";
import { Loader2, Package, User, CreditCard, ExternalLink, Calendar, MapPin, Search } from "lucide-react";
import { format } from "date-fns";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-indigo-100 text-indigo-800",
  out_for_delivery: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const AdminOrders = () => {
  const queryClient = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // Date filter state
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [appliedStart, setAppliedStart] = useState("");
  const [appliedEnd, setAppliedEnd] = useState("");

  // Status filter & search (live — no Apply needed)
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const handleApplyFilter = () => {
    setAppliedStart(startDate);
    setAppliedEnd(endDate);
  };

  const handleClearFilter = () => {
    setStartDate("");
    setEndDate("");
    setAppliedStart("");
    setAppliedEnd("");
    setStatusFilter("all");
    setSearchQuery("");
  };

  // Fetch orders
  const { data, isLoading, error } = useQuery({
    queryKey: ["orders"],
    queryFn: getAllOrdersApi,
  });

  // Update status mutation
  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateOrderStatusApi(id, status),
    onSuccess: (data) => {
      toast({ title: "Status updated", description: `Order status updated to ${data.order.status}.` });
      // Invalidate query to refetch
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error", 
        description: error.response?.data?.message || "Failed to update status", 
        variant: "destructive" 
      });
    },
  });

  const handleStatusChange = (orderId: string, status: string) => {
    mutation.mutate({ id: orderId, status });
  };

  const openOrderDetails = (order: any) => {
    setSelectedOrder(order);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading orders...</span>
      </div>
    );
  }

  const allOrders = data?.orders || [];

  // Client-side filtering: date range + status + search
  const orders = allOrders.filter((order: any) => {
    // Date range filter
    if (appliedStart || appliedEnd) {
      const orderDate = new Date(order.createdAt);
      orderDate.setHours(0, 0, 0, 0);
      if (appliedStart) {
        const from = new Date(appliedStart);
        from.setHours(0, 0, 0, 0);
        if (orderDate < from) return false;
      }
      if (appliedEnd) {
        const to = new Date(appliedEnd);
        to.setHours(23, 59, 59, 999);
        if (orderDate > to) return false;
      }
    }
    // Status filter
    if (statusFilter !== "all" && order.status !== statusFilter) return false;
    // Search filter (name or email)
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      const name = (order.user?.name || "").toLowerCase();
      const email = (order.user?.email || "").toLowerCase();
      if (!name.includes(q) && !email.includes(q)) return false;
    }
    return true;
  });

  const isAnyFilterActive = appliedStart || appliedEnd || statusFilter !== "all" || searchQuery.trim();

  return (
    <div>
      <h1 className="font-serif text-2xl md:text-3xl font-bold mb-6 text-gray-800">Orders Management</h1>

      {/* Filter Bar — single row, all fixed widths, no layout shift */}
      <div className="p-5 bg-gray-50 border border-gray-200 rounded-lg mb-5">
        <div className="flex flex-wrap items-end gap-4">

          {/* Search */}
          <div className="flex flex-col gap-1.5 w-72">
            <label className="text-sm font-medium text-gray-600">Search Customer</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 pl-9 bg-white border-gray-300 text-sm w-full"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex flex-col gap-1.5 w-48">
            <label className="text-sm font-medium text-gray-600">Status</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-10 w-48 bg-white border-gray-300 text-sm">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Start Date */}
          <div className="flex flex-col gap-1.5 w-44">
            <label className="text-sm font-medium text-gray-600">Start Date</label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              max={endDate || undefined}
              className="h-10 w-44 bg-white border-gray-300 text-sm"
            />
          </div>

          {/* End Date */}
          <div className="flex flex-col gap-1.5 w-44">
            <label className="text-sm font-medium text-gray-600">End Date</label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate || undefined}
              className="h-10 w-44 bg-white border-gray-300 text-sm"
            />
          </div>

          {/* Apply Date */}
          <button
            onClick={handleApplyFilter}
            disabled={!startDate && !endDate}
            className="h-10 px-5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed self-end"
          >
            Apply Date
          </button>

          {/* Clear All — always in DOM, invisible when inactive = zero layout shift */}
          <button
            onClick={handleClearFilter}
            className={`h-10 px-5 border border-gray-300 text-gray-600 text-sm font-medium rounded-md hover:bg-gray-100 transition-colors self-end ${isAnyFilterActive ? "" : "invisible pointer-events-none"}`}
          >
            Clear All
          </button>

          {/* Count hint — always in DOM too */}
          <span className={`text-sm text-gray-500 self-end pb-2 ${isAnyFilterActive ? "" : "invisible"}`}>
            {orders.length} / {allOrders.length} orders
          </span>

        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left p-4 font-semibold text-gray-700 text-sm">Order ID</th>
                <th className="text-left p-4 font-semibold text-gray-700 text-sm">Customer</th>
                <th className="text-left p-4 font-semibold text-gray-700 text-sm">Amount</th>
                <th className="text-left p-4 font-semibold text-gray-700 text-sm">Payment</th>
                <th className="text-left p-4 font-semibold text-gray-700 text-sm">Status</th>
                <th className="text-left p-4 font-semibold text-gray-700 text-sm">Date</th>
                <th className="text-left p-4 font-semibold text-gray-700 text-sm">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order: any) => (
                  <tr key={order._id} className="border-t border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <button 
                        onClick={() => openOrderDetails(order)}
                        className="font-medium text-primary hover:underline text-sm flex items-center gap-1 group"
                      >
                        {order.orderId}
                        <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    </td>
                    <td className="p-4">
                      <div>
                        {order.user ? (
                          <>
                            <p className="font-medium text-gray-800 text-sm">{order.user.name}</p>
                            <p className="text-xs text-gray-500">{order.user.email}</p>
                          </>
                        ) : (
                          <span className="text-gray-400 italic text-sm">Deleted User</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-gray-800 font-medium">₹{order.totalAmount}</td>
                    <td className="p-4 text-sm">
                      <div className="flex flex-col">
                        <span className="uppercase font-semibold text-xs tracking-wider">{order.paymentMethod}</span>
                        <Badge variant="outline" className={`w-fit mt-1 text-[10px] uppercase ${order.paymentStatus === 'paid' ? 'border-green-200 text-green-700 bg-green-50' : 'border-amber-200 text-amber-700 bg-amber-50'}`}>
                          {order.paymentStatus}
                        </Badge>
                      </div>
                    </td>
                    <td className="p-4">
                      <Select defaultValue={order.status} onValueChange={(v) => handleStatusChange(order._id, v)}>
                        <SelectTrigger className={`w-[140px] h-8 text-xs border-0 ring-1 ring-gray-200 ${statusColors[order.status]}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-4 text-sm text-gray-500 whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <button 
                        onClick={() => openOrderDetails(order)}
                        className="text-sm text-gray-500 hover:text-primary underline decoration-dotted"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto p-0 gap-0 rounded-xl">
          <DialogHeader className="p-6 pb-4 border-b bg-gray-50/50">
            <div className="flex items-center justify-between mr-6">
              <div className="space-y-1">
                <DialogTitle className="text-xl font-serif">Order Details</DialogTitle>
                <DialogDescription className="flex items-center gap-2">
                  #{selectedOrder?.orderId} 
                  <span className="text-gray-300">•</span> 
                  {selectedOrder && format(new Date(selectedOrder.createdAt), "PPP p")}
                </DialogDescription>
              </div>
              {selectedOrder && (
                <Badge className={`${statusColors[selectedOrder.status]} px-3 py-1 text-sm capitalize`}>
                  {selectedOrder.status.replace(/_/g, " ")}
                </Badge>
              )}
            </div>
          </DialogHeader>

          {selectedOrder && (
            <div className="p-6 space-y-8">
              {/* Customer & Shipping Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Customer Card */}
                <div className="flex gap-4 p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
                  <div className="mt-1">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <User className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-sm">Customer Information</h4>
                    {selectedOrder.user ? (
                      <div className="text-sm text-gray-600 space-y-0.5">
                        <p className="font-medium text-gray-900">{selectedOrder.user.name}</p>
                        <p>{selectedOrder.user.email}</p>
                        <p>{selectedOrder.user.phone || "No phone provided"}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-red-500">User account deleted</p>
                    )}
                  </div>
                </div>

                {/* Shipping Card */}
                <div className="flex gap-4 p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
                  <div className="mt-1">
                     <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                      <MapPin className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-sm">Shipping Address</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {selectedOrder.address}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <h4 className="flex items-center gap-2 font-semibold text-sm mb-3">
                  <CreditCard className="h-4 w-4 text-slate-500" /> Payment Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 text-xs uppercase tracking-wider block mb-1">Method</span>
                    <span className="font-medium uppercase">{selectedOrder.paymentMethod}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs uppercase tracking-wider block mb-1">Status</span>
                    <Badge variant="outline" className={selectedOrder.paymentStatus === 'paid' ? 'border-green-500 text-green-600' : 'border-amber-500 text-amber-600'}>
                      {selectedOrder.paymentStatus.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="sm:col-span-1">
                     <span className="text-gray-500 text-xs uppercase tracking-wider block mb-1">Transaction Ref</span>
                     <span className="font-mono text-xs text-gray-700 break-all">{selectedOrder.razorpayPaymentId || "-"}</span>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div>
                <h4 className="flex items-center gap-2 font-semibold text-sm mb-3">
                  <Package className="h-4 w-4 text-gray-500" /> Order Items ({selectedOrder.items.length})
                </h4>
                <div className="rounded-md border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Item</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-500">Qty</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-500">Price</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-500">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {selectedOrder.items.map((item: any, idx: number) => (
                        <tr key={idx} className="bg-white">
                          <td className="py-3 px-4">
                             <span className="font-medium text-gray-900">{item.product?.productName || "Unknown Product"}</span>
                          </td>
                          <td className="py-3 px-4 text-center text-gray-600">{item.quantity}</td>
                          <td className="py-3 px-4 text-right text-gray-600">₹{item.price}</td>
                          <td className="py-3 px-4 text-right font-medium text-gray-900">₹{item.price * item.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50 border-t">
                      <tr>
                        <td colSpan={3} className="py-4 px-4 text-right font-semibold text-gray-900">Total Order Amount</td>
                        <td className="py-4 px-4 text-right font-bold text-lg text-primary">₹{selectedOrder.totalAmount}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrders;
