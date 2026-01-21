"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ProjectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectName = searchParams.get('name') || 'Untitled';
  
  return (
    <div className="flex h-screen w-full">
      {/* Sidebar */}
      <AppSidebar />
      
      {/* Main Content */}
      <SidebarInset>
        <div className="h-screen flex flex-col bg-bg-base">
          {/* Header with back button */}
          <div 
            className="px-3 py-4 flex items-center" 
            style={{ height: '52px' }}
          >
            {/* Back Button */}
            <button
              onClick={() => router.push('/vault')}
              className="p-2 hover:bg-bg-subtle rounded-md transition-colors"
            >
              <ArrowLeft size={16} className="text-fg-subtle" />
            </button>
          </div>
          
          <div className="w-full xl:max-w-[1500px] xl:mx-auto flex flex-col h-full px-10">
            {/* Header */}
            <div className="pb-0" style={{ paddingTop: '12px' }}>
              <h1 className="text-2xl font-medium text-fg-base">{projectName}</h1>
              <p className="text-sm text-fg-muted mt-1 mb-6">0 files ⋅ 0 queries</p>
            </div>
            
            {/* Empty State */}
            <div className="flex-1 flex flex-col items-center justify-center -mt-20">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-bg-subtle rounded-lg flex items-center justify-center">
                  <img 
                    src="/privateFolderIcon.svg"
                    alt="Empty project"
                    className="w-10 h-10 opacity-50"
                  />
                </div>
                <h2 className="text-lg font-medium text-fg-base mb-2">No files yet</h2>
                <p className="text-sm text-fg-muted max-w-sm">
                  Upload files to this project to start analyzing and querying your documents.
                </p>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </div>
  );
}

export default function VaultProjectPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen w-full items-center justify-center">
        <p className="text-fg-muted">Loading...</p>
      </div>
    }>
      <ProjectContent />
    </Suspense>
  );
}
