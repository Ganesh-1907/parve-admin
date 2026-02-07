import { Link } from "react-router-dom";

interface LogoProps {
  className?: string;
  variant?: "default" | "light";
}

export function Logo({ className = "", variant = "default" }: LogoProps) {
  return (
    <Link to="/" className={`block ${className}`}>
        <img 
          src="/logo.parve.png" 
          alt="PARVE" 
          className="h-10 md:h-12 w-auto object-contain"
          style={variant === "light" ? { filter: "brightness(0) invert(1)" } : {}}
        />
    </Link>
  );
}
