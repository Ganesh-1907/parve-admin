import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Eye, EyeOff, MessageSquare, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { getAdminReviewsApi, updateReviewStatusApi } from "@/api/review.api";
import { Review } from "@/types";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const AdminReviews = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  const fetchReviews = async (status?: string) => {
    setLoading(true);
    try {
      const res = await getAdminReviewsApi(status === "all" ? undefined : status);
      setReviews(res.reviews);
    } catch (error) {
      toast({ title: "Failed to load reviews", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(filter);
  }, [filter]);

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "public" ? "private" : "public";
    try {
      await updateReviewStatusApi(id, newStatus);
      toast({ title: `Review marked as ${newStatus}` });
      fetchReviews(filter);
    } catch (error) {
      toast({ title: "Update failed", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-blue-600">Customer Reviews</h1>
          <p className="text-gray-500 text-sm mt-1">Manage public visibility of customer feedback</p>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reviews</SelectItem>
              <SelectItem value="public">Public Only</SelectItem>
              <SelectItem value="private">Private Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24 text-gray-500">
          <MessageSquare className="h-6 w-6 animate-pulse mr-2" />
          Loading reviews...
        </div>
      ) : reviews.length > 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="p-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Username</th>
                  <th className="p-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                  <th className="p-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
                  <th className="p-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Rating</th>
                  <th className="p-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="p-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reviews.map((review) => (
                  <tr key={review._id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-gray-900">{review.userName}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-gray-500">{format(new Date(review.createdAt), "MMM d, yyyy")}</p>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100">
                        {review.productType}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`h-3 w-3 ${
                              s <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge className={review.status === "public" ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-100" : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-100"}>
                        {review.status}
                      </Badge>
                    </td>
                    <td className="p-4 flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-blue-600 border-blue-200 hover:bg-blue-50"
                        onClick={() => navigate(`/reviews/${review._id}`)}
                      >
                        <Eye className="h-4 w-4 mr-1" /> View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={review.status === "public" ? "text-gray-500 hover:text-gray-700" : "text-blue-600 hover:text-blue-700 hover:bg-blue-50"}
                        onClick={() => toggleStatus(review._id, review.status)}
                      >
                        {review.status === "public" ? (
                          <><EyeOff className="h-4 w-4 mr-1" /> Make Private</>
                        ) : (
                          <><Eye className="h-4 w-4 mr-1" /> Make Public</>
                        )}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <MessageSquare className="h-12 w-12 mx-auto text-gray-300 mb-3" />
          <h3 className="text-lg font-medium text-gray-900">No reviews found</h3>
          <p className="text-gray-500">Try changing your filter or check back later.</p>
        </div>
      )}
    </div>
  );
};

export default AdminReviews;
