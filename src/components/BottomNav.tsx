"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Users, Plus, Bell, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

function NavItem({
  href,
  label,
  icon,
  active,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center justify-center gap-1 w-14 pt-1"
    >
      {/* Active dot */}
      <span className={cn("w-1 h-1 rounded-full mb-0.5 transition-colors", active ? "bg-secondary" : "bg-transparent")} />
      <span className={cn("transition-colors", active ? "text-secondary" : "text-white/60")}>
        {icon}
      </span>
      <span className={cn("text-[11px] font-medium leading-none transition-colors", active ? "text-secondary" : "text-white/60")}>
        {label}
      </span>
    </Link>
  );
}

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-primary h-16 flex items-center justify-around px-2 pb-safe">
      <NavItem href="/today" label="Today" icon={<CalendarDays size={22} />} active={pathname === "/today"} />
      <NavItem href="/buyers" label="Buyers" icon={<Users size={22} />} active={pathname.startsWith("/buyers")} />

      {/* Raised Add button */}
      <Link
        href="/add"
        aria-label="Add buyer"
        className="relative -top-4 flex items-center justify-center w-14 h-14 bg-secondary rounded-full shadow-[0_4px_16px_rgba(0,106,98,0.45)]"
      >
        <Plus size={26} className="text-white" />
      </Link>

      <NavItem href="/reminders" label="Reminders" icon={<Bell size={22} />} active={pathname.startsWith("/reminders")} />
      <NavItem href="/settings" label="Settings" icon={<Settings size={22} />} active={pathname.startsWith("/settings")} />
    </nav>
  );
}
