import LogoImage from "../assets/logo/Fab-reward.png";

function Logo() {
  return (
    <div className="flex w-full justify-end items-center">
      <img src={LogoImage} alt="FAB" className="w-[28vw] max-w-[220px]" />
    </div>
  );
}

export default Logo;
