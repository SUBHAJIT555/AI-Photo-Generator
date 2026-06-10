import { cn } from "@/lib/utils";
import { LiquidGlass } from "./LiquidGlass";
import "./LiquidGlass.css";

export function CameraGlassFrame({ className, children }) {
  return (
    <div
      className={cn(
        "camera-glass-frame relative flex justify-center items-center w-fit max-w-[90vw]",
        className
      )}
    >
      <LiquidGlass
        className="w-full rounded-[2rem] p-2.5 sm:p-3"
        blur={4}
        refraction={24}
        bezel={0.3}
      >
        <div className="camera-glass-frame__inner relative overflow-hidden rounded-[1.5rem] border-[5px] border-white bg-black">
          {children}
        </div>
      </LiquidGlass>
    </div>
  );
}
