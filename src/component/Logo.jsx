import LogoImage from "../assets/logo/Fab-reward.png";
import { BackButton } from "./BackButton";

function Logo({ onBack, backDisabled = false }) {
  return (
    <div
      className={`flex w-full items-center gap-4 ${
        onBack ? "justify-between" : "justify-end"
      }`}
    >
      {onBack ? (
        <BackButton onClick={onBack} disabled={backDisabled} />
      ) : null}
      <img src={LogoImage} alt="FAB" className="w-[28vw] max-w-[220px]" />
    </div>
  );
}

export default Logo;
