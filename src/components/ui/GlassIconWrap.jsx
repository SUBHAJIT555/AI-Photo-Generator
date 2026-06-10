import { cn } from "@/lib/utils";
import { LiquidGlass } from "./LiquidGlass";

const sizeClasses = {
  md: "w-10 h-10",
  lg: "w-14 h-14",
};

export function GlassIconWrap({
  className,
  size = "md",
  iconClassName,
  children,
}) {
  return (
    <LiquidGlass
      className={cn("inline-flex shrink-0 rounded-2xl", className)}
      blur={2}
      refraction={14}
      bezel={0.34}
    >
      <span
        className={cn(
          "flex items-center justify-center text-white",
          sizeClasses[size],
          iconClassName
        )}
      >
        {children}
      </span>
    </LiquidGlass>
  );
}
