import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { User, Package, Heart, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import axios from "axios";

interface UserType {
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const token = localStorage.getItem("token");

  // 🔥 FETCH PROFILE USING API + ENV
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUser(res.data.user);
      } catch (error) {
        console.error("Profile fetch failed", error);
        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchProfile();
    } else {
      navigate("/login");
    }
  }, [token, navigate]);

  const handleUpdateProfile = async (updatedData: any) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/users/profile`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUser(res.data.user);
      toast({
        title: "Profile Updated",
        description: "Your profile details have been updated successfully.",
      });
    } catch (error) {
      console.error("Update failed", error);
      toast({
        title: "Update Failed",
        description: "Could not update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="py-8 md:py-12">
      <div className="container max-w-2xl">
        <h1 className="font-serif text-3xl md:text-4xl font-bold mb-8">
          My Profile
        </h1>

        {/* Profile Card */}
        <div className="bg-card rounded-2xl p-6 md:p-8 shadow-soft mb-6 relative">
          <div className="absolute top-6 right-6">
             <Button variant="outline" size="sm" onClick={() => setIsEditOpen(true)}>
               Edit Profile
             </Button>
          </div>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-semibold">
                {user.name}
              </h2>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground">Phone</label>
              <p className="font-medium">
                {user.phone || "Not provided"}
              </p>
            </div>

            <div>
              <label className="text-sm text-muted-foreground">Address</label>
              <p className="font-medium">
                {user.address || "Not provided"}
              </p>
            </div>
          </div>
        </div>

        <EditProfileDialog 
          user={user} 
          isOpen={isEditOpen} 
          onClose={() => setIsEditOpen(false)} 
          onSave={handleUpdateProfile}
        />

        {/* Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/orders"
            className="bg-card rounded-xl p-6 shadow-soft hover-lift flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">My Orders</h3>
              <p className="text-sm text-muted-foreground">
                View order history
              </p>
            </div>
          </Link>

          <Link
            to="/wishlist"
            className="bg-card rounded-xl p-6 shadow-soft hover-lift flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Wishlist</h3>
              <p className="text-sm text-muted-foreground">
                Saved items
              </p>
            </div>
          </Link>
        </div>

        {/* Logout */}
        <Button
          variant="outline"
          className="w-full mt-6 text-destructive hover:text-destructive gap-2"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

// Simple Edit Profile Dialog Component (Inline for simplicity, or could be separate)
const EditProfileDialog = ({ user, isOpen, onClose, onSave }: any) => {
  const [formData, setFormData] = useState({
    name: user.name,
    phone: user.phone || "",
    address: user.address || "",
  });
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSave(formData);
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background p-6 rounded-lg w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <Input name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <Input name="phone" value={formData.phone} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <textarea
              name="address"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
