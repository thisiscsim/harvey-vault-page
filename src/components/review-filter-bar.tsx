"use client";

import { SmallButton } from "@/components/ui/button";
import { SvgIcon } from "@/components/svg-icon";

interface ReviewFilterBarProps {
  onFilter?: () => void;
  onDisplayOptions?: () => void;
}

export default function ReviewFilterBar({ 
  onFilter,
  onDisplayOptions
}: ReviewFilterBarProps) {
  return (
    <div className="px-3 py-2 border-b border-border-base bg-bg-base flex items-center justify-between" style={{ height: '42px' }}>
      <div className="flex items-center gap-2">
        {/* Filter Button */}
        <SmallButton 
          variant="secondary" 
          onClick={onFilter}
          icon={<SvgIcon src="/central_icons/Filter.svg" alt="Filter" width={14} height={14} className="text-fg-subtle" />}
        >
          Filter
        </SmallButton>
      </div>
      
      <div className="flex items-center gap-2">
        {/* Display Options Button */}
        <SmallButton 
          variant="secondary" 
          onClick={onDisplayOptions}
          icon={<SvgIcon src="/central_icons/SliderSettings.svg" alt="Display options" width={14} height={14} className="text-fg-subtle" />}
        >
          Display options
        </SmallButton>
      </div>
    </div>
  );
}
