import { Link } from "react-router-dom";
import { Instagram, Mail } from "lucide-react";
import logo from "@/assets/logo-parve.png";

export function Footer() {
  return (
    <footer className="bg-[hsl(var(--footer-background))] py-12 md:py-16">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <img src={logo} alt="PARVE" className="h-8 brightness-0 invert" />
            <p className="text-sm text-[hsl(var(--footer-muted))]">
              Natural beauty, crafted with care. Every product is made with the finest plant-based ingredients.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-semibold text-[hsl(var(--footer-foreground))]">Quick Links</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/" className="text-sm text-[hsl(var(--footer-muted))] hover:text-primary transition-colors">
                Home
              </Link>
              <Link to="/products" className="text-sm text-[hsl(var(--footer-muted))] hover:text-primary transition-colors">
                Products
              </Link>
              <Link to="/about" className="text-sm text-[hsl(var(--footer-muted))] hover:text-primary transition-colors">
                About Us
              </Link>
            </nav>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-semibold text-[hsl(var(--footer-foreground))]">Support</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/terms" className="text-sm text-[hsl(var(--footer-muted))] hover:text-primary transition-colors">
                Terms & Conditions
              </Link>
              <Link to="/terms#refund" className="text-sm text-[hsl(var(--footer-muted))] hover:text-primary transition-colors">
                Refund Policy
              </Link>
              <Link to="/terms#privacy" className="text-sm text-[hsl(var(--footer-muted))] hover:text-primary transition-colors">
                Privacy Policy
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-semibold text-[hsl(var(--footer-foreground))]">Contact Us</h4>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:parve.world5@gmail.com"
                className="flex items-center gap-2 text-sm text-[hsl(var(--footer-muted))] hover:text-primary transition-colors"
              >
                <Mail className="h-4 w-4" />
                parve.world5@gmail.com
              </a>
              <a
                href="https://www.instagram.com/parve.world"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-[hsl(var(--footer-muted))] hover:text-primary transition-colors"
              >
                <Instagram className="h-4 w-4" />
                @parve.world
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-[hsl(var(--footer-muted)/0.2)] mt-8 pt-8 text-center">
          <p className="text-sm text-[hsl(var(--footer-muted))]">
            © {new Date().getFullYear()} PARVE. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
