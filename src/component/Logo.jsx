import LogoImage from "../assets/logo/logo.webp";
import { BackButton } from "./BackButton";

function Logo({ onBack, backDisabled = false }) {
  return (
    <div
      className={`flex w-full items-center gap-4 ${
        onBack ? "justify-between" : "justify-start"
      }`}
    >
      <img src={LogoImage} alt="FAB" className="w-[28vw] max-w-[220px]" />
      {onBack ? (
        <BackButton onClick={onBack} disabled={backDisabled} />
      ) : null}
    </div>
  );
}

export default Logo;
