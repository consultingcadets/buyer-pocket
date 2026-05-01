"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Users, Plus, Bell, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/today", label: "Today", icon: CalendarDays },
  { href: "/buyers", label: "Buyers", icon: Users },
  { href: "/reminders", label: "Reminders", icon: Bell },
  { href: "/settings", label: "Settings", icon: Settings },
];

function BottomNavItem({
  href,
  label,
  Icon,
  active,
}: {
  href: string;
  label: string;
  Icon: React.ElementType;
  active: boolean;
}) {
  return (
    <Link href={href} className="flex flex-col items-center justify-center gap-1 w-14 pt-1">
      <span
        className={cn(
          "w-1 h-1 rounded-full mb-0.5 transition-colors",
          active ? "bg-teal-action" : "bg-transparent"
        )}
      />
      <span className={cn("transition-colors", active ? "text-teal-action" : "text-white/55")}>
        <Icon size={22} />
      </span>
      <span
        className={cn(
          "text-[11px] font-medium leading-none transition-colors",
          active ? "text-teal-action" : "text-white/55"
        )}
      >
        {label}
      </span>
    </Link>
  );
}

function SidebarItem({
  href,
  label,
  Icon,
  active,
}: {
  href: string;
  label: string;
  Icon: React.ElementType;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "relative flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13.5px] font-medium transition-all",
        active
          ? "bg-white/10 text-white"
          : "text-white/55 hover:text-white/85 hover:bg-white/6"
      )}
    >
      {active && (
        <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-teal-action rounded-full" />
      )}
      <Icon
        size={18}
        className={cn("shrink-0 transition-colors", active ? "text-teal-action" : "text-current")}
      />
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
          <BottomNavItem
            key={item.href}
            href={item.href}
            label={item.label}
            Icon={item.icon}
            active={
              pathname === item.href ||
              (item.href !== "/today" && pathname.startsWith(item.href))
            }
          />
        ))}
        <Link
          href="/add"
          aria-label="Add buyer"
          className="relative -top-4 flex items-center justify-center w-14 h-14 bg-teal-action rounded-full shadow-[0_4px_16px_rgba(0,106,98,0.45)]"
        >
          <Plus size={26} className="text-white" />
        </Link>
        {NAV_ITEMS.slice(2).map((item) => (
          <BottomNavItem
            key={item.href}
            href={item.href}
            label={item.label}
            Icon={item.icon}
            active={pathname.startsWith(item.href)}
          />
        ))}
      </nav>

      {/* ── Desktop left sidebar ── */}
      <nav className="hidden lg:flex flex-col fixed top-0 left-0 bottom-0 w-60 bg-primary z-30 py-6 px-3">
        {/* Brand */}
        <Link href="/today" className="flex items-center gap-2.5 px-3 py-2 mb-6">
          <div className="w-8 h-8 rounded-xl bg-teal-action flex items-center justify-center shrink-0">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-[15px] text-white tracking-tight leading-tight">BuyerPocket</span>
            <span className="text-[10px] text-white/40 leading-none">Agent Portal</span>
          </div>
        </Link>

        <div className="flex flex-col gap-0.5">
          {NAV_ITEMS.map((item) => (
            <SidebarItem
              key={item.href}
              href={item.href}
              label={item.label}
              Icon={item.icon}
              active={
                item.href === "/today"
                  ? pathname === "/today"
                  : pathname.startsWith(item.href)
              }
            />
          ))}
        </div>

        <div className="mt-auto pt-4 border-t border-white/10">
          <Link
            href="/add"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-teal-action text-white text-[13.5px] font-semibold hover:bg-teal-action/90 transition-colors"
          >
            <Plus size={18} />
            Add Buyer
          </Link>
        </div>
      </nav>
    </>
  );
}
