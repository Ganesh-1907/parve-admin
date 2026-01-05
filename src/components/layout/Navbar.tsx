import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Search, User, ShoppingCart, Heart, Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCartStore, useAuthStore, useWishlistStore } from "@/store/useStore";
import { Logo } from "./Logo";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Products", path: "/products" },
  { name: "About", path: "/about" },
  { name: "Terms & Services", path: "/terms" },
];

export function Navbar() {
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { getTotalItems } = useCartStore();
  const { isLoggedIn, user, logout } = useAuthStore();
  const { items: wishlistItems } = useWishlistStore();

  return (
    <header className="sticky top-0 z-50 w-full glass">
      <div className="container flex h-16 items-center justify-between md:h-20">
        {/* Logo */}
        <Logo />

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-primary relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full ${
                location.pathname === link.path ? "text-primary after:w-full" : "text-foreground"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Search */}
          <div className="relative hidden md:block">
            {searchOpen ? (
              <div className="flex items-center gap-2 animate-fade-in">
                <Input
                  placeholder="Search products..."
                  className="w-48 lg:w-64"
                  autoFocus
                  onBlur={() => setSearchOpen(false)}
                />
                <Button variant="ghost" size="icon" onClick={() => setSearchOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)}>
                <Search className="h-5 w-5" />
              </Button>
            )}
          </div>

          {/* Wishlist */}
          <Link to="/wishlist">
            <Button variant="ghost" size="icon" className="relative">
              <Heart className="h-5 w-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-bold flex items-center justify-center text-primary-foreground">
                  {wishlistItems.length}
                </span>
              )}
            </Button>
          </Link>

          {/* Cart */}
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-bold flex items-center justify-center text-primary-foreground">
                  {getTotalItems()}
                </span>
              )}
            </Button>
          </Link>

          {/* User Menu */}
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/orders">My Orders</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/wishlist">Wishlist</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link to="/signup">
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex flex-col gap-6 mt-8">
                <Input placeholder="Search products..." />
                <nav className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileOpen(false)}
                      className={`text-lg font-medium transition-colors hover:text-primary ${
                        location.pathname === link.path ? "text-primary" : ""
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                </nav>
                {!isLoggedIn && (
                  <div className="flex flex-col gap-2 mt-4">
                    <Link to="/login" onClick={() => setMobileOpen(false)}>
                      <Button variant="outline" className="w-full">Login</Button>
                    </Link>
                    <Link to="/signup" onClick={() => setMobileOpen(false)}>
                      <Button className="w-full">Sign Up</Button>
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
