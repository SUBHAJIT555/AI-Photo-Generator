
import { useEffect, useState } from "react";
import Logo from "../component/Logo";
import BGImage from "../assets/logo/BG.webp";
import AnimatedButton from "../component/AnimatedButton";

function Instruction() {
  const [activeIndex, setActiveIndex] = useState(0);
  // const buttonRef = useRef(null);
  const instructions = [
    "Only one person should be in the photo.",
    "Stay still for a few seconds after tapping the screen for a clear photo.",
    "Keep your eye open for the best photo.",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % instructions.length);
    }, 2000); // Change every 2 seconds

    return () => clearInterval(interval);
  }, [instructions.length]);

  // const createRipple = (event) => {
  //   const button = buttonRef.current;
  //   const rect = button.getBoundingClientRect();
  //   const size = Math.max(rect.width, rect.height);
  //   const x = event.clientX - rect.left - size / 2;
  //   const y = event.clientY - rect.top - size / 2;

  //   const ripple = document.createElement("div");
  //   ripple.style.cssText = `
  //     position: absolute;
  //     width: ${size}px;
  //     height: ${size}px;
  //     left: ${x}px;
  //     top: ${y}px;
  //     background: rgba(255, 255, 255, 0.4);
  //     border-radius: 50%;
  //     transform: scale(0);
  //     animation: ripple 0.6s linear;
  //     pointer-events: none;
  //     z-index: 1;
  //   `;

  //   button.appendChild(ripple);

  //   setTimeout(() => {
  //     ripple.remove();
  //   }, 600);
  // };

  // const handleTouchStart = (event) => {
  //   createRipple(event.touches[0]);
  // };

  // const handleMouseDown = (event) => {
  //   createRipple(event);
  // };

  return (
    <div
      className="flex flex-col justify-evenly items-center w-full h-screen min-h-screen text-white bg-center bg-cover"
      style={{ backgroundImage: `url(${BGImage})` }}
    >
      <div className="flex flex-col justify-evenly items-center w-full h-screen">
        <Logo />
        <div className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 blur-3xl left-10 top-[50vw] animate-float-scale"></div>

        <div className="flex flex-col items-center justify-center w-[60vw] gap-6 px-10  shadow-lg py-14 border-zinc-400 rounded-3xl backdrop-blur-md relative overflow-hidden">
          {/* Background Animation Layer */}
          {/* glass effect background for instraction  */}
          <div className="absolute inset-0 z-0 bg-gradient-to-br to-transparent backdrop-blur-3xl from-white/10 via-white/5 bg-zinc-800/20 animate-gradient" />

          {/* Content Layer */}
          <div className="flex relative z-10 flex-col items-center animate-fadeIn">
            {/* Stylish Heading with Gradient */}
            <h1 className="text-[4vw] mb-[5vw] font-grotesk font-bold tracking-wide bg-gradient-to-r from-orange-400 to-yellow-500 text-transparent bg-clip-text drop-shadow-lg ">
              INSTRUCTIONS
            </h1>

            {/* Instruction Text with a Soft Glow Effect */}
            {instructions.map((text, index) => (
              <p
                key={index}
                className={`text-[3vw]  text-zinc text-center font-grotesk transition-all duration-300 mb-[4vw] drop-shadow-md leading-[3.5vw]  ${
                  activeIndex === index
                    ? "scale-105 text-orange-300 font-extrabold"
                    : ""
                }`}
              >
                {text}
              </p>
            ))}
          </div>
        </div>

        <div className="flex justify-center items-center">
          <AnimatedButton 
            text="Click Here to Start" 
            to="/capture"
            className="text-[4vw] tracking-widest font-grotesk uppercase font-extrabold"
          />
        </div>
      </div>
    </div>
  );
}

export default Instruction;
