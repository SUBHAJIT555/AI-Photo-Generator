import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useInView } from "framer-motion";
import Logo from "../component/Logo";
import { ShinyButton } from "./shiny-button";
import { AnimatedText } from "@/components/ui/AnimatedShinyText";
import {
  UserScanIcon,
  ClockPauseIcon,
  EyeIcon,
} from "@/components/ui/InstructionIcons";
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
    <div className="min-h-screen w-full bg-white relative flex flex-col justify-evenly items-center overflow-hidden">
      {/* Dashed Bottom Fade Grid - on top of glow so it's visible */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          backgroundImage: `
        linear-gradient(to right, #FF5900 1px, transparent 1px),
        linear-gradient(to bottom, #FF5900 1px, transparent 1px)
      `,
          backgroundSize: "10px 10px",
          backgroundPosition: "0 0, 0 0",
          opacity: 0.3,
          maskImage: `
         repeating-linear-gradient(
              to right,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            repeating-linear-gradient(
              to bottom,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            radial-gradient(ellipse 100% 80% at 50% 100%, #000 50%, transparent 90%)
      `,
          WebkitMaskImage: `
  repeating-linear-gradient(
              to right,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            repeating-linear-gradient(
              to bottom,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            radial-gradient(ellipse 100% 80% at 50% 100%, #000 50%, transparent 90%)
      `,
          maskComposite: "intersect",
          WebkitMaskComposite: "source-in",
        }}
      />

      {/* Amber-style glow background - base #FF5900 */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(125% 125% at 50% 90%, #ffffff 40%, #FF5900 100%)
          `,
          backgroundSize: "100% 100%",
        }}
      />

      <div className="flex flex-col justify-evenly items-center w-full flex-1 relative z-[2] text-white px-4 py-4">
        <Logo />
        {/* <div className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 blur-3xl left-10 top-[50vw] animate-float-scale"></div> */}

        <div className="flex flex-col items-center max-w-2xl px-6 py-8 rounded-2xl bg-[#F4EDE3] border border-neutral-200 ring-1 ring-offset-8 ring-neutral-300">
          <AnimatedText
            text="Instructions"
            className="mb-2"
            textClassName="text-[3rem] md:text-[4rem] font-bold"
            gradientColors="linear-gradient(90deg, #FF5900, #411517, #ff8c4d, #FF5900)"
            gradientAnimationDuration={2.5}
          />
          <ul
            ref={listRef}
            className="space-y-10 text-left w-full list-none pl-0"
          >
            {[
              { text: instructions[0], Icon: UserScanIcon },
              { text: instructions[1], Icon: ClockPauseIcon },
              { text: instructions[2], Icon: EyeIcon },
            ].map(({ text, Icon }, i) => (
              <li key={i} className="flex items-center gap-5">
                <span className="flex shrink-0 items-center justify-center w-9 h-9 rounded-xl bg-neutral-100 border border-neutral-200 ring-1 ring-offset-2 ring-neutral-300 text-[#FF5900]">
                  <Icon isInView={iconsInView} />
                </span>
                <span className="text-[#FF5900] text-3xl font-cornea font-semibold leading-snug flex-1 min-w-0">
                  {text}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-center items-center">
          <ShinyButton
            onClick={() => navigate("/capture")}
            className="text-[4vw]  uppercase font-extrabold"
          >
            Click Here to Start
          </ShinyButton>
        </div>
      </div>
    </div>
  );
}

export default Instruction;
