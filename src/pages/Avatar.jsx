import Logo from "../component/Logo";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { cn } from "../utils/cn";
import { getData } from "../utils/localStorageDB";
import toast from "react-hot-toast";
import useAxiosPublic from "../hooks/useAxios";
import loadingVideo from "../assets/loading.webm";
import LoadingSwapping from "../component/LoadingSwapping";
import { avatarMap } from "../constant/avatar";
import { ShamayimGenderToggle } from "@/components/ui/shamayim-toggle-switch";
import { ShinyButton } from "./shiny-button";

// Dynamically import all avatars
const maleAvatars = import.meta.glob("../assets/Avatars/male-*.png", {
  eager: true,
});
const femaleAvatars = import.meta.glob("../assets/Avatars/female-*.png", {
  eager: true,
});

// normalize to filename → url
function normalizeGlob(globResult) {
  return Object.fromEntries(
    Object.entries(globResult).map(([path, mod]) => {
      const fileName = path.split("/").pop(); // e.g. "male-01.png"
      return [fileName, mod.default];
    }),
  );
}

const maleAvatarMap = normalizeGlob(maleAvatars);
const femaleAvatarMap = normalizeGlob(femaleAvatars);

// use avatarMap to build arrays
const maleImages = Object.entries(avatarMap)
  .filter(([key]) => key.startsWith("male"))
  .map(([id, fileName]) => ({
    id,
    url: maleAvatarMap[fileName],
  }));

const femaleImages = Object.entries(avatarMap)
  .filter(([key]) => key.startsWith("female"))
  .map(([id, fileName]) => ({
    id,
    url: femaleAvatarMap[fileName],
  }));

function Avatar() {
  const [gender, setGender] = useState("male");

  const [selectedAvatarId, setSelectedAvatarId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSelectAvatarPrompt, setShowSelectAvatarPrompt] = useState(false);
  const publicAxios = useAxiosPublic();
  const [swaploader, setswaloader] = useState("none");

  const navigate = useNavigate();

  const handleAvatarSelect = (avatarId) => {
    setSelectedAvatarId(avatarId);
  };

  // const convertToBase64 = async (imageUrl) => {
  //   try {
  //     const response = await fetch(imageUrl);
  //     const blob = await response.blob();
  //     return new Promise((resolve, reject) => {
  //       const reader = new FileReader();
  //       reader.onloadend = () => resolve(reader.result);
  //       reader.onerror = reject;
  //       reader.readAsDataURL(blob);
  //     });
  //   } catch (error) {
  //     console.error("Error converting image to base64:", error);
  //     return null;
  //   }
  // };

  // const handleMouseDown = (event) => {
  //   createRipple(event);
  // };

  // const handleTouchStart = (event) => {
  //   createRipple(event.touches[0]);
  // };

  const handleSwap = async () => {
    try {
      setLoading(true);
      if (selectedAvatarId && selectedAvatarId !== null) {
        const capturedImage = await getData("capturedImage");

        if (!capturedImage) {
          toast.success("Please capture an image first");
          return;
        }

        const formData = {
          source: capturedImage,
          avatar_id: selectedAvatarId,
        };
        // Start timer
        const start = performance.now();
        const response = await publicAxios.post("swap.php", formData);
        // End timer
        const end = performance.now();
        const elapsed = ((end - start) / 1000).toFixed(2); // seconds
        console.log(`Swap API took ${elapsed} seconds`);

        const data = response.data;
        console.log(data);

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
    setswaloader(loading ? "block" : "none");
  }, [loading]);

  return loading ? (
    <div className="w-full h-screen">
      <LoadingSwapping visibility={swaploader} src={loadingVideo} />
    </div>
  ) : (
    <div className="min-h-screen w-full bg-white relative flex flex-col justify-center items-center overflow-hidden">
      {/* Dashed Bottom Fade Grid - on top of glow */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          backgroundImage: `
        linear-gradient(to right, #FF5900 1px, transparent 1px),
        linear-gradient(to bottom, #FF5900 1px, transparent 1px)
      `,
          backgroundSize: "10px 10px",
          backgroundPosition: "0 0, 0 0",
          opacity: 0.3,
          maskImage: `
         repeating-linear-gradient(
              to right,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            repeating-linear-gradient(
              to bottom,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            radial-gradient(ellipse 100% 80% at 50% 100%, #000 50%, transparent 90%)
      `,
          WebkitMaskImage: `
  repeating-linear-gradient(
              to right,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            repeating-linear-gradient(
              to bottom,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            radial-gradient(ellipse 100% 80% at 50% 100%, #000 50%, transparent 90%)
      `,
          maskComposite: "intersect",
          WebkitMaskComposite: "source-in",
        }}
      />

      {/* Amber-style glow background */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(125% 125% at 50% 90%, #ffffff 40%, #FF5900 100%)
          `,
          backgroundSize: "100% 100%",
        }}
      />

      <div className="flex flex-col gap-10 justify-center items-center py-10 w-full flex-1 relative z-[2] px-4">
        <div className="mb-[4vw]">
          <Logo />
        </div>

        {/* Gender toggle – Shamayim style, orange dots, Male/Female icons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-[15vw] w-full">
          <span className="text-[3.5vw] font-golonto tracking-wide text-neutral-700">
            Male
          </span>
          <ShamayimGenderToggle
            checked={gender === "female"}
            onChange={(isFemale) => setGender(isFemale ? "female" : "male")}
          />
          <span className="text-[3.5vw] font-golonto tracking-wide text-neutral-700">
            Female
          </span>
        </div>

        {/* Avatar Grid */}
        <div
          className={cn(
            "grid grid-cols-3 gap-10 justify-center items-center w-full px-[10vw] mb-[20vw]",
          )}
        >
          {(gender === "male" ? maleImages : femaleImages).map(
            (avatar, index) => (
              <div
                key={index}
                className={cn(
                  "group relative w-full max-w-[400px] mx-auto rounded-2xl cursor-none",
                  avatar.id === selectedAvatarId
                    ? "ring-2 ring-offset-8 ring-orange-500 ring-offset-orange-500"
                    : "ring-1 ring-offset-8 ring-neutral-300",
                )}
                onClick={() => handleAvatarSelect(avatar.id)}
              >
                <div className="relative rounded-2xl overflow-hidden">
                  <div className="h-[calc(85%-75px)] w-full overflow-hidden rounded-2xl border border-neutral-300">
                    <img
                      src={avatar.url}
                      alt={`Avatar ${index + 1}`}
                      className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                      style={{ marginBottom: "-75px" }}
                    />
                  </div>
                  {avatar.id === selectedAvatarId && (
                    <>
                      {/* Dotted / dither pattern overlay (3px grid like GlowButton backdrop) */}
                      <div
                        className="absolute inset-0 rounded-2xl pointer-events-none"
                        style={{
                          backgroundImage:
                            "radial-gradient(circle at 1.5px 1.5px, rgba(255, 89, 0, 0.4) 1px, transparent 0)",
                          backgroundSize: "3px 3px",
                          backgroundPosition: "0 0",
                        }}
                      />
                      <div className="overflow-hidden absolute inset-0 rounded-xl pointer-events-none">
                        <div className="absolute -left-full top-0 h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shine_1.5s_infinite]"></div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ),
          )}
        </div>
        {/* Avatar Grid */}
        {/* <div className="w-full px-[10vw] mb-[20vw]">

        <div
          className={cn(
            "grid grid-cols-3 gap-10 justify-center items-center transition-opacity duration-300",
            gender === "male"
              ? "opacity-100"
              : "opacity-0 absolute pointer-events-none"
          )}
        >
          {maleImages.map((avatar, index) => (
            <div
              key={`male-${index}`}
              className={cn(
                "group relative w-full max-w-[400px] mx-auto rounded-2xl overflow-hidden cursor-pointer",
                avatar.id === selectedAvatarId ? "border-4 border-zinc-200" : ""
              )}
              onClick={() => handleAvatarSelect(avatar.id)}
            >
              <div className="h-[calc(85%-75px)] w-full overflow-hidden rounded-xl">
                <img
                  src={avatar.url}
                  alt={`Male Avatar ${index + 1}`}
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                  style={{ marginBottom: "-75px" }}
                  loading="lazy"
                />
              </div>
              {avatar.id === selectedAvatarId && (
                <div className="overflow-hidden absolute inset-0 rounded-xl pointer-events-none">
                  <div className="absolute -left-full top-0 h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shine_1.5s_infinite]" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div
          className={cn(
            "grid grid-cols-3 gap-10 justify-center items-center transition-opacity duration-300",
            gender === "female"
              ? "opacity-100"
              : "opacity-0 absolute pointer-events-none"
          )}
        >
          {femaleImages.map((avatar, index) => (
            <div
              key={`female-${index}`}
              className={cn(
                "group relative w-full max-w-[400px] mx-auto rounded-2xl overflow-hidden cursor-pointer",
                avatar.id === selectedAvatarId ? "border-4 border-zinc-200" : ""
              )}
              onClick={() => handleAvatarSelect(avatar.id)}
            >
              <div className="h-[calc(85%-75px)] w-full overflow-hidden rounded-xl">
                <img
                  src={avatar.url}
                  alt={`Female Avatar ${index + 1}`}
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                  style={{ marginBottom: "-75px" }}
                  loading="lazy"
                />
              </div>
              {avatar.id === selectedAvatarId && (
                <div className="overflow-hidden absolute inset-0 rounded-xl pointer-events-none">
                  <div className="absolute -left-full top-0 h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shine_1.5s_infinite]" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div> */}

        {/* Swap / Generate Button */}
        <ShinyButton
          onClick={() => {
            if (loading) return;
            if (!selectedAvatarId || selectedAvatarId === null) {
              setShowSelectAvatarPrompt(true);
              return;
            }
            handleSwap();
          }}
          className={cn(loading && "opacity-60 cursor-not-allowed pointer-events-none")}
        >
          {loading ? "Loading..." : "Click to generate"}
        </ShinyButton>

        {/* Centered popup when clicking generate without selecting an avatar */}
        {showSelectAvatarPrompt && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setShowSelectAvatarPrompt(false)}
            onKeyDown={(e) => e.key === "Escape" && setShowSelectAvatarPrompt(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="select-avatar-title"
          >
            <div
              className="bg-white rounded-2xl shadow-xl max-w-xl w-full p-6 text-center border-2 border-[#FF5900] ring-2 ring-offset-8 ring-[#FF5900]"
              onClick={(e) => e.stopPropagation()}
            >
              <p id="select-avatar-title" className="text-neutral-800 text-2xl font-semibold mb-10 text-center">
                <span className="inline-flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="shrink-0 inline-block align-middle text-[#FF5900]" aria-hidden="true">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M12 2c5.523 0 10 4.477 10 10a10 10 0 0 1 -19.995 .324l-.005 -.324l.004 -.28c.148 -5.393 4.566 -9.72 9.996 -9.72zm0 9h-1l-.117 .007a1 1 0 0 0 0 1.986l.117 .007v3l.007 .117a1 1 0 0 0 .876 .876l.117 .007h1l.117 -.007a1 1 0 0 0 .876 -.876l.007 -.117l-.007 -.117a1 1 0 0 0 -.764 -.857l-.112 -.02l-.117 -.006v-3l-.007 -.117a1 1 0 0 0 -.876 -.876l-.117 -.007zm.01 -3l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007z" />
                  </svg>
                  Please select one avatar to generate.
                </span>
              </p>
              <button
                type="button"
                onClick={() => setShowSelectAvatarPrompt(false)}
                className="w-full py-3 px-4 rounded-xl bg-[#FF5900] text-white font-semibold hover:opacity-90 transition-opacity"
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Avatar;
