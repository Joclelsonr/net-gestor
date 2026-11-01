"use client";

import Link from "next/link";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Wifi, LogOut } from "lucide-react";
import { Spinner } from "../ui/spinner";

import { MENU } from "@/constants/menu";

export function SidebarContent() {
  const route = useRouter();
  const pathname = usePathname();
  const { data } = authClient.useSession();

  const [loading, setLoading] = useState(false);

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
      {/* LOGO */}
      <div className="flex items-center gap-2 px-5 py-5 font-display text-lg font-semibold text-muted">
        <span className="grid h-8 w-8 place-items-center rounded-md bg-blue-500 text-muted">
          <Wifi className="h-4 w-4" />
        </span>
        Norte Telecom
      </div>

      {/* MENU */}
      <nav className="flex-1 space-y-1 px-3">
        {MENU.map((menu) => (
          <Link
            key={menu.id}
            href={menu.url}
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted ${
              pathname.includes(menu.url) ? "bg-blue-500" : ""
            } ${menu.active ? "" : "opacity-50"} hover:bg-blue-500`}
          >
            <menu.icon className="h-4 w-4" />
            {menu.label}

            {!menu.active && (
              <span className="ml-auto text-[10px] uppercase tracking-wider">
                em breve
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* SAIR */}
      <div className="border-t border-sidebar-border p-3">
        <p className="truncate px-3 text-xs opacity-50 text-muted">
          {data?.user?.email}
        </p>

        <button
          onClick={signOut}
          className="mt-2 flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-muted hover:cursor-pointer hover:bg-blue-500"
        >
          {loading ? (
            <>
              <Spinner /> Saindo...
            </>
          ) : (
            <>
              <LogOut /> Sair
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
