import LogoImage from "../assets/logo/logo.webp";
import { BackButton } from "./BackButton";

function Logo({ onBack, backDisabled = false }) {
  return (
    <div className="relative z-[3] flex w-full shrink-0 items-center px-6 pt-[6vw]">
      <img src={LogoImage} alt="FAB" className="w-[28vw] max-w-[220px]" />
      {onBack ? (
        <div className="ml-auto">
          <BackButton onClick={onBack} disabled={backDisabled} />
        </div>
      ) : null}
    </div>
  );
}

export default Logo;
