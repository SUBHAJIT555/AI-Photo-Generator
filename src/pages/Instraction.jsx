import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useInView } from "framer-motion";
import Logo from "../component/Logo";
import PageBackground from "../component/PageBackground";
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
    <div className="flex overflow-hidden relative flex-col items-center w-full h-screen min-h-screen">
      <PageBackground />

      <Logo onBack={() => navigate("/")} />

      <div className="relative z-[2] min-h-0 w-full flex-1 overflow-y-auto px-6">
        <div className="flex min-h-full w-full items-center justify-center py-4">
          <div className="flex w-full max-w-3xl flex-col items-center justify-center">
            <p className="mb-1 text-center text-sm font-semibold uppercase tracking-[0.28em] text-[#ee3139]/80">
              Photo Booth
            </p>
            <h1 className="text-center text-5xl font-bold font-cornea leading-tight text-[#ee3139] md:text-6xl">
              Instruction
            </h1>
            <div className="mx-auto mt-3 mb-8 h-px w-24 bg-gradient-to-r from-transparent via-[#ee3139]/60 to-transparent" />

            <ul
              ref={listRef}
              className="flex w-full max-w-3xl list-none flex-col gap-6"
            >
              {instructionItems.map(({ text, Icon }) => (
                <li key={text} className="flex items-center gap-5 text-left">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[16px] bg-gradient-to-b from-tertiary to-primary text-white ring-1 ring-inset ring-white/25 [&_svg]:mt-0 [&_svg]:h-7 [&_svg]:w-7">
                    <Icon isInView={iconsInView} />
                  </span>
                  <span className="text-2xl font-cornea font-semibold leading-snug text-[#ee3139] md:text-3xl">
                    {text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 justify-center items-center z-[2] w-full pb-10 mb-[5vw]">
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
