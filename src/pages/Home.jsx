import { useNavigate } from "react-router-dom";
import Logo from "../component/Logo";
import PageBackground from "../component/PageBackground";
import { LiquidMetalButton } from "@/components/ui/LiquidMetalButton";

function Home() {
  const navigate = useNavigate();
  return (
    <div className="flex overflow-hidden relative flex-col items-center w-full h-screen min-h-screen text-white">
      <PageBackground />

      <div className="z-[2] flex flex-1 flex-col items-center justify-center w-full px-4">
        <Logo />
        <div className="flex flex-1 justify-center items-center w-full -mt-[15vw]">
          <img
            src="/home.webp"
            alt="Home"
            className="max-h-full w-auto max-w-[70vw] object-contain"
          />
        </div>
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
