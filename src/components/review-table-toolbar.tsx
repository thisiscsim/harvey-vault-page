"use client";

import { SmallButton } from "@/components/ui/button";
import { SvgIcon } from "@/components/svg-icon";
import { useState } from "react";

interface ReviewTableToolbarProps {
  chatOpen: boolean;
  onToggleChat: () => void;
  onCloseArtifact?: () => void;
  alignment?: 'top' | 'center' | 'bottom';
  onAlignmentChange?: (alignment: 'top' | 'center' | 'bottom') => void;
  textWrap?: boolean;
  onTextWrapChange?: (wrap: boolean) => void;
}

export default function ReviewTableToolbar({ 
  chatOpen, 
  onToggleChat, 
  onCloseArtifact,
  alignment = 'center',
  onAlignmentChange,
  textWrap = false,
  onTextWrapChange 
}: ReviewTableToolbarProps) {
  // Use props for alignment instead of local state
  const handleAlignmentChange = (newAlignment: 'top' | 'center' | 'bottom') => {
    onAlignmentChange?.(newAlignment);
  };
  
  // Use props for text wrap instead of local state
  const handleTextWrapChange = (wrap: boolean) => {
    onTextWrapChange?.(wrap);
  };
  
  // State for concise/extend (keep local for now)
  const [textLength, setTextLength] = useState<'concise' | 'extend'>('concise');

  return (
    <div className="px-3 py-2 border-b border-border-base bg-bg-base flex items-center justify-between" style={{ height: '42px' }}>
      <div className="flex items-center gap-2">
        {/* Toggle Chat Button */}
        <SmallButton
          onClick={onToggleChat}
          variant="secondary"
          className={chatOpen ? "bg-bg-subtle" : ""}
          icon={
            <SvgIcon 
              src={chatOpen ? "/central_icons/Assistant - Filled.svg" : "/central_icons/Assistant.svg"}
              alt="Harvey" 
              width={14} 
              height={14} 
              className={chatOpen ? "text-fg-base" : "text-fg-subtle"}
            />
          }
        >
          Ask Harvey
        </SmallButton>
        
        {/* Separator */}
        <div className="w-px bg-bg-subtle-pressed" style={{ height: '20px' }}></div>
        
        {/* Add File Button */}
        <SmallButton 
          variant="secondary" 
          icon={<SvgIcon src="/central_icons/Add File.svg" alt="Add file" width={14} height={14} className="text-fg-subtle" />}
        >
          Add file
        </SmallButton>
        
        {/* Add Column Button */}
        <SmallButton 
          variant="secondary" 
          icon={<SvgIcon src="/central_icons/Add Column.svg" alt="Add column" width={14} height={14} className="text-fg-subtle" />}
        >
          Add column
        </SmallButton>
        
        {/* Separator */}
        <div className="w-px bg-bg-subtle-pressed" style={{ height: '20px' }}></div>
        
        {/* Alignment Options */}
        <div className="flex items-center gap-1">
          <button 
            onClick={() => handleAlignmentChange('top')}
            className={`w-6 h-6 flex items-center justify-center rounded-[6px] transition-colors ${
              alignment === 'top' ? 'bg-bg-subtle-pressed text-fg-base hover:bg-bg-component' : 'text-fg-subtle hover:bg-bg-subtle'
            }`}
            title="Top align"
          >
            <SvgIcon 
              src={alignment === 'top' ? '/top-align-filled.svg' : '/top-align-outline.svg'} 
              alt="Top align" 
              width={14} 
              height={14} 
            />
          </button>
          
          <button 
            onClick={() => handleAlignmentChange('center')}
            className={`w-6 h-6 flex items-center justify-center rounded-[6px] transition-colors ${
              alignment === 'center' ? 'bg-bg-subtle-pressed text-fg-base hover:bg-bg-component' : 'text-fg-subtle hover:bg-bg-subtle'
            }`}
            title="Center align"
          >
            <SvgIcon 
              src={alignment === 'center' ? '/center-align-filled.svg' : '/center-align-outline.svg'} 
              alt="Center align" 
              width={14} 
              height={14} 
            />
          </button>
          
          <button 
            onClick={() => handleAlignmentChange('bottom')}
            className={`w-6 h-6 flex items-center justify-center rounded-[6px] transition-colors ${
              alignment === 'bottom' ? 'bg-bg-subtle-pressed text-fg-base hover:bg-bg-component' : 'text-fg-subtle hover:bg-bg-subtle'
            }`}
            title="Bottom align"
          >
            <SvgIcon 
              src={alignment === 'bottom' ? '/bottom-align-filled.svg' : '/bottom-align-outline.svg'} 
              alt="Bottom align" 
              width={14} 
              height={14} 
            />
          </button>
        </div>
        
        {/* Separator */}
        <div className="w-px bg-bg-subtle-pressed" style={{ height: '20px' }}></div>
        
        {/* Text Display Options */}
        <div className="flex items-center gap-1">
          <button 
            onClick={() => handleTextWrapChange(false)}
            className={`w-6 h-6 flex items-center justify-center rounded-[6px] transition-colors ${
              !textWrap ? 'bg-bg-subtle-pressed text-fg-base hover:bg-bg-component' : 'text-fg-subtle hover:bg-bg-subtle'
            }`}
            title="Text overflow"
          >
            <SvgIcon 
              src="/overflow.svg" 
              alt="Text overflow" 
              width={14} 
              height={14} 
            />
          </button>
          
          <button 
            onClick={() => handleTextWrapChange(true)}
            className={`w-6 h-6 flex items-center justify-center rounded-[6px] transition-colors ${
              textWrap ? 'bg-bg-subtle-pressed text-fg-base hover:bg-bg-component' : 'text-fg-subtle hover:bg-bg-subtle'
            }`}
            title="Text wrapping"
          >
            <SvgIcon 
              src="/wrapping.svg" 
              alt="Text wrapping" 
              width={14} 
              height={14} 
            />
          </button>
        </div>
        
        {/* Separator */}
        <div className="w-px bg-bg-subtle-pressed" style={{ height: '20px' }}></div>
        
        {/* Text Length Options */}
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setTextLength('concise')}
            className={`w-6 h-6 flex items-center justify-center rounded-[6px] transition-colors ${
              textLength === 'concise' ? 'bg-bg-subtle-pressed text-fg-base hover:bg-bg-component' : 'text-fg-subtle hover:bg-bg-subtle'
            }`}
            title="Concise"
          >
            <SvgIcon 
              src="/concise.svg" 
              alt="Concise" 
              width={14} 
              height={14} 
            />
          </button>
          
          <button 
            onClick={() => setTextLength('extend')}
            className={`w-6 h-6 flex items-center justify-center rounded-[6px] transition-colors ${
              textLength === 'extend' ? 'bg-bg-subtle-pressed text-fg-base hover:bg-bg-component' : 'text-fg-subtle hover:bg-bg-subtle'
            }`}
            title="Extend"
          >
            <SvgIcon 
              src="/extend.svg" 
              alt="Extend" 
              width={14} 
              height={14} 
            />
          </button>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {/* Close button */}
        <button 
          onClick={chatOpen ? onCloseArtifact : undefined}
          disabled={!chatOpen}
          className={`w-6 h-6 flex items-center justify-center rounded-[6px] transition-colors ${
            chatOpen 
              ? 'hover:bg-bg-subtle text-fg-subtle' 
              : 'text-fg-disabled cursor-not-allowed'
          }`}
          title={chatOpen ? "Close" : "Open assistant to close artifact"}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18"/>
            <path d="M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
