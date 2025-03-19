import { Link } from "react-router-dom";
import Logo from "../component/Logo";
import BGImage from "../assets/logo/BG.jpg";

function Instruction() {
  return (
    <div
      className="flex flex-col items-center w-full h-screen min-h-screen text-white bg-center bg-cover justify-evenly"
      style={{ backgroundImage: `url(${BGImage})` }}
    >
      <div className="flex flex-col items-center w-full h-screen justify-evenly">
        <Logo />
        <div className="flex flex-col items-center justify-center w-[60vw] gap-6 px-10 border shadow-lg py-14 border-zinc-400 rounded-3xl backdrop-blur-md relative overflow-hidden">
          {/* Background Animation Layer */}
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-900 animate-gradient"></div>

          {/* Content Layer */}
          <div className="relative z-10 flex flex-col items-center animate-fadeIn">
            {/* Stylish Heading with Gradient */}
            <h1 className="text-[4vw] font-bold mb-6 tracking-widest bg-gradient-to-r from-orange-400 to-yellow-500 text-transparent bg-clip-text drop-shadow-lg">
              - INSTRUCTIONS -
            </h1>

            {/* Instruction Text with a Soft Glow Effect */}
            <p className="text-[3vw] font-light text-zinc-200 text-center tracking-wider transition-all duration-300 mb-5 hover:scale-105 hover:text-orange-300 drop-shadow-md">
              Only one person should be in the photo.
            </p>
            <p className="text-[3vw] font-light text-zinc-200 text-center tracking-wider transition-all duration-300 mb-5 hover:scale-105 hover:text-orange-300 drop-shadow-md">
              Stay still for a few seconds after tapping the screen for a clear
              photo.
            </p>
            <p className="text-[3vw] font-light text-zinc-200 text-center tracking-wider transition-all duration-300 hover:scale-105 hover:text-orange-300 drop-shadow-md">
              Keep your eye open for the best photo.
            </p>
          </div>
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
            <span className="text-[2vw] tracking-wider">
              Click Here to Start
            </span>

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
    </div>
  );
}

export default Instruction;
