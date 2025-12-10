"use client";

import React, { useState } from "react";
import { SmallButton } from "@/components/ui/button";
import { SvgIcon } from "@/components/svg-icon";
import { X, Check, GripVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Icons for column types
const FileColumnIcon = () => (
  <svg width="14" height="14" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.75 2.625V5.25C9.75 6.07843 10.4216 6.75 11.25 6.75H13.875M5.25 2.25H9.1287C9.5265 2.25 9.90803 2.40803 10.1894 2.68934L13.8106 6.31066C14.092 6.59197 14.25 6.97349 14.25 7.37132V14.25C14.25 15.0784 13.5784 15.75 12.75 15.75H5.25C4.42157 15.75 3.75 15.0784 3.75 14.25V3.75C3.75 2.92157 4.42157 2.25 5.25 2.25Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TextColumnIcon = () => (
  <svg width="14" height="14" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 4.5V3H9M9 3H15V4.5M9 3V15M9 15H7.5M9 15H10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export interface FilterableColumn {
  id: string;
  header: string;
  type: 'file' | 'text' | 'selection';
}

export interface DisplayColumn {
  id: string;
  header: string;
  visible: boolean;
  fixed?: boolean;
}

export interface ActiveFilter {
  columnId: string;
  columnHeader: string;
  columnType: 'file' | 'text' | 'selection';
  condition: 'is_any_of' | 'is_none_of';
  value: string;
}

// Filter Chip Component - button group style
const FilterChip = ({ 
  filter, 
  onConditionChange, 
  onRemove 
}: { 
  filter: ActiveFilter;
  onConditionChange: (condition: 'is_any_of' | 'is_none_of') => void;
  onRemove: () => void;
}) => {
  const [conditionOpen, setConditionOpen] = useState(false);
  
  return (
    <div className="inline-flex items-center h-6 rounded-[6px] border border-border-base bg-button-neutral overflow-hidden">
      {/* Column name segment */}
      <div className="flex items-center gap-1 px-2 h-full text-xs text-fg-base border-r border-border-base">
        <span className="text-fg-subtle">
          {filter.columnType === 'file' ? <FileColumnIcon /> : <TextColumnIcon />}
        </span>
        <span className="max-w-[80px] truncate">{filter.columnHeader}</span>
      </div>
      
      {/* Condition dropdown segment */}
      <DropdownMenu open={conditionOpen} onOpenChange={setConditionOpen}>
        <DropdownMenuTrigger asChild>
          <button 
            className="flex items-center px-2 h-full text-xs text-fg-base hover:bg-button-neutral-hover transition-colors border-r border-border-base"
          >
            {filter.condition === 'is_any_of' ? 'is any of' : 'is none of'}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[140px] p-0.5 rounded-[6px]">
          <DropdownMenuItem 
            onClick={() => onConditionChange('is_any_of')}
            className="flex items-center justify-between px-2 py-1 text-xs rounded-[4px]"
          >
            <span>is any of</span>
            {filter.condition === 'is_any_of' && <Check size={14} className="text-fg-base" />}
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => onConditionChange('is_none_of')}
            className="flex items-center justify-between px-2 py-1 text-xs rounded-[4px]"
          >
            <span>is none of</span>
            {filter.condition === 'is_none_of' && <Check size={14} className="text-fg-base" />}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Value segment */}
      <div className="flex items-center px-2 h-full text-xs text-fg-base border-r border-border-base">
        <span className="max-w-[100px] truncate">{filter.value || 'All values'}</span>
      </div>
      
      {/* Close button segment */}
      <button 
        onClick={onRemove}
        className="flex items-center justify-center w-6 h-full text-fg-muted hover:text-fg-base hover:bg-button-neutral-hover transition-colors"
      >
        <X size={12} />
      </button>
    </div>
  );
};

// Sortable column item for display options
const SortableColumnItem = ({ 
  column, 
  onToggleVisibility 
}: { 
  column: DisplayColumn;
  onToggleVisibility: (id: string) => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between px-2 py-1 rounded-[4px] hover:bg-bg-subtle-hover"
    >
      <div className="flex items-center gap-2">
        <button
          onClick={() => onToggleVisibility(column.id)}
          className={`w-3.5 h-3.5 rounded-[3px] border flex items-center justify-center transition-colors ${
            column.visible 
              ? 'bg-bg-interactive border-border-interactive' 
              : 'border-border-base bg-transparent hover:border-border-strong'
          }`}
        >
          {column.visible && <Check size={10} className="text-fg-on-color" />}
        </button>
        <span className="text-xs text-fg-base">{column.header}</span>
      </div>
      <button
        {...attributes}
        {...listeners}
        className="p-0.5 text-fg-muted hover:text-fg-subtle cursor-grab active:cursor-grabbing"
      >
        <GripVertical size={14} />
      </button>
    </div>
  );
};

// Display Options Dropdown Content
const DisplayOptionsContent = ({
  displayColumns,
  onToggleVisibility,
  onReorder,
}: {
  displayColumns: DisplayColumn[];
  onToggleVisibility: (id: string) => void;
  onReorder: (columns: DisplayColumn[]) => void;
}) => {
  const fixedColumns = displayColumns.filter(col => col.fixed);
  const sortableColumns = displayColumns.filter(col => !col.fixed);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sortableColumns.findIndex(col => col.id === active.id);
      const newIndex = sortableColumns.findIndex(col => col.id === over.id);
      
      const newSortableColumns = arrayMove(sortableColumns, oldIndex, newIndex);
      onReorder([...fixedColumns, ...newSortableColumns]);
    }
  };

  return (
    <div className="w-[240px]">
      {/* Fixed columns section */}
      {fixedColumns.length > 0 && (
        <div className="p-1">
          <div className="text-xs text-fg-muted px-2 py-1">Fixed columns</div>
          {fixedColumns.map(column => (
            <div 
              key={column.id}
              className="flex items-center gap-2 px-2 py-1"
            >
              <FileColumnIcon />
              <span className="text-xs text-fg-base">{column.header}</span>
            </div>
          ))}
        </div>
      )}
      
      {/* Divider */}
      {fixedColumns.length > 0 && sortableColumns.length > 0 && (
        <div className="h-px bg-border-base mx-1" />
      )}
      
      {/* Sortable columns section */}
      {sortableColumns.length > 0 && (
        <div className="p-1">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sortableColumns.map(col => col.id)}
              strategy={verticalListSortingStrategy}
            >
              {sortableColumns.map(column => (
                <SortableColumnItem
                  key={column.id}
                  column={column}
                  onToggleVisibility={onToggleVisibility}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      )}
      
      {/* Empty state */}
      {sortableColumns.length === 0 && fixedColumns.length === 0 && (
        <div className="px-2 py-1 text-xs text-fg-muted text-center">
          No columns to display
        </div>
      )}
    </div>
  );
};

interface ReviewFilterBarProps {
  onFilter?: () => void;
  columns?: FilterableColumn[];
  onColumnFilter?: (columnId: string) => void;
  hasFilters?: boolean;
  displayColumns?: DisplayColumn[];
  onToggleColumnVisibility?: (columnId: string) => void;
  onReorderColumns?: (columns: DisplayColumn[]) => void;
}

export default function ReviewFilterBar({ 
  onFilter,
  columns = [],
  onColumnFilter,
  hasFilters = false,
  displayColumns = [],
  onToggleColumnVisibility,
  onReorderColumns,
}: ReviewFilterBarProps) {
  const hasColumns = columns.length > 0;
  const hasDisplayColumns = displayColumns.length > 0;
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);
  const [displayOptionsOpen, setDisplayOptionsOpen] = useState(false);
  
  const handleColumnSelect = (column: FilterableColumn) => {
    // Check if filter for this column already exists
    if (activeFilters.some(f => f.columnId === column.id)) {
      return;
    }
    
    // Add new filter
    const newFilter: ActiveFilter = {
      columnId: column.id,
      columnHeader: column.header,
      columnType: column.type,
      condition: 'is_any_of',
      value: 'All values',
    };
    
    setActiveFilters([...activeFilters, newFilter]);
    onColumnFilter?.(column.id);
  };
  
  const handleConditionChange = (filterId: string, condition: 'is_any_of' | 'is_none_of') => {
    setActiveFilters(activeFilters.map(f => 
      f.columnId === filterId ? { ...f, condition } : f
    ));
  };
  
  const handleRemoveFilter = (filterId: string) => {
    setActiveFilters(activeFilters.filter(f => f.columnId !== filterId));
  };
  
  // Get columns that are not already filtered
  const availableColumns = columns.filter(
    col => !activeFilters.some(f => f.columnId === col.id)
  );
  
  return (
    <div className="px-3 py-2 border-b border-border-base bg-bg-base flex items-center justify-between" style={{ height: '42px' }}>
      <div className="flex items-center gap-2">
        {/* Filter Button with Dropdown */}
        {hasColumns && availableColumns.length > 0 ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div>
                <SmallButton 
                  variant="secondary" 
                  icon={<SvgIcon src="/central_icons/Filter.svg" alt="Filter" width={14} height={14} className="text-fg-subtle" />}
                >
                  Filter
                </SmallButton>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[200px] p-0.5 rounded-[6px]">
              {availableColumns.map((column) => (
                <DropdownMenuItem 
                  key={column.id}
                  onClick={() => handleColumnSelect(column)}
                  className="flex items-center gap-2 px-2 py-1 text-xs rounded-[4px]"
                >
                  <span className="text-fg-subtle">
                    {column.type === 'file' ? <FileColumnIcon /> : <TextColumnIcon />}
                  </span>
                  <span>{column.header}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <SmallButton 
            variant="secondary" 
            onClick={onFilter}
            icon={<SvgIcon src="/central_icons/Filter.svg" alt="Filter" width={14} height={14} className="text-fg-subtle" />}
            disabled
          >
            Filter
          </SmallButton>
        )}
        
        {/* Active Filter Chips */}
        {activeFilters.map((filter) => (
          <FilterChip
            key={filter.columnId}
            filter={filter}
            onConditionChange={(condition) => handleConditionChange(filter.columnId, condition)}
            onRemove={() => handleRemoveFilter(filter.columnId)}
          />
        ))}
      </div>
      
      <div className="flex items-center gap-2">
        {/* Display Options Button with Dropdown */}
        {hasDisplayColumns ? (
          <DropdownMenu open={displayOptionsOpen} onOpenChange={setDisplayOptionsOpen}>
            <DropdownMenuTrigger asChild>
              <div>
                <SmallButton 
                  variant="secondary" 
                  icon={<SvgIcon src="/central_icons/SliderSettings.svg" alt="Display options" width={14} height={14} className="text-fg-subtle" />}
                >
                  Display options
                </SmallButton>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="p-0 rounded-[6px]">
              <DisplayOptionsContent
                displayColumns={displayColumns}
                onToggleVisibility={(id) => onToggleColumnVisibility?.(id)}
                onReorder={(cols) => onReorderColumns?.(cols)}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <SmallButton 
            variant="secondary" 
            icon={<SvgIcon src="/central_icons/SliderSettings.svg" alt="Display options" width={14} height={14} className="text-fg-subtle" />}
            disabled
          >
            Display options
          </SmallButton>
        )}
      </div>
    </div>
  );
}
