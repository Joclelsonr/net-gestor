"use client";

import { Suspense } from "react";

import { SidebarContent } from "./sidebar-content";

export function Sidebar() {
  return (
    <Suspense fallback={<SidebarFallback />}>
      <SidebarContent />
    </Suspense>
  );
}

function SidebarFallback() {
  return (
    <aside className="hidden w-60 shrink-0 flex-col bg-blue-950 md:flex">
      <div className="px-5 py-5 font-semibold text-muted">Norte Telecom</div>
    </aside>
  );
}
