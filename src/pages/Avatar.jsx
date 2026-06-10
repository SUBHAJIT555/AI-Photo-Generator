import Logo from "../component/Logo";
import Lightfall from "../component/Lightfall";
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
import { GlassButton, LiquidGlassPanel } from "@/components/ui/GlassButton";
import { AvatarGlassCard } from "@/components/ui/AvatarGlassCard";

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
    <div className="min-h-screen w-full relative flex flex-col justify-center items-center overflow-hidden">
      <div className="absolute inset-0 z-[-1]">
        <Lightfall
          colors={["#9CB8C8", "#4F758B", "#FFFFFF"]}
          backgroundColor="#4F758B"
          speed={0.5}
          streakCount={2}
          streakWidth={1}
          streakLength={1}
          glow={1}
          density={0.6}
          twinkle={1}
          zoom={3}
          backgroundGlow={0.5}
          opacity={1}
          mouseInteraction
          mouseStrength={0.5}
          mouseRadius={1}
        />
      </div>

      <div className="flex flex-col justify-evenly items-center w-full flex-1 relative z-[2] px-4 py-4">
        <Logo />

        <div className="grid grid-cols-[1fr_auto_1fr] items-center w-full max-w-[90vw] px-[10vw] mb-[15vw]">
          <span className="text-[3.5vw] font-golonto tracking-wide text-white justify-self-end pr-3">
            Male
          </span>
          <ShamayimGenderToggle
            checked={gender === "female"}
            onChange={(isFemale) => setGender(isFemale ? "female" : "male")}
          />
          <span className="text-[3.5vw] font-golonto tracking-wide text-white justify-self-start pl-3">
            Female
          </span>
        </div>

        <div className="grid grid-cols-3 gap-10 justify-items-center items-start w-full px-[10vw] mb-[20vw]">
          {(gender === "male" ? maleImages : femaleImages).map(
            (avatar, index) => (
              <AvatarGlassCard
                key={index}
                selected={avatar.id === selectedAvatarId}
                onClick={() => handleAvatarSelect(avatar.id)}
              >
                <div className="relative rounded-xl overflow-hidden border-[4px] border-white">
                  <div className="h-[calc(85%-75px)] w-full overflow-hidden rounded-lg">
                    <img
                      src={avatar.url}
                      alt={`Avatar ${index + 1}`}
                      className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                      style={{ marginBottom: "-75px" }}
                    />
                  </div>
                  {avatar.id === selectedAvatarId && (
                    <>
                      <div
                        className="absolute inset-0 rounded-xl pointer-events-none"
                        style={{
                          backgroundImage:
                            "radial-gradient(circle at 1.5px 1.5px, rgba(79, 117, 139, 0.45) 1px, transparent 0)",
                          backgroundSize: "3px 3px",
                          backgroundPosition: "0 0",
                        }}
                      />
                      <div className="overflow-hidden absolute inset-0 rounded-xl pointer-events-none">
                        <div className="absolute -left-full top-0 h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shine_1.5s_infinite]" />
                      </div>
                    </>
                  )}
                </div>
              </AvatarGlassCard>
            ),
          )}
        </div>
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
        <GlassButton
          onClick={() => {
            if (loading) return;
            if (!selectedAvatarId || selectedAvatarId === null) {
              setShowSelectAvatarPrompt(true);
              return;
            }
            handleSwap();
          }}
          disabled={loading}
          size="lg"
          contentClassName="px-10 py-5 text-[4vw] uppercase font-extrabold tracking-wide"
          className={cn(loading && "opacity-60 cursor-not-allowed pointer-events-none")}
        >
          {loading ? "Loading..." : "Click to generate"}
        </GlassButton>

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
            <div onClick={(e) => e.stopPropagation()}>
              <LiquidGlassPanel className="max-w-xl w-full rounded-3xl p-6 text-center">
              <p id="select-avatar-title" className="text-[#4F758B] text-2xl font-semibold mb-10 text-center font-cornea">
                <span className="inline-flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="shrink-0 inline-block align-middle text-[#4F758B]" aria-hidden="true">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M12 2c5.523 0 10 4.477 10 10a10 10 0 0 1 -19.995 .324l-.005 -.324l.004 -.28c.148 -5.393 4.566 -9.72 9.996 -9.72zm0 9h-1l-.117 .007a1 1 0 0 0 0 1.986l.117 .007v3l.007 .117a1 1 0 0 0 .876 .876l.117 .007h1l.117 -.007a1 1 0 0 0 .876 -.876l.007 -.117l-.007 -.117a1 1 0 0 0 -.764 -.857l-.112 -.02l-.117 -.006v-3l-.007 -.117a1 1 0 0 0 -.876 -.876l-.117 -.007zm.01 -3l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007z" />
                  </svg>
                  Please select one avatar to generate.
                </span>
              </p>
              <GlassButton
                onClick={() => setShowSelectAvatarPrompt(false)}
                size="lg"
                contentClassName="w-full py-3 px-4 uppercase font-semibold"
                className="w-full"
              >
                OK
              </GlassButton>
              </LiquidGlassPanel>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Avatar;
