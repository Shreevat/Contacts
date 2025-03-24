"use client";

import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { LayoutDashboard, Users, FileText, LogOut, Menu } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  const handleLogout = () => {
    // Remove auth token
    Cookies.remove("authToken");

    // Remove session counts cookies
    Cookies.remove("sessionContactsCount");
    Cookies.remove("sessionNotesCount");
    navigate("/login");
    window.location.reload();
  };

  const navItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
    },
    {
      title: "Contacts",
      icon: Users,
      href: "/contacts",
    },
    {
      title: "Notes",
      icon: FileText,
      href: "/notes",
    },
  ];

  const NavItem = ({ item }: { item: typeof navItems[0] }) => {
    const isActive = location.pathname === item.href;
    
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={isActive ? "secondary" : "ghost"}
              size="lg"
              className={cn(
                "w-full justify-start gap-2 px-3",
                isActive && "bg-primary/10 font-medium"
              )}
              onClick={() => {
                navigate(item.href);
                setIsMobileOpen(false);
              }}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.title}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">{item.title}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  // Desktop sidebar
  const SidebarContent = () => (
    <div className="flex h-full flex-col gap-2 p-3">
      <div className="flex h-14 items-center border-b px-3 py-4">
        <h2 className="text-lg font-semibold">MakeMyNotes</h2>
      </div>
      <div className="flex-1 py-2">
        <nav className="grid gap-1">
          {navItems.map((item, index) => (
            <NavItem key={index} item={item} />
          ))}
        </nav>
      </div>
      <div className="mt-auto border-t pt-3">
        <Button
          variant="destructive"
          className="w-full justify-start gap-2"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );

  // Mobile sidebar trigger
  const MobileSidebar = () => (
    <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <SidebarContent />
      </SheetContent>
    </Sheet>
  );

  return (
    <>
      <MobileSidebar />
      <div className={cn("hidden h-screen w-64 border-r bg-background md:flex md:flex-col", className)}>
        <SidebarContent />
      </div>
    </>
  );
};

export default Sidebar;
