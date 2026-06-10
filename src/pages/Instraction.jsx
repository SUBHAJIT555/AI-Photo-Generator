import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useInView } from "framer-motion";
import Logo from "../component/Logo";
import Lightfall from "../component/Lightfall";
import { GlassButton, LiquidGlassPanel } from "@/components/ui/GlassButton";
import {
  UserScanIcon,
  ClockPauseIcon,
  EyeIcon,
} from "@/components/ui/InstructionIcons";
import { GlassIconWrap } from "@/components/ui/GlassIconWrap";
// import InstructionImage from "../assets/logo/instruction_bg.jpg";

function Instruction() {
  const navigate = useNavigate();
  const listRef = useRef(null);
  const iconsInView = useInView(listRef, { once: true, margin: "-80px" });
  const instructions = [
    "Only one person should be in the photo.",
    "Stay still for a few seconds after tapping the screen for a clear photo.",
    "Keep your eye open for the best photo.",
  ];

  return (
    <div className="min-h-screen w-full relative flex flex-col justify-evenly items-center overflow-hidden">
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

      <div className="flex flex-col justify-evenly items-center w-full flex-1 relative z-[2] text-white px-4 py-4">
        <Logo />
        {/* <div className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 blur-3xl left-10 top-[50vw] animate-float-scale"></div> */}

        <LiquidGlassPanel className="flex flex-col items-center max-w-2xl w-full rounded-3xl">
          <h1 className="w-full py-6 text-center text-[3rem] md:text-[4rem] font-bold text-[#4F758B] font-cornea leading-tight">
            Instruction
          </h1>
          <ul
            ref={listRef}
            className="space-y-10 text-left w-full list-none px-6 pb-8"
          >
            {[
              { text: instructions[0], Icon: UserScanIcon },
              { text: instructions[1], Icon: ClockPauseIcon },
              { text: instructions[2], Icon: EyeIcon },
            ].map(({ text, Icon }, i) => (
              <li key={i} className="flex items-center gap-5">
                <GlassIconWrap>
                  <Icon isInView={iconsInView} />
                </GlassIconWrap>
                <span className="text-[#4F758B] text-3xl font-cornea font-semibold leading-snug flex-1 min-w-0">
                  {text}
                </span>
              </li>
            ))}
          </ul>
        </LiquidGlassPanel>

        <div className="flex justify-center items-center">
          <GlassButton
            onClick={() => navigate("/capture")}
            size="lg"
            contentClassName="px-10 py-5 text-[4vw] uppercase font-extrabold tracking-wide"
          >
            Click Here to Start
          </GlassButton>
        </div>
      </div>
    </div>
  );
}

export default Instruction;
