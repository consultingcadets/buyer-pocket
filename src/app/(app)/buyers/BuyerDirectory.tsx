"use client";

import {
  useState,
  useEffect,
  useRef,
  useTransition,
  useCallback,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  type BuyerFilters,
  type SortOption,
  SORT_OPTIONS,
  getActiveFilterCount,
  filtersToChips,
} from "@/lib/buyer-filters";
import type { Buyer } from "@/types/database";
import { fetchBuyers, archiveBuyer } from "./actions";
import { PAGE_SIZE } from "@/lib/buyer-filters";
import { BuyerCard } from "./BuyerCard";
import { FilterSheet } from "./FilterSheet";

// ─── Icons ───────────────────────────────────────────────────────────────────

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
  );
}
function FilterIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" x2="4" y1="21" y2="14" /><line x1="4" x2="4" y1="6" y2="3" />
      <line x1="12" x2="12" y1="21" y2="16" /><line x1="12" x2="12" y1="8" y2="3" />
      <line x1="20" x2="20" y1="21" y2="19" /><line x1="20" x2="20" y1="11" y2="3" />
      <line x1="1" x2="7" y1="14" y2="14" /><line x1="9" x2="15" y1="16" y2="16" />
      <line x1="17" x2="23" y1="19" y2="19" />
    </svg>
  );
}
function PlusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" /><path d="M12 5v14" />
    </svg>
  );
}
function ChevronDownIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
function XIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18" /><path d="m6 6 12 12" />
    </svg>
  );
}

// ─── Bottom Nav ───────────────────────────────────────────────────────────────

function BottomNav() {
  const navItems = [
    {
      label: "Today",
      href: "/today",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="18" x="3" y="4" rx="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
        </svg>
      ),
    },
    {
      label: "Buyers",
      href: "/buyers",
      active: true,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      label: "Listings",
      href: "/listings",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect width="16" height="20" x="4" y="2" rx="2" /><path d="M9 22v-4h6v4" /><path d="M8 6h.01" /><path d="M16 6h.01" /><path d="M12 6h.01" /><path d="M12 10h.01" /><path d="M12 14h.01" /><path d="M16 10h.01" /><path d="M16 14h.01" /><path d="M8 10h.01" /><path d="M8 14h.01" />
        </svg>
      ),
    },
    {
      label: "Inspections",
      href: "/inspections",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect width="8" height="4" x="8" y="2" rx="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        </svg>
      ),
    },
    {
      label: "Settings",
      href: "/settings",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" />
        </svg>
      ),
    },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-[#E0E1DD] flex">
      {navItems.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className={cn(
            "flex-1 flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium",
            item.active ? "text-[#2EC4B6]" : "text-[#44474C]"
          )}
        >
          <span className={item.active ? "text-[#2EC4B6]" : "text-[#44474C]"}>
            {item.icon}
          </span>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

// ─── Sort Dropdown ────────────────────────────────────────────────────────────

function SortDropdown({
  sort,
  onChange,
}: {
  sort: SortOption;
  onChange: (s: SortOption) => void;
}) {
  const [open, setOpen] = useState(false);
  const label = SORT_OPTIONS.find((o) => o.field === sort)?.label ?? "Sort";

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 h-9 px-3 rounded-lg border border-[#E0E1DD] bg-white text-[13px] font-medium text-[#1B1B1D] hover:bg-[#F5F3F4]"
      >
        {label}
        <ChevronDownIcon />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-1 z-30 w-48 bg-white rounded-lg border border-[#E0E1DD] shadow-lg py-1">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.field}
                onClick={() => {
                  onChange(opt.field);
                  setOpen(false);
                }}
                className={cn(
                  "w-full text-left px-4 py-2.5 text-[13px] hover:bg-[#F0EDEE]",
                  sort === opt.field
                    ? "font-semibold text-[#0F1C2C]"
                    : "text-[#44474C]"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Skeletons ────────────────────────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="py-2 lg:py-0">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="mx-4 lg:mx-0 mb-3 lg:mb-0 bg-white rounded-lg lg:rounded-none p-4 lg:px-6 lg:py-4 lg:border-b lg:border-[#E0E1DD]"
          style={{ boxShadow: "0px 4px 20px rgba(13,27,42,0.05)" }}
        >
          <div className="flex justify-between mb-2">
            <div className="h-5 w-40 bg-[#F0EDEE] rounded animate-pulse" />
            <div className="h-5 w-14 bg-[#F0EDEE] rounded-full animate-pulse" />
          </div>
          <div className="h-3 w-56 bg-[#F0EDEE] rounded animate-pulse mb-3" />
          <div className="flex gap-2">
            {[1, 2, 3].map((j) => (
              <div key={j} className="flex-1 h-11 bg-[#F0EDEE] rounded-md animate-pulse" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function BuyerDirectory({
  initialBuyers,
  initialCount,
}: {
  initialBuyers: Buyer[];
  initialCount: number;
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const [buyers, setBuyers] = useState<Buyer[]>(initialBuyers);
  const [totalCount, setTotalCount] = useState(initialCount);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(initialBuyers.length < initialCount);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [filters, setFilters] = useState<BuyerFilters>({});
  const [sort, setSort] = useState<SortOption>("recently_added");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const sentinelRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  // Reload on filter/sort/search change
  useEffect(() => {
    setIsLoading(true);
    startTransition(async () => {
      const result = await fetchBuyers(
        { ...filters, search: debouncedSearch || undefined },
        sort,
        0
      );
      if (!result.error) {
        setBuyers(result.buyers);
        setTotalCount(result.count);
        setPage(0);
        setHasMore(result.buyers.length < result.count);
      }
      setIsLoading(false);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, sort, debouncedSearch]);

  // Infinite scroll
  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    const nextPage = page + 1;
    const result = await fetchBuyers(
      { ...filters, search: debouncedSearch || undefined },
      sort,
      nextPage
    );
    if (!result.error) {
      setBuyers((prev) => {
        const newList = [...prev, ...result.buyers];
        setHasMore(newList.length < result.count);
        return newList;
      });
      setPage(nextPage);
    }
    setIsLoadingMore(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingMore, hasMore, page, filters, sort, debouncedSearch]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !isLoadingMore && !isLoading) {
          loadMore();
        }
      },
      { rootMargin: "300px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasMore, isLoadingMore, isLoading, loadMore]);

  function handleArchive(id: string) {
    setBuyers((prev) => prev.filter((b) => b.id !== id));
    setTotalCount((prev) => prev - 1);
    startTransition(async () => {
      await archiveBuyer(id);
    });
  }

  function handleApplyFilters(newFilters: BuyerFilters) {
    setFilters(newFilters);
  }

  function handleClearFilters() {
    setFilters({});
  }

  function handleRemoveChip(newFilters: BuyerFilters) {
    setFilters(newFilters);
  }

  const activeChips = filtersToChips(filters);
  const filterCount = getActiveFilterCount(filters);
  const hasFiltersOrSearch = filterCount > 0 || debouncedSearch;

  const searchInput = (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#44474C]">
        <SearchIcon />
      </span>
      <input
        ref={searchRef}
        type="search"
        placeholder="Search buyers, suburbs…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="h-10 w-full rounded-lg border border-[#E0E1DD] bg-[#F5F3F4] pl-9 pr-3 text-[14px] text-[#1B1B1D] placeholder:text-[#A0A3AB] focus:outline-none focus:border-2 focus:border-[#3A86FF] focus:bg-white transition-all"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FBF9FA] flex flex-col">

      {/* ── Mobile Header ──────────────────────────────────────────────── */}
      <header className="lg:hidden sticky top-0 z-20 bg-white border-b border-[#E0E1DD]">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-[18px] font-bold text-[#0F1C2C]">
            Buyer Directory
            {!isLoading && (
              <span className="ml-1.5 text-[#44474C] font-normal text-[15px]">
                · {totalCount}
              </span>
            )}
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setShowSearchBar((v) => !v);
                setTimeout(() => searchRef.current?.focus(), 50);
              }}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#F0EDEE] text-[#44474C]"
            >
              <SearchIcon />
            </button>
            <button
              onClick={() => setIsFilterOpen(true)}
              className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#F0EDEE] text-[#44474C]"
            >
              <FilterIcon />
              {filterCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#2EC4B6] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {filterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {showSearchBar && (
          <div className="px-4 pb-3">{searchInput}</div>
        )}

        {/* Active chips — mobile */}
        {activeChips.length > 0 && (
          <div className="flex gap-2 px-4 pb-3 overflow-x-auto">
            {activeChips.map((chip) => (
              <button
                key={chip.id}
                onClick={() => handleRemoveChip(chip.remove(filters))}
                className="flex items-center gap-1.5 shrink-0 h-7 px-3 bg-[#EAE7E9] rounded-full text-[12px] font-medium text-[#1B1B1D]"
              >
                {chip.label}
                <XIcon />
              </button>
            ))}
          </div>
        )}
      </header>

      {/* ── Desktop Header ─────────────────────────────────────────────── */}
      <header className="hidden lg:flex items-center gap-4 px-6 py-4 bg-white border-b border-[#E0E1DD] sticky top-0 z-20">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <h1 className="text-[20px] font-bold text-[#0F1C2C]">Buyer Directory</h1>
          {!isLoading && (
            <span className="text-[#44474C] text-[15px]">· {totalCount}</span>
          )}
        </div>
        <div className="w-72">{searchInput}</div>
        <Link
          href="/add"
          className="flex items-center gap-1.5 h-10 px-4 bg-[#2EC4B6] text-white rounded-lg font-semibold text-[14px] hover:bg-[#27b0a4] transition-colors shrink-0"
        >
          <PlusIcon />
          Add Buyer
        </Link>
      </header>

      {/* ── Body ───────────────────────────────────────────────────────── */}
      <div className="flex flex-1 min-h-0">

        {/* Main list */}
        <main className="flex-1 min-w-0 pb-20 lg:pb-0">

          {/* Desktop toolbar */}
          <div className="hidden lg:flex items-center gap-3 px-6 py-3 bg-white border-b border-[#E0E1DD]">
            <button
              onClick={() => setIsFilterOpen((v) => !v)}
              className={cn(
                "flex items-center gap-1.5 h-9 px-3 rounded-lg border text-[13px] font-medium transition-colors",
                filterCount > 0
                  ? "border-[#2EC4B6] text-[#2EC4B6] bg-[#2EC4B6]/5"
                  : "border-[#E0E1DD] text-[#1B1B1D] hover:bg-[#F5F3F4]"
              )}
            >
              <FilterIcon />
              Filter
              {filterCount > 0 && (
                <span className="w-5 h-5 bg-[#2EC4B6] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {filterCount}
                </span>
              )}
            </button>

            <SortDropdown sort={sort} onChange={setSort} />

            {/* Active chips — desktop */}
            {activeChips.length > 0 && (
              <div className="flex items-center gap-2 flex-1 flex-wrap">
                {activeChips.map((chip) => (
                  <button
                    key={chip.id}
                    onClick={() => handleRemoveChip(chip.remove(filters))}
                    className="flex items-center gap-1.5 h-7 px-3 bg-[#EAE7E9] rounded-full text-[12px] font-medium text-[#1B1B1D] hover:bg-[#E0E1DD]"
                  >
                    {chip.label}
                    <XIcon />
                  </button>
                ))}
                {activeChips.length > 1 && (
                  <button
                    onClick={handleClearFilters}
                    className="h-7 px-2 text-[12px] text-[#3A86FF] font-medium"
                  >
                    Clear all
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Loading */}
          {isLoading && <LoadingSkeleton />}

          {/* Empty: no buyers at all */}
          {!isLoading && totalCount === 0 && !hasFiltersOrSearch && (
            <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
              <div className="w-16 h-16 rounded-full bg-[#F0EDEE] flex items-center justify-center mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#44474C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h2 className="text-[18px] font-semibold text-[#0F1C2C] mb-2">No buyers yet</h2>
              <p className="text-[14px] text-[#44474C] mb-6">
                Add your first buyer to get started tracking leads.
              </p>
              <Link
                href="/add"
                className="flex items-center gap-1.5 h-11 px-6 bg-[#2EC4B6] text-white rounded-lg font-semibold text-[14px]"
              >
                <PlusIcon />
                Add your first buyer
              </Link>
            </div>
          )}

          {/* Empty: filtered */}
          {!isLoading && buyers.length === 0 && hasFiltersOrSearch && (
            <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
              <div className="w-16 h-16 rounded-full bg-[#F0EDEE] flex items-center justify-center mb-4">
                <SearchIcon />
              </div>
              <h2 className="text-[18px] font-semibold text-[#0F1C2C] mb-2">
                No buyers match this
              </h2>
              <p className="text-[14px] text-[#44474C] mb-6">
                Try a different search or clear your filters.
              </p>
              <button
                onClick={() => {
                  setFilters({});
                  setSearch("");
                }}
                className="h-10 px-5 border border-[#E0E1DD] rounded-lg text-[14px] font-medium text-[#1B1B1D] hover:bg-[#F0EDEE]"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Buyer list */}
          {!isLoading && buyers.length > 0 && (
            <div className="pt-2 lg:pt-0">
              {buyers.map((b) => (
                <BuyerCard key={b.id} buyer={b} onArchive={handleArchive} />
              ))}
            </div>
          )}

          {/* Infinite scroll sentinel */}
          <div ref={sentinelRef} className="h-1" />
          {isLoadingMore && (
            <div className="flex justify-center py-6">
              <div className="w-6 h-6 border-2 border-[#2EC4B6] border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </main>

        {/* Filter panel */}
        <FilterSheet
          filters={filters}
          onFiltersChange={handleApplyFilters}
          onClear={handleClearFilters}
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
        />
      </div>

      {/* Mobile FAB */}
      <Link
        href="/add"
        className="lg:hidden fixed bottom-20 right-4 w-14 h-14 bg-[#2EC4B6] rounded-full flex items-center justify-center shadow-lg z-20 hover:bg-[#27b0a4] text-white"
        aria-label="Add buyer"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14" /><path d="M12 5v14" />
        </svg>
      </Link>

      {/* Bottom nav */}
      <BottomNav />
    </div>
  );
}
