"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Wifi, LogOut, Menu } from "lucide-react";

import {
  Sheet,
  SheetTitle,
  SheetHeader,
  SheetTrigger,
  SheetContent,
} from "../ui/sheet";
import { NavItems } from "./nav-items";
import { Spinner } from "../ui/spinner";

export function SidebarContent() {
  const route = useRouter();
  const { data } = authClient.useSession();

  const [menuOpen, setMenuOpen] = useState(false);
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
    <>
      {/* SIDEBAR DESKTOP */}
      <aside className="hidden w-60 shrink-0 flex-col bg-blue-950 text-sidebar-foreground md:flex">
        <div className="flex items-center gap-2 px-5 py-5 font-display text-lg font-semibold text-muted">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-blue-500 text-muted">
            <Wifi className="h-4 w-4" />
          </span>
          Norte Telecom
        </div>

        <NavItems />

        <div className="mt-auto border-t border-sidebar-border p-3">
          <p className="truncate px-3 text-xs opacity-50 text-muted">
            {data?.user?.email}
          </p>

          <button
            onClick={signOut}
            disabled={loading}
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

      {/* MOBILE HEADER */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b bg-blue-950 px-4 md:hidden">
        <div className="flex items-center gap-2">
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger
              aria-label="Abrir menu"
              className="grid h-9 w-9 place-items-center rounded-md hover:bg-blue-800"
            >
              <Menu className="text-muted" />
            </SheetTrigger>

            <SheetContent
              side="left"
              className="flex w-64 flex-col bg-blue-950 p-0 text-sidebar-foreground"
            >
              <SheetHeader className="flex flex-row items-center gap-2 space-y-0 px-5 py-5">
                <span className="grid h-8 w-8 place-items-center rounded-md bg-blue-500">
                  <Wifi className="text-muted" />
                </span>

                <SheetTitle className="font-display text-lg font-semibold text-muted">
                  Norte Telecom
                </SheetTitle>
              </SheetHeader>

              <NavItems />

              <div className="mt-auto border-t border-sidebar-border p-3">
                <p className="truncate px-3 text-xs opacity-60 text-muted">
                  {data?.user?.email}
                </p>

                <button
                  onClick={signOut}
                  disabled={loading}
                  className="mt-2 flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-muted"
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
            </SheetContent>
          </Sheet>

          <span className="font-display font-semibold text-muted">
            Norte Telecom
          </span>
        </div>

        <button
          onClick={signOut}
          disabled={loading}
          className="text-sm text-muted"
        >
          Sair
        </button>
      </header>
    </>
  );
}
