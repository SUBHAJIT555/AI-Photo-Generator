import { useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import PropTypes from "prop-types";
import { IoMdClose } from "react-icons/io";
import blackLogo from "../assets/logo/The_Himalaya.webp";

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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl p-12 transition-all transform bg-[#fff]  rounded-lg shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute p-2 bg-[#006b6e] rounded-full border-2 border-[#fff] text-[#fff] top-4 right-4 hover:text-[#006b6e] hover:bg-[#fff] hover:border-[#006b6e]"
        >
          <IoMdClose />
        </button>

        <div className="mt-2">
          <div className="flex flex-col items-center space-y-4">
            {/*  */}
            <QRCodeSVG
              size={500}
              value={data}
              fgColor="#006b6e"
              bgColor="#fff"
              imageSettings={{
                src: blackLogo,
                x: undefined,
                y: undefined,
                height: 100,
                width: 100,
                opacity: 1,
                excavate: true,
              }}
            />
          </div>
        </div>
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
