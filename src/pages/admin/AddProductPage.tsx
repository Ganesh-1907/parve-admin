import { useNavigate } from "react-router-dom";
import { ArrowLeft, X } from "lucide-react";
import axios from "axios";
import { useState } from "react";
import { compressImage } from "@/utils/compressImage";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AddProductPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
  const [form, setForm] = useState({
    productName: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    unit: "",
    unitType: "gms",
    discountPercentage: "",
    isYearlyDiscount: true, // Default to true
    discountStartDate: "",
    discountEndDate: "",
    mainImage: null as File | null,
    subImages: [] as File[],
  });

  const token = localStorage.getItem("token");

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!form.mainImage) {
        toast({ title: "Main image is required", variant: "destructive" });
        return;
      }

      setLoading(true);
      const formData = new FormData();

      formData.append("productName", form.productName);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("stock", form.stock);
      formData.append("category", form.category);
      formData.append("unit", `${form.unit}${form.unitType}`);
      formData.append("discountPercentage", form.discountPercentage);
      formData.append("isYearlyDiscount", String(form.isYearlyDiscount));

      if (!form.isYearlyDiscount) {
        formData.append("discountStartDate", form.discountStartDate);
        formData.append("discountEndDate", form.discountEndDate);
      }

      toast({ title: "Compressing images...", description: "Please wait" });
      const compressedMain = await compressImage(form.mainImage);
      const compressedSubs = await Promise.all(form.subImages.map((img) => compressImage(img)));

      formData.append("images", compressedMain);
      compressedSubs.forEach((img) => {
        formData.append("images", img);
      });

      await axios.post(`${API_BASE_URL}/products/add`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast({ title: "Product added successfully" });
      navigate("/products");
    } catch (error) {
      toast({ title: "Add product failed", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <h2 className="text-blue-600 text-xl font-semibold mb-8">Add Product</h2>
        <form onSubmit={handleAddProduct} className="space-y-6">
          
          {/* Product Name & Category - Side by Side */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-700 font-medium">Product Name</Label>
              <Input
                value={form.productName}
                onChange={(e) =>
                  setForm({ ...form, productName: e.target.value })
                }
                className="mt-2 bg-white border border-gray-300 text-gray-900 rounded-md focus:border-gray-500 focus:ring-gray-500 placeholder-gray-400 shadow-sm"
                required
              />
            </div>
            <div>
              <Label className="text-gray-700 font-medium">Category</Label>
              <Select
                value={form.category}
                onValueChange={(value) =>
                  setForm({ ...form, category: value })
                }
              >
                <SelectTrigger className="mt-2 bg-white border border-gray-300 text-gray-900 rounded-md focus:border-gray-500 focus:ring-gray-500 shadow-sm">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="facewash">Facewash</SelectItem>
                  <SelectItem value="serums">Serums</SelectItem>
                  <SelectItem value="creams">Creams</SelectItem>
                  <SelectItem value="moisturizer">Moisturizer</SelectItem>
                  <SelectItem value="night-cream">Night Cream</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div>
            <Label className="text-gray-700 font-medium">Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="mt-2 bg-white border border-gray-300 text-gray-900 rounded-md focus:border-gray-500 focus:ring-gray-500 placeholder-gray-400 shadow-sm"
              rows={4}
              required
            />
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-700 font-medium">Price (₹)</Label>
              <Input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="mt-2 bg-white border border-gray-300 text-gray-900 rounded-md focus:border-gray-500 focus:ring-gray-500 placeholder-gray-400 shadow-sm"
                required
              />
            </div>
            <div>
              <Label className="text-gray-700 font-medium">Stock</Label>
              <Input
                type="number"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="mt-2 bg-white border border-gray-300 text-gray-900 rounded-md focus:border-gray-500 focus:ring-gray-500 placeholder-gray-400 shadow-sm"
                required
              />
            </div>
          </div>

          {/* Unit & Discount - Side by Side */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-700 font-medium">Unit</Label>
              <div className="mt-2 flex gap-2">
                <Input
                  type="number"
                  value={form.unit}
                  onChange={(e) => setForm({ ...form, unit: e.target.value })}
                  placeholder="e.g. 50"
                  className="bg-white border border-gray-300 text-gray-900 rounded-md focus:border-gray-500 focus:ring-gray-500 placeholder-gray-400 shadow-sm"
                  required
                />
                <Select
                  value={form.unitType}
                  onValueChange={(value) => setForm({ ...form, unitType: value })}
                >
                  <SelectTrigger className="w-24 bg-white border border-gray-300 text-gray-900 rounded-md shadow-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gms">gms</SelectItem>
                    <SelectItem value="ml">ml</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-gray-700 font-medium">Discount %</Label>
              <Input
                type="number"
                value={form.discountPercentage}
                onChange={(e) =>
                  setForm({
                    ...form,
                    discountPercentage: e.target.value,
                  })
                }
                className="mt-2 bg-white border border-gray-300 text-gray-900 rounded-md focus:border-gray-500 focus:ring-gray-500 placeholder-gray-400 shadow-sm"
              />
            </div>
          </div>

          {/* Discount Toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() =>
                setForm({
                  ...form,
                  isYearlyDiscount: !form.isYearlyDiscount,
                })
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                form.isYearlyDiscount ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out ${
                  form.isYearlyDiscount ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <Label className="text-gray-700 font-medium cursor-pointer" onClick={() => setForm({ ...form, isYearlyDiscount: !form.isYearlyDiscount })}>
              Apply discount for whole year
            </Label>
          </div>

          {/* Discount Dates - Only show when yearly discount is disabled */}
          {!form.isYearlyDiscount && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-700 font-medium">Start Date</Label>
                <Input
                  type="date"
                  value={form.discountStartDate}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      discountStartDate: e.target.value,
                    })
                  }
                  className="mt-2 bg-white border border-gray-300 text-gray-900 rounded-md focus:border-gray-500 focus:ring-gray-500 placeholder-gray-400 shadow-sm"
                />
              </div>
              <div>
                <Label className="text-gray-700 font-medium">End Date</Label>
                <Input
                  type="date"
                  value={form.discountEndDate}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      discountEndDate: e.target.value,
                    })
                  }
                  className="mt-2 bg-white border border-gray-300 text-gray-900 rounded-md focus:border-gray-500 focus:ring-gray-500 placeholder-gray-400 shadow-sm"
                />
              </div>
            </div>
          )}

          {/* Images Section - Side by Side, Same Size */}
          <div className="grid grid-cols-2 gap-6">
            {/* Main Image */}
            <div>
              <Label className="text-gray-700 font-medium">Main Image</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setForm({
                    ...form,
                    mainImage: e.target.files ? e.target.files[0] : null,
                  })
                }
                className="mt-2 bg-white border border-gray-300 text-gray-900 rounded-md focus:border-gray-500 focus:ring-gray-500 placeholder-gray-400 shadow-sm"
                required
              />
              {/* Main Image Preview */}
              {form.mainImage && (
                <div className="mt-3 relative inline-block">
                  <img 
                    src={URL.createObjectURL(form.mainImage)} 
                    alt="Main Preview" 
                    className="h-20 w-20 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity" 
                    onClick={() => setEnlargedImage(URL.createObjectURL(form.mainImage!))}
                  />
                  <button 
                    type="button" 
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-md" 
                    onClick={() => setForm({ ...form, mainImage: null })}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>

            {/* Sub Images */}
            <div>
              <Label className="text-gray-700 font-medium">Sub Images (max 4)</Label>
              <Input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) =>
                  setForm({
                    ...form,
                    subImages: e.target.files
                      ? Array.from(e.target.files).slice(0, 4)
                      : [],
                  })
                }
                className="mt-2 bg-white border border-gray-300 text-gray-900 rounded-md focus:border-gray-500 focus:ring-gray-500 placeholder-gray-400 shadow-sm"
              />
              {/* Sub Images Preview */}
              {form.subImages.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {form.subImages.map((img, idx) => (
                    <div key={idx} className="relative">
                      <img 
                        src={URL.createObjectURL(img)} 
                        alt={`Sub ${idx + 1}`} 
                        className="h-20 w-20 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity" 
                        onClick={() => setEnlargedImage(URL.createObjectURL(img))}
                      />
                      <button 
                        type="button" 
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-md" 
                        onClick={() => setForm({ ...form, subImages: form.subImages.filter((_, i) => i !== idx) })}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 text-blue-600 bg-white border border-blue-100 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 font-semibold"
            >
              {loading ? "Adding..." : "Add Product"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/products")}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Image Enlarge Modal */}
      {enlargedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setEnlargedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img 
              src={enlargedImage} 
              alt="Enlarged" 
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" 
            />
            <button 
              type="button"
              className="absolute -top-3 -right-3 bg-white text-gray-800 rounded-full p-2 hover:bg-gray-100 transition-colors shadow-lg"
              onClick={() => setEnlargedImage(null)}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProductPage;
