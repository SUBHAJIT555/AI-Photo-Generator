import Logo from "../component/Logo";
import PageBackground from "../component/PageBackground";
import { IoHome, IoQrCode } from "react-icons/io5";
import { ImPrinter } from "react-icons/im";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import QRModal from "../component/QRModal";
import { useEffect, useState } from "react";
import { PDFDocument } from "pdf-lib";
import LoadingSwapping from "../component/LoadingSwapping";
import printingVideo from "../assets/printing.webm";
import { CameraGlassFrame } from "@/components/ui/CameraGlassFrame";
import { LiquidMetalButton } from "@/components/ui/LiquidMetalButton";

function Preview() {
  const navigate = useNavigate();
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const { resultUrl } = useLocation()?.state || {};
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [swaploader, setswaloader] = useState("none");
  const url = searchParams.get("resultUrl");

  const finalUrl = resultUrl || url;
  useEffect(() => {
    setswaloader(loading ? "block" : "none");
  }, [loading]);

  const uint8ArrayToBase64 = (uint8Array) => {
    let binary = "";
    const len = uint8Array.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(uint8Array[i]);
    }
    return btoa(binary);
  };

  const printImageAsPDF = async () => {
    try {
      setLoading(true);
      const response = await fetch(finalUrl);
      const imageBlob = await response.blob();
      const imageArrayBuffer = await imageBlob.arrayBuffer();

      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([288, 432]);

      const image = await pdfDoc.embedJpg(imageArrayBuffer);
      const { width, height } = image.scale(0.25);

      const x = (page.getWidth() - width) / 2;
      const y = (page.getHeight() - height) / 2;

      page.drawImage(image, { x, y, width, height });

      const pdfBytes = await pdfDoc.save();
      const pdfBase64 = uint8ArrayToBase64(new Uint8Array(pdfBytes));

      const apiKey = import.meta.env.VITE_PRINTNODE_API_KEY;
      const printerId = import.meta.env.VITE_PRINTNODE_PRINTER_ID;

      const printJob = {
        printerId: printerId,
        title: "PDF Print Job",
        contentType: "pdf_base64",
        content: pdfBase64,
        source: "React Web App",
        options: {
          fit_to_page: true,
        },
      };

      const responsePrint = await fetch("https://api.printnode.com/printjobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${btoa(apiKey + ":")}`,
        },
        body: JSON.stringify(printJob),
      });

      if (responsePrint.ok) {
        console.log("Print job sent successfully!");
      } else {
        console.error("Print failed:", await responsePrint.json());
      }
    } catch (error) {
      console.error("Error processing print job:", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 35000);
    }
  };

  return loading ? (
    <div className="w-full h-screen">
      <LoadingSwapping visibility={swaploader} src={printingVideo} />
    </div>
  ) : (
    <div className="min-h-screen w-full relative flex flex-col justify-evenly items-center overflow-hidden">
      <PageBackground />

      <div className="flex flex-col justify-evenly items-center w-full flex-1 relative z-[2] text-white px-4 min-h-screen">
        <div className="w-full pt-4">
          <Logo />
        </div>

        <CameraGlassFrame className="mx-auto">
          {finalUrl && (
            <img
              src={finalUrl}
              alt="Generated result"
              className="block w-full max-w-2xl min-h-[40vh] object-cover"
            />
          )}
        </CameraGlassFrame>

        <div className="flex flex-wrap gap-10 justify-center">
          <LiquidMetalButton
            viewMode="icon"
            large
            label="Print"
            onClick={printImageAsPDF}
          >
            <ImPrinter className="text-5xl text-[#e8e8e8] drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] md:text-6xl" />
          </LiquidMetalButton>

          <LiquidMetalButton
            viewMode="icon"
            large
            label="QR Code"
            onClick={() => setIsQRModalOpen(true)}
          >
            <IoQrCode className="text-5xl text-[#e8e8e8] drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] md:text-6xl" />
          </LiquidMetalButton>

          <LiquidMetalButton
            viewMode="icon"
            large
            label="Home"
            onClick={() => navigate("/")}
          >
            <IoHome className="text-5xl text-[#e8e8e8] drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] md:text-6xl" />
          </LiquidMetalButton>
        </div>

        <QRModal
          isOpen={isQRModalOpen}
          onClose={() => setIsQRModalOpen(false)}
          data={finalUrl}
        />
      </div>
    </div>
  );
}

export default Preview;
