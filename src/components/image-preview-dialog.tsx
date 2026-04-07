"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ImagePreviewDialogProps {
  url: string | null;
  onClose: () => void;
}

export function ImagePreviewDialog({ url, onClose }: ImagePreviewDialogProps) {
  return (
    <Dialog open={!!url} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl p-0 overflow-hidden bg-transparent border-none shadow-none">
        <DialogHeader className="sr-only">
          <DialogTitle>Phóng to ảnh</DialogTitle>
        </DialogHeader>
        <div className="relative w-full flex items-center justify-center pointer-events-none">
          {url && (
            <img 
              src={url} 
              alt="Phóng to" 
              className="max-w-full max-h-[80vh] rounded-lg object-contain shadow-2xl pointer-events-auto" 
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
