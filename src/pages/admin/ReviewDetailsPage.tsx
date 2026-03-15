import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Star, ArrowLeft, MessageSquare, Calendar, User, Package, ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { getReviewByIdApi, updateReviewStatusApi } from "@/api/review.api";
import { Review } from "@/types";
import { format } from "date-fns";

const ReviewDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
  const IMAGE_BASE_URL = API_BASE_URL.replace('/api', '');

  const fetchReview = async () => {
    if (!id) return;
    try {
      const res = await getReviewByIdApi(id);
      setReview(res.review);
    } catch (error) {
      toast({ title: "Failed to load review details", variant: "destructive" });
      navigate("/reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReview();
  }, [id, navigate]);

  const toggleStatus = async () => {
    if (!review) return;
    setUpdating(true);
    const newStatus = review.status === "public" ? "private" : "public";
    try {
      await updateReviewStatusApi(review._id, newStatus);
      toast({ title: `Review marked as ${newStatus}` });
      await fetchReview();
    } catch (error) {
      toast({ title: "Update failed", variant: "destructive" });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-gray-500">
        <MessageSquare className="h-6 w-6 animate-pulse mr-2" />
        Loading review details...
      </div>
    );
  }

  if (!review) {
    return (
      <div className="text-center py-20">
        <h3 className="text-lg font-medium text-gray-900">Review not found</h3>
        <Button variant="link" onClick={() => navigate("/reviews")}>Back to reviews</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          className="text-gray-500 hover:text-blue-600 pl-0" 
          onClick={() => navigate("/reviews")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Reviews
        </Button>

        <Button
          variant={review.status === "public" ? "outline" : "default"}
          className={review.status === "public" ? "text-gray-600 border-gray-200" : "bg-blue-600 hover:bg-blue-700"}
          onClick={toggleStatus}
          disabled={updating}
        >
          {review.status === "public" ? (
            <><EyeOff className="h-4 w-4 mr-2" /> Make Private</>
          ) : (
            <><Eye className="h-4 w-4 mr-2" /> Make Public</>
          )}
        </Button>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 space-y-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-gray-100">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{review.userName}</h1>
                  <p className="text-sm text-gray-500">{review.userEmail}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`h-5 w-5 ${
                        s <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-lg font-semibold text-gray-700">{review.rating}.0</span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-3">
              <Badge className={review.status === "public" ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-100" : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-100"}>
                {review.status.toUpperCase()}
              </Badge>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-1" />
                {format(new Date(review.createdAt), "MMMM d, yyyy")}
              </div>
            </div>
          </div>

          {/* Details Section - Stacked Layout */}
          <div className="space-y-10">
            {/* Category */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center">
                <Package className="h-4 w-4 mr-2" /> Product Category
              </h3>
              <Badge variant="secondary" className="px-4 py-1.5 text-sm bg-blue-50 text-blue-700 border-blue-100 font-medium">
                {review.productType}
              </Badge>
            </div>

            {/* Comment */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center">
                <MessageSquare className="h-4 w-4 mr-2" /> Review Comment
              </h3>
              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-gray-800 text-lg leading-relaxed italic font-serif">"{review.comment}"</p>
              </div>
            </div>

            {/* Photos */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center">
                <ImageIcon className="h-4 w-4 mr-2" /> Attached Photos ({review.images.length})
              </h3>
              {review.images.length > 0 ? (
                <div className="flex flex-wrap gap-4">
                  {review.images.map((img, i) => (
                    <a 
                      key={i} 
                      href={`${IMAGE_BASE_URL}${img}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="h-32 w-32 md:h-48 md:w-48 rounded-2xl border border-gray-200 overflow-hidden hover:ring-4 hover:ring-blue-100 transition-all group shadow-sm"
                    >
                      <img 
                        src={`${IMAGE_BASE_URL}${img}`} 
                        className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300" 
                        alt={`Review attachment ${i + 1}`}
                      />
                    </a>
                  ))}
                </div>
              ) : (
                <div className="py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
                  <ImageIcon className="h-10 w-10 mb-2 opacity-20" />
                  <p className="text-sm">No photos attached to this review</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewDetailsPage;
