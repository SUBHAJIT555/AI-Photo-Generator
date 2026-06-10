import { useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import PropTypes from "prop-types";
import { IoMdClose } from "react-icons/io";
import blackLogo from "../assets/logo/talabat-icon.svg";
import { LiquidGlassPanel } from "@/components/ui/GlassButton";
import { GlassIconButton } from "@/components/ui/GlassIconButton";

const QRModal = ({ isOpen, onClose, data }) => {
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

  if (!isOpen) return null;

  return (
    <div
      className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black/70"
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()}>
        <LiquidGlassPanel className="relative w-full max-w-4xl items-stretch rounded-3xl px-8 pb-8 pt-5">
          <div className="flex w-full items-start justify-between gap-4 mb-6">
            <h2 className="flex-1 min-w-0 text-left text-[#4F758B] text-xl md:text-2xl font-cornea font-semibold leading-snug">
              Scan this QR for your soft copy
            </h2>
            <GlassIconButton onClick={onClose} className="shrink-0">
              <IoMdClose className="text-2xl" />
            </GlassIconButton>
          </div>

          <div className="flex w-full justify-center">
            <QRCodeSVG
                size={600}
                value={data}
                fgColor="#4F758B"
                bgColor="#F4EDE3"
                imageSettings={{
                  src: blackLogo,
                  x: undefined,
                  y: undefined,
                  height: 90,
                  width: 90,
                  opacity: 1,
                  excavate: true,
                }}
              />
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
