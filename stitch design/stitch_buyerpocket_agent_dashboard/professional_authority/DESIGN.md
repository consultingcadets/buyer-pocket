---
name: Professional Authority
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
  secondary: '#016a62'
  on-secondary: '#ffffff'
  secondary-container: '#9deee4'
  on-secondary-container: '#0c6f66'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#001a41'
  on-tertiary-container: '#3280f9'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d6e3fa'
  primary-fixed-dim: '#bac7dd'
  on-primary-fixed: '#0f1c2c'
  on-primary-fixed-variant: '#3b4859'
  secondary-fixed: '#a0f1e7'
  secondary-fixed-dim: '#84d5cb'
  on-secondary-fixed: '#00201d'
  on-secondary-fixed-variant: '#00504a'
  tertiary-fixed: '#d8e2ff'
  tertiary-fixed-dim: '#adc6ff'
  on-tertiary-fixed: '#001a41'
  on-tertiary-fixed-variant: '#004494'
  background: '#fbf9fa'
  on-background: '#1b1b1d'
  surface-variant: '#e4e2e3'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  title-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-base:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  button-text:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
  touch-target-min: 48px
---

## Brand & Style

The brand personality for this design system is rooted in trust, efficiency, and professional authority. Aimed at real estate agents managing high-value transactions, the UI must evoke a sense of reliability and architectural precision. 

The design style is a hybrid of **Corporate Modern** and **Minimalism**. It utilises a structured, data-dense approach for desktop (inspired by high-productivity tools like Linear) while transitioning to a polished, tactile **HIG-inspired** card system for mobile users in the field. The aesthetic avoids unnecessary flourishes, focusing instead on clarity, speed of use, and a sophisticated navy-dominant palette that reflects the premium nature of the Australian property market.

## Colors

This design system uses a high-contrast palette to ensure clear hierarchies in data-heavy environments. 

- **Primary (Navy):** Reserved for structural elements like sidebars, headers, and hero sections to ground the interface.
- **Teal Action:** Used exclusively for interactive elements, primary buttons, and active navigation states.
- **Accent (Blue):** Applied to badges and highlights to draw attention without the weight of the primary brand colour.
- **Temperature States:** 
  - **Hot:** Teal background with White text (High priority/active).
  - **Warm:** Accent Blue background with White text (Medium priority/engaged).
  - **Cold:** White background with Navy border and Navy text (Low priority/passive).

All interface elements must adhere to Australian English spelling conventions (e.g., "colour", "optimise", "categorise").

## Typography

The typography system relies on **Inter** to provide a neutral, functional, and highly legible experience across both web and mobile platforms. 

The baseline body text is set to 14px for data-dense tables on desktop, scaling up to 16px for mobile reading. Hierarchy is established through weight shifts (SemiBold for headers) rather than dramatic size increases. For data labels and metadata, use the `label-caps` style to provide distinct visual separation from user-generated content.

## Layout & Spacing

This design system employs a **Fixed Grid** for desktop and a **Fluid Margin** system for mobile.

- **Desktop:** Utilises a 12-column grid with a fixed sidebar (240px-280px). Information density is high, with 8px gutters between data cells and 16px padding within container modules.
- **Mobile:** Shifts to a single-column layout with 16px side margins. Elements are vertically stacked within cards.
- **Interactions:** Regardless of screen size, all interactive elements must maintain a minimum touch target of 48x48px to accommodate field-based usage. Use 16px (md) spacing as the default gap between logical sections.

## Elevation & Depth

Visual hierarchy is managed through **Tonal Layers** on desktop and **Ambient Shadows** on mobile.

- **Desktop:** Depth is achieved via the `Surface` and `Surface Container` tiers. The main background uses `Surface`, while content blocks, sidebars, and card containers use `White` or `Surface Container` to create a "Notion-like" flat layered effect. Borders (#E5E7EB) are the primary separator.
- **Mobile:** Elements use `shadow-sm` (a soft, diffused 2-4px blur with 5% opacity) to lift cards off the background, creating a tactile, iOS-style feel. 
- **Modals:** Use a heavy backdrop blur (12px+) with a semi-transparent Navy overlay to focus the user’s attention on critical task flows.

## Shapes

The shape language differentiates between functional inputs and status indicators.

- **Standard Elements:** Buttons and input fields use `rounded-lg` (8px-12px) to balance professional rigour with modern approachability.
- **Mobile Cards:** Use `rounded-xl` (12px-16px) to match the native iOS aesthetic.
- **Status Indicators:** Chips and badges must be `rounded-full` (pill-shaped) to distinguish them from interactive buttons and input fields.
- **Containers:** Large surface areas (like the main content dashboard) use `rounded-lg` to maintain a consistent corner radius across the system.

## Components

- **Buttons:** Primary buttons use Teal action (#006A62) with white text and 8px corner radius. Minimum height is 48px for mobile.
- **Chips:** Always rounded-full. Use Temperature colours (Hot, Warm, Cold) to indicate buyer urgency or property status.
- **Inputs:** Use `rounded-lg` with a 1px border (#E5E7EB). Active state uses a 2px Teal border. Labels should be 14px Medium weight Navy.
- **Cards (Mobile):** White background, `shadow-sm`, `rounded-xl`. 16px internal padding.
- **Tables (Desktop):** Bordered layout, 14px Inter text. Header row uses `Surface Container` background with `label-caps` typography.
- **Sidebar:** Navy (#0F1C2C) background with Teal active indicators. Text in white at 90% opacity for inactive items.
- **Badges:** Small, `rounded-full` accents using Blue (#3A86FF) for notifications or new property alerts.