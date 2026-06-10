import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { LiquidGlass } from "./LiquidGlass";
import "./LiquidGlass.css";

const buttonSizeClasses = {
  default: "text-base font-medium",
  sm: "text-sm font-medium",
  lg: "text-lg font-medium",
  icon: "h-10 w-10",
};

const textSizeClasses = {
  default: "px-6 py-3.5",
  sm: "px-4 py-2",
  lg: "px-8 py-4",
  icon: "flex h-10 w-10 items-center justify-center",
};

export const GlassButton = forwardRef(function GlassButton(
  { className, children, size = "default", contentClassName, ...props },
  ref
) {
  return (
    <div
      className={cn(
        "glass-button-wrap cursor-pointer rounded-full",
        className
      )}
    >
      <LiquidGlass className="inline-flex rounded-full">
        <button
          ref={ref}
          type="button"
          className={cn("glass-button", buttonSizeClasses[size])}
          {...props}
        >
          <span
            className={cn(
              "glass-button-text relative block select-none tracking-tighter",
              textSizeClasses[size],
              contentClassName
            )}
          >
            {children}
          </span>
        </button>
      </LiquidGlass>
      <div className="glass-button-shadow rounded-full" />
    </div>
  );
});

GlassButton.displayName = "GlassButton";

export function LiquidGlassPanel({ className, children }) {
  return (
    <LiquidGlass
      className={cn("flex w-full flex-col items-center rounded-xl overflow-visible", className)}
      blur={3}
      refraction={22}
      bezel={0.28}
    >
      {children}
    </LiquidGlass>
  );
}
