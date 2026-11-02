import { Sidebar } from "@/components/sidbar";

import type { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-dvh flex-col md:flex-row bg-gray-50">
      <Sidebar />

      <main className="w-full min-w-0 flex-1">{children}</main>
    </div>
  );
}
