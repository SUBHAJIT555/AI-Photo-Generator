import { useNavigate } from "react-router-dom";
import Logo from "../component/Logo";
import PageBackground from "../component/PageBackground";
import { LiquidMetalButton } from "@/components/ui/LiquidMetalButton";

function CameraMark() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      className="h-[28vw] w-[28vw] max-h-[220px] max-w-[220px] text-[#C44B78] drop-shadow-[0_8px_16px_rgba(163,58,98,0.35)]"
      aria-hidden="true"
    >
      <path
        d="M208,64H176L160,40H96L80,64H48A16,16,0,0,0,32,80V192a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V80A16,16,0,0,0,208,64ZM128,168a36,36,0,1,1,36-36A36,36,0,0,1,128,168Z"
        fill="currentColor"
        opacity="0.2"
      />
      <path
        d="M208,56H180.28L166.65,35.56A8,8,0,0,0,160,32H96a8,8,0,0,0-6.65,3.56L75.71,56H48A24,24,0,0,0,24,80V192a24,24,0,0,0,24,24H208a24,24,0,0,0,24-24V80A24,24,0,0,0,208,56Zm8,136a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V80a8,8,0,0,1,8-8H80a8,8,0,0,0,6.66-3.56L100.28,48h55.43l13.63,20.44A8,8,0,0,0,176,72h32a8,8,0,0,1,8,8ZM128,88a44,44,0,1,0,44,44A44.05,44.05,0,0,0,128,88Zm0,72a28,28,0,1,1,28-28A28,28,0,0,1,128,160Z"
        fill="currentColor"
      />
    </svg>
  );
}

function Home() {
  const navigate = useNavigate();
  return (
    <div className="relative flex h-screen min-h-screen w-full flex-col items-center overflow-hidden text-white">
      <PageBackground />

      <div className="z-[2] w-full px-6 pt-[5vw]">
        <Logo />
      </div>

      <div className="z-[2] flex flex-1 flex-col items-center justify-center gap-8 pb-[8vh]">
        <CameraMark />
        <LiquidMetalButton
          label="Click here to Start"
          onClick={() => navigate("/instruction")}
          className="rounded-2xl px-12 py-4 text-[1.6rem] ring-offset-[3px] md:text-[2rem]"
          labelClassName="font-semibold tracking-wide"
        />
      </div>
    </div>
  );
}

export default Home;
