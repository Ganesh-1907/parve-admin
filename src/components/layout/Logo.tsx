import { Link } from "react-router-dom";

interface LogoProps {
  className?: string;
  variant?: "default" | "light" | "navbar" | "footer";
}

export function Logo({ className = "", variant = "default" }: LogoProps) {
  // Variant Logic:
  // "navbar" (Light BG/Transparent): mix-blend-multiply removes white bg, keeps black text.
  // "footer" (Dark BG): We need White Text. 
  //    Step 1: grayscale(100%) brightness(0) invert(1) -> Makes image text White and background Black.
  //    Step 2: mix-blend-screen -> Removes the Black background, leaving White text.
  // Variant Logic:
  // "navbar" (Light BG/Transparent): mix-blend-multiply removes white bg, keeps black text.
  // "footer" (Dark BG): We need White Text. 
  //    Step 1: grayscale(100%) brightness(0) invert(1) -> Makes image text White and background Black.
  //    Step 2: mix-blend-screen -> Removes the Black background, leaving White text.
  let filterClass = "";
  
  if (variant === "navbar") {
    filterClass = "mix-blend-multiply";
  } else if (variant === "footer" || variant === "light") {
    // 1. grayscale(1) -> makes it black/white only.
    // 2. invert(1) -> black text becomes white, white bg becomes black.
    // 3. brightness(2) -> boosts white text visibility.
    // 4. mix-blend-screen -> makes the black background transparent.
    filterClass = "grayscale invert brightness-200 mix-blend-screen"; 
  }

  return (
    <Link to="/" className={`block ${className}`}>
        <img 
          src="/logo.parve.png" 
          alt="PARVE" 
          className={`h-10 md:h-12 w-auto object-contain ${filterClass}`}
        />
    </Link>
  );
}
