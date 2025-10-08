# Railway Rake Management System - Design Guidelines

## Design Approach: Data-First Professional Interface

**Selected System:** Material Design + Carbon Design hybrid approach
**Justification:** This railway operations tool requires exceptional data clarity, real-time information processing, and professional utility. The design prioritizes information hierarchy, rapid decision-making, and operational efficiency over aesthetic flourishes.

**Key Principles:**
- Information clarity above decoration
- Immediate data accessibility
- Status-driven color coding
- Efficient use of screen real estate
- Professional, trust-building aesthetics

## Core Design Elements

### A. Color Palette

**Dark Mode Primary (Professional Railway Operations):**
- Background: 220 15% 12% (deep navy-charcoal, professional operations feel)
- Surface: 220 12% 18% (elevated panels)
- Surface Elevated: 220 10% 22% (cards, modals)
- Primary Action: 210 100% 50% (railway blue for interactive elements)
- Text Primary: 0 0% 95%
- Text Secondary: 0 0% 70%

**Status Color System (Critical for Railway Operations):**
- Success/On-Time: 142 76% 45% (green for operational trains)
- Warning/Delayed: 38 92% 50% (amber for delays)
- Critical/Emergency: 0 84% 60% (red for critical issues)
- Empty Rake: 220 15% 40% (neutral gray)
- Loaded Rake: 210 100% 50% (primary blue)
- Weather Alert: 280 70% 55% (purple for weather impacts)

**Light Mode (Optional Toggle):**
- Background: 0 0% 98%
- Surface: 0 0% 100%
- Text: 220 15% 20%

### B. Typography

**Font System:**
- Primary: 'Inter' (CDN: Google Fonts) - exceptional readability for data
- Monospace: 'JetBrains Mono' (for train IDs, timestamps, coordinates)

**Type Scale:**
- Dashboard Headers: text-2xl font-semibold (24px)
- Section Titles: text-lg font-medium (18px)
- Data Labels: text-sm font-medium (14px)
- Body/Data Values: text-base (16px)
- Timestamps/IDs: text-sm font-mono (14px monospace)
- Metrics: text-3xl font-bold (30px for key KPIs)

### C. Layout System

**Tailwind Spacing Primitives:** Use 2, 4, 6, 8, 12, 16 units consistently
- Component padding: p-4 or p-6
- Section gaps: gap-6 or gap-8
- Card spacing: space-y-4
- Grid gaps: gap-4
- Dashboard margins: m-8 (desktop), m-4 (mobile)

**Grid Structure:**
- Main dashboard: Two-column split (70% map/visualization, 30% sidebar data)
- Analytics: 3-column metric cards (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
- Schedule table: Full-width with sticky headers
- Rake status: 4-column grid on desktop (grid-cols-2 lg:grid-cols-4)

### D. Component Library

**Navigation:**
- Top bar: Fixed with app title, real-time clock, weather indicator, user menu
- Side navigation: Collapsible with icons + labels (Dashboard, Scheduling, ACO Optimizer, Analytics, Events)
- Breadcrumbs: For deep navigation paths

**Data Display:**
- Map Visualization: Interactive Mapbox/Leaflet with custom rake markers (color-coded by status)
- ACO Algorithm Visualizer: Animated path optimization display with pheromone trail visualization
- Status Cards: Compact cards with large status icon, rake ID (monospace), location, and timestamp
- Schedule Timeline: Horizontal scrolling timeline with color-coded train blocks
- Data Tables: Striped rows, sortable columns, sticky headers, inline status badges
- Metric Cards: Large number (text-3xl), label below, trend indicator (↑↓), sparkline chart

**Forms & Inputs:**
- Search bars: Prominent with autocomplete for train/rake IDs
- Date/time pickers: For schedule adjustments
- Dropdown filters: Multi-select for status, routes, weather conditions
- Toggle switches: For automation features (ACO on/off)

**Status Indicators:**
- Rake status badges: Pill-shaped with icon (empty/loaded/in-transit/maintenance)
- Delay indicators: Inline time delta (+15 min) with color coding
- Weather alerts: Banner at top with icon and impact level
- Event markers: Calendar icon + badge on affected dates

**Overlays:**
- Modals: For detailed rake information, schedule editing
- Toast notifications: Top-right for delay alerts, optimization updates
- Side panels: For ACO algorithm settings, event details

### E. Animations

**Minimal, Purposeful Motion:**
- Real-time updates: Subtle pulse on new data (animate-pulse for 1s)
- ACO visualization: Smooth path drawing (transition-all duration-500)
- Status changes: Color fade transitions (transition-colors)
- Map markers: Smooth position updates
- NO decorative animations, NO scroll effects

## Component-Specific Guidelines

**Dashboard Layout:**
- Header with real-time metrics bar (on-time %, empty movements, active rakes)
- Primary: Split-screen map (left) + live schedule (right)
- Bottom: Scrolling alert feed for delays and optimizations

**ACO Optimizer Interface:**
- Visualization panel showing ant colony paths in real-time
- Parameter controls (pheromone strength, evaporation rate) in sidebar
- Results comparison: Before/After empty movement metrics
- Iteration counter with convergence graph

**Schedule Management:**
- Gantt-style timeline with drag-to-reschedule
- Conflict indicators (overlapping assignments)
- Weather overlay toggle
- Event markers integrated into timeline

**Analytics Dashboard:**
- 4-6 KPI cards at top (empty movement %, avg delay, optimization savings)
- Line charts: Historical accuracy trends
- Heatmap: Demand patterns by time/location
- Comparison tables: Forecast vs. actual

## Images

**No hero images** - This is an operations tool, not a marketing site
**Contextual imagery:**
- Map tiles: OpenStreetMap or Mapbox satellite view
- Rake icons: Custom SVG icons (train silhouettes, different for empty/loaded)
- Weather icons: From weather icon library (Heroicons weather set)
- Dashboard background: Subtle railway track pattern at 5% opacity (optional, very subtle)