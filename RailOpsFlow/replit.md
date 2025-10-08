# Railway Rake Management System

## Overview
Advanced railway rake management system with Ant Colony Optimization (ACO) for intelligent scheduling, demand forecasting, and minimizing empty rake movements. Built with React, TypeScript, Express, and in-memory storage.

## Purpose
This application helps railway operators:
- Optimize rake (train car) allocation using ACO algorithms
- Minimize empty rake movements to reduce operational costs
- Dynamically adapt schedules based on delays and real-time conditions
- Forecast demand considering festivals, public events, and weather impacts
- Improve scheduling accuracy during adverse weather conditions

## Current State
**Version:** MVP (Minimum Viable Product)
**Last Updated:** October 2025

### Completed Features
- ✅ Complete data schema for rakes, trains, routes, schedules, delays, events, weather, and ACO optimizations
- ✅ Professional railway operations UI with dark mode support
- ✅ Dashboard with real-time metrics and status cards
- ✅ ACO Optimizer interface with visual algorithm representation
- ✅ Dynamic scheduling system with event integration
- ✅ Analytics dashboard with performance charts
- ✅ Status color coding system (success, warning, critical, empty/loaded rakes, weather alerts)
- ✅ Responsive sidebar navigation
- ✅ Theme toggle (light/dark mode)

### In Progress
- 🔄 Backend API implementation
- 🔄 ACO algorithm implementation
- 🔄 Demand forecasting logic
- 🔄 Weather impact analysis

## Project Architecture

### Frontend Stack
- **Framework:** React with TypeScript
- **Routing:** Wouter
- **Styling:** Tailwind CSS + Shadcn UI components
- **State Management:** TanStack Query (React Query)
- **Charts:** Recharts
- **Icons:** Lucide React
- **Date Handling:** date-fns

### Backend Stack
- **Runtime:** Node.js with Express
- **Storage:** In-memory (MemStorage)
- **Validation:** Zod
- **Schema:** Drizzle ORM definitions

### Design System
- **Primary Color:** Railway Blue (hsl(210 100% 50%))
- **Font Stack:** Inter (data), JetBrains Mono (IDs/numbers)
- **Theme:** Professional operations UI with dark mode primary
- **Status Colors:**
  - Success/On-Time: Green (hsl(142 76% 45%))
  - Warning/Delayed: Amber (hsl(38 92% 50%))
  - Critical/Emergency: Red (hsl(0 84% 60%))
  - Empty Rake: Gray (hsl(220 15% 50%))
  - Loaded Rake: Primary Blue
  - Weather Alert: Purple (hsl(280 70% 55%))

## Recent Changes
- **2025-10-08:** Initial MVP implementation
  - Created comprehensive data schema with 9 entities
  - Built all frontend pages (Dashboard, ACO Optimizer, Scheduling, Analytics)
  - Implemented reusable components (RakeCard, TrainCard, MetricCard, AcoVisualizer)
  - Configured design tokens and railway-specific status colors
  - Set up sidebar navigation and theme toggle

## User Preferences
- Professional, data-driven UI design
- Dark mode as default theme
- Focus on operational efficiency and clarity
- Status-based color coding for quick decision making
- Real-time metrics and visualization

## Key Features

### 1. Dashboard
- Real-time metrics: Total rakes, empty movements, on-time performance, active delays
- Active trains display with status indicators
- Recent delays with impact levels
- Weather conditions panel
- Empty rakes tracker

### 2. ACO Optimizer
- Visual ant colony algorithm representation
- Adjustable parameters (pheromone strength, evaporation rate, iterations)
- Real-time optimization progress
- Historical optimization runs with performance metrics
- Empty movement reduction tracking

### 3. Dynamic Scheduling
- Train schedules with status tracking
- ACO optimization indicators
- Upcoming events calendar (festivals, public events)
- Event impact levels and demand multipliers
- Schedule conflict detection

### 4. Analytics
- Empty movement trend analysis
- Demand forecast accuracy by route
- ACO optimization impact comparison (before/after)
- Performance metrics and KPIs
- Interactive charts (line, bar)

## Data Models

### Core Entities
1. **Rakes:** Railway cars with capacity, status, location, and load state
2. **Trains:** Train services with routes, schedules, and delay information
3. **Routes:** Railway routes with stations, distance, and duration
4. **Schedules:** Train schedules with rake assignments and optimization flags
5. **Delays:** Delay tracking with reasons, impact levels, and resolution status
6. **Events:** Public events and festivals affecting demand
7. **Weather Conditions:** Weather data with scheduling impact analysis
8. **ACO Optimizations:** Algorithm run history with performance metrics
9. **Demand Forecasts:** Predicted vs actual demand with accuracy tracking

## API Endpoints (To Be Implemented)
- `GET /api/rakes` - Get all rakes
- `GET /api/trains` - Get all trains
- `GET /api/schedules` - Get train schedules
- `GET /api/delays/active` - Get active delays
- `GET /api/weather` - Get weather conditions
- `GET /api/events` - Get events
- `GET /api/stats` - Get dashboard statistics
- `POST /api/aco/run` - Run ACO optimization
- `GET /api/aco/history` - Get optimization history
- `GET /api/analytics` - Get analytics data

## Development Guidelines
- Follow design_guidelines.md for all UI implementations
- Use status colors from index.css for consistent theming
- Maintain professional, operations-focused design
- Ensure all interactive elements have data-testid attributes
- Use font-mono for train IDs, rake numbers, and timestamps
- Keep components modular and reusable

## Next Steps
1. Implement backend API routes
2. Build ACO algorithm for rake optimization
3. Create demand forecasting logic
4. Implement weather impact analysis
5. Connect frontend to backend APIs
6. Add real-time data updates
7. Test optimization algorithms
8. Validate scheduling accuracy
