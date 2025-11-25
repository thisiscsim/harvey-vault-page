"use client";

import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";

interface ManageGroupedFilesPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  anchorElement: HTMLElement | null;
  groupedFiles?: Array<{ name: string; id: string }>;
}

export default function ManageGroupedFilesPopover({
  isOpen,
  onClose,
  anchorElement,
  groupedFiles = [],
}: ManageGroupedFilesPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        anchorElement &&
        !anchorElement.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose, anchorElement]);

  if (!anchorElement) return null;

  const rect = anchorElement.getBoundingClientRect();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={popoverRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="fixed z-50 bg-white rounded-lg shadow-xl border border-neutral-200"
          style={{
            top: rect.top,
            left: rect.right + 8,
            width: "400px",
            maxHeight: "500px",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200">
            <h3 className="text-sm font-medium text-neutral-900">Grouped files</h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-neutral-100 rounded transition-colors text-neutral-500"
            >
              <X size={16} />
            </button>
          </div>

          {/* Content - placeholder for now */}
          <div className="p-4">
            <p className="text-sm text-neutral-500">
              Manage grouped files functionality coming soon...
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

