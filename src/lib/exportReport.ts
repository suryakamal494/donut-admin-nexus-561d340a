import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { toast } from "sonner";

interface ExportOptions {
  /** Element to capture */
  element: HTMLElement;
  /** Filename without extension */
  filename: string;
  /** Scale factor for quality (default: 2) */
  scale?: number;
}

/**
 * Capture an element as a PNG image and trigger download.
 */
export async function exportToImage({ element, filename, scale = 2 }: ExportOptions): Promise<void> {
  const toastId = toast.loading("Generating image…");
  try {
    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
    });
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `${filename}.png`;
    link.href = url;
    link.click();
    toast.success("Image downloaded", { id: toastId });
  } catch (err) {
    console.error("Export to image failed:", err);
    toast.error("Failed to generate image", { id: toastId });
  }
}

/**
 * Capture an element as a PDF and trigger download.
 * Automatically handles portrait/landscape based on aspect ratio.
 */
export async function exportToPdf({ element, filename, scale = 2 }: ExportOptions): Promise<void> {
  const toastId = toast.loading("Generating PDF…");
  try {
    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
    });

    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const isLandscape = imgWidth > imgHeight;

    const pdf = new jsPDF({
      orientation: isLandscape ? "landscape" : "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Fit image to page with margins
    const margin = 8; // mm
    const maxW = pageWidth - margin * 2;
    const maxH = pageHeight - margin * 2;

    const ratio = Math.min(maxW / imgWidth, maxH / imgHeight);
    const finalW = imgWidth * ratio;
    const finalH = imgHeight * ratio;

    const x = (pageWidth - finalW) / 2;
    const y = margin;

    const imgData = canvas.toDataURL("image/png");
    pdf.addImage(imgData, "PNG", x, y, finalW, finalH);
    pdf.save(`${filename}.pdf`);

    toast.success("PDF downloaded", { id: toastId });
  } catch (err) {
    console.error("Export to PDF failed:", err);
    toast.error("Failed to generate PDF", { id: toastId });
  }
}

/**
 * Capture an element as a multi-page PDF for tall content.
 * Splits the canvas into page-sized chunks.
 */
export async function exportToMultiPagePdf({ element, filename, scale = 2 }: ExportOptions): Promise<void> {
  const toastId = toast.loading("Generating PDF…");
  try {
    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
    });

    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const margin = 8;
    const maxW = pageWidth - margin * 2;

    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = maxW / imgWidth;
    const scaledHeight = imgHeight * ratio;
    const maxH = pageHeight - margin * 2;

    const imgData = canvas.toDataURL("image/png");

    if (scaledHeight <= maxH) {
      // Fits in one page
      pdf.addImage(imgData, "PNG", margin, margin, maxW, scaledHeight);
    } else {
      // Multi-page
      let yOffset = 0;
      let page = 0;
      while (yOffset < scaledHeight) {
        if (page > 0) pdf.addPage();
        // Calculate source crop in canvas pixels
        const srcY = (yOffset / ratio);
        const srcH = Math.min(maxH / ratio, imgHeight - srcY);
        const destH = srcH * ratio;

        // Create a cropped canvas for this page
        const pageCanvas = document.createElement("canvas");
        pageCanvas.width = imgWidth;
        pageCanvas.height = srcH;
        const ctx = pageCanvas.getContext("2d")!;
        ctx.drawImage(canvas, 0, srcY, imgWidth, srcH, 0, 0, imgWidth, srcH);

        const pageImgData = pageCanvas.toDataURL("image/png");
        pdf.addImage(pageImgData, "PNG", margin, margin, maxW, destH);

        yOffset += maxH;
        page++;
      }
    }

    pdf.save(`${filename}.pdf`);
    toast.success("PDF downloaded", { id: toastId });
  } catch (err) {
    console.error("Export to PDF failed:", err);
    toast.error("Failed to generate PDF", { id: toastId });
  }
}
