"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { Phone, MessageSquare, Mail, Bell, Pencil, MoreHorizontal, CheckCircle, Clock, Check, X, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getReminderDate, type ReminderChip } from "@/lib/reminder-utils";
import type { Database } from "@/types/database";
import type { MatchedProperty } from "@/app/(app)/properties/actions";
import {
  addNote,
  updateNote,
  deleteNote,
  completeReminder,
  snoozeReminder,
  deleteReminder,
  addReminder,
  archiveBuyer,
  markAsContacted,
} from "./actions";

// ─── Types ───────────────────────────────────────────────────────────────────

type Buyer = Database["public"]["Tables"]["buyers"]["Row"];
type Note = Database["public"]["Tables"]["notes"]["Row"];
type Reminder = Database["public"]["Tables"]["reminders"]["Row"];
type MobileTab = "looking-for" | "notes" | "reminders" | "contact" | "properties";

interface Props {
  buyer: Buyer;
  notes: Note[];
  reminders: Reminder[];
  matchedProperties: MatchedProperty[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtBudget(min: number | null, max: number | null): string {
  if (!min && !max) return "—";
  const f = (n: number) =>
    n >= 1_000_000
      ? `$${(n / 1_000_000 % 1 === 0 ? n / 1_000_000 : (n / 1_000_000).toFixed(1))}m`
      : `$${Math.round(n / 1000)}k`;
  if (min && max) return `${f(min)} – ${f(max)}`;
  if (min) return `${f(min)}+`;
  return `Up to ${f(max!)}`;
}

function fmtDate(iso: string): string {
  const d = new Date(iso);
  return (
    d.toLocaleDateString("en-AU", {
      weekday: "short",
      day: "numeric",
      month: "short",
    }) +
    " · " +
    d.toLocaleTimeString("en-AU", { hour: "numeric", minute: "2-digit" })
  );
}

function fmtRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return new Date(iso).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function fmtReminderTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const isToday = d.toDateString() === now.toDateString();
  const isTomorrow = d.toDateString() === tomorrow.toDateString();
  const time = d.toLocaleTimeString("en-AU", {
    hour: "numeric",
    minute: "2-digit",
  });
  if (isToday) return `Today ${time}`;
  if (isTomorrow) return `Tomorrow ${time}`;
  return (
    d.toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short" }) +
    ` ${time}`
  );
}

const TEMP_STYLES: Record<
  string,
  { label: string; chip: string }
> = {
  hot: { label: "Hot", chip: "bg-secondary text-white" },
  warm: { label: "Warm", chip: "bg-accent text-white" },
  cold: { label: "Cold", chip: "bg-white text-primary border border-primary" },
};

const CONTACT_TYPES = ["Call", "SMS", "Email", "Inspection follow-up", "Finance follow-up", "Offer follow-up", "General"];
const REMINDER_TYPES = ["Call", "SMS", "Email", "Inspection follow-up", "Finance follow-up", "Offer follow-up", "General"];

const SNOOZE_OPTIONS = [
  { label: "1 hour", fn: () => { const d = new Date(); d.setHours(d.getHours() + 1); return d; } },
  { label: "Tonight 7pm", fn: () => { const d = new Date(); d.setHours(19, 0, 0, 0); if (new Date() >= d) d.setDate(d.getDate() + 1); return d; } },
  { label: "Tomorrow 9am", fn: () => { const d = new Date(); d.setDate(d.getDate() + 1); d.setHours(9, 0, 0, 0); return d; } },
  { label: "Next Monday", fn: () => { const d = new Date(); const day = d.getDay(); const daysUntilMon = day === 1 ? 7 : (8 - day) % 7 || 7; d.setDate(d.getDate() + daysUntilMon); d.setHours(9, 0, 0, 0); return d; } },
];

const REMINDER_CHIPS: Array<{ id: Exclude<ReminderChip, null>; label: string }> = [
  { id: "tonight-7pm", label: "Tonight 7pm" },
  { id: "tomorrow-9am", label: "Tomorrow 9am" },
  { id: "tomorrow-5pm", label: "Tomorrow 5pm" },
  { id: "saturday-morning", label: "Sat morning" },
  { id: "next-monday-9am", label: "Mon 9am" },
  { id: "custom", label: "Custom…" },
];


// ─── Shared UI primitives ─────────────────────────────────────────────────────

const inputBase =
  "w-full h-12 px-4 rounded-lg border bg-white text-text-primary placeholder:text-outline focus:outline-none focus:ring-0 focus:border-2 focus:border-teal-action transition-colors";

  
function Field({
  label,
  value,
  fallback = "—",
}: {
  label: string;
  value?: string | null | number;
  fallback?: string;
}) {
  return (
    <div className="space-y-1">
      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-secondary">
        {label}
      </p>
      <p className="text-[15px] font-semibold leading-snug text-text-primary">
        {value ?? fallback}
      </p>
    </div>
  );
}

function Chip({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center h-6 px-2.5 rounded-full text-xs font-medium",
        className
      )}
    >
      {label}
    </span>
  );
}

function Card({
  title,
  action,
  children,
  className,
}: {
  title?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-white rounded-lg border border-border shadow-card p-4 space-y-4",
        className
      )}
    >
      {title && (
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
            {title}
          </p>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

// ─── Add Reminder Modal ───────────────────────────────────────────────────────

function AddReminderModal({
  buyerId,
  onClose,
}: {
  buyerId: string;
  onClose: () => void;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [chip, setChip] = useState<ReminderChip>(null);
  const [customDate, setCustomDate] = useState("");
  const [reminderType, setReminderType] = useState("");
  const [reminderNote, setReminderNote] = useState("");
  const [error, setError] = useState("");

  function handleSet() {
    if (!chip) { setError("Pick a time"); return; }
    let at: string;
    if (chip === "custom") {
      if (!customDate) { setError("Enter a date"); return; }
      at = new Date(customDate).toISOString();
    } else {
      at = getReminderDate(chip).toISOString();
    }
    setError("");
    startTransition(async () => {
      const res = await addReminder(buyerId, at, reminderType || null, reminderNote || null);
      if (res.error) { setError(res.error); return; }
      router.refresh();
      onClose();
    });
  }

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl space-y-6">
        <h2 className="text-xl font-semibold text-text-primary">When to follow up</h2>

        <div className="grid grid-cols-3 gap-2">
          {REMINDER_CHIPS.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setChip((prev) => (prev === c.id ? null : c.id))}
              className={cn(
                "h-11 px-3 rounded-lg border text-sm font-medium transition-colors",
                chip === c.id
                  ? "bg-secondary border-secondary text-white"
                  : "bg-white border-border text-text-secondary hover:border-secondary/40"
              )}
            >
              {c.label}
            </button>
          ))}
        </div>

        {chip === "custom" && (
          <input
            type="datetime-local"
            value={customDate}
            onChange={(e) => setCustomDate(e.target.value)}
            className={cn(inputBase, "border-border")}
          />
        )}

        <div>
          <p className="text-base font-semibold text-text-primary mb-3">What kind of follow-up?</p>
          <div className="flex flex-wrap gap-2">
            {REMINDER_TYPES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setReminderType((prev) => (prev === t ? "" : t))}
                className={cn(
                  "h-10 px-3 rounded-full border text-sm font-medium transition-colors",
                  reminderType === t
                    ? "bg-secondary border-secondary text-white"
                    : "bg-white border-border text-text-secondary hover:border-secondary/40"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <textarea
          placeholder="Optional note for yourself…"
          value={reminderNote}
          onChange={(e) => setReminderNote(e.target.value)}
          rows={3}
          className="w-full px-4 py-3 rounded-lg border border-border bg-white text-text-primary placeholder:text-outline focus:outline-none focus:border-2 focus:border-teal-action transition-colors resize-none"
        />

        {error && <p className="text-xs text-error">{error}</p>}

        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={onClose}
            className="text-teal-action text-sm font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSet}
            disabled={isPending}
            className="h-11 px-6 rounded-lg bg-secondary text-white font-semibold text-sm disabled:opacity-60"
          >
            {isPending ? "Saving…" : "Set reminder"}
          </button>
        </div>
      </div>
    </ModalBackdrop>
  );
}

// ─── Snooze Modal ─────────────────────────────────────────────────────────────

function SnoozeModal({
  reminderId,
  buyerId,
  onClose,
}: {
  reminderId: string;
  buyerId: string;
  onClose: () => void;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [customDate, setCustomDate] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const [error, setError] = useState("");

  function handleSnooze(until: Date) {
    startTransition(async () => {
      const res = await snoozeReminder(reminderId, buyerId, until.toISOString());
      if (res.error) { setError(res.error); return; }
      router.refresh();
      onClose();
    });
  }

  function handleCustom() {
    if (!customDate) { setError("Enter a date and time"); return; }
    handleSnooze(new Date(customDate));
  }

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl space-y-4">
        <h2 className="text-xl font-semibold text-text-primary">Snooze until</h2>
        <div className="space-y-2">
          {SNOOZE_OPTIONS.map((opt) => (
            <button
              key={opt.label}
              type="button"
              disabled={isPending}
              onClick={() => handleSnooze(opt.fn())}
              className="w-full h-12 rounded-lg border border-border text-sm font-medium text-text-primary hover:border-secondary/40 hover:bg-secondary/5 transition-colors disabled:opacity-60"
            >
              {opt.label}
            </button>
          ))}
          <button
            type="button"
            disabled={isPending}
            onClick={() => setShowCustom((v) => !v)}
            className="w-full h-12 rounded-lg border border-border text-sm font-medium text-text-primary hover:border-secondary/40 hover:bg-secondary/5 transition-colors"
          >
            Custom…
          </button>
          {showCustom && (
            <div className="space-y-2">
              <input
                type="datetime-local"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                className={cn(inputBase, "border-border")}
              />
              <button
                type="button"
                disabled={isPending}
                onClick={handleCustom}
                className="w-full h-11 rounded-lg bg-secondary text-white font-semibold text-sm disabled:opacity-60"
              >
                Snooze
              </button>
            </div>
          )}
        </div>
        {error && <p className="text-xs text-error">{error}</p>}
        <button
          type="button"
          onClick={onClose}
          className="w-full text-center text-sm text-teal-action font-medium pt-1"
        >
          Cancel
        </button>
      </div>
    </ModalBackdrop>
  );
}

// ─── Modal backdrop ───────────────────────────────────────────────────────────

function ModalBackdrop({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(15,28,44,0.4)", backdropFilter: "blur(4px)" }}
    >
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative z-10 w-full max-w-lg">{children}</div>
    </div>
  );
}

// ─── Looking For Card ─────────────────────────────────────────────────────────

const profileFieldLabel = "text-[11px] font-semibold uppercase tracking-[0.08em] text-text-secondary";

function LookingForCard({ buyer }: { buyer: Buyer }) {
  const budget = fmtBudget(buyer.budget_min, buyer.budget_max);
  const hasBudget = buyer.budget_min != null || buyer.budget_max != null;
  const hasSuburbs = (buyer.preferred_suburbs?.length ?? 0) > 0;
  const criteriaItems: { key: string; text: string }[] = [];
  if (buyer.bedrooms) criteriaItems.push({ key: "bedrooms", text: `${buyer.bedrooms}+ bed` });
  if (buyer.bathrooms) criteriaItems.push({ key: "bathrooms", text: `${buyer.bathrooms}+ bath` });
  if (buyer.car_spaces) criteriaItems.push({ key: "parking", text: `${buyer.car_spaces}+ parking` });
  if (buyer.land_size_min) criteriaItems.push({ key: "land", text: `${buyer.land_size_min}m²+ land` });

  const hasMorePreferences =
    buyer.block_preference ||
    buyer.building_size_min ||
    buyer.deposit_ready ||
    buyer.school_zone_required;

  return (
    <Card title="Looking for">
      <div className="space-y-5">
        {/* Row 1: Suburbs | Budget (+ Finance when set) */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
          <div className="min-w-0">
            <p className={cn(profileFieldLabel, "mb-1.5")}>Suburbs</p>
            {hasSuburbs ? (
              <div className="flex flex-wrap gap-1.5">
                {buyer.preferred_suburbs!.map((s) => (
                  <Chip
                    key={s}
                    label={s.split(",")[0].trim()}
                    className="bg-teal-action/15 text-teal-action border border-teal-action/30 font-semibold"
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-[15px] font-semibold text-text-primary">—</p>
                <Link href={`/buyers/${buyer.id}/edit`} className="text-sm text-teal-action font-medium shrink-0">
                  Add suburbs
                </Link>
              </div>
            )}
          </div>
          <div className="min-w-0 space-y-3">
            <Field label="Budget" value={hasBudget ? budget : null} />
            {buyer.finance_status ? <Field label="Finance" value={buyer.finance_status} /> : null}
          </div>
        </div>

        {/* Row 2: Timeline | Condition */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
          <Field label="Timeline" value={buyer.buying_timeline} />
          <Field label="Condition" value={buyer.condition_preference} />
        </div>

        {/* Row 3: Property criteria */}
        {criteriaItems.length > 0 && (
          <div>
            <p className={cn(profileFieldLabel, "mb-2")}>Property criteria</p>
            <ul className="grid grid-cols-2 gap-2 sm:gap-3">
              {criteriaItems.map(({ key, text }) => (
                <li
                  key={key}
                  className="rounded-lg border border-border/80 bg-surface-container-low px-3 py-2.5 text-center text-sm font-semibold leading-snug text-text-primary"
                >
                  {text}
                </li>
              ))}
            </ul>
          </div>
        )}

        {buyer.must_haves && buyer.must_haves.length > 0 && (
          <div>
            <p className={cn(profileFieldLabel, "mb-2")}>Must-haves</p>
            <div className="flex flex-wrap gap-1.5">
              {buyer.must_haves.map((m) => (
                <Chip key={m} label={m} className="bg-surface-container text-text-secondary" />
              ))}
            </div>
          </div>
        )}

        {hasMorePreferences && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {buyer.block_preference && <Field label="Block" value={buyer.block_preference} />}
            {buyer.building_size_min && <Field label="Building size" value={`${buyer.building_size_min} sq min`} />}
            {buyer.deposit_ready && <Field label="Deposit" value={buyer.deposit_ready} />}
            {buyer.school_zone_required && <Field label="School zone" value={buyer.school_zone_required} />}
          </div>
        )}

        {buyer.deal_breakers && <Field label="Deal breakers" value={buyer.deal_breakers} />}
        {buyer.other_must_haves && <Field label="Additional must-haves" value={buyer.other_must_haves} />}
      </div>
    </Card>
  );
}

// ─── Notes & Activity ─────────────────────────────────────────────────────────

function NotesActivity({
  buyer,
  notes,
  reminders,
}: {
  buyer: Buyer;
  notes: Note[];
  reminders: Reminder[];
}) {
  const router = useRouter();
  const [isPendingAdd, startAdd] = useTransition();
  const [isPendingEdit, startEdit] = useTransition();
  const [isPendingDelete, startDelete] = useTransition();

  const [noteText, setNoteText] = useState("");
  const [contactType, setContactType] = useState("");
  const [noteError, setNoteError] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  function handleAddNote() {
    if (!noteText.trim()) { setNoteError("Note can't be empty"); return; }
    if (!contactType) { setNoteError("Select a contact type"); return; }
    setNoteError("");
    startAdd(async () => {
      const res = await addNote(buyer.id, noteText, contactType);
      if (res.error) { setNoteError(res.error); return; }
      setNoteText("");
      setContactType("");
      router.refresh();
    });
  }

  function handleEditSave(noteId: string) {
    if (!editText.trim()) return;
    startEdit(async () => {
      const res = await updateNote(noteId, buyer.id, editText);
      if (!res.error) { setEditingId(null); router.refresh(); }
    });
  }

  function handleDelete(noteId: string) {
    startDelete(async () => {
      const res = await deleteNote(noteId, buyer.id);
      if (!res.error) router.refresh();
    });
  }

  // Build combined timeline: notes + completed reminders
  type TimelineItem =
    | { kind: "note"; data: Note }
    | { kind: "activity"; type: string; at: string; label: string };

  const timeline: TimelineItem[] = [
    ...notes.map((n) => ({ kind: "note" as const, data: n })),
    ...reminders
      .filter((r) => r.status === "completed" && r.completed_at)
      .map((r) => ({
        kind: "activity" as const,
        type: "reminder-completed",
        at: r.completed_at!,
        label: `Reminder completed${r.reminder_type ? ` · ${r.reminder_type}` : ""}`,
      })),
    ...reminders
      .filter((r) => r.status === "snoozed")
      .map((r) => ({
        kind: "activity" as const,
        type: "reminder-snoozed",
        at: r.updated_at,
        label: `Reminder snoozed${r.reminder_type ? ` · ${r.reminder_type}` : ""}`,
      })),
  ].sort((a, b) => {
    const aDate = a.kind === "note" ? a.data.created_at : a.at;
    const bDate = b.kind === "note" ? b.data.created_at : b.at;
    return new Date(bDate).getTime() - new Date(aDate).getTime();
  });

  return (
    <Card title="Notes & activity">
      {/* Add note input */}
      <div className="space-y-3">
        <textarea
          placeholder="Type a note…"
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          rows={2}
          className="w-full px-4 py-3 rounded-lg border border-border bg-white text-text-primary placeholder:text-outline focus:outline-none focus:border-2 focus:border-teal-action transition-colors resize-none text-sm"
        />
        <div className="flex items-center gap-2">
          <select
            value={contactType}
            onChange={(e) => setContactType(e.target.value)}
            className="h-12 px-3 rounded-lg border border-border bg-white text-sm text-text-primary focus:outline-none focus:border-teal-action"
          >
            <option value="">Contact type…</option>
            {CONTACT_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleAddNote}
            disabled={isPendingAdd}
            className="ml-auto h-12 px-5 rounded-lg bg-primary text-white text-sm font-semibold disabled:opacity-60"
          >
            {isPendingAdd ? "Adding…" : "Add note"}
          </button>
        </div>
        {noteError && <p className="text-xs text-error">{noteError}</p>}
      </div>

      {/* Timeline */}
      {timeline.length === 0 ? (
        <div className="py-8 text-center">
          <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center mx-auto mb-3">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-text-secondary">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
            </svg>
          </div>
          <p className="font-semibold text-text-primary mb-1">No notes yet.</p>
          <p className="text-sm text-text-secondary">Add a note after your next call or inspection.</p>
        </div>
      ) : (
        <div className="space-y-4 pt-2">
          {timeline.map((item, i) => {
            if (item.kind === "note") {
              const n = item.data;
              const isEditing = editingId === n.id;
              return (
                <div key={n.id} className="flex gap-3">
                  {/* Icon */}
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    {n.contact_type === "Call" ? <Phone className="w-3.5 h-3.5" /> : n.contact_type === "SMS" ? <MessageSquare className="w-3.5 h-3.5" /> : n.contact_type === "Email" ? <Mail className="w-3.5 h-3.5" /> : <MessageCircle className="w-3.5 h-3.5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-xs font-medium text-text-secondary">
                          {n.contact_type ?? "Note"}
                        </span>
                        <span className="text-xs text-text-secondary ml-2">
                          {fmtDate(n.created_at)}
                        </span>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <button
                          type="button"
                          onClick={() => { setEditingId(n.id); setEditText(n.note); }}
                          className="flex min-h-11 items-center px-2 py-1 text-sm font-medium text-teal-action"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(n.id)}
                          disabled={isPendingDelete}
                          className="flex min-h-11 items-center px-2 py-1 text-sm font-medium text-error disabled:opacity-60"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    {isEditing ? (
                      <div className="mt-2 space-y-2">
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          rows={3}
                          autoFocus
                          className="w-full px-3 py-2 rounded-lg border border-teal-action bg-white text-sm text-text-primary focus:outline-none resize-none"
                        />
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleEditSave(n.id)}
                            disabled={isPendingEdit}
                            className="h-10 px-4 rounded-lg bg-primary text-white text-sm font-semibold disabled:opacity-60"
                          >
                            {isPendingEdit ? "Saving…" : "Save"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="h-10 px-3 text-sm text-text-secondary"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="mt-1 text-sm text-text-primary whitespace-pre-wrap">{n.note}</p>
                    )}
                  </div>
                </div>
              );
            }

            // Activity event
            return (
              <div key={`activity-${i}`} className="flex gap-3">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-container">
                  {item.type === "reminder-completed" ? <CheckCircle className="w-3.5 h-3.5 text-secondary" /> : <Clock className="w-3.5 h-3.5 text-text-secondary" />}
                </div>
                <div className="flex-1">
                  <span className="text-xs text-text-secondary">{item.label}</span>
                  <span className="text-xs text-text-secondary ml-2">· {fmtRelative(item.at)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

// ─── Contact Card ─────────────────────────────────────────────────────────────

function ContactCard({ buyer }: { buyer: Buyer }) {
  const phone = buyer.phone ?? "";
  const email = buyer.email ?? "";
  const hasPhone = phone.length > 0;
  const hasEmail = email.length > 0;
  const hasPreferredOrBest = Boolean(buyer.preferred_contact_method || buyer.best_time_to_contact);

  return (
    <Card title="Contact">
      <div className="space-y-3">
        {hasPhone ? (
          <div>
            <p className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-0.5">Phone</p>
            <a href={`tel:${phone.replace(/\s/g, "")}`} className="text-sm text-teal-action font-medium">
              {phone}
            </a>
          </div>
        ) : null}
        {hasEmail ? (
          <div>
            <p className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-0.5">Email</p>
            <a href={`mailto:${email}`} className="text-sm text-teal-action font-medium break-all">
              {email}
            </a>
          </div>
        ) : null}
        {!hasPhone && !hasEmail && (
          <p className="text-sm text-warning-text">No contact info — Edit buyer to add</p>
        )}
        {hasPreferredOrBest && (
          <div className="grid grid-cols-2 gap-4">
            {buyer.preferred_contact_method && (
              <Field label="Preferred contact" value={buyer.preferred_contact_method} />
            )}
            {buyer.best_time_to_contact && (
              <Field label="Best time" value={buyer.best_time_to_contact} />
            )}
          </div>
        )}
        {buyer.contact_consent && <Field label="Consent" value={buyer.contact_consent} />}
      </div>
    </Card>
  );
}

// ─── Reminders Card ───────────────────────────────────────────────────────────

function RemindersCard({
  buyer,
  reminders,
  onAddReminder,
}: {
  buyer: Buyer;
  reminders: Reminder[];
  onAddReminder: () => void;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [snoozeTarget, setSnoozeTarget] = useState<string | null>(null);

  const upcoming = reminders.filter(
    (r) => r.status === "pending" || r.status === "snoozed" || r.status === "sent"
  ).sort((a, b) => new Date(a.reminder_at).getTime() - new Date(b.reminder_at).getTime());

  const past = reminders.filter(
    (r) => r.status === "completed" || r.status === "cancelled"
  ).sort((a, b) => new Date(b.reminder_at).getTime() - new Date(a.reminder_at).getTime());

  function handleComplete(id: string) {
    startTransition(async () => {
      const res = await completeReminder(id, buyer.id);
      if (!res.error) router.refresh();
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const res = await deleteReminder(id, buyer.id);
      if (!res.error) router.refresh();
    });
  }

  return (
    <>
      <Card
        title="Reminders"
        action={
          <button
            type="button"
            onClick={onAddReminder}
            className="text-xs font-semibold text-teal-action"
          >
            + Add
          </button>
        }
      >
        <div className="space-y-3">
          {upcoming.length === 0 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-text-secondary">No upcoming reminder</p>
              <button
                type="button"
                onClick={onAddReminder}
                className="text-sm font-semibold text-teal-action"
              >
                + Add
              </button>
            </div>
          )}
            {upcoming.length > 0 && (
              <div>
                <p className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-2">Next</p>
                {upcoming.slice(0, 3).map((r) => (
                  <div key={r.id} className="py-2 border-b border-border last:border-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium text-text-primary">
                          {fmtReminderTime(r.reminder_at)}
                        </p>
                        {r.reminder_type && (
                          <p className="text-xs text-text-secondary">{r.reminder_type}</p>
                        )}
                        {r.reminder_note && (
                          <p className="text-xs text-text-secondary mt-0.5 italic">{r.reminder_note}</p>
                        )}
                        {r.status === "snoozed" && (
                          <p className="text-xs text-text-secondary mt-0.5">Snoozed</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => handleComplete(r.id)}
                        className="h-7 px-3 rounded-full bg-teal-action/10 text-teal-action text-xs font-semibold disabled:opacity-60"
                      >
                        Done
                      </button>
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => setSnoozeTarget(r.id)}
                        className="h-7 px-3 rounded-full border border-border text-xs font-medium text-text-secondary"
                      >
                        Snooze
                      </button>
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => handleDelete(r.id)}
                        className="h-7 px-3 rounded-full border border-error/20 text-xs font-medium text-error"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {past.length > 0 && (
              <div>
                <p className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-2">Past</p>
                {past.slice(0, 3).map((r) => (
                  <div key={r.id} className="py-2 border-b border-border last:border-0 flex items-center gap-2">
                    <span className="flex items-center">
                      {r.status === "completed" ? <Check className="w-3.5 h-3.5 text-secondary" /> : <X className="w-3.5 h-3.5 text-error" />}
                    </span>
                    <div>
                      <p className="text-xs text-text-secondary line-through">
                        {fmtRelative(r.reminder_at)}
                        {r.reminder_type ? ` · ${r.reminder_type}` : ""}
                      </p>
                      {r.completed_at && (
                        <p className="text-xs text-text-secondary">
                          Completed {fmtRelative(r.completed_at)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
        </div>
      </Card>

      {snoozeTarget && (
        <SnoozeModal
          reminderId={snoozeTarget}
          buyerId={buyer.id}
          onClose={() => setSnoozeTarget(null)}
        />
      )}
    </>
  );
}

// ─── Quick Stats Card ─────────────────────────────────────────────────────────

function StatsCard({
  buyer,
  notes,
  reminders,
}: {
  buyer: Buyer;
  notes: Note[];
  reminders: Reminder[];
}) {
  return (
    <Card title="Engagement">
      <div className="space-y-3">
        <Field
          label="Added"
          value={new Date(buyer.created_at).toLocaleDateString("en-AU", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        />
        <div>
          <p className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-0.5">
            Last contacted
          </p>
          <p className={cn("text-sm", buyer.last_contacted_at ? "text-text-primary" : "text-text-secondary")}>
            {buyer.last_contacted_at ? fmtRelative(buyer.last_contacted_at) : "Never contacted"}
          </p>
        </div>
        {buyer.lead_source && <Field label="Lead source" value={buyer.lead_source} />}
        <Field
          label="Engagement"
          value={`${notes.length} note${notes.length !== 1 ? "s" : ""} · ${reminders.length} reminder${reminders.length !== 1 ? "s" : ""}`}
        />
        {buyer.priority && <Field label="Priority" value={buyer.priority} />}
      </div>
    </Card>
  );
}

// ─── Archive confirm ──────────────────────────────────────────────────────────

function ArchiveConfirm({
  buyerName,
  buyerId,
  onClose,
}: {
  buyerName: string;
  buyerId: string;
  onClose: () => void;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleArchive() {
    startTransition(async () => {
      const res = await archiveBuyer(buyerId);
      if (res.error) { setError(res.error); return; }
      router.push("/buyers");
    });
  }

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl space-y-4">
        <h2 className="text-lg font-semibold text-text-primary">Archive {buyerName}?</h2>
        <p className="text-sm text-text-secondary">
          This buyer will be hidden from your directory. You can restore them from Settings → Archived buyers.
        </p>
        {error && <p className="text-xs text-error">{error}</p>}
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="flex-1 h-11 rounded-lg border border-border text-sm font-medium text-text-secondary">
            Cancel
          </button>
          <button
            type="button"
            onClick={handleArchive}
            disabled={isPending}
            className="flex-1 h-11 rounded-lg bg-error text-white text-sm font-semibold disabled:opacity-60"
          >
            {isPending ? "Archiving…" : "Archive"}
          </button>
        </div>
      </div>
    </ModalBackdrop>
  );
}

// ─── More menu ────────────────────────────────────────────────────────────────

function MoreMenu({
  onArchive,
  onClose,
}: {
  onArchive: () => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full z-20 mt-1 min-w-35 rounded-lg border border-border bg-white py-1 shadow-lg"
    >
      <button
        type="button"
        onClick={() => { onClose(); onArchive(); }}
        className="w-full text-left px-4 py-2.5 text-sm text-error hover:bg-error/5"
      >
        Archive buyer
      </button>
    </div>
  );
}

// ─── Matching Properties Panel ───────────────────────────────────────────────

function MatchingPropertiesPanel({ properties }: { properties: MatchedProperty[] }) {
  const fmtPrice = (p: number) =>
    p >= 1_000_000
      ? `$${((p / 1_000_000) % 1 === 0 ? p / 1_000_000 : (p / 1_000_000).toFixed(1))}M`
      : `$${Math.round(p / 1000)}k`;

  return (
    <div className="bg-white rounded-xl border border-border p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[14px] font-semibold text-text-primary">
          Matching properties
          {properties.length > 0 && (
            <span className="ml-1.5 text-text-secondary font-normal">· {properties.length}</span>
          )}
        </h3>
        <Link href="/properties" className="text-[12px] text-teal-action font-medium hover:opacity-70">
          View all
        </Link>
      </div>

      {properties.length === 0 ? (
        <p className="text-[13px] text-text-secondary py-2">
          No active properties match this buyer&apos;s criteria yet.
        </p>
      ) : (
        <div className="space-y-3">
          {properties.map((p) => (
            <Link
              key={p.id}
              href={`/properties/${p.id}`}
              className="block border border-border rounded-lg px-3 py-3 hover:bg-surface-container transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-text-primary truncate">
                    {p.street_address}
                  </p>
                  <p className="text-[12px] text-text-secondary">
                    {p.suburb}, {p.state}
                  </p>
                </div>
                <span className="text-[13px] font-bold text-text-primary shrink-0">
                  {fmtPrice(p.price)}
                </span>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {p.matchedCriteria.map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-medium"
                  >
                    ✓ {c}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main BuyerProfile ────────────────────────────────────────────────────────

export function BuyerProfile({ buyer, notes, reminders, matchedProperties }: Props) {
  const [activeTab, setActiveTab] = useState<MobileTab>("looking-for");
  const [showAddReminder, setShowAddReminder] = useState(false);
  const [showArchive, setShowArchive] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [contactedFlash, setContactedFlash] = useState(false);
  const [, startContactTransition] = useTransition();

  function handleMarkContacted() {
    setContactedFlash(true);
    setTimeout(() => setContactedFlash(false), 2000);
    startContactTransition(async () => { await markAsContacted(buyer.id); });
  }

  const tempConfig = buyer.buyer_temperature ? TEMP_STYLES[buyer.buyer_temperature] : null;

  const initials = buyer.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const phoneHref = buyer.phone ? `tel:${buyer.phone.replace(/\s/g, "")}` : null;
  const smsHref = buyer.phone ? `sms:${buyer.phone.replace(/\s/g, "")}` : null;
  const emailHref = buyer.email ? `mailto:${buyer.email}` : null;

  const mobileActionBtn = "flex flex-col items-center gap-1 text-xs text-text-secondary";
  const mobileIconBtn = "w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-xl";

  const MOBILE_TABS: Array<{ id: MobileTab; label: string; badge?: number }> = [
    { id: "looking-for", label: "Looking for" },
    { id: "properties", label: "Properties", badge: matchedProperties.length || undefined },
    { id: "notes", label: "Notes" },
    { id: "reminders", label: "Reminders" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <>
      {/* ── Desktop Layout ── */}
      <div className="hidden lg:block min-h-screen bg-background">
        <div className="mx-auto px-6 py-6 space-y-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-text-secondary">
            <Link href="/buyers" className="hover:text-text-primary">Buyers</Link>
            <span>/</span>
            <span className="text-text-primary">{buyer.name}</span>
          </nav>

          {/* Header card — navy dashboard style */}
          <div className="bg-primary rounded-xl px-6 py-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">
                  {buyer.name}
                </h1>
                <div className="flex flex-wrap items-center gap-2 mt-2.5">
                  {tempConfig && (
                    <Chip label={tempConfig.label} className={tempConfig.chip} />
                  )}
                  {buyer.buyer_type && (
                    <Chip label={buyer.buyer_type} className="bg-white/10 text-white/75 border border-white/15" />
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
                {phoneHref && (
                  <a
                    href={phoneHref}
                    className="h-9 px-4 rounded-lg bg-teal-action text-on-teal-action text-sm font-semibold flex items-center gap-1.5"
                  >
                    <Phone className="w-4 h-4" /> Call
                  </a>
                )}
                {smsHref && (
                  <a
                    href={smsHref}
                    className="h-9 px-4 rounded-lg bg-white/10 border border-white/20 text-white text-sm font-medium flex items-center gap-1.5 hover:bg-white/20 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" /> SMS
                  </a>
                )}
                {emailHref && (
                  <a
                    href={emailHref}
                    className="h-9 px-4 rounded-lg bg-white/10 border border-white/20 text-white text-sm font-medium flex items-center gap-1.5 hover:bg-white/20 transition-colors"
                  >
                    <Mail className="w-4 h-4" /> Email
                  </a>
                )}
                <button
                  type="button"
                  onClick={handleMarkContacted}
                  className={cn(
                    "h-9 px-4 rounded-lg border text-sm font-medium flex items-center gap-1.5 transition-colors",
                    contactedFlash
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                  )}
                >
                  <Check className="w-4 h-4" />
                  {contactedFlash ? "Contacted!" : "Mark contacted"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddReminder(true)}
                  className="h-9 px-4 rounded-lg bg-white/10 border border-white/20 text-white text-sm font-medium flex items-center gap-1.5 hover:bg-white/20 transition-colors"
                >
                  <Bell className="w-4 h-4" /> Reminder
                </button>
                <Link
                  href={`/buyers/${buyer.id}/edit`}
                  className="h-9 px-4 rounded-lg bg-white/10 border border-white/20 text-white text-sm font-medium flex items-center gap-1.5 hover:bg-white/20 transition-colors"
                >
                  <Pencil className="w-4 h-4" /> Edit
                </Link>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowMoreMenu((v) => !v)}
                    className="h-9 w-9 rounded-lg bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
                    aria-label="More options"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                  {showMoreMenu && (
                    <MoreMenu
                      onArchive={() => setShowArchive(true)}
                      onClose={() => setShowMoreMenu(false)}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Two-column body */}
          <div className="grid grid-cols-[1fr_320px] gap-6 items-start">
            {/* Left column */}
            <div className="space-y-6">
              <LookingForCard buyer={buyer} />
              <MatchingPropertiesPanel properties={matchedProperties} />
              <NotesActivity buyer={buyer} notes={notes} reminders={reminders} />
            </div>

            {/* Right column */}
            <div className="space-y-4">
              <ContactCard buyer={buyer} />
              <RemindersCard
                buyer={buyer}
                reminders={reminders}
                onAddReminder={() => setShowAddReminder(true)}
              />
              <StatsCard buyer={buyer} notes={notes} reminders={reminders} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile Layout ── */}
      <div className="lg:hidden min-h-screen bg-background pb-28">
        {/* Mobile header */}
        <header className="sticky top-0 bg-white border-b border-border z-10">
          <div className="px-4 h-14 flex items-center justify-between">
            <Link href="/buyers" className="text-text-primary text-xl">←</Link>
            <h1 className="max-w-50 truncate text-base font-semibold text-text-primary">
              {buyer.name}
            </h1>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowMoreMenu((v) => !v)}
                className="text-text-secondary text-xl w-9 h-9 flex items-center justify-center"
                aria-label="More options"
              >
                ⋮
              </button>
              {showMoreMenu && (
                <MoreMenu
                  onArchive={() => setShowArchive(true)}
                  onClose={() => setShowMoreMenu(false)}
                />
              )}
            </div>
          </div>
        </header>

        {/* Mobile hero */}
        <div className="bg-white px-4 pt-4 pb-5 border-b border-border">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <h2 className="text-2xl font-bold text-text-primary">{buyer.name}</h2>
              <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                {tempConfig && (
                  <Chip label={tempConfig.label} className={tempConfig.chip} />
                )}
                {buyer.buyer_type && (
                  <Chip label={buyer.buyer_type} className="bg-primary text-white" />
                )}
              </div>
            </div>
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
              {initials}
            </div>
          </div>

          {/* Mobile action icons */}
          <div className="flex items-center justify-around mt-4">
            {phoneHref ? (
              <a href={phoneHref} className={mobileActionBtn}>
                <div className={cn(mobileIconBtn, "bg-secondary/10 text-secondary")}><Phone className="w-5 h-5" /></div>
                <span>Call</span>
              </a>
            ) : (
              <div className={cn(mobileActionBtn, "opacity-30")}>
                <div className={mobileIconBtn}><Phone className="w-5 h-5" /></div>
                <span>Call</span>
              </div>
            )}
            {smsHref ? (
              <a href={smsHref} className={mobileActionBtn}>
                <div className={mobileIconBtn}><MessageSquare className="w-5 h-5" /></div>
                <span>SMS</span>
              </a>
            ) : (
              <div className={cn(mobileActionBtn, "opacity-30")}>
                <div className={mobileIconBtn}><MessageSquare className="w-5 h-5" /></div>
                <span>SMS</span>
              </div>
            )}
            {emailHref ? (
              <a href={emailHref} className={mobileActionBtn}>
                <div className={mobileIconBtn}><Mail className="w-5 h-5" /></div>
                <span>Email</span>
              </a>
            ) : (
              <div className={cn(mobileActionBtn, "opacity-30")}>
                <div className={mobileIconBtn}><Mail className="w-5 h-5" /></div>
                <span>Email</span>
              </div>
            )}
            <button
              type="button"
              onClick={() => setShowAddReminder(true)}
              className={mobileActionBtn}
            >
              <div className={mobileIconBtn}><Bell className="w-5 h-5" /></div>
              <span>Reminder</span>
            </button>
            <Link href={`/buyers/${buyer.id}/edit`} className={mobileActionBtn}>
              <div className={mobileIconBtn}><Pencil className="w-5 h-5" /></div>
              <span>Edit</span>
            </Link>
          </div>
        </div>

        {/* Mobile tabs */}
        <div className="sticky top-14 bg-white border-b border-border z-10">
          <div className="flex">
            {MOBILE_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-1 py-3 text-xs font-semibold transition-colors border-b-2 flex items-center justify-center gap-1",
                  activeTab === tab.id
                    ? "text-secondary border-secondary"
                    : "text-text-secondary border-transparent"
                )}
              >
                {tab.label}
                {tab.badge ? (
                  <span className="w-4 h-4 rounded-full bg-teal-action text-on-teal-action text-[9px] font-bold flex items-center justify-center">
                    {tab.badge}
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile tab content */}
        <div className="px-4 pt-4 space-y-4">
          {activeTab === "looking-for" && (
            <>
              {/* Budget range — hero display */}
              {(buyer.budget_min || buyer.budget_max) && (
                <div className="bg-white rounded-xl border border-border p-4 mb-3">
                  <p className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider mb-1">Budget Range</p>
                  <p className="text-[26px] font-bold text-text-primary leading-tight">
                    {fmtBudget(buyer.budget_min, buyer.budget_max)}{" "}
                    <span className="text-[14px] font-normal text-text-secondary">AUD</span>
                  </p>
                  {buyer.budget_min && buyer.budget_max && (
                    <div className="mt-2 h-1.5 rounded-full bg-surface-container overflow-hidden">
                      <div className="h-full bg-teal-action rounded-full" style={{ width: "65%" }} />
                    </div>
                  )}
                </div>
              )}

              {/* Suburbs */}
              {(buyer.preferred_suburbs?.length ?? 0) > 0 && (
                <div className="bg-white rounded-xl border border-border p-4 mb-3">
                  <p className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider mb-2">Preferred Suburbs</p>
                  <div className="flex flex-wrap gap-1.5">
                    {buyer.preferred_suburbs!.map((s) => (
                      <span key={s} className="px-3 py-1 rounded-full text-[13px] font-medium bg-teal-action/10 text-teal-action border border-teal-action/30">
                        {s.split(",")[0].trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Property criteria cards 2x2 */}
              {(buyer.property_type || buyer.bedrooms || buyer.bathrooms || buyer.car_spaces) && (
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {buyer.property_type && (
                    <div className="bg-white rounded-xl border border-border p-3">
                      <p className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider mb-1">Type</p>
                      <p className="text-[14px] font-semibold text-text-primary">
                        {[buyer.property_type, buyer.house_type].filter(Boolean).join(" or ")}
                      </p>
                    </div>
                  )}
                  {buyer.bedrooms && buyer.bedrooms !== "Any" && (
                    <div className="bg-white rounded-xl border border-border p-3">
                      <p className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider mb-1">Bedrooms</p>
                      <p className="text-[14px] font-semibold text-text-primary">{buyer.bedrooms} Bed</p>
                    </div>
                  )}
                  {buyer.bathrooms && buyer.bathrooms !== "Any" && (
                    <div className="bg-white rounded-xl border border-border p-3">
                      <p className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider mb-1">Bathrooms</p>
                      <p className="text-[14px] font-semibold text-text-primary">{buyer.bathrooms} Bath</p>
                    </div>
                  )}
                  {buyer.car_spaces && buyer.car_spaces !== "Any" && (
                    <div className="bg-white rounded-xl border border-border p-3">
                      <p className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider mb-1">Parking</p>
                      <p className="text-[14px] font-semibold text-text-primary">{buyer.car_spaces}+ Garage</p>
                    </div>
                  )}
                </div>
              )}

              {/* Must-haves */}
              {buyer.must_haves && buyer.must_haves.length > 0 && (
                <div className="bg-surface-container-low rounded-xl border border-dashed border-border p-4 mb-3">
                  <p className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider mb-2">Critical Must-Haves</p>
                  <div className="flex flex-col gap-2">
                    {buyer.must_haves.map((m) => (
                      <div key={m} className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full border-2 border-teal-action flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 text-teal-action" />
                        </div>
                        <span className="text-[14px] text-text-primary">{m}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Other criteria */}
              {(buyer.buying_timeline || buyer.finance_status || buyer.condition_preference || buyer.land_size_min) && (
                <div className="bg-white rounded-xl border border-border p-4">
                  <p className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider mb-3">Other Criteria</p>
                  <div className="grid grid-cols-2 gap-3">
                    {buyer.buying_timeline && <Field label="Timeline" value={buyer.buying_timeline} />}
                    {buyer.finance_status && <Field label="Finance" value={buyer.finance_status} />}
                    {buyer.condition_preference && <Field label="Condition" value={buyer.condition_preference} />}
                    {buyer.land_size_min && <Field label="Land size" value={`${buyer.land_size_min}m²+`} />}
                  </div>
                </div>
              )}
            </>
          )}
          {activeTab === "properties" && (
            <MatchingPropertiesPanel properties={matchedProperties} />
          )}
          {activeTab === "notes" && (
            <NotesActivity buyer={buyer} notes={notes} reminders={reminders} />
          )}
          {activeTab === "reminders" && (
            <RemindersCard
              buyer={buyer}
              reminders={reminders}
              onAddReminder={() => setShowAddReminder(true)}
            />
          )}
          {activeTab === "contact" && (
            <>
              <ContactCard buyer={buyer} />
              <StatsCard buyer={buyer} notes={notes} reminders={reminders} />
            </>
          )}
        </div>

        {/* Mobile sticky bottom bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border px-4 py-3 flex gap-3">
          {phoneHref ? (
            <a
              href={phoneHref}
              className="flex-1 h-12 rounded-lg bg-secondary text-white font-semibold flex items-center justify-center gap-2"
            >
              <Phone className="w-5 h-5" /> Call {buyer.name.split(" ")[0]}
            </a>
          ) : (
            <div className="flex-1 h-12 rounded-lg bg-surface-container text-text-secondary font-semibold flex items-center justify-center gap-2 opacity-50">
              No phone number
            </div>
          )}
          {smsHref && (
            <a
              href={smsHref}
              className="w-12 h-12 rounded-lg border border-border flex items-center justify-center text-text-primary"
            >
              <MessageSquare className="w-5 h-5" />
            </a>
          )}
          {emailHref && (
            <a
              href={emailHref}
              className="w-12 h-12 rounded-lg border border-border flex items-center justify-center text-text-primary"
            >
              <Mail className="w-5 h-5" />
            </a>
          )}
          <button
            type="button"
            onClick={handleMarkContacted}
            className={cn(
              "w-12 h-12 rounded-lg border flex items-center justify-center transition-colors",
              contactedFlash
                ? "bg-emerald-500 border-emerald-500 text-white"
                : "border-border text-text-primary"
            )}
            title="Mark as contacted"
          >
            <Check className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ── Modals ── */}
      {showAddReminder && (
        <AddReminderModal
          buyerId={buyer.id}
          onClose={() => setShowAddReminder(false)}
        />
      )}

{showArchive && (
        <ArchiveConfirm
          buyerName={buyer.name}
          buyerId={buyer.id}
          onClose={() => setShowArchive(false)}
        />
      )}

    </>
  );
}
