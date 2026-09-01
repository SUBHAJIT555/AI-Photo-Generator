import { useNavigate } from "react-router-dom";
import Logo from "../component/Logo";
import PageBackground from "../component/PageBackground";
import camLogo from "../assets/logo/cam-logo.webp";
import { LiquidMetalButton } from "@/components/ui/LiquidMetalButton";

function Home() {
  const navigate = useNavigate();
  return (
    <div className="flex overflow-hidden relative flex-col items-center w-full h-screen min-h-screen text-white">
      <PageBackground />

      <div className="z-[2] flex w-full justify-start px-6 pt-[6vw]">
        <Logo />
      </div>

      <div className="z-[2] flex flex-1 items-center justify-center w-full px-6">
        <img
          src={camLogo}
          alt="Camera"
          className="w-[55vw] max-w-[420px] object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.25)]"
        />
      </div>

      <div className="flex justify-center items-center z-[2] w-full pb-10 mb-[5vw]">
        <LiquidMetalButton
          label="Start"
          large
          onClick={() => navigate("/instruction")}
          labelClassName="uppercase tracking-widest font-extrabold"
        />
      </div>
    </div>
  );
}

export default Home;
