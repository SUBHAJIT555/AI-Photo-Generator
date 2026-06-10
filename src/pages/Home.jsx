import { useNavigate } from "react-router-dom";
import Logo from "../component/Logo";
import Lightfall from "../component/Lightfall";
import { GlassButton } from "@/components/ui/GlassButton";

function Home() {
  const navigate = useNavigate();
  return (
    <div className="flex overflow-hidden relative flex-col justify-evenly items-center w-full h-screen min-h-screen text-white">
      <div className="absolute inset-0 z-[-1]">
        <Lightfall
          colors={["#9CB8C8", "#4F758B", "#FFFFFF"]}
          backgroundColor="#4F758B"
          speed={0.5}
          streakCount={2}
          streakWidth={1}
          streakLength={1}
          glow={1}
          density={0.6}
          twinkle={1}
          zoom={3}
          backgroundGlow={0.5}
          opacity={1}
          mouseInteraction
          mouseStrength={0.5}
          mouseRadius={1}
        />
      </div>

      {/* Logo */}
      <div className="z-[2] mb-[15vw] -mt-[10vw]">
        <Logo />
      </div>

      {/* Start Button */}
      <div className="flex justify-center items-center z-[2] mt-[90vw]">
        <GlassButton
          onClick={() => navigate("/instruction")}
          size="lg"
          contentClassName="px-10 py-5 text-[5vw] tracking-widest uppercase font-extrabold"
        >
          Start
        </GlassButton>
      </div>
    </div>
  );
}

export default Home;
