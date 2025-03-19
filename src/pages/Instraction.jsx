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
        <button
          className="relative px-14 py-3 font-light tracking-tight capitalize border-2 border-transparent rounded-full text-zinc-200 bg-indigo-600 transition-all duration-300 overflow-hidden shadow-[0_0_10px_rgba(99,102,241,0.6)] 
    hover:bg-indigo-800 hover:border-indigo-300 hover:shadow-[0_0_20px_rgba(99,102,241,1)] active:scale-95"
        >
          {/* Sparkles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <span
                key={i}
                className="absolute block bg-white rounded-full opacity-50"
                style={{
                  width: `${Math.random() * 4 + 2}px`,
                  height: `${Math.random() * 4 + 2}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animation: `sparkle-animation ${
                    Math.random() * 3 + 2
                  }s linear infinite`,
                }}
              />
            ))}
          </div>

          {/* Button Text */}
          <span className="text-[2vw] tracking-wider">Click Here to Start</span>

          {/* Magical Styles */}
          <style>
            {`
      @keyframes sparkle-animation {
        0% { transform: translate(0, 0) scale(1); opacity: 1; }
        100% { transform: translate(300%, -50%) scale(0.5); opacity: 0; }
      }
    `}
          </style>
        </button>
      </Link>
    </div>
  );
}

export default Instruction;
