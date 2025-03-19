import LogoImage from "../assets/logo/mainLogo.svg";
function Logo() {
  return (
    <div className="flex items-center justify-center">
      <img src={LogoImage} alt="Codecobble" height={100} />
    </div>
  );
}

export default Logo;
