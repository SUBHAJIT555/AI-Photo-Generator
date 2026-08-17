import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useInView } from "framer-motion";
import Logo from "../component/Logo";
import PageBackground from "../component/PageBackground";
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
      <PageBackground />

      <div className="flex flex-col items-center w-full flex-1 relative z-[2] text-white px-4 py-6 gap-[6vw]">
        <Logo />

        <div className="relative w-full max-w-2xl shrink-0 overflow-hidden rounded-[20px] border border-white/15 bg-[#0b1419]/80 shadow-[0_20px_50px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md">
          <LightRays
            className="mix-blend-screen opacity-70"
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
            <div className="mb-8 text-center">
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.28em] text-white/55">
                Photo Booth
              </p>
              <h1 className="text-[3rem] font-bold font-cornea leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)] md:text-[4rem]">
                Instruction
              </h1>
              <div className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            </div>

            <ul ref={listRef} className="flex list-none flex-col gap-4">
              {instructionItems.map(({ text, Icon }, index) => (
                <li
                  key={text}
                  className="flex items-center gap-4 rounded-[20px] border border-white/12 bg-white/[0.06] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                >
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[16px] bg-gradient-to-b from-[#6A93A8] to-[#4F758B] text-white ring-1 ring-inset ring-white/25 [&_svg]:mt-0 [&_svg]:h-7 [&_svg]:w-7">
                    <Icon isInView={iconsInView} />
                  </span>
                  <span className="flex-1 text-2xl font-cornea font-semibold leading-snug md:text-3xl">
                    {text}
                  </span>
                  <span className="hidden shrink-0 text-sm font-bold tracking-widest text-white/30 sm:block">
                    {String(index + 1).padStart(2, "0")}
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
