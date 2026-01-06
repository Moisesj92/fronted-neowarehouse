import { Outlet, useLocation } from "react-router";
import { useState, useEffect } from "react";
import {
  Sidebar,
  SidebarBody,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
} from "../components/ui";
import {
  HomeIcon,
  CubeIcon,
  ClipboardDocumentListIcon,
  SwatchIcon,
  SunIcon,
  MoonIcon,
} from "@heroicons/react/20/solid";

export function Layout() {
  const location = useLocation();
  const [isDark, setIsDark] = useState(() => {
    // Leer preferencia guardada o usar la del sistema
    const saved = localStorage.getItem("theme");
    if (saved) {
      return saved === "dark";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    // Aplicar o remover la clase 'dark' en el elemento html
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <div className="flex h-screen overflow-hidden dark:bg-zinc-900">
      <div className="w-64 shrink p-4">
        <Sidebar className="h-full rounded-2xl border border-zinc-300 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800">
          <SidebarHeader>
            <div className="flex items-center justify-between px-2">
              <SidebarLabel className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                NeoWarehouse
              </SidebarLabel>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                aria-label="Cambiar tema"
              >
                {isDark ? (
                  <SunIcon className="w-5 h-5 text-yellow-500" />
                ) : (
                  <MoonIcon className="w-5 h-5 text-zinc-700" />
                )}
              </button>
            </div>
          </SidebarHeader>

          <SidebarBody>
            <SidebarSection>
              <SidebarItem
                href="/"
                current={location.pathname === "/"}
                className="rounded-2xl text-zinc-900 hover:bg-zinc-200/70 hover:text-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-700/70 dark:hover:text-white"
              >
                <HomeIcon className="text-zinc-700 dark:text-zinc-300" />
                <SidebarLabel className="text-zinc-600 dark:text-zinc-300">
                  Dashboard
                </SidebarLabel>
              </SidebarItem>

              <SidebarItem
                href="/products"
                current={location.pathname === "/products"}
                className="rounded-2xl text-zinc-900 hover:bg-zinc-200/70 hover:text-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-700/70 dark:hover:text-white"
              >
                <CubeIcon className="text-zinc-700 dark:text-zinc-300" />
                <SidebarLabel className="text-zinc-600 dark:text-zinc-300">
                  Productos
                </SidebarLabel>
              </SidebarItem>

              <SidebarItem
                href="/categories"
                current={location.pathname === "/categories"}
                className="rounded-2xl text-zinc-900 hover:bg-zinc-200/70 hover:text-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-700/70 dark:hover:text-white"
              >
                <SwatchIcon className="text-zinc-700 dark:text-zinc-300" />
                <SidebarLabel className="text-zinc-600 dark:text-zinc-300">
                  Categorías
                </SidebarLabel>
              </SidebarItem>

              <SidebarItem
                href="/inventory"
                current={location.pathname === "/inventory"}
                className="rounded-2xl text-zinc-900 hover:bg-zinc-200/70 hover:text-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-700/70 dark:hover:text-white"
              >
                <ClipboardDocumentListIcon className="text-zinc-700 dark:text-zinc-300" />
                <SidebarLabel className="text-zinc-600 dark:text-zinc-300">
                  Inventario
                </SidebarLabel>
              </SidebarItem>
            </SidebarSection>
          </SidebarBody>
        </Sidebar>
      </div>

      {/* Contenido principal */}
      <main className="flex-1 overflow-auto p-8 bg-white dark:bg-zinc-900">
        <Outlet />
      </main>
    </div>
  );
}
