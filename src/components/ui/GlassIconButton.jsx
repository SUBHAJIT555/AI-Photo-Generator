import { cn } from "@/lib/utils";
import { LiquidGlass } from "./LiquidGlass";

export function GlassIconButton({ onClick, className, children, ...props }) {
  return (
    <LiquidGlass
      className={cn("inline-flex rounded-2xl", className)}
      blur={2}
      refraction={12}
      bezel={0.34}
    >
      <button
        type="button"
        onClick={onClick}
        className="p-3 text-white transition-opacity duration-300 hover:opacity-80"
        {...props}
      >
        {children}
      </button>
    </LiquidGlass>
  );
}
