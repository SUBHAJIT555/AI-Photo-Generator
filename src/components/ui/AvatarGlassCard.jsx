import { cn } from "@/lib/utils";
import { LiquidGlass } from "./LiquidGlass";

export function AvatarGlassCard({ selected, onClick, className, children }) {
  return (
    <div
      className={cn(
        "group relative w-full max-w-[400px] mx-auto cursor-none",
        className
      )}
      onClick={onClick}
    >
      <LiquidGlass
        className={cn(
          "w-full rounded-2xl p-1.5",
          selected && "shadow-[0_0_0_2px_#4F758B,0_0_12px_rgba(79,117,139,0.35)]"
        )}
        blur={2}
        refraction={12}
        bezel={0.34}
      >
        {children}
      </LiquidGlass>
    </div>
  );
}
