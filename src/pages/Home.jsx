import { MdCamera } from "react-icons/md";
import { Link } from "react-router-dom";
import Logo from "../component/Logo";

function Home() {
  return (
    <div className="flex flex-col items-center w-full min-h-screen text-white  justify-evenly">
      <Logo />
      <div className="text-zinc-100 text-[8vw] flex justify-center items-center">
        <MdCamera />
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
