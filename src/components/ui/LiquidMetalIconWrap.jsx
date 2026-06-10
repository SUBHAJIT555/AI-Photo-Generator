import { cn } from "@/lib/utils";
import "./LiquidMetal.css";

const sizeClasses = {
  md: "liquid-metal-icon-wrap--md",
  lg: "liquid-metal-icon-wrap--lg",
};

export function LiquidMetalIconWrap({
  className,
  size = "md",
  iconClassName,
  children,
}) {
  return (
    <span
      className={cn(
        "liquid-metal-icon-wrap",
        sizeClasses[size],
        className
      )}
    >
      <span
        className={cn(
          "flex h-full w-full items-center justify-center",
          iconClassName
        )}
      >
        {children}
      </span>
    </span>
  );
}
