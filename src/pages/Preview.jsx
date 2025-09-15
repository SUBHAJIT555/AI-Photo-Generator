import Logo from "../component/Logo";
import { IoHome, IoQrCode } from "react-icons/io5";
import { ImPrinter } from "react-icons/im";
import { Link, useLocation, useSearchParams } from "react-router-dom";
// import { saveAs } from "file-saver";
// import toast from "react-hot-toast";
import QRModal from "../component/QRModal";
import { useEffect, useState } from "react";
import { PDFDocument } from "pdf-lib";
import download from "downloadjs";
import BGImage from "../assets/logo/BG.webp";
import LoadingSwapping from "../component/LoadingSwapping";
import printingVideo from "../assets/printing.webm";

function Preview() {
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const { resultUrl } = useLocation()?.state || {};
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [swapLoader, setswaloader] = useState("none");
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
      // Fetch the image as a Blob
      const response = await fetch(finalUrl);
      const imageBlob = await response.blob();
      const imageArrayBuffer = await imageBlob.arrayBuffer();

      // Create a new PDF document
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([288, 432]); // 4x6 inches in points (1 inch = 72 points)

      // Embed the image into the PDF
      const image = await pdfDoc.embedJpg(imageArrayBuffer);
      const { width, height } = image.scale(0.25);
      // const { width, height } = image.scale(0);

      // Calculate position to center the image
      const x = (page.getWidth() - width) / 2;
      const y = (page.getHeight() - height) / 2;

      // Draw image on PDF
      page.drawImage(image, { x, y, width, height });

      // Convert PDF to Uint8Array
      const pdfBytes = await pdfDoc.save();
      // console.log("pdf", pdfBytes);
      const pdfBase64 = uint8ArrayToBase64(new Uint8Array(pdfBytes)); // Proper encoding
      // console.log("pdfbase64", pdfBase64);

      download(pdfBytes, `face_swap_${Date.now()}.pdf`, "application/pdf");
      // console.log(pdfBase64);

      // download(pdfBytes, generateUniqueFilename("pdf"));

      // Send the PDF to PrintNode
      const apiKey = import.meta.env.VITE_PRINTNODE_API_KEY; // Replace with actual API key
      const printerId = import.meta.env.VITE_PRINTNODE_PRINTER_ID; // Replace with actual printer ID

      const printJob = {
        printerId: printerId,
        title: "PDF Print Job",
        contentType: "pdf_base64",
        content: pdfBase64,
        source: "React Web App",
        // options: {
        //   fit_to_page: true,
        // },
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
      // This for loading 35sec
      setTimeout(() => {
        setLoading(false);
      }, 35000);
    }
  };

  return loading ? (
    <div className="w-full h-screen">
      <LoadingSwapping visibility={swapLoader} src={printingVideo} />
    </div>
  ) : (
    <div
      className="flex flex-col justify-evenly items-center w-full h-screen min-h-screen text-white bg-center bg-cover"
      style={{ backgroundImage: `url(${BGImage})` }}
    >
      <div className="flex flex-col justify-evenly items-center px-4 mx-auto w-full h-screen">
        <Logo />
        <div className="group mx-auto w-full  rounded-xl overflow-hidden max-w-[400px]">
          {finalUrl && (
            <div className="h-[100%] w-full overflow-hidden cursor-none">
              <img
                src={finalUrl}
                alt="Generated result"
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          )}
          {/* {resultUrl && (
          <div className="w-full h-full">
            <img
              src={resultUrl}
              alt="Generated Avatar"
              className="object-cover object-center w-full h-full"
            />
          </div>
        )} */}
        </div>

        <div className="flex flex-wrap gap-10 justify-center text-zinc-200">
          <button
            onClick={printImageAsPDF}
            className="border-[2px] border-zinc-300 p-3 rounded-2xl hover:bg-zinc-800 cursor-none"
          >
            <ImPrinter className="text-3xl md:text-5xl" />
          </button>

          <button
            onClick={() => setIsQRModalOpen(true)}
            className="border-[2px] border-zinc-300 p-2 px-3 rounded-2xl hover:bg-zinc-800 cursor-none"
          >
            <IoQrCode className="text-3xl md:text-5xl" />
          </button>

          <Link to="/">
            <button className="border-[2px] border-zinc-300 p-2 rounded-2xl hover:bg-zinc-800 cursor-none">
              <IoHome className="text-3xl md:text-6xl" />
            </button>
          </Link>
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
