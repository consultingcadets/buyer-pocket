# BuyerPocket — Design System Reference

This is the source of truth for design tokens, components, and visual rules. Claude Code should reference this for every UI decision.

---

## Brand

**Name:** BuyerPocket  
**Personality:** Authoritative and reliable, with modern agility. Built for working agents.  
**Style:** Corporate / Modern with strong minimalism. High clarity. No decorative elements.  
**Voice in UI:** Direct, plain English, Australian spelling, no fluff.

---

## Color tokens

All colors are defined as CSS variables and used via Tailwind utilities. Never hard-code hex values in components.

### Primary palette

| Token | Hex | Usage |
|---|---|---|
| `primary` | `#0F1C2C` | Deep Navy. Headers, sidebar background, primary text on light surfaces. |
| `primary-foreground` | `#FFFFFF` | Text on Deep Navy backgrounds. |
| `secondary` | `#2EC4B6` | Fresh Teal. Primary CTAs, "Save," "Confirm" actions, success states. |
| `secondary-foreground` | `#FFFFFF` | Text on Teal backgrounds. |
| `accent` | `#3A86FF` | Electric Blue. Active selection, focus rings, data highlights, link text. |
| `accent-foreground` | `#FFFFFF` | Text on Electric Blue. |

### Surface palette

| Token | Hex | Usage |
|---|---|---|
| `background` | `#FBF9FA` | Page background. Warm off-white. |
| `surface` | `#FFFFFF` | Card backgrounds, modal backgrounds. |
| `surface-container` | `#F0EDEE` | Subtle banded sections, hover states. |
| `surface-container-low` | `#F5F3F4` | Very subtle sections. |
| `surface-container-high` | `#EAE7E9` | Emphasised banded sections. |
| `border` | `#E0E1DD` | All borders, dividers. |
| `border-strong` | `#C4C6CC` | Stronger dividers (rare use). |

### Text palette

| Token | Hex | Usage |
|---|---|---|
| `foreground` | `#1B1B1D` | Primary text on light backgrounds. |
| `foreground-muted` | `#44474C` | Secondary text, captions, helper text. |
| `foreground-subtle` | `#74777D` | Disabled text, tertiary info. |
| `foreground-on-dark` | `#FFFFFF` | Text on dark/navy backgrounds. |

### Semantic palette

| Token | Hex | Usage |
|---|---|---|
| `success` | `#2EC4B6` | Same as secondary. Success toasts, confirmations. |
| `warning` | `#B58900` | Muted amber. Trial countdown banners (day 4-6). |
| `warning-strong` | `#D97706` | Stronger amber. Trial countdown banner (day 7). |
| `error` | `#BA1A1A` | Errors, validation messages, destructive actions. |
| `error-bg` | `#FFDAD6` | Light error background for banners. |
| `info` | `#3A86FF` | Same as accent. Info banners, neutral notifications. |

### Buyer temperature chip colors

| Temperature | Background | Text | Notes |
|---|---|---|---|
| Hot | `#2EC4B6` (Teal) | `#FFFFFF` | Solid fill |
| Warm | `#3A86FF` (Electric Blue) | `#FFFFFF` | Solid fill |
| Cold | `#FFFFFF` | `#0F1C2C` (Navy) | Border 1px Navy |

### Lead status chip colors

All lead status chips use a soft background with strong text. Pill shape.

| Status | Background | Text |
|---|---|---|
| New | `#F0EDEE` | `#0F1C2C` |
| Contacted | `#D6E4F9` | `#0F1C2C` |
| Interested | `#70F8E8` | `#005049` |
| Inspection booked | `#3A86FF` | `#FFFFFF` |
| Offer ready | `#2EC4B6` | `#FFFFFF` |
| Not interested | `#E4E2E3` | `#44474C` |
| Closed | `#0F1C2C` | `#FFFFFF` |

---

## Typography

**Font family:** Inter, loaded via `next/font/google`. Fallback: system-ui, sans-serif.

### Type scale

| Token | Size | Weight | Line-height | Letter-spacing | Usage |
|---|---|---|---|---|---|
| `h1` | 40px | 700 | 1.2 | -0.02em | Page heroes, top-level page titles |
| `h2` | 32px | 700 | 1.2 | -0.01em | Section headings |
| `h3` | 24px | 600 | 1.3 | normal | Card headings, subsections |
| `h4` | 18px | 600 | 1.4 | normal | Smaller card headings |
| `body-lg` | 18px | 400 | 1.5 | normal | Hero subheadings, marketing body |
| `body` | 16px | 400 | 1.5 | normal | Default body text |
| `body-sm` | 14px | 400 | 1.5 | normal | Captions, helper text, dense lists |
| `label` | 14px | 600 | 1.0 | 0.05em uppercase | Form labels, table headers, tags |
| `caption` | 12px | 500 | 1.4 | normal | Smallest text, footnotes |

**Mobile minimum body size:** 14px. Never go smaller on touch interfaces.

### Heading rules

- H1 only appears once per page (semantic).
- H2 separates major sections.
- H3 lives inside cards or sub-sections.
- Headings use `foreground` color (#1B1B1D) by default. On Navy backgrounds, use `foreground-on-dark` (#FFFFFF).
- Letter-spacing is tighter at larger sizes for a "locked-in" feel.

---

## Spacing scale

Base unit: **4px**. All spacing must be a multiple of 4.

| Token | Value | Common use |
|---|---|---|
| `space-xs` | 4px | Tight gaps, icon-text gaps |
| `space-sm` | 8px | Form field internal spacing |
| `space-md` | 16px | Card internal padding (mobile), default gap |
| `space-lg` | 24px | Card internal padding (desktop), section gaps |
| `space-xl` | 40px | Major section separation |
| `space-2xl` | 64px | Hero/section vertical rhythm |

### Layout

- **Desktop max-width:** 1440px container, 24px gutters
- **Mobile:** fluid with 16px side padding
- **Grid:** 12 columns on desktop, fluid on mobile
- **Card padding:** 24px on desktop, 16px on mobile
- **Section vertical padding:** 64px desktop, 40px mobile

### Density rules

- **Default vertical rhythm in dashboards:** 8px between related fields, 16px between groups, 24px between cards.
- **Form field rhythm:** 16px between fields, 24px between sections.
- **List item rhythm:** 12px vertical padding minimum.

---

## Shape

### Border radius

| Token | Value | Usage |
|---|---|---|
| `rounded-sm` | 4px | Small inputs, tight elements |
| `rounded` | 8px | Default — cards, inputs, buttons |
| `rounded-md` | 12px | Larger primary buttons |
| `rounded-lg` | 16px | Modals, sheets |
| `rounded-xl` | 24px | Hero cards (rare) |
| `rounded-full` | 9999px | Pills, chips, avatars |

### Component-specific radii

- **Cards:** 8px
- **Buttons:** 8px (medium), 12px (large primary)
- **Inputs:** 8px
- **Modals & sheets:** 16px top corners (mobile sheets), 16px all (desktop modals)
- **Status chips:** fully rounded (pill)
- **Avatars:** fully rounded (circle)

---

## Elevation & shadow

### Shadow tokens

```css
--shadow-card: 0px 4px 20px rgba(13, 27, 42, 0.05);
--shadow-card-hover: 0px 8px 28px rgba(13, 27, 42, 0.08);
--shadow-modal: 0px 12px 40px rgba(13, 27, 42, 0.15);
--shadow-dropdown: 0px 4px 16px rgba(13, 27, 42, 0.08);
```

### Rules

- **Cards:** use `shadow-card` by default. On hover (interactive cards only), shift to `shadow-card-hover` and translate Y by -2px.
- **Modals:** `shadow-modal` plus 8px backdrop blur on the overlay.
- **Dropdowns:** `shadow-dropdown` plus a 1px border in `border` color for crisp definition.
- **Bottom sheets (mobile):** no shadow — they sit at the bottom edge with a 16px top radius.
- **Sticky bars (e.g. mobile save bar):** `shadow-dropdown` shadow upward.

---

## Components

### Buttons

All buttons: minimum 48px height regardless of viewport. Padding 12px vertical, 24px horizontal for default size.

**Primary**
- Background: `secondary` (Teal #2EC4B6)
- Text: white
- Radius: 8px (12px for large)
- Hover: darken 5%
- Disabled: 50% opacity, cursor not-allowed
- Focus: 2px Electric Blue outline with 2px offset

**Secondary**
- Background: white
- Border: 1px `primary` (Navy)
- Text: `primary` (Navy)
- Hover: light grey background `surface-container`
- Same radius, focus, disabled rules

**Ghost**
- No background, no border
- Text: `primary` (Navy)
- Hover: `surface-container` background appears
- Use for tertiary actions

**Destructive**
- Text: `error` (red)
- No background by default
- Hover: light red background
- Use sparingly — only for delete/cancel actions

**Icon button**
- 40px square (or 48px on mobile)
- No border, no background by default
- Hover: `surface-container` circular background
- Use for inline actions in cards

### Inputs

- Height: 48px
- Border: 1px `border` (#E0E1DD)
- Border radius: 8px
- Padding: 12px 16px
- Font size: 16px (prevents iOS zoom on focus)
- Background: white
- **Focus state:** border becomes `accent` (Electric Blue), with a 2px outer glow ring (Electric Blue at 20% opacity).
- **Error state:** border becomes `error` (red), helper text below in red.
- **Disabled:** background `surface-container-low`, text `foreground-subtle`.

Helper text (below input):
- Color: `foreground-muted`
- Size: 12px
- 4px above the helper text

### Multi-select chip input (suburb picker, must-haves)

- Selected items show as filled Teal pills inside the input area
- × icon on each chip removes it
- Input remains focusable to add more
- Typeahead opens dropdown below

### Segmented control

- Used for: bedrooms, bathrooms, car spaces, land size minimum
- Container: 1px border, 8px radius, light grey background
- Selected segment: white background, navy text, subtle shadow
- Unselected segments: transparent, muted text
- 48px height, equal-width segments

### Cards

- Background: white
- Radius: 8px
- Padding: 24px desktop, 16px mobile
- Shadow: `shadow-card`
- **Sub-cards inside cards:** `surface-container-low` background, no shadow, 8px radius

### Status chips (pills)

- Fully rounded
- Padding: 4px 12px
- Font: 12px / 600 weight / uppercase / 0.05em letter-spacing
- Use the buyer temperature and lead status colors above
- Never combine with hover effects (they're informational, not interactive)

### Filter chips

- Fully rounded
- 1px border `border`
- Padding: 8px 16px
- Default: white background, navy text
- Selected: `secondary` (Teal) background, white text
- Hover: `surface-container` background

### Banners

Full-width strips above main content. Padding 12px 16px. Always include action button on right.

- **Info:** Electric Blue tint background, dark text
- **Warning (yellow):** `#FFF8DC` background, `#7A5400` text
- **Warning (orange):** `#FFE0B2` background, `#9C4500` text
- **Error:** `error-bg` background, `#93000A` text
- **Dismissible:** include × button on the far right

### Modals

- Backdrop: rgba(13, 27, 42, 0.5) with 8px blur
- Modal: white, 16px radius, max-width 480px (small) / 720px (medium)
- Padding: 24px
- Close button: top-right
- Footer buttons: right-aligned, ghost cancel + primary action

### Bottom sheets (mobile only)

- Background: white
- Top radius: 16px
- Drag handle at top: 4px tall, 32px wide, `border` color, centered
- Padding: 16px sides, 24px top, 16px bottom
- Backdrop: same as modal but no blur on mobile (performance)

### Toast notifications

- Position: top-center on desktop, bottom-center on mobile (above tab bar)
- Width: max 480px, fluid on mobile
- Padding: 12px 16px
- Radius: 8px
- Auto-dismiss: 4 seconds for success/info, 6 seconds for error
- Manual close: × icon on the right
- **Success:** white background with 4px Teal left border, dark text
- **Error:** white background with 4px error-red left border
- **Info:** white background with 4px Electric Blue left border

### Bottom navigation (mobile only)

- Background: `primary` (Deep Navy)
- Height: 64px (plus safe-area inset on iOS)
- 5 tabs: Today, Buyers, Add (raised circular Teal button in center), Reminders, Settings
- Icon size: 24px
- Label: 11px below icon, 4px gap
- Active state: Teal indicator (4px square dot above the icon)
- Add button (center): 56px circle, Teal background, white plus icon, raised 8px above the bar

### Sidebar (desktop only)

- Background: `primary` (Deep Navy)
- Width: 240px
- Padding: 24px 16px
- Logo at top
- Navigation list: 12px font, white text, 12px vertical padding per item, 8px radius hover state with white at 10% opacity
- Active item: Teal indicator (4px) on left edge, white text
- User profile at bottom with avatar (32px circle with initials in Teal background) + name + Pro badge

### Avatars

- Circle, fully rounded
- Default: initials on Teal background, white text
- Sizes: 24px (compact), 32px (default), 48px (large)
- Pro badge: small Teal "Pro" pill bottom-right

### Loading states

**Skeleton loader:**
- Background: `surface-container`
- Animated pulse: subtle opacity wave
- Match the shape of the content being loaded (card-shaped skeleton for cards, line-shaped for text)

**Spinner:**
- Use only for inline button loading states, not page-level
- 16px in buttons, replace text temporarily

**Page-level loading:**
- Use skeleton loaders, not spinners
- Match the structure of the loaded page (skeleton cards in a list look like a list)

### Empty states

- Center-aligned
- Simple monochrome line illustration in `primary` (Navy) — keep illustrations stylised and simple
- H2 or H3 headline depending on context
- Body text below
- Single CTA button below body (where applicable)

---

## Iconography

- **Icon library:** Lucide React (`lucide-react` package)
- **Default size:** 20px in body, 24px in nav, 16px inline with text
- **Default color:** `foreground` for body, `primary-foreground` on dark backgrounds
- **Stroke width:** 2px (Lucide default)
- **Never use emoji as UI icons.**

Common icons:
- Phone — `Phone`
- SMS — `MessageSquare`
- Email — `Mail`
- Reminder — `Bell`
- Add note — `MessageCircle`
- Edit — `Pencil`
- Delete — `Trash2`
- Archive — `Archive`
- Filter — `SlidersHorizontal`
- Search — `Search`
- Sort — `ArrowUpDown`
- Calendar — `Calendar`
- Time — `Clock`
- Settings — `Settings`
- More menu — `MoreHorizontal` (or `MoreVertical` for compact lists)

---

## Responsive breakpoints

```
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1440px
```

**Mobile-first.** Build the mobile layout first, then scale up.

**Key breakpoint behaviour:**
- Mobile (`< 768px`): bottom navigation, full-width cards, bottom sheets for modals
- Tablet (`768px - 1023px`): bottom navigation persists, cards in 2-column grid where useful
- Desktop (`≥ 1024px`): sidebar navigation, multi-column layouts, slide-out panels for filters

---

## Animation & motion

Use sparingly. Animation should be functional, not decorative.

- **Default duration:** 150ms for micro-interactions (button hover, focus rings)
- **Page transitions:** 200ms ease-out
- **Modal/sheet open:** 250ms ease-out
- **Skeleton pulse:** 2s ease-in-out infinite
- **Toast slide-in:** 200ms ease-out
- **Toast slide-out:** 150ms ease-in

Tailwind: use `transition-all duration-150` or `duration-200` for most cases.

**No animation in critical paths.** Save buttons should respond instantly.

---

## Accessibility requirements

- **Touch targets:** minimum 48×48px on mobile, 40×40px on desktop
- **Color contrast:** all text must meet WCAG AA (4.5:1 for body, 3:1 for large text)
- **Focus states:** every interactive element must have a visible focus state (2px Electric Blue outline)
- **Keyboard navigation:** every action must be keyboard-accessible
- **Screen reader labels:** all icon-only buttons must have `aria-label`
- **Form labels:** every input must have a visible label (not placeholder-as-label)
- **Error messages:** must be associated with the field via `aria-describedby`
- **Don't rely on color alone:** error states use red color *and* an icon *and* text
- **Heading order:** maintain semantic order (don't skip from h1 to h3)

---

## Australian-specific rules

- **Currency formatting:** $850,000 not $850000 (commas as thousands separator)
- **Phone format:** 04XX XXX XXX (mobile), (0X) XXXX XXXX (landline) — auto-format on blur
- **Date format:** "Sat 3 May 2026" or "3/5/26" — never US (5/3/26)
- **Time format:** 12-hour with am/pm, lowercase (7:00pm not 7:00 PM)
- **Spelling:** Australian (organise, colour, recognise, capitalise, neighbour, behaviour)
- **Address fields:** State dropdown uses NSW, VIC, QLD, WA, SA, TAS, ACT, NT (not full names)
- **Postcode:** 4-digit Australian format
- **Land size:** square metres (m²) — use the squared character, not "m2" or "sqm"
- **Building size:** "squares" is a real estate convention (1 square ≈ 9.29 m²) — use "squares" in UI

---

## Component naming conventions (for code)

When Claude Code creates components, follow these naming rules:

- PascalCase for components: `BuyerCard`, `ReminderPicker`, `FilterSheet`
- Kebab-case for files: `buyer-card.tsx`, `reminder-picker.tsx`
- Group by feature: `/components/buyer/`, `/components/reminder/`, `/components/ui/`
- Keep `/components/ui/` for primitive shadcn-derived components only
- Never name a component generically (`Card`, `Button`) inside feature folders — use `BuyerCard`, `ReminderActionButton` etc.

---

## What this document does NOT cover

- Page-by-page layout (that's in the Stitch designs)
- Specific copy (that's in the copy doc)
- Data structure (that's in the database schema)
- Business logic (that's in the PRD)

If a design decision isn't covered here, default to the principle of: simpler, calmer, more whitespace, less decoration.