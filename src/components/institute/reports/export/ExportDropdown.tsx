import { useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileText, Image, Loader2 } from "lucide-react";
import { exportToPdf, exportToImage } from "@/lib/exportReport";

interface ExportDropdownProps {
  /** Ref to the hidden printable element */
  getElement: () => HTMLElement | null;
  /** Base filename (no extension) */
  filename: string;
  /** Size variant */
  size?: "sm" | "default";
}

const ExportDropdown = ({ getElement, filename, size = "sm" }: ExportDropdownProps) => {
  const [exporting, setExporting] = useState(false);

  const handleExport = useCallback(
    async (type: "pdf" | "image") => {
      const el = getElement();
      if (!el) return;
      setExporting(true);
      try {
        if (type === "pdf") {
          await exportToPdf({ element: el, filename });
        } else {
          await exportToImage({ element: el, filename });
        }
      } finally {
        setExporting(false);
      }
    },
    [getElement, filename]
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size={size} className="gap-1.5" disabled={exporting}>
          {exporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">Export</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport("pdf")} className="gap-2">
          <FileText className="w-4 h-4" />
          Download PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("image")} className="gap-2">
          <Image className="w-4 h-4" />
          Download Image (PNG)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportDropdown;
