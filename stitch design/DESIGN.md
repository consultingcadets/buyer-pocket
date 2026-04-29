---
name: BuyerPocket Identity
colors:
  surface: '#fbf9fa'
  surface-dim: '#dbd9db'
  surface-bright: '#fbf9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f4'
  surface-container: '#f0edef'
  surface-container-high: '#eae7e9'
  surface-container-highest: '#e4e2e3'
  on-surface: '#1b1b1d'
  on-surface-variant: '#44474c'
  inverse-surface: '#303032'
  inverse-on-surface: '#f2f0f1'
  outline: '#75777d'
  outline-variant: '#c5c6cd'
  surface-tint: '#535f72'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#0f1c2c'
  on-primary-container: '#788599'
  inverse-primary: '#bac7dd'
  secondary: '#006a62'
  on-secondary: '#ffffff'
  secondary-container: '#70f8e8'
  on-secondary-container: '#007168'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#281803'
  on-tertiary-container: '#9a7f60'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d6e3fa'
  primary-fixed-dim: '#bac7dd'
  on-primary-fixed: '#0f1c2c'
  on-primary-fixed-variant: '#3b4859'
  secondary-fixed: '#70f8e8'
  secondary-fixed-dim: '#4fdbcc'
  on-secondary-fixed: '#00201d'
  on-secondary-fixed-variant: '#005049'
  tertiary-fixed: '#feddb9'
  tertiary-fixed-dim: '#e0c19f'
  on-tertiary-fixed: '#281803'
  on-tertiary-fixed-variant: '#584328'
  background: '#fbf9fa'
  on-background: '#1b1b1d'
  surface-variant: '#e4e2e3'
typography:
  h1:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h2:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  h3:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: 0em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.5'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.4'
  label-bold:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  gutter: 24px
  margin: 24px
---

## Brand & Style

The design system is engineered for the independent Australian real estate sector, where efficiency and clarity are paramount. The brand personality is direct, professional, and utilitarian, eschewing decorative trends in favour of functional density. 

The style is defined by **Strong Minimalism** within a **Corporate/Modern** framework. It leverages significant whitespace and a restricted palette to reduce cognitive load for agents managing high-stakes transactions. Every interface element exists to facilitate data entry or decision-making, ensuring a high-trust environment that feels reliable and institutional yet technologically advanced.

## Colors

The palette is anchored by **Deep Navy**, providing a sophisticated, corporate foundation that conveys stability. **Fresh Teal** is reserved strictly for primary calls to action and success states, ensuring critical paths are immediately identifiable. 

**Electric Blue** serves as the functional accent, used exclusively for active states, focus indicators, and interactive highlights. The neutral scale utilizes a cool-grey "Surface Container" to provide subtle grouping without the need for heavy borders. This design system prioritises high contrast ratios to ensure accessibility and readability in varied lighting conditions, such as an agent working outdoors during an open home.

## Typography

The design system utilizes **Inter** across all levels to maintain a neutral, systematic, and utilitarian appearance. The typographic hierarchy is strictly enforced to guide the user through complex property data. 

Headlines use tight tracking and heavy weights to create a sense of authority. Body text is set with generous line heights to facilitate long-form reading of legal descriptions and contracts. The **Label Bold** style is a specialized utility for metadata and table headers, using all-caps and increased letter spacing to provide a distinct visual anchor for data-heavy views.

## Layout & Spacing

This design system employs a **12-column fixed grid** for desktop environments, transitioning to a fluid single-column layout for mobile. All spatial relationships are governed by an **8px baseline grid**, ensuring that margins, paddings, and component heights remain mathematically consistent.

Horizontal spacing between cards and major sections utilizes the 24px gutter to maintain clear separation. For internal component layout, such as within a property list item, the 16px (md) unit is the standard default for padding.

## Elevation & Depth

Visual hierarchy is established through **Tonal Layers** and **Ambient Shadows**. Surfaces are primarily flat, with elevation used sparingly to indicate interactivity or temporary overlays (such as modals).

Shadows are never pure black; they are "Navy-Tinted" (using a low-opacity #0F1C2C) to ensure they feel integrated with the brand palette. 
- **Level 1 (Resting Cards):** Very soft blur, low spread.
- **Level 2 (Dropdowns/Menus):** Medium blur with a slight vertical offset to suggest lift.
- **Level 3 (Modals):** High blur, significant vertical offset, accompanied by a 40% opacity navy backdrop blur.

## Shapes

The shape language reflects the system's corporate identity by balancing approachability with professional rigour. 
- **Standard Elements:** Cards, input fields, and buttons use an 8px (0.5rem) radius.
- **Interactive Chips:** Tags for property status or buyer categories use a full pill-shape (circular ends) to differentiate them from actionable buttons.
- **Borders:** A 1px solid border (#E0E1DD) is used for containers where tonal separation is insufficient.

## Components

### Buttons
- **Primary:** Fresh Teal (#2EC4B6) background with White text. Used for the main action (e.g., "Add Listing").
- **Secondary:** Deep Navy (#0F1C2C) outline or solid background with White text. Used for auxiliary actions.
- **Ghost:** No background, Electric Blue (#3A86FF) text. Used for low-emphasis actions like "Cancel".

### Input Fields
Inputs use a white background, 1px #E0E1DD border, and 8px radius. On focus, the border transitions to 2px Electric Blue (#3A86FF). Labels are always positioned above the field using the Body Small style.

### Chips
Pill-shaped containers used for status indicators (e.g., "Under Offer", "Settled"). Use a light tint of the status color for the background with high-contrast text for legibility.

### Cards
White surfaces with 8px radius and Level 1 Navy-tinted shadows. Cards should have no internal borders; use 16px or 24px internal padding to group content.

### Additional Components
- **Data Tables:** Minimalist rows with 1px bottom borders, using the Label Bold style for headers.
- **Property Badges:** Compact labels for price points and bedroom/bathroom counts, using the Deep Navy for icons and text.