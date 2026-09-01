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
import { getData } from "../utils/localStorageDB";

function isHttpUrl(value) {
  return typeof value === "string" && /^https?:\/\//i.test(value);
}

function detectImageFormat(bytes, hintUrl = "") {
  if (bytes?.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "jpg";
  }
  if (
    bytes?.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  ) {
    return "png";
  }
  if (typeof hintUrl === "string") {
    if (hintUrl.startsWith("data:image/png") || /\.png(\?|$)/i.test(hintUrl)) {
      return "png";
    }
    if (
      hintUrl.startsWith("data:image/jpeg") ||
      hintUrl.startsWith("data:image/jpg") ||
      /\.jpe?g(\?|$)/i.test(hintUrl)
    ) {
      return "jpg";
    }
  }
  return "jpg";
}

async function loadImageBytes(source) {
  if (!source || typeof source !== "string") {
    throw new Error("No image source for print");
  }

  if (source.startsWith("data:")) {
    const comma = source.indexOf(",");
    if (comma < 0) throw new Error("Invalid data URL");
    const base64 = source.slice(comma + 1);
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return { bytes, hintUrl: source };
  }

  const response = await fetch(source);
  if (!response.ok) {
    throw new Error(`Failed to fetch image (${response.status})`);
  }
  const buffer = await response.arrayBuffer();
  return { bytes: new Uint8Array(buffer), hintUrl: source };
}

function Preview() {
  const navigate = useNavigate();
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const { resultUrl, softCopyUrl, printUrl, mode } = useLocation()?.state || {};
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [swaploader, setswaloader] = useState("none");
  const [displayUrl, setDisplayUrl] = useState(null);
  const [qrUrl, setQrUrl] = useState(null);
  const [printSource, setPrintSource] = useState(null);
  const url = searchParams.get("resultUrl");

  useEffect(() => {
    const fromStateOrQuery = resultUrl || url;
    if (fromStateOrQuery) {
      setDisplayUrl(fromStateOrQuery);
    } else if (mode === "original") {
      const labeled = getData("labeledOriginalImage");
      if (labeled) setDisplayUrl(labeled);
    }

    // Original prints must use the local labeled image (data URL), not only the soft-copy host URL.
    if (mode === "original") {
      const labeled =
        printUrl ||
        getData("labeledOriginalImage") ||
        (!isHttpUrl(fromStateOrQuery) ? fromStateOrQuery : null);
      setPrintSource(labeled || fromStateOrQuery || null);
    } else {
      setPrintSource(fromStateOrQuery || null);
    }

    const hosted =
      softCopyUrl ||
      (isHttpUrl(fromStateOrQuery) ? fromStateOrQuery : null) ||
      getData("softCopyUrl") ||
      null;
    setQrUrl(hosted || fromStateOrQuery || null);
  }, [resultUrl, softCopyUrl, printUrl, url, mode]);

  const finalUrl = displayUrl;

  useEffect(() => {
    setswaloader(loading ? "block" : "none");
  }, [loading]);

  const uint8ArrayToBase64 = (uint8Array) => {
    const chunkSize = 0x8000;
    let binary = "";
    for (let i = 0; i < uint8Array.length; i += chunkSize) {
      const chunk = uint8Array.subarray(i, i + chunkSize);
      binary += String.fromCharCode(...chunk);
    }
    return btoa(binary);
  };

  const printImageAsPDF = async () => {
    const source = printSource || finalUrl;
    if (!source) return;

    try {
      setLoading(true);
      const { bytes, hintUrl } = await loadImageBytes(source);
      const format = detectImageFormat(bytes, hintUrl);

      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([288, 432]);

      const image =
        format === "png"
          ? await pdfDoc.embedPng(bytes)
          : await pdfDoc.embedJpg(bytes);

      const pageWidth = page.getWidth();
      const pageHeight = page.getHeight();
      const scale = Math.min(
        pageWidth / image.width,
        pageHeight / image.height
      );
      const width = image.width * scale;
      const height = image.height * scale;
      const x = (pageWidth - width) / 2;
      const y = (pageHeight - height) / 2;

      page.drawImage(image, { x, y, width, height });

      const pdfBytes = await pdfDoc.save();
      const pdfBase64 = uint8ArrayToBase64(new Uint8Array(pdfBytes));

      const apiKey = import.meta.env.VITE_PRINTNODE_API_KEY;
      const printerId = Number(import.meta.env.VITE_PRINTNODE_PRINTER_ID);

      const printJob = {
        printerId,
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
        setLoading(false);
        return;
      }
    } catch (error) {
      console.error("Error processing print job:", error);
      setLoading(false);
      return;
    }

    setTimeout(() => {
      setLoading(false);
    }, 35000);
  };

  return loading ? (
    <div className="w-full h-screen">
      <LoadingSwapping visibility={swaploader} src={printingVideo} />
    </div>
  ) : (
    <div className="min-h-screen w-full relative flex flex-col items-center overflow-hidden">
      <PageBackground />

      <Logo
        onBack={() => navigate(mode === "original" ? "/capture" : "/avatar")}
      />

      <div className="flex flex-col justify-evenly items-center w-full flex-1 relative z-[2] text-white px-4 min-h-0">
        <CameraGlassFrame className="mx-auto">
          {finalUrl && (
            <img
              src={finalUrl}
              alt="Generated result"
              className="block w-full max-w-2xl min-h-[40vh] object-contain bg-black"
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
          data={qrUrl || finalUrl}
        />
      </div>
    </div>
  );
}

export default Preview;
