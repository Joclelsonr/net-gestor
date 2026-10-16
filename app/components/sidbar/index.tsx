"use client";

import Link from "next/link";

import { useState } from "react";
import { MENU } from "@/constants/menu";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Wifi, Users, LogOut } from "lucide-react";

export function Sidebar() {
  const route = useRouter();
  const [loading, setLoading] = useState(false);
  const { data } = authClient.useSession();

  async function signOut() {
    setLoading(true);

    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          route.push("/login");
        },
        onError: (ctx) => {
          console.log(ctx);
          setLoading(false);
        },
      },
    });
  }
  return (
    <aside className="hidden w-60 shrink-0 flex-col bg-blue-950 text-sidebar-foreground md:flex">
      <div className="flex items-center gap-2 px-5 py-5 font-display text-lg font-semibold text-muted">
        <span className="grid h-8 w-8 place-items-center rounded-md bg-blue-500 text-muted">
          <Wifi className="h-4 w-4" />
        </span>
        Norte Telecom
      </div>
      <nav className="flex-1 space-y-1 px-3">
        <Link
          href="/clients"
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted hover:bg-blue-500"
          // activeProps={{
          //   className: "bg-sidebar-accent text-sidebar-accent-foreground",
          // }}
        >
          <Users className="h-4 w-4" /> Clientes
        </Link>
        {MENU.map((s) => (
          <div
            key={s.id}
            className="flex items-center gap-3 px-3 py-2 text-sm opacity-40 text-muted"
          >
            <s.icon className="h-4 w-4" /> {s.label}
            <span className="ml-auto text-[10px] uppercase tracking-wider">
              em breve
            </span>
          </div>
        ))}
      </nav>
      <div className="border-t border-sidebar-border p-3">
        <p className="truncate px-3 text-xs opacity-50 text-muted">
          {data?.user?.email}
        </p>

        <button
          onClick={signOut}
          className="mt-2 flex w-full items-center gap-3 rounded-md hover:cursor-pointer px-3 py-2 text-sm text-muted hover:bg-blue-500"
        >
          {loading ? (
            <>
              <LogOut className="h-4 w-4" /> Saindo...
            </>
          ) : (
            <>
              <LogOut className="h-4 w-4" /> Sair
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
