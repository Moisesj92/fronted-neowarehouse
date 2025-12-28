import { Outlet } from "react-router";
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
} from "@heroicons/react/20/solid";

export function Layout() {
  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <div className="w-64 shrink p-4">
        <Sidebar className="h-full rounded-2xl border border-zinc-300 bg-zinc-100">
          <SidebarHeader>
            <SidebarLabel className="text-lg text-center font-semibold text-zinc-900">
              NeoWarehouse
            </SidebarLabel>
          </SidebarHeader>

          <SidebarBody>
            <SidebarSection>
              <SidebarItem
                href="/"
                className=" rounded-2xl text-zinc-900 hover:bg-zinc-200/70 hover:text-zinc-950"
              >
                <HomeIcon className="text-zinc-700" />
                <SidebarLabel className="text-zinc-600">Dashboard</SidebarLabel>
              </SidebarItem>

              <SidebarItem
                href="/products"
                className="rounded-2xl text-zinc-900 hover:bg-zinc-200/70 hover:text-zinc-950"
              >
                <CubeIcon className="text-zinc-700" />
                <SidebarLabel className="text-zinc-600">Productos</SidebarLabel>
              </SidebarItem>

              <SidebarItem
                href="/categories"
                className="rounded-2xl text-zinc-900 hover:bg-zinc-200/70 hover:text-zinc-950"
              >
                <SwatchIcon className="text-zinc-700" />
                <SidebarLabel className="text-zinc-600">
                  Categorías
                </SidebarLabel>
              </SidebarItem>

              <SidebarItem
                href="/inventory"
                className=" rounded-2xl text-zinc-900 hover:bg-zinc-200/70 hover:text-zinc-950"
              >
                <ClipboardDocumentListIcon className="text-zinc-700" />
                <SidebarLabel className="text-zinc-600">
                  Inventario
                </SidebarLabel>
              </SidebarItem>
            </SidebarSection>
          </SidebarBody>
        </Sidebar>
      </div>

      {/* Contenido principal */}
      <main className="flex-1 overflow-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
