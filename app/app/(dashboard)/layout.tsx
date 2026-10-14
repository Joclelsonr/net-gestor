import { Sidebar } from "@/components/sidbar";

import type { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <main className="flex min-h-screen bg-gray-50">
      <Sidebar />
      {children}
    </main>
  );
}
