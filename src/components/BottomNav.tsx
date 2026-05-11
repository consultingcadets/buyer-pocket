"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Users, Plus, Bell, Settings, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/today", label: "Today", icon: CalendarDays },
  { href: "/buyers", label: "Buyers", icon: Users },
  { href: "/properties", label: "Properties", icon: Building2 },
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
    <Link
      href={href}
      className={cn(
        "flex min-h-12 min-w-12 flex-col items-center justify-center gap-1 rounded-xl px-2 py-1.5 transition-colors",
        active ? "text-teal-action" : "text-white/70 hover:text-white"
      )}
      aria-current={active ? "page" : undefined}
    >
      <span
        className={cn(
          "mb-0.5 h-1 w-1 rounded-full transition-colors",
          active ? "bg-teal-action" : "bg-transparent"
        )}
      />
      <span className="transition-colors">
        <Icon size={20} />
      </span>
      <span
        className={cn(
          "text-xs font-medium leading-none transition-colors",
          active ? "text-teal-action" : "text-inherit"
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
        "relative flex min-h-12 items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all",
        active
          ? "bg-white/12 text-white"
          : "text-white/70 hover:bg-white/8 hover:text-white"
      )}
      aria-current={active ? "page" : undefined}
    >
      {active && (
        <span className="absolute left-1.5 top-1/2 -translate-y-1/2 h-5 w-0.75 rounded-full bg-teal-action" />
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
      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-white/10 bg-primary/98 px-2 pb-safe pt-2 backdrop-blur lg:hidden">
        <div className="mx-auto flex h-16 max-w-xl items-center justify-around">
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
          className="relative -top-5 flex size-14 items-center justify-center rounded-full bg-teal-action shadow-[0_10px_24px_rgba(0,106,98,0.45)]"
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
        </div>
      </nav>

      {/* ── Desktop left sidebar ── */}
      <nav className="fixed bottom-0 left-0 top-0 z-30 hidden w-64 flex-col border-r border-white/10 bg-primary px-3 py-6 lg:flex">
        {/* Brand */}
        <Link href="/today" className="mb-6 flex min-h-12 items-center gap-2.5 px-3 py-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-teal-action">
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
            <span className="text-[15px] font-bold leading-tight tracking-tight text-white">BuyerPocket</span>
            <span className="text-xs leading-none text-white/55">Agent Portal</span>
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
            className="flex min-h-12 items-center gap-3 rounded-xl bg-teal-action px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-action/90"
          >
            <Plus size={18} />
            Add Buyer
          </Link>
        </div>
      </nav>
    </>
  );
}
