import { LiquidMetalButton } from "@/components/ui/LiquidMetalButton";
import { cn } from "@/lib/utils";

function ArrowLeftDashedIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M5 12h6m3 0h1.5m3 0h.5" />
      <path d="M5 12l6 6" />
      <path d="M5 12l6 -6" />
    </svg>
  );
}

export function BackButton({ onClick, className, disabled = false }) {
  return (
    <LiquidMetalButton
      viewMode="icon"
      label="Back"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "h-14 w-14 shrink-0 rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.35)]",
        className,
      )}
    >
      <ArrowLeftDashedIcon className="text-[#e8e8e8] drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
    </LiquidMetalButton>
  );
}

export default BackButton;
