import { cn } from "@/lib/utils";
import { LiquidGlass } from "./LiquidGlass";

export function GlassIconWrap({ className, children }) {
  return (
    <LiquidGlass
      className={cn("inline-flex shrink-0 rounded-2xl", className)}
      blur={2}
      refraction={12}
      bezel={0.34}
    >
      <span className="flex items-center justify-center w-10 h-10 text-[#4F758B]">
        {children}
      </span>
    </LiquidGlass>
  );
}
