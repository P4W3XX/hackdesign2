"use client"

import { sidebarItems } from "@/constants"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  ChevronUp,
  BanknoteIcon,
  LogOutIcon,
  SettingsIcon,
  ShoppingBagIcon,
  Menu,
  X,
} from "lucide-react"
import { useState, useEffect } from "react"

import { useUserStore } from "@/store/user";
import { logoutAction } from "@/actions/auth-action";
import { createClient } from "@/lib/supabase/client";


export default function Sidebar() {
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { user, setUser } = useUserStore();
  const supabase = createClient()
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (authUser) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('full_name, salary')
          .eq('id', authUser.id)
          .single();

        if (profile) {
          setUser({
            id: authUser.id,
            email: authUser.email!,
            name: profile.full_name || authUser.user_metadata.full_name, 
            salary: profile.salary
          });
        } else {
          console.warn("Zalogowany, ale brak rekordu w tabeli profiles");
        }

        const channel = supabase
          .channel('points-update')
          .on('postgres_changes', { 
            event: 'UPDATE', 
            schema: 'public', 
            table: 'profiles', 
            filter: `id=eq.${authUser.id}` 
          }, (payload) => {
            setUser({ ...user! });
          })
          .subscribe();

        return () => { supabase.removeChannel(channel); };
      }
    };
    
    if (!user && isMounted) { 
      fetchUser();
    }
  }, [setUser, user, isMounted, supabase.auth]);

  if (
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password" ||
    pathname === "/"
  ) {
    return null
  }

  const handleLogout = async () => {
    useUserStore.getState().setUser(null); 
    
    await logoutAction();
  };

  // Mobile Menu Navigation
  const mobileMenu = (
    <>
      {/* Mobile Hamburger Button */}
      <div className="sm:hidden flex items-center justify-between w-full p-4 border-b bg-white fixed top-0 left-0 right-0 z-50 ">
        <h1 className="font-bold text-lg">MZK</h1>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>  

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="sm:hidden fixed inset-0 bg-black/50 z-30 top-16"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sliding Menu */}
      <div
        className={`sm:hidden fixed top-16 left-0 h-screen w-64 bg-white border-r z-40 transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 space-y-2">
          {sidebarItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link
                key={index}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex w-full cursor-pointer items-center space-x-3 rounded-xl px-3 py-3 transition ${
                  pathname === item.href
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-foreground font-medium hover:bg-gray-100"
                }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span>{item.title}</span>
              </Link>
            );
          })}

          <div className="my-4 border-t pt-4">
            <button
              onClick={() => {
                router.push("/settings");
                setIsMobileMenuOpen(false);
              }}
              className="flex w-full cursor-pointer items-center space-x-3 rounded-xl px-3 py-3 text-foreground font-medium hover:bg-gray-100 transition"
            >
              <SettingsIcon className="h-5 w-5" />
              <span>Settings</span>
            </button>
            <button
              onClick={() => {
                router.push("/exchange");
                setIsMobileMenuOpen(false);
              }}
              className="flex w-full cursor-pointer items-center space-x-3 rounded-xl px-3 py-3 text-foreground font-medium hover:bg-gray-100 transition"
            >
              <ShoppingBagIcon className="h-5 w-5" />
              <span>Exchange Rewards</span>
            </button>
            <button
              onClick={async () => {
                await handleLogout();
                setIsMobileMenuOpen(false);
              }}
              className="flex w-full cursor-pointer items-center space-x-3 rounded-xl px-3 py-3 text-red-600 font-medium hover:bg-red-50 transition"
            >
              <LogOutIcon className="h-5 w-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {mobileMenu}
      <main className="hidden bg-white sm:flex h-full w-24 lg:w-80 flex-col justify-between border-r p-2 lg:p-4">
        <div>
          <div className="mt-20 flex w-full flex-col space-y-2">
          {sidebarItems.map((item, index) => {
            const Icon = item.icon
            return (
              <Link
                key={index}
                href={item.href}
                className={`flex w-full cursor-pointer items-center space-x-3 rounded-xl px-2 lg:px-3 py-2.5 ${pathname === item.href ? "bg-primary/10" : ""}`}
                title={item.title}
              >
                <Icon className="h-5.5 w-5.5 text-primary flex-shrink-0" />
                <span
                  className={`hidden lg:inline text-base text-foreground ${pathname === item.href ? "font-semibold text-primary" : "font-medium"}`}
                >
                  {item.title}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
      
    </main>
    </>
  )
}
