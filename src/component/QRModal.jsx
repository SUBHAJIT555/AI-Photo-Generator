import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import PropTypes from "prop-types";
import { IoMdClose } from "react-icons/io";
import brandLogo from "../assets/logo/logo.webp";
import { LiquidGlassPanel } from "@/components/ui/GlassButton";
import { GlassIconButton } from "@/components/ui/GlassIconButton";
import { uploadPhotoForSoftCopy } from "../utils/uploadPhoto";

const LOGO_NATURAL_WIDTH = 3508;
const LOGO_NATURAL_HEIGHT = 2481;
const LOGO_DISPLAY_HEIGHT = 80;
const LOGO_DISPLAY_WIDTH = Math.round(
  (LOGO_NATURAL_WIDTH / LOGO_NATURAL_HEIGHT) * LOGO_DISPLAY_HEIGHT
);

function isHttpUrl(value) {
  return typeof value === "string" && /^https?:\/\//i.test(value);
}

const QRModal = ({ isOpen, onClose, data }) => {
  const [qrValue, setQrValue] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;

    const prepareQr = async () => {
      setError("");

      if (isHttpUrl(data)) {
        setQrValue(data);
        setStatus("ready");
        return;
      }

      if (typeof data === "string" && data.startsWith("data:")) {
        setStatus("uploading");
        const uploaded = await uploadPhotoForSoftCopy(data);
        if (cancelled) return;

        if (uploaded) {
          setQrValue(uploaded);
          setStatus("ready");
          return;
        }

        setStatus("error");
        setError(
          "Could not create soft copy link. Check that the kiosk can reach /upload.php, then try again."
        );
        return;
      }

      setStatus("error");
      setError("No image URL available for QR soft copy.");
    };

    prepareQr();

    return () => {
      cancelled = true;
    };
  }, [isOpen, data]);

  if (!isOpen) return null;

  return (
    <div
      className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black/70"
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()}>
        <LiquidGlassPanel className="relative w-full max-w-4xl items-stretch rounded-3xl px-8 pb-8 pt-5 !bg-[#1a1f24]/92 border border-white/15">
          <div className="flex w-full items-start justify-between gap-4 mb-6">
            <h2 className="flex-1 min-w-0 text-left text-[#ee3139] text-xl md:text-2xl font-cornea font-semibold leading-snug">
              Scan this QR for your soft copy
            </h2>
            <GlassIconButton onClick={onClose} className="shrink-0">
              <IoMdClose className="text-2xl text-white" />
            </GlassIconButton>
          </div>

          <div className="flex w-full min-h-[320px] justify-center items-center rounded-2xl bg-white p-4">
            {status === "uploading" && (
              <p className="text-[#ee3139] text-xl font-cornea">
                Preparing soft copy QR…
              </p>
            )}

            {status === "error" && (
              <p className="max-w-md text-center text-[#ee3139] text-lg font-cornea">
                {error}
              </p>
            )}

            {status === "ready" && qrValue && (
              <QRCodeSVG
                size={600}
                value={qrValue}
                fgColor="#C21820"
                bgColor="#FFFFFF"
                imageSettings={{
                  src: brandLogo,
                  height: LOGO_DISPLAY_HEIGHT,
                  width: LOGO_DISPLAY_WIDTH,
                  opacity: 1,
                  excavate: true,
                }}
              />
            )}
          </div>
        </LiquidGlassPanel>
      </div>
    </div>
  );
};

QRModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  data: PropTypes.string,
};

export default QRModal;
