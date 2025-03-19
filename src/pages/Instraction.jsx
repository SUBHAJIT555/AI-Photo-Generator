import { Link } from "react-router-dom";
import Logo from "../component/Logo";

function Instruction() {
  return (
    <div className="flex flex-col items-center w-full h-screen justify-evenly">
      <Logo />
      <div className="w-1/2 px-8 py-12 flex flex-col gap-[1.5vw] justify-center items-center border-2 border-zinc-300 rounded-3xl bg-zinc-700/70">
        <h1 className="text-[3vw] font-bold text-zinc-200 mb-6 underline underline-offset-4">
          Instruction
        </h1>
        <p className="text-[2vw] font-light text-zinc-200 text-center">
          only one person should be in the photo.
        </p>
        <p className="text-[2vw] font-light text-zinc-200 text-center">
          Stay still for a few seconds after tapping the screen for the clear
          photo.
        </p>
        <p className="text-[2vw] font-light text-zinc-200 text-center">
          Keep your eye open for the best photo.
        </p>
      </div>
      <Link to="/capture">
        <button className="px-5 py-3 font-light tracking-tight capitalize border-2 border-transparent rounded-full text-zinc-200 bg-zinc-700 hover:bg-zinc-900 hover:border-zinc-200">
          click here to capture
        </button>
      </Link>
    </div>
  );
}

export default Instruction;
