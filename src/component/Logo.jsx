import LogoImage from "../assets/logo/RitLogoorange.svg";
function Logo() {
  return (
    <div className="flex items-center justify-center">
      <img src={LogoImage} alt="Codecobble" className="w-[50vw]" />
    </div>
  );
}

export default Logo;
