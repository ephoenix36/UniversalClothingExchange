"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Shirt, Heart, MessageCircle, User, Sparkles, ShoppingBag, Settings, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import Logo from "./Logo";

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Wardrobe", href: "/wardrobe", icon: Shirt },
  { name: "Discover", href: "/discover", icon: Sparkles },
  { name: "Swaps", href: "/swaps", icon: Heart },
  { name: "Messages", href: "/messages", icon: MessageCircle },
  { 
    name: "Profile", 
    href: "/profile", 
    icon: User,
    submenu: [
      { name: "Creator", href: "/creator", icon: ShoppingBag },
      { name: "Settings", href: "/settings", icon: Settings },
    ]
  },
];

export default function Navigation() {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const isRouteActive = (href: string, submenu?: any[]) => {
    if (pathname === href) return true;
    if (submenu) {
      return submenu.some(item => pathname === item.href);
    }
    return false;
  };

  return (
    <nav className="sticky top-0 z-50 glass-nav shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <Logo variant="icon" size={40} className="group-hover:scale-105 transition-transform" />
            <span className="hidden lg:block text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Universal Clothing Exchange
            </span>
            <span className="hidden sm:block lg:hidden text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              UCE
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = isRouteActive(item.href, item.submenu);
              
              if (item.submenu) {
                return (
                  <div 
                    key={item.name}
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(item.name)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button
                      className={cn(
                        "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
                        isActive
                          ? "bg-gradient-to-r from-[#4a8a62] to-[#d98960] text-white shadow-md shadow-[#4a8a62]/20"
                          : "text-[#241f1c] hover:bg-[#eae4d6] hover:text-[#241f1c]"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                      <ChevronDown className={cn(
                        "w-3 h-3 transition-transform",
                        openDropdown === item.name && "rotate-180"
                      )} />
                    </button>
                    
                    {/* Dropdown Menu */}
                    {openDropdown === item.name && (
                      <div className="absolute top-full right-0 mt-2 w-48 glass-card rounded-xl shadow-xl overflow-hidden">
                        {item.submenu.map((subItem) => {
                          const SubIcon = subItem.icon;
                          const isSubActive = pathname === subItem.href;
                          return (
                            <Link
                              key={subItem.name}
                              href={subItem.href}
                              className={cn(
                                "flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors",
                                isSubActive
                                  ? "bg-[#eae4d6] text-[#241f1c]"
                                  : "text-[#241f1c] hover:bg-[#eae4d6]/50"
                              )}
                            >
                              <SubIcon className="w-4 h-4" />
                              <span>{subItem.name}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
                    isActive
                      ? "bg-gradient-to-r from-[#4a8a62] to-[#d98960] text-white shadow-md shadow-[#4a8a62]/20"
                      : "text-[#241f1c] hover:bg-[#eae4d6] hover:text-[#241f1c]"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background/98 backdrop-blur-lg border-t border-border shadow-2xl z-50">
        <div className="grid grid-cols-5 gap-1 px-3 py-3 safe-area-bottom">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = isRouteActive(item.href, item.submenu);
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl transition-all",
                  isActive
                    ? "bg-gradient-to-br from-primary to-secondary text-primary-foreground shadow-md shadow-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium leading-none">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
