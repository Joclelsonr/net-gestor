import Link from "next/link";

import { usePathname } from "next/navigation";

import { MENU } from "@/constants/menu";

export function NavItems() {
  const pathname = usePathname();
  return (
    <nav className="flex-1 space-y-1 overflow-y-auto px-3">
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
  );
}
