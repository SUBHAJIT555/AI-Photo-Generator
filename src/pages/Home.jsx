import { useNavigate } from "react-router-dom";
import Logo from "../component/Logo";
import homeVideo from "../assets/logo/home.webm";
import { LiquidMetalButton } from "@/components/ui/LiquidMetalButton";

function Home() {
  const navigate = useNavigate();
  return (
    <div className="flex overflow-hidden relative flex-col items-center w-full h-screen min-h-screen text-white">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 z-[-1] h-full w-full object-cover"
      >
        <source src={homeVideo} type="video/webm" />
      </video>

      <div className="z-[2] flex w-full justify-end px-6 pt-[6vw]">
        <Logo />
      </div>

      <div className="flex-1" />

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
