import Logo from "../component/Logo";
import { IoHome, IoQrCode } from "react-icons/io5";
import { ImPrinter } from "react-icons/im";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import QRModal from "../component/QRModal";
import { useEffect, useState } from "react";
import { PDFDocument } from "pdf-lib";
import LoadingSwapping from "../component/LoadingSwapping";
import printingVideo from "../assets/printing.webm";

function Preview() {
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

  // const uint8ArrayToBase64 = (uint8Array) => {
  //   let binary = "";
  //   const len = uint8Array.byteLength;
  //   for (let i = 0; i < len; i++) {
  //     binary += String.fromCharCode(uint8Array[i]);
  //   }
  //   return btoa(binary);
  // };

  // const printImage = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await fetch(finalUrl);
  //     const blob = await response.blob();
  //     const url = URL.createObjectURL(blob);

  //     const iframe = document.createElement("iframe");
  //     iframe.style.display = "none";
  //     iframe.srcdoc = `
  //     <html>
  //       <head>
  //         <style>
  //           @page { margin: 0; size: 4in 6in; }
  //           body { margin: 0; }
  //           img { width: 100%; height: 100%; object-fit: cover; }
  //         </style>
  //       </head>
  //       <body onload="window.print();">
  //         <img src="${url}" />
  //       </body>
  //     </html>
  //   `;
  //     document.body.appendChild(iframe);
  //   } catch (error) {
  //     console.error("Error processing print job:", error);
  //   } finally {
  //     setTimeout(() => {
  //       setLoading(false);
  //     }, 35000);
  //   }
  // };

  // const printImageAsPDF = async () => {
  //   try {
  //     setLoading(true);

  //     // Fetch the image as a Blob
  //     const response = await fetch(finalUrl);
  //     const imageBlob = await response.blob();
  //     const imageArrayBuffer = await imageBlob.arrayBuffer();

  //     // Create a new PDF document
  //     const pdfDoc = await PDFDocument.create();
  //     const page = pdfDoc.addPage([288, 432]); // 4x6 inches in points

  //     // Embed the image into the PDF
  //     const image = await pdfDoc.embedJpg(imageArrayBuffer);
  //     // const { width, height } = image.scale(0.25);
  //     const { width: imgW, height: imgH } = image.size();

  //     // Center the image
  //     // Target page size (4x6 in pts)
  //     const pageWidth = 288;
  //     const pageHeight = 432;

  //     // Scale proportionally to fit
  //     const scale = Math.min(pageWidth / imgW, pageHeight / imgH);
  //     const scaledW = imgW * scale;
  //     const scaledH = imgH * scale;

  //     // Center image
  //     const x = (pageWidth - scaledW) / 2;
  //     const y = (pageHeight - scaledH) / 2;

  //     page.drawImage(image, { x, y, width: scaledW, height: scaledH });
  //     // const x = (page.getWidth() - width) / 2;
  //     // const y = (page.getHeight() - height) / 2;
  //     // page.drawImage(image, { x, y, width, height });

  //     // Save PDF as Uint8Array
  //     const pdfBytes = await pdfDoc.save();

  //     // ---- Print ----

  //     const blob = new Blob([pdfBytes], { type: "application/pdf" });
  //     const url = URL.createObjectURL(blob);

  //     const iframe = document.createElement("iframe");
  //     iframe.style.display = "none";
  //     iframe.src = url;
  //     document.body.appendChild(iframe);

  //     iframe.onload = () => {
  //       iframe.contentWindow.focus();
  //       iframe.contentWindow.print();
  //     };

  //     // ---- Download with downloadjs ----
  //     // download(pdfBytes, `document-${Date.now()}.pdf`, "application/pdf");
  //   } catch (error) {
  //     console.error("Error processing print job:", error);
  //   } finally {
  //     setTimeout(() => {
  //       setLoading(false);
  //     }, 35000);
  //   }
  // };
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

      // Calculate position to center the image
      const x = (page.getWidth() - width) / 2;
      const y = (page.getHeight() - height) / 2;

      // Draw image on PDF
      page.drawImage(image, { x, y, width, height });

      // Convert PDF to Uint8Array
      const pdfBytes = await pdfDoc.save();
      const pdfBase64 = uint8ArrayToBase64(new Uint8Array(pdfBytes)); // Proper encoding

      // console.log(pdfBase64);

      //  download(pdfBytes, generateUniqueFilename("pdf"));

      // Send the PDF to PrintNode
      const apiKey = import.meta.env.VITE_PRINTNODE_API_KEY; // Replace with actual API key
      const printerId = import.meta.env.VITE_PRINTNODE_PRINTER_ID; // Replace with actual printer ID

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
      // This for loading 40sec
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
    <div className="min-h-screen w-full bg-white relative flex flex-col justify-evenly items-center overflow-hidden">
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

      <div className="flex flex-col justify-evenly items-center w-full flex-1 relative z-[2] text-white px-4 min-h-screen">
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
        
            className="border-[1px] border-zinc-300 p-3 rounded-2xl bg-neutral-100 hover:bg-[#FF5900] cursor-none group transition-all duration-300 ring-1 ring-offset-4 ring-neutral-300"
          >
            <ImPrinter className="text-3xl md:text-5xl text-[#FF5900] group-hover:text-[#ffffff]" />
          </button>

          <button
            onClick={() => setIsQRModalOpen(true)}
            className="border-[1px] border-zinc-300 p-2 px-3 rounded-2xl bg-neutral-100 hover:bg-[#FF5900] cursor-none group transition-all duration-300 ring-1 ring-offset-4 ring-neutral-300"
          >
            <IoQrCode className="text-3xl md:text-5xl text-[#FF5900] group-hover:text-[#ffffff]" />
          </button>

          <Link to="/">
            <button className="border-[1px] border-zinc-300 p-2 rounded-2xl bg-neutral-100 hover:bg-[#FF5900] cursor-none group transition-all duration-300 ring-1 ring-offset-4 ring-neutral-300">
              <IoHome className="text-3xl md:text-6xl text-[#FF5900] group-hover:text-[#ffffff]" />
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
