"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Users, Plus, Bell, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/today", label: "Today", icon: <CalendarDays size={22} /> },
  { href: "/buyers", label: "Buyers", icon: <Users size={22} /> },
  { href: "/reminders", label: "Reminders", icon: <Bell size={22} /> },
  { href: "/settings", label: "Settings", icon: <Settings size={22} /> },
];

function BottomNavItem({ href, label, icon, active }: { href: string; label: string; icon: React.ReactNode; active: boolean }) {
  return (
    <Link href={href} className="flex flex-col items-center justify-center gap-1 w-14 pt-1">
      <span className={cn("w-1 h-1 rounded-full mb-0.5 transition-colors", active ? "bg-secondary" : "bg-transparent")} />
      <span className={cn("transition-colors", active ? "text-secondary" : "text-white/60")}>{icon}</span>
      <span className={cn("text-[11px] font-medium leading-none transition-colors", active ? "text-secondary" : "text-white/60")}>{label}</span>
    </Link>
  );
}

function SidebarItem({ href, label, icon, active }: { href: string; label: string; icon: React.ReactNode; active: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-medium transition-colors",
        active ? "bg-white/12 text-white" : "text-white/65 hover:text-white hover:bg-white/8"
      )}
    >
      {icon}
      {label}
    </Link>
  );
}

export function BottomNav() {
  const pathname = usePathname();

  return (
    <>
      {/* ── Mobile / tablet bottom nav ── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-primary h-16 flex items-center justify-around px-2 pb-safe">
        {NAV_ITEMS.slice(0, 2).map((item) => (
          <BottomNavItem key={item.href} {...item} active={pathname === item.href || (item.href !== "/today" && pathname.startsWith(item.href))} />
        ))}
        <Link
          href="/add"
          aria-label="Add buyer"
          className="relative -top-4 flex items-center justify-center w-14 h-14 bg-secondary rounded-full shadow-[0_4px_16px_rgba(0,106,98,0.45)]"
        >
          <Plus size={26} className="text-white" />
        </Link>
        {NAV_ITEMS.slice(2).map((item) => (
          <BottomNavItem key={item.href} {...item} active={pathname.startsWith(item.href)} />
        ))}
      </nav>

      {/* ── Desktop left sidebar ── */}
      <nav className="hidden lg:flex flex-col fixed top-0 left-0 bottom-0 w-56 bg-primary z-30 py-8 px-3 gap-1">
        <Link
          href="/today"
          className="px-4 py-3 mb-4 font-bold text-[17px] text-white tracking-tight"
        >
          BuyerPocket
        </Link>

        {NAV_ITEMS.map((item) => (
          <SidebarItem
            key={item.href}
            {...item}
            active={item.href === "/today" ? pathname === "/today" : pathname.startsWith(item.href)}
          />
        ))}

        <div className="mt-auto">
          <Link
            href="/add"
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-secondary text-white text-[14px] font-semibold hover:bg-secondary/90 transition-colors"
          >
            <Plus size={20} />
            Add buyer
          </Link>
        </div>
      </nav>
    </>
  );
}
