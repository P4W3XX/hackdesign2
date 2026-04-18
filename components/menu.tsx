"use client";

import React, { useState } from "react";
import {
  Briefcase,
  Menu as MenuIcon,
  X,
  TrendingUp,
  CheckCircle,
  ChevronUp,
  Sparkles,
  Settings,
  ShoppingBag,
  Receipt,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MenuProps {
  onNavigate?: (page: "jobs" | "career" | "home") => void;
  isExpanded: boolean;
  onToggleMenu: () => void;
}

export const Menu: React.FC<MenuProps> = ({
  onNavigate,
  isExpanded,
  onToggleMenu,
}) => {
  const [activeItem, setActiveItem] = useState<string>("jobs");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const user = { name: "John Doe" };
  const router = useRouter();

  const menuItems = [
    {
      id: "jobs",
      label: "Oferty pracy",
      icon: Briefcase,
      description: "Porównaj warunki i wynagrodzenie",
      page: "jobs" as const,
    },
    {
      id: "career",
      label: "Ścieżka rozwoju",
      icon: TrendingUp,
      description: "Wymagania do awansu",
      page: "career" as const,
    },
    {
      id: "form",
      label: "Zgodność formularza",
      icon: CheckCircle,
      description: "Walidacja danych",
      page: "home" as const,
    },
  ];

  const handleMenuItemClick = (item: (typeof menuItems)[0]) => {
    if (onNavigate) {
      onNavigate(item.page);
    }
    setActiveItem(item.id);
  };

  return (
    <aside
      className={cn(
        "fixed z-50 h-svh bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-500 ease-in-out overflow-hidden flex flex-col",
        isExpanded ? "w-72" : "w-20"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border h-16">
        {isExpanded && (
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="size-5" />
            </div>
            <h1 className="text-lg font-bold tracking-tight">JobFinder</h1>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onToggleMenu}
          aria-label="Toggle menu"
          className="ml-auto"
        >
          {isExpanded ? <X className="size-5" /> : <MenuIcon className="size-5" />}
        </Button>
      </div>

      {/* Menu Items */}
      <nav className="p-3 flex flex-col gap-1 overflow-y-auto flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleMenuItemClick(item)}
              className={cn(
                "group relative w-full rounded-lg text-left transition-all duration-200 flex items-center gap-3 px-3 py-2.5",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
              title={!isExpanded ? item.label : undefined}
            >
              <Icon
                className={cn(
                  "size-5 flex-shrink-0",
                  isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-sidebar-accent-foreground"
                )}
              />

              {isExpanded && (
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm leading-tight truncate">
                    {item.label}
                  </p>
                  <p
                    className={cn(
                      "text-xs truncate mt-0.5",
                      isActive
                        ? "text-primary-foreground/80"
                        : "text-muted-foreground"
                    )}
                  >
                    {item.description}
                  </p>
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer user dropdown */}
      <div className="border-t border-sidebar-border p-3">
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                "relative flex w-full cursor-pointer items-center gap-3 rounded-lg p-2 hover:bg-sidebar-accent transition-colors",
                !isExpanded && "justify-center"
              )}
            >
              <div className="relative flex size-9 items-center justify-center rounded-lg bg-primary font-semibold text-primary-foreground flex-shrink-0 text-sm">
                {user?.name
                  ?.split(" ")
                  .map((word) => word.charAt(0))
                  .join("")
                  .toUpperCase()}
              </div>
              {isExpanded && (
                <>
                  <span className="flex-1 text-left text-sm font-medium truncate">
                    {user?.name || "User"}
                  </span>
                  <ChevronUp
                    className={cn(
                      "size-4 text-muted-foreground transition-transform",
                      isDropdownOpen && "rotate-180"
                    )}
                  />
                </>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="center"
            side="top"
            sideOffset={10}
            className="w-64"
          >
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => router.push("/exchange")}>
                <ShoppingBag className="size-4" />
                Wymień punkty eko
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/bills")}>
                <Receipt className="size-4" />
                Twoje rachunki
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/settings")}>
                <Settings className="size-4" />
                Ustawienia
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem variant="destructive">
                <LogOut className="size-4" />
                Wyloguj
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
};
