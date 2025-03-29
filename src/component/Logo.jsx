import LogoImage from "../assets/logo/himalaya-pet.svg";
function Logo() {
  return (
    <div className="flex items-center justify-center">
      <img src={LogoImage} alt="Codecobble" className="w-full" />
    </div>
  );
}

export default Logo;
