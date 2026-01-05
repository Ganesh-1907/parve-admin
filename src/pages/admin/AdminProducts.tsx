import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

interface Product {
  _id: string;
  productName: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  unit: string;
  images: string[];
}

const AdminProducts = () => {
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    productName: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    unit: "",
    discountPercentage: "",
    isYearlyDiscount: false,
    discountStartDate: "",
    discountEndDate: "",
    mainImage: null as File | null,
    subImages: [] as File[],
  });

  const token = localStorage.getItem("token");

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

  /* ================= ADD PRODUCT ================= */
  const handleAddProduct = async () => {
    try {
      if (!form.mainImage) {
        toast({ title: "Main image is required", variant: "destructive" });
        return;
      }

      const formData = new FormData();

      formData.append("productName", form.productName);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("stock", form.stock);
      formData.append("category", form.category);
      formData.append("unit", form.unit);
      formData.append("discountPercentage", form.discountPercentage);
      formData.append("isYearlyDiscount", String(form.isYearlyDiscount));

      if (!form.isYearlyDiscount) {
        formData.append("discountStartDate", form.discountStartDate);
        formData.append("discountEndDate", form.discountEndDate);
      }

      // Images
      formData.append("images", form.mainImage);
      form.subImages.forEach((img) => {
        formData.append("images", img);
      });

      await axios.post(`${API_BASE_URL}/products/add`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast({ title: "Product added successfully" });
      setOpen(false);
      fetchProducts();
    } catch (error) {
      toast({ title: "Add product failed", variant: "destructive" });
    }
  };

  if (loading) return <div>Loading products...</div>;

  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl md:text-3xl font-bold">Products</h1>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Add Product
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              {/* Product Name */}
              <div>
                <Label>Product Name</Label>
                <Input
                  value={form.productName}
                  onChange={(e) =>
                    setForm({ ...form, productName: e.target.value })
                  }
                />
              </div>

              {/* Description */}
              <div>
                <Label>Description</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>

              {/* Main Image */}
              <div>
                <Label>Main Image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      mainImage: e.target.files
                        ? e.target.files[0]
                        : null,
                    })
                  }
                />
              </div>

              {/* Price & Stock */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Price (₹)</Label>
                  <Input
                    type="number"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Stock</Label>
                  <Input
                    type="number"
                    value={form.stock}
                    onChange={(e) =>
                      setForm({ ...form, stock: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Category & Unit */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Category</Label>
                  <Select
                    value={form.category}
                    onValueChange={(value) =>
                      setForm({ ...form, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="facewash">Facewash</SelectItem>
                      <SelectItem value="serums">Serums</SelectItem>
                      <SelectItem value="creams">Creams</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Unit</Label>
                  <Input
                    value={form.unit}
                    onChange={(e) =>
                      setForm({ ...form, unit: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Discount */}
              <div>
                <Label>Discount %</Label>
                <Input
                  type="number"
                  value={form.discountPercentage}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      discountPercentage: e.target.value,
                    })
                  }
                />
              </div>

              {/* Discount Toggle */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.isYearlyDiscount}
                  onChange={() =>
                    setForm({
                      ...form,
                      isYearlyDiscount: !form.isYearlyDiscount,
                    })
                  }
                />
                <Label>Apply discount for whole year</Label>
              </div>

              {/* Discount Dates */}
              {!form.isYearlyDiscount && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Start Date</Label>
                    <Input
                      type="date"
                      value={form.discountStartDate}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          discountStartDate: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>End Date</Label>
                    <Input
                      type="date"
                      value={form.discountEndDate}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          discountEndDate: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              )}

              {/* Sub Images */}
              <div>
                <Label>Sub Images (max 4)</Label>
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
                />
              </div>

              <Button className="w-full" onClick={handleAddProduct}>
                Add Product
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* TABLE */}
      <div className="bg-card rounded-xl shadow-soft overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="p-4 text-left">Product</th>
              <th className="p-4 text-left">Product Name</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-left">Price</th>
              <th className="p-4 text-left">Stock</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-t">
               
               <td className="p-4">
  <div className="flex items-center">
    <img
      src={`${API_BASE_URL.replace("/api", "")}${p.images[0]}`}
      alt={p.productName}
      className="w-12 h-12 rounded object-cover"
    />
  </div>
</td>
 <span className="font-medium">{p.productName}</span>
                <td className="p-4">
                  <Badge variant="outline">{p.category}</Badge>
                </td>
                <td className="p-4">₹{p.price}</td>
                <td className="p-4">{p.stock}</td>
                <td className="p-4 flex gap-2">
                  <Button size="icon" variant="ghost">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
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
