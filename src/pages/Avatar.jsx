import Logo from "../component/Logo";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { cn } from "../utils/cn";
import { getData } from "../utils/localStorageDB";
import toast from "react-hot-toast";
import useAxiosPublic from "../hooks/useAxios";

import BGImage from "../assets/logo/BG.jpg";
import LoadingSwapping from "../component/LoadingSwapping";

// Dynamically import all avatars
const maleAvatars = import.meta.glob("../assets/Avatars/male-*.png", {
  eager: true,
});
const femaleAvatars = import.meta.glob("../assets/Avatars/female-*.png", {
  eager: true,
});

function Avatar() {
  const [gender, setGender] = useState("male");
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const publicAxios = useAxiosPublic();
  const [swaploader, Setswaloader] = useState("none");

  const navigate = useNavigate();

  const [maleImages, setMaleImages] = useState([]);
  const [femaleImages, setFemaleImages] = useState([]);

  useEffect(() => {
    setMaleImages(Object.values(maleAvatars).map((img) => img.default));
    setFemaleImages(Object.values(femaleAvatars).map((img) => img.default));
  }, []);

  const convertToBase64 = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Error converting image to base64:", error);
      return null;
    }
  };

  const handleSwap = async () => {
    try {
      setLoading(true);
      if (selectedImage) {
        const targetBase64 = await convertToBase64(selectedImage);
        const capturedImage = await getData("capturedImage");

        if (!capturedImage) {
          toast.success("Please capture an image first");
          return;
        }

        const formData = new FormData();
        formData.append("source", capturedImage);
        formData.append("target", targetBase64);

        const data = await publicAxios.post("faceswap_handler.php", formData);

        if (data?.data?.result_url) {
          navigate(`/preview?resultUrl=${data.data.result_url}`, {
            state: {
              resultUrl: data.data.result_url,
            },
          });
        }
      }
    } catch (error) {
      console.error("Error swapping images:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Setswaloader(loading ? "block" : "none");
  }, [loading]);

  return loading ? (
    <div className="w-full h-screen ">
      <LoadingSwapping visibility={swaploader} />
    </div>
  ) : (
    <div
      className="flex flex-col items-center justify-center w-full h-screen gap-10 py-10 bg-center bg-repeat bg-cover "
      style={{ backgroundImage: `url(${BGImage})` }}
    >
      <div className="mb-[8vw]">
        <Logo />
      </div>

      {/* Magical Toggle Button */}
      <div className="flex items-center gap-4 mb-[4vw]">
        <span className="text-[3vw] text-white">Male</span>
        <div
          className={`relative w-[15vw] h-[5vw] flex items-center bg-gray-800 border-2 border-gray-600 rounded-full transition-all duration-300 ${
            gender === "female"
              ? "border-pink-500 shadow-[0_0_15px_pink]"
              : "border-blue-500 shadow-[0_0_15px_blue]"
          }`}
        >
          <input
            type="checkbox"
            className="absolute w-full h-full opacity-0 cursor-pointer"
            checked={gender === "female"}
            onChange={() => setGender(gender === "male" ? "female" : "male")}
          />
          <div
            className={`absolute left-1 w-[5vw] h-[5vw] rounded-full transition-all duration-500 transform shadow-lg ${
              gender === "female"
                ? "translate-x-[9vw] bg-pink-400"
                : "bg-blue-400"
            }`}
          >
            {[...Array(6)].map((_, i) => (
              <span
                key={i}
                className="absolute block bg-white rounded-full opacity-50"
                style={{
                  width: `${Math.random() * 4 + 2}px`,
                  height: `${Math.random() * 4 + 2}px`,
                  top: `${Math.random() * 80}%`,
                  left: `${Math.random() * 80}%`,
                  animation: `sparkle-animation ${
                    Math.random() * 3 + 2
                  }s linear infinite`,
                }}
              />
            ))}
          </div>
        </div>
        <span className="text-[3vw] text-white">Female</span>
      </div>

      {/* Avatar Grid */}
      <div
        className={cn(
          "grid justify-center items-center gap-10 grid-cols-3 px-[10vw] w-full"
        )}
      >
        {(gender === "male" ? maleImages : femaleImages).map(
          (avatar, index) => (
            <div
              key={index}
              className={cn(
                "group relative w-full max-w-[400px] mx-auto rounded-xl overflow-hidden cursor-pointer",
                avatar === selectedImage ? "border-2 border-zinc-200" : ""
              )}
              onClick={() => setSelectedImage(avatar)}
            >
              <div className="h-[85%] w-full overflow-hidden rounded-t-xl bg-gray-200">
                <img
                  src={avatar}
                  alt={`Avatar ${index + 1}`}
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </div>
          )
        )}
      </div>

      {/* Swap Button */}
      <button
        onClick={handleSwap}
        disabled={!selectedImage || loading}
        className={cn(
          "relative capitalize text-zinc-200 tracking-tight font-light py-2 px-5 rounded-full border-2 border-transparent overflow-hidden transition-all duration-300",
          selectedImage || loading
            ? "bg-indigo-600 hover:bg-indigo-800 hover:border-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.8)]"
            : "bg-gray-500 cursor-not-allowed",
          loading && "opacity-50 cursor-not-allowed"
        )}
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
        {loading ? (
          <span className="animate-pulse">Loading...</span>
        ) : (
          <span className="tracking-wider text-[2vw]">Swap</span>
        )}

        <style>
          {`
      @keyframes sparkle-animation {
        0% { transform: translate(0, 0) scale(1); opacity: 1; }
        100% { transform: translate(300%, -50%) scale(0.5); opacity: 0; }
      }
      @keyframes pulse-glow {
        0% { box-shadow: 0 0 10px rgba(99, 102, 241, 0.8); }
        50% { box-shadow: 0 0 20px rgba(99, 102, 241, 1); }
        100% { box-shadow: 0 0 10px rgba(99, 102, 241, 0.8); }
      }
    `}
        </style>
      </button>

      <style>
        {`
          @keyframes sparkle-animation {
            0% { transform: translate(0, 0) scale(1); opacity: 1; }
            100% { transform: translate(300%, -50%) scale(0.5); opacity: 0; }
          }
        `}
      </style>
    </div>
  );
}

export default Avatar;
