import LogoImage from "../assets/logo_and_bg/logo.svg";
function Logo() {
  return (
    <div className="flex justify-center items-center">
      <img src={LogoImage} alt="Codecobble" height={100} />
    </div>
  );
}

export default Logo;
