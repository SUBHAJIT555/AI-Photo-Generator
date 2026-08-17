import { cn } from "@/lib/utils";

const baseClasses =
  "flex cursor-pointer font-display items-center justify-center rounded-xl transition-all duration-200 active:scale-98 bg-gradient-to-b from-tertiary to-primary text-white shadow-[0px_0px_10px_0px_rgba(255,255,255,0.2)_inset] ring ring-white/20 ring-inset ring-offset-2 ring-offset-primary hover:shadow-[0px_0px_20px_0px_rgba(255,255,255,0.4)_inset] hover:ring-white/40 disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100";

export function LiquidMetalButton({
  label = "Get Started",
  onClick,
  viewMode = "text",
  large = false,
  disabled = false,
  className,
  labelClassName,
  children,
}) {
  const isIcon = viewMode === "icon";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cn(
        baseClasses,
        isIcon
          ? large
            ? "h-[4.5rem] w-[4.5rem] p-0"
            : "h-12 w-12 p-0"
          : large
            ? "px-8 py-4 text-lg"
            : "px-4 py-2 text-base",
        className
      )}
    >
      {isIcon ? (
        children
      ) : (
        <span
          className={cn(
            "select-none whitespace-nowrap",
            large && "uppercase tracking-widest font-extrabold",
            labelClassName
          )}
        >
          {label}
        </span>
      )}
    </button>
  );
}
