import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Product {
  _id: string;
  productName: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  unit: string;
  images: string[];
  discount?: {
    percentage: number;
    isYearly: boolean;
  };
}

const AdminProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH PRODUCTS ================= */
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/products`);
      setProducts(res.data.products);
    } catch (error) {
      toast({ title: "Failed to load products", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* ================= EDIT PRODUCT ================= */
  const handleEditClick = (product: Product) => {
    navigate(`/products/${product._id}/edit`);
  };

  /* ================= DELETE PRODUCT ================= */
  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/products/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast({ title: "Product deleted" });
      fetchProducts();
    } catch (error) {
      toast({ title: "Delete failed", variant: "destructive" });
    }
  };

  if (loading) return <div className="text-gray-600 pt-8">Loading products...</div>;

  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-blue-600">Products</h1>

        <button 
          onClick={() => navigate("/products/add")}
          className="gap-2 text-blue-600 hover:text-blue-700 font-medium flex items-center cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Add Product
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 text-left text-sm font-semibold text-gray-700">Product Name</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-700">Category</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-700">Price</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-700">Stock</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-700">Units</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-700">Discount</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-t border-gray-200 hover:bg-gray-50">
                <td className="p-4"><span className="font-medium text-gray-800">{p.productName}</span></td>
                <td className="p-4">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">{p.category}</Badge>
                </td>
                <td className="p-4 text-gray-800 font-medium">₹{p.price}</td>
                <td className="p-4 text-gray-800">{p.stock}</td>
                <td className="p-4 text-gray-800">{p.unit}</td>
                <td className="p-4 text-gray-800">
                  {p.discount?.percentage ? `${p.discount.percentage}%` : '-'}
                </td>
                <td className="p-4 flex gap-3">
                  <button 
                    className="text-blue-600 hover:text-blue-700 cursor-pointer transition-colors"
                    onClick={() => handleEditClick(p)}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button 
                    className="text-blue-600 hover:text-blue-700 cursor-pointer transition-colors"
                    onClick={() => handleDeleteProduct(p._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;
