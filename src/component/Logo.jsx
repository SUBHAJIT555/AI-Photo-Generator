import LogoImage from "../assets/logo/Title.png";
import { BackButton } from "./BackButton";

function Logo({ onBack, backDisabled = false }) {
  return (
    <div className="relative flex w-full items-center justify-center">
      {onBack ? (
        <div className="absolute left-0 top-1/2 -translate-y-1/2">
          <BackButton onClick={onBack} disabled={backDisabled} />
        </div>
      ) : null}
      <img
        src={LogoImage}
        alt="Navya's Birthday"
        className="h-auto w-[72vw] max-w-[520px] object-contain"
      />
    </div>
  );
}

export default Logo;
