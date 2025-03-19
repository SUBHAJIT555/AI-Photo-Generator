import { Link } from "react-router-dom";
import Logo from "../component/Logo";
import CameraIcon from "../assets/logo/AI_photobooth_icon.png";

function Home() {
  return (
    <div className="flex flex-col items-center w-full h-screen min-h-screen text-white justify-evenly">
      <Logo />
      <div className="text-zinc-100 text-[8vw] flex justify-center items-center">
        <img className="w-[15vw]" src={CameraIcon} alt="" />
      </div>
      <div className="flex items-center justify-center">
        <Link to="/instruction">
          <button
            className="relative px-5 py-3 font-light tracking-tight capitalize border-2 border-transparent rounded-full text-zinc-200 bg-indigo-600 transition-all duration-300 overflow-hidden shadow-[0_0_10px_rgba(99,102,241,0.6)] 
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
            <span className="tracking-wider text-[2vw]">
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

export default Home;
