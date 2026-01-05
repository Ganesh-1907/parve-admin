import { Link } from "react-router-dom";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center ${className}`}>
      <span className="font-logo text-2xl md:text-3xl font-bold tracking-wide text-foreground uppercase">
        <span className="relative inline-block">
          P
          <span 
            className="absolute bottom-0 left-[45%] w-[55%] h-[45%] bg-background"
            style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
          />
        </span>
        <span className="inline-block">A</span>
        <span className="relative inline-block">
          R
          <span 
            className="absolute bottom-0 right-0 w-[35%] h-[40%] bg-background"
          />
        </span>
        <span className="inline-block">V</span>
        <span className="inline-block">E</span>
      </span>
    </Link>
  );
}
