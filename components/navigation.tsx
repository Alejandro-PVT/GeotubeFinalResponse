"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, Search, Settings, Menu, X } from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import { cn } from "@/lib/utils";

export function Navigation() {
  const pathname = usePathname();
  const { t } = useLocale();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/", label: t.home, icon: Home },
    { href: "/map-search", label: t.mapSearch, icon: Map },
    { href: "/custom-search", label: t.customSearch, icon: Search },
    { href: "/preferences", label: t.preferences, icon: Settings },
  ];

  return (
    <>
      {/* NAVBAR SUPERIOR */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 fixed top-0 left-0 w-full z-40">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">

            {/* LOGO */}
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              {t.appTitle}
            </Link>

            {/* BOTONES DESKTOP */}
            <div className="hidden md:flex gap-2">
              {links.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "px-3 py-2 rounded-md flex items-center gap-2",
                      isActive
                        ? "bg-black text-white"
                        : "text-muted-foreground hover:bg-gray-100"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* BOTÓN HAMBURGUESA (SOLO MÓVIL) */}
            <button
              className="md:hidden p-2 rounded-md hover:bg-gray-100"
              onClick={() => setOpen(!open)}
            >
              {open ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </nav>

      {/* MENÚ MÓVIL DESPLEGABLE */}
      {open && (
        <div className="md:hidden fixed top-16 left-0 w-full bg-white border-b z-30 animate-slide-down shadow-lg">
          <div className="flex flex-col px-4 py-2 gap-2">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-md text-base",
                    isActive
                      ? "bg-black text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* ESPACIADO PARA QUE EL CONTENIDO NO SUBA BAJO EL NAV */}
      <div className="h-16"></div>
    </>
  );
}
