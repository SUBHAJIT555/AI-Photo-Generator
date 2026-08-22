import Logo from "../component/Logo";
import PageBackground from "../component/PageBackground";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { cn } from "../utils/cn";
import { getData } from "../utils/localStorageDB";
import toast from "react-hot-toast";
import useAxiosPublic from "../hooks/useAxios";
import loadingVideo from "../assets/loading.webm";
import LoadingSwapping from "../component/LoadingSwapping";
import { ShamayimGenderToggle } from "@/components/ui/shamayim-toggle-switch";
import { LiquidGlassPanel } from "@/components/ui/GlassButton";
import { LiquidMetalButton } from "@/components/ui/LiquidMetalButton";
import { AvatarGlassCard } from "@/components/ui/AvatarGlassCard";

import male01 from "../assets/Avatars/male-01.webp";
import male02 from "../assets/Avatars/male-02.webp";
import male03 from "../assets/Avatars/male-03.webp";
import male04 from "../assets/Avatars/male-04.webp";
import male05 from "../assets/Avatars/male-05.webp";
import male06 from "../assets/Avatars/male-06.webp";
import female01 from "../assets/Avatars/female-01.webp";
import female02 from "../assets/Avatars/female-02.webp";
import female03 from "../assets/Avatars/female-03.webp";
import female04 from "../assets/Avatars/female-04.webp";
import female05 from "../assets/Avatars/female-05.webp";
import female06 from "../assets/Avatars/female-06.webp";

const maleImages = [
  { id: "male1", url: male01 },
  { id: "male2", url: male02 },
  { id: "male3", url: male03 },
  { id: "male4", url: male04 },
  { id: "male5", url: male05 },
  { id: "male6", url: male06 },
];

const femaleImages = [
  { id: "female1", url: female01 },
  { id: "female2", url: female02 },
  { id: "female3", url: female03 },
  { id: "female4", url: female04 },
  { id: "female5", url: female05 },
  { id: "female6", url: female06 },
];

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
      <PageBackground />

      <div className="flex flex-col justify-evenly items-center w-full flex-1 relative z-[2] px-4 py-4">
        <div className="w-full">
          <Logo />
        </div>

        <h1 className="w-full text-center text-white text-[5vw] md:text-5xl font-cornea font-bold tracking-wide drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)] mb-4">
          Choose Your Avatar
        </h1>

        <div className="grid grid-cols-[1fr_auto_1fr] items-center w-full max-w-[90vw] px-[10vw] mb-[10vw]">
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

        <div className="relative w-full px-[10vw] mb-[20vw]">
          <div
            className={cn(
              "grid grid-cols-3 gap-10 justify-items-center items-start w-full transition-opacity duration-300",
              gender === "male"
                ? "relative z-10 opacity-100"
                : "absolute inset-0 opacity-0 pointer-events-none",
            )}
            aria-hidden={gender !== "male"}
          >
            {maleImages.map((avatar, index) => (
              <AvatarGlassCard
                key={avatar.id}
                selected={avatar.id === selectedAvatarId}
                onClick={() => handleAvatarSelect(avatar.id)}
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl border-[4px] border-white">
                  <img
                    src={avatar.url}
                    alt={`Male avatar ${index + 1}`}
                    className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                    decoding="async"
                  />
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
            ))}
          </div>

          <div
            className={cn(
              "grid grid-cols-3 gap-10 justify-items-center items-start w-full transition-opacity duration-300",
              gender === "female"
                ? "relative z-10 opacity-100"
                : "absolute inset-0 opacity-0 pointer-events-none",
            )}
            aria-hidden={gender !== "female"}
          >
            {femaleImages.map((avatar, index) => (
              <AvatarGlassCard
                key={avatar.id}
                selected={avatar.id === selectedAvatarId}
                onClick={() => handleAvatarSelect(avatar.id)}
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl border-[4px] border-white">
                  <img
                    src={avatar.url}
                    alt={`Female avatar ${index + 1}`}
                    className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                    decoding="async"
                  />
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
            ))}
          </div>
        </div>

        <LiquidMetalButton
          label={loading ? "Loading..." : "Click to Generate"}
          large
          onClick={() => {
            if (loading) return;
            if (!selectedAvatarId || selectedAvatarId === null) {
              setShowSelectAvatarPrompt(true);
              return;
            }
            handleSwap();
          }}
          disabled={loading}
          labelClassName="uppercase tracking-widest font-extrabold"
        />

        {/* Centered popup when clicking generate without selecting an avatar */}
        {showSelectAvatarPrompt && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setShowSelectAvatarPrompt(false)}
            onKeyDown={(e) =>
              e.key === "Escape" && setShowSelectAvatarPrompt(false)
            }
            role="dialog"
            aria-modal="true"
            aria-labelledby="select-avatar-title"
          >
            <div onClick={(e) => e.stopPropagation()}>
              <LiquidGlassPanel className="max-w-xl w-full rounded-3xl p-6 text-center">
                <p
                  id="select-avatar-title"
                  className="text-[#4F758B] text-2xl font-semibold mb-10 text-center font-cornea"
                >
                  <span className="inline-flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="shrink-0 inline-block align-middle text-[#4F758B]"
                      aria-hidden="true"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M12 2c5.523 0 10 4.477 10 10a10 10 0 0 1 -19.995 .324l-.005 -.324l.004 -.28c.148 -5.393 4.566 -9.72 9.996 -9.72zm0 9h-1l-.117 .007a1 1 0 0 0 0 1.986l.117 .007v3l.007 .117a1 1 0 0 0 .876 .876l.117 .007h1l.117 -.007a1 1 0 0 0 .876 -.876l.007 -.117l-.007 -.117a1 1 0 0 0 -.764 -.857l-.112 -.02l-.117 -.006v-3l-.007 -.117a1 1 0 0 0 -.876 -.876l-.117 -.007zm.01 -3l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007z" />
                    </svg>
                    Please select one avatar to generate.
                  </span>
                </p>
                <LiquidMetalButton
                  label="OK"
                  large
                  onClick={() => setShowSelectAvatarPrompt(false)}
                  labelClassName="uppercase tracking-widest font-extrabold"
                  className="w-full flex justify-center"
                />
              </LiquidGlassPanel>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Avatar;
