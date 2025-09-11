import Logo from "../component/Logo";
import AnimatedButton from "../component/AnimatedButton";
import CameraIcon from "../assets/logo/AI_photobooth_icon.png";
import BackgroundVideo from "../assets/logo/home.webm"; // Import your video file

function Home() {
  return (
    <div className="flex overflow-hidden relative flex-col justify-evenly items-center w-full h-screen min-h-screen text-white">
      {/* Background Video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-[1]"
        src={BackgroundVideo}
        autoPlay
        muted
        loop
      />

      {/* Logo */}
      <div className="z-[2] mb-[15vw]">
        <Logo />
      </div>

      {/* Icon */}
      <div className="text-zinc-100 text-[8vw] flex justify-center items-center">
        <img className="w-[15vw]" src={CameraIcon} alt="Camera Icon" />
      </div>

      {/* Start Button */}
      <div className="flex justify-center items-center">
        <AnimatedButton text="Start" to="/instruction" />
      </div>
    </div>
  );
}

export default Home;
