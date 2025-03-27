import LogoImage from "../assets/logo/Himalaya-Pet_Logo_FA_White-on-Black_Big-2.png";
function Logo() {
  return (
    <div className="flex items-center justify-center">
      <img src={LogoImage} alt="Codecobble" className="w-1/2" />
    </div>
  );
}

export default Logo;
