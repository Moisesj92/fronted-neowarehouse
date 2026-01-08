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
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/20/solid";

export function Layout() {
  const location = useLocation();
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) {
      return saved === "dark";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  // Cerrar menú móvil al cambiar de ruta
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const navItems = [
    { href: "/", icon: HomeIcon, label: "Dashboard" },
    { href: "/products", icon: CubeIcon, label: "Productos" },
    { href: "/categories", icon: SwatchIcon, label: "Categorías" },
    {
      href: "/inventory",
      icon: ClipboardDocumentListIcon,
      label: "Inventario",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col md:flex-row dark:bg-zinc-900">
      {/* Header móvil con hamburguesa */}
      <header className="flex items-center justify-between p-4 bg-zinc-100 border-b border-zinc-300 md:hidden dark:bg-zinc-800 dark:border-zinc-700">
        <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          NeoWarehouse
        </span>
        <div className="flex items-center gap-2">
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
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            aria-label="Abrir menú"
          >
            {isMobileMenuOpen ? (
              <XMarkIcon className="w-6 h-6 text-zinc-700 dark:text-zinc-300" />
            ) : (
              <Bars3Icon className="w-6 h-6 text-zinc-700 dark:text-zinc-300" />
            )}
          </button>
        </div>
      </header>

      {/* Overlay para cerrar menú en móvil */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Menú móvil deslizable */}
      <nav
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-zinc-100 border-r border-zinc-300 transition-transform duration-300 ease-in-out md:hidden dark:bg-zinc-800 dark:border-zinc-700 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-zinc-300 dark:border-zinc-700">
          <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            NeoWarehouse
          </span>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            aria-label="Cerrar menú"
          >
            <XMarkIcon className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
          </button>
        </div>
        <div className="p-4 space-y-2">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-colors ${
                location.pathname === item.href
                  ? "bg-zinc-200 dark:bg-zinc-700"
                  : "hover:bg-zinc-200/70 dark:hover:bg-zinc-700/70"
              }`}
            >
              <item.icon className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
              <span className="text-zinc-600 dark:text-zinc-300">
                {item.label}
              </span>
            </a>
          ))}
        </div>
      </nav>

      {/* Sidebar desktop */}
      <div className="hidden w-64 shrink-0 p-4 md:block">
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
              {navItems.map((item) => (
                <SidebarItem
                  key={item.href}
                  href={item.href}
                  current={location.pathname === item.href}
                  className="rounded-2xl text-zinc-900 hover:bg-zinc-200/70 hover:text-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-700/70 dark:hover:text-white"
                >
                  <item.icon className="text-zinc-700 dark:text-zinc-300" />
                  <SidebarLabel className="text-zinc-600 dark:text-zinc-300">
                    {item.label}
                  </SidebarLabel>
                </SidebarItem>
              ))}
            </SidebarSection>
          </SidebarBody>
        </Sidebar>
      </div>

      {/* Contenido principal */}
      <main className="flex-1 overflow-auto p-4 bg-white md:p-8 dark:bg-zinc-900">
        <Outlet />
      </main>
    </div>
  );
}
