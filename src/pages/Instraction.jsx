import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useInView } from "framer-motion";
import Logo from "../component/Logo";
import Lightfall from "../component/Lightfall";
import LightRays from "../component/LightRays";
import { LiquidMetalButton } from "@/components/ui/LiquidMetalButton";
import {
  UserScanIcon,
  ClockPauseIcon,
  EyeIcon,
} from "@/components/ui/InstructionIcons";

const instructionItems = [
  { text: "Only one person should be in the photo.", Icon: UserScanIcon },
  {
    text: "Stay still for a few seconds after tapping the screen for a clear photo.",
    Icon: ClockPauseIcon,
  },
  { text: "Keep your eye open for the best photo.", Icon: EyeIcon },
];

function Instruction() {
  const navigate = useNavigate();
  const listRef = useRef(null);
  const iconsInView = useInView(listRef, { once: true, margin: "-80px" });

  return (
    <div className="min-h-screen w-full relative flex flex-col items-center overflow-x-hidden">
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

      <div className="flex flex-col items-center w-full flex-1 relative z-[2] text-white px-4 py-6 gap-[6vw]">
        <Logo />

        <div className="relative w-full max-w-2xl shrink-0 overflow-hidden rounded-3xl border border-white/10 bg-[#050a0e] shadow-[0_12px_40px_rgba(0,0,0,0.45)]">
          <LightRays
            className="mix-blend-screen opacity-100"
            raysOrigin="top-center"
            raysColor="#ffffff"
            raysSpeed={1}
            lightSpread={0.5}
            rayLength={3}
            followMouse
            mouseInfluence={0.1}
            noiseAmount={0}
            distortion={0}
            fadeDistance={1}
          />

          <div className="relative z-[2] px-6 py-8">
            <h1 className="mb-8 text-center text-[3rem] font-bold font-cornea leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)] md:text-[4rem]">
              Instruction
            </h1>

            <ul
              ref={listRef}
              className="flex list-none flex-col gap-4"
            >
              {instructionItems.map(({ text, Icon }) => (
                <li
                  key={text}
                  className="flex items-start gap-4 rounded-2xl border border-white/10 bg-black/30 px-4 py-4 backdrop-blur-[2px]"
                >
                  <span className="mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white [&_svg]:mt-0 [&_svg]:h-7 [&_svg]:w-7">
                    <Icon isInView={iconsInView} />
                  </span>
                  <span className="flex-1 pt-1.5 text-2xl font-cornea font-semibold leading-snug md:text-3xl">
                    {text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <LiquidMetalButton
          label="Click Here to Start"
          large
          onClick={() => navigate("/capture")}
          labelClassName="uppercase tracking-widest font-extrabold"
        />
      </div>
    </div>
  );
}

export default Instruction;
