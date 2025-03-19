import { MdCamera } from "react-icons/md";
import { Link } from "react-router-dom";
import Logo from "../component/Logo";
import aiPhotoboothIcon from "../assets/logo/AI_photobooth_icon.png";

function Home() {
  return (
    <div className="flex flex-col items-center w-full h-screen min-h-screen text-white bg-gradient-to-t from-blue-900 via-black to-gray-900 justify-evenly">
      <Logo />
      <div className="flex items-center justify-center w-[30vw] ">
        <img src={aiPhotoboothIcon} alt="AI Photobooth Icon" />
      </div>
      <div className="flex items-center justify-center">
        <Link to="/instruction">
          <button className="px-5 py-3 font-light tracking-tight capitalize border-2 border-transparent rounded-full text-zinc-200 bg-zinc-700 hover:bg-zinc-900 hover:border-zinc-200">
            click here to start
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
