"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ProtectedRoute } from "@/features/auth/hooks";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  HomeIcon,
  CalendarIcon,
  PaletteIcon,
  CreditCardIcon,
} from "lucide-react";
import CosmosLogo from "@/components/Logo";
import { UserMenu } from "@/components/UserMenu";

const sidebarItems = [
  {
    label: "Home",
    href: "/d",
    icon: HomeIcon,
  },
  {
    label: "Brands",
    href: "/d/brands",
    icon: PaletteIcon,
  },
  {
    label: "Calendar",
    href: "/d/calendar",
    icon: CalendarIcon,
  },
];

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <ProtectedRoute>
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <CosmosLogo />
            <Button asChild size="sm" variant={"outline"}>
              <Link href="/(dashboard)/brands">+ Create New</Link>
            </Button>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu className="gap-2">
                  {sidebarItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={isActive(item.href)}>
                        <Link href={item.href}>
                          <item.icon />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarSeparator />
          <SidebarFooter>
            <SidebarMenuButton asChild>
              <Link href="/d/subscription">
                <CreditCardIcon />
                <span>Subscription</span>
              </Link>
            </SidebarMenuButton>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>

        <SidebarInset>
          <header className="sticky top-0 z-10 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
            <div className="px-4 py-2 flex items-center gap-3">
              <SidebarTrigger />
              <div className="ml-auto flex items-center gap-2">
                <UserMenu />
              </div>
            </div>
          </header>
          <div className="p-6">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
