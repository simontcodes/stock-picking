# Design System Specification: The Precision Luminary



## 1. Overview & Creative North Star

This design system is built upon the "Precision Luminary" philosophy. In the volatile world of high-stakes fintech, data should not feel like a chore to read—it should feel like a beacon of clarity emerging from the void.



We reject the "boxed-in" aesthetic of legacy trading platforms. Instead, we embrace **Sophisticated Dimensionality**. By utilizing intentional asymmetry, overlapping glass surfaces, and high-contrast editorial typography, we create an environment that feels less like a database and more like a high-end digital cockpit. The goal is to make the user feel like an institutional insider, providing a "calm-tech" experience amidst the chaos of the market.



## 2. Colors & Surface Architecture

The palette is rooted in the depth of the night. We use `#101419` (Surface) as our canvas, allowing the electric greens and muted blues to command attention without causing ocular fatigue.



### The "No-Line" Rule

Traditional 1px solid borders are strictly prohibited for sectioning. Boundaries must be defined solely through background color shifts.

* **Separation via Tones:** To separate a sidebar from a main feed, use `surface-container-low` against the base `surface`.

* **The Depth Hierarchy:**

* **Level 0 (Base):** `surface` (#101419) - The foundation.

* **Level 1 (Sections):** `surface-container-low` (#181c21) - Large layout blocks.

* **Level 2 (Cards/Modules):** `surface-container-highest` (#31353b) - Interactive elements.

* **Level 3 (Popovers/Modals):** `surface-bright` (#36393f) - Floating elements with 24px backdrop blur.



### Glass & Gradient Implementation

To move beyond a flat "SaaS template" look, utilize **Surface Tinting**.

* **Signature Glow:** Apply a subtle radial gradient of `primary` (#0abc56) at 3% opacity in the top-right corner of the viewport to simulate an off-screen light source.

* **CTA Soul:** Primary buttons should not be flat. Use a linear gradient from `primary` to `primary_container` at a 15-degree angle to provide "visual weight."



## 3. Typography: The Editorial Edge

We utilize **Inter** not just for legibility, but as a stylistic anchor. The hierarchy relies on extreme scale contrast.



* **The "Power" Header (`display-lg`):** 3.5rem, Bold, -0.04em tracking. Used for portfolio totals or market-moving headlines. It should feel authoritative and unmovable.

* **The "Insight" Label (`label-sm`):** 0.6875rem, Medium, +0.08em tracking, Uppercase. Used for metadata (e.g., TICKER SYMBOLS, TIMESTAMP). The wide tracking gives a premium, "Swiss-style" editorial feel.

* **Tabular Data:** For all numerical values in tables, use `font-variant-numeric: tabular-nums`. This ensures that fluctuating stock prices do not cause the layout to "jitter" as numbers change.



## 4. Elevation & Depth

In this design system, depth is an ecosystem, not an effect.



* **Tonal Layering:** Avoid shadows for static cards. Instead, place a `surface-container-highest` card inside a `surface-container-low` section. The contrast in lightness creates a "natural lift."

* **Ambient Shadows:** For floating modals or dropdowns, use a dual-stage shadow:

1. A sharp 2px blur at 10% opacity of `surface_container_lowest`.

2. An expansive 40px blur at 15% opacity of `#000000`.

* **The Ghost Border:** If a visual anchor is required for accessibility, use a 1px stroke of `outline-variant` at 20% opacity. It should be felt, not seen.



## 5. Components



### High-Contrast Data Tables

* **Layout:** No vertical or horizontal lines.

* **Row State:** Use a 4px `primary` left-border "accent" on hover, and shift the row background to `surface-container-high`.

* **Cell Alignment:** Text is left-aligned; numerical data is right-aligned to the decimal point for instant scanability.



### The TradingView-Style Charting

* **Candlesticks:** `primary` (#0abc56) for gains, `secondary` (#488453) for losses.

* **Grid:** Use `outline-variant` at 5% opacity for the grid lines.

* **Active State:** The crosshair must be a dashed line using `tertiary` (#ff8b7c).



### Interactive Inputs

* **Search Focus:** On focus, the input container expands slightly (2px scale) and the `outline` token glows with a 4px outer spread at 20% opacity.

* **Glass Inputs:** Inputs should use a semi-transparent `surface-container-low` background with a `backdrop-filter: blur(8px)`.



### Buttons

* **Primary:** High-gloss `primary` fill. Text uses `on-primary`. Corner radius: `md` (0.75rem).

* **Tertiary/Ghost:** No background, no border. Use `primary` text for "Buy" actions and `secondary` for "Sell." Underline only on hover.



## 6. Do's and Don'ts



### Do

* **Use Whitespace as a Tool:** Use the `10` (2.5rem) and `12` (3rem) spacing tokens between major modules to let the data breathe.

* **Embrace Asymmetry:** Align the main portfolio chart to the left and keep the "Quick Actions" panel floating on the right to break the standard 3-column grid.

* **Color Intent:** Only use `primary` green for actual financial gain. Do not use it for "success" messages (use a neutral grey for those).



### Don't

* **Never use 100% Black:** The background must remain `#101419` to maintain the navy/charcoal premium depth.

* **No Sharp Corners:** Every interactive element must use at least the `DEFAULT` (0.5rem) or `md` (0.75rem) roundedness to keep the UI feeling modern and approachable.

* **Avoid Over-Saturation:** Do not fill large containers with `primary` green. It should be used like a "laser pointer"—only to draw the eye to the most critical data points.