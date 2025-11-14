# Project Management Tool - Design Guidelines

## Design Approach

**Selected System:** Material Design (via Material-UI)
**Justification:** This productivity tool requires information-dense layouts, clear data visualization, and familiar interaction patterns. Material Design excels at organizing complex data while maintaining usability. Drawing inspiration from Linear, Asana, and Trello for modern task management UX patterns.

## Core Design Principles

1. **Clarity over decoration** - Every element serves a functional purpose
2. **Scannable information hierarchy** - Users need to quickly parse task data
3. **Consistent spatial rhythm** - Predictable layouts reduce cognitive load
4. **Action-oriented interface** - Primary actions are always accessible

## Typography System

**Font Family:** Roboto (Material-UI default) with Inter as optional alternative for enhanced readability

**Hierarchy:**
- Page titles: 2xl, semi-bold (Dashboard, Projects, Calendar)
- Section headers: xl, medium (Project names, view toggles)
- Card titles/Task names: base, medium
- Metadata labels: sm, medium, uppercase with letter-spacing (PRIORITY, DUE DATE)
- Body text/descriptions: base, regular
- Supporting text/timestamps: sm, regular
- Small labels/badges: xs, medium

## Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 6, 8, 12, and 16 exclusively
- Component internal padding: p-4 or p-6
- Card spacing: gap-4 for grids, space-y-6 for stacks
- Page margins: px-6 md:px-8 lg:px-12
- Section spacing: py-8 md:py-12

**Grid Structure:**
- Main dashboard: 12-column grid with 16-unit gaps
- Task cards: 3-column grid on desktop (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
- Calendar view: Full-width with sidebar filters (70/30 split on desktop)
- Task detail panels: Side drawer at 400px width

**Container Strategy:**
- Maximum width: max-w-7xl for main content areas
- Sidebars/navigation: Fixed 240px width on desktop, full-width drawer on mobile
- Modal dialogs: max-w-2xl for forms, max-w-4xl for detailed views

## Component Library

### Navigation
**Top App Bar:**
- Fixed positioning with elevation-4 shadow
- Height: h-16
- Contains: Logo (left), project switcher (center), user menu + notifications (right)
- Breadcrumb navigation below app bar for context

**Side Navigation (Desktop):**
- Persistent drawer: 240px width
- Navigation items with icons + labels
- Sections: Dashboard, My Tasks, Projects, Calendar, Team
- Active state with subtle background and border accent

### Task Cards
**Standard Task Card:**
- Outlined card with hover elevation increase
- Structure: Title (truncated at 2 lines), priority badge, assignee avatar, due date indicator
- Action menu (three-dot) top-right
- Status indicator: Vertical border on left edge (4px width)
- Padding: p-4, min-height: 120px

**Compact List View:**
- Single row per task with columns: checkbox, title, priority chip, assignee, due date, status, actions
- Alternating subtle background for readability
- Row height: 56px with py-2

### Priority System
**Visual Treatment:**
- Display as filled chips with numeric value (1-5)
- Size: Small chips (height: 24px)
- Typography: xs, semi-bold
- Position: Inline with task metadata

### Calendar Component
**@mui/x-date-pickers Implementation:**
- Full calendar view with task events as dot indicators on dates
- Task count badge on dates with multiple tasks
- Click to expand day view showing all tasks
- Date range picker prominent in toolbar
- Project filter dropdown integrated in calendar header

**Event Display:**
- Task events shown with 4px height bars
- Truncated task name with priority indicator
- Click opens task detail panel (slide-in from right)

### Forms & Inputs
**Task Creation Modal:**
- Centered modal, max-w-2xl
- Title: "Create New Task" - xl, semi-bold
- Form fields with consistent spacing (space-y-6)
- Field labels: sm, medium, with required indicators
- Input heights: 48px minimum for touch targets
- Validation messages: xs text below fields

**Input Components:**
- Text fields: Outlined variant with focused state
- Select dropdowns: Native Material-UI select
- Date pickers: Material-UI date picker with calendar popup
- Priority selector: Button group with numbers 1-5

### Data Display
**Project Overview Cards:**
- Grid layout with equal-height cards
- Structure: Project name header, task count metrics, progress indicator, quick actions
- Padding: p-6
- Metrics displayed as labeled stat groups (2-column grid within card)

**Task List Table:**
- Material-UI DataGrid component
- Sortable columns: Name, Priority, Due Date, Assignee, Status
- Row selection with checkboxes
- Pagination: 25/50/100 items per page
- Empty state with illustration and "Create Task" CTA

### Status & Feedback
**Loading States:**
- Page-level: Centered circular progress spinner
- Component-level: Skeleton screens matching final layout
- Button loading: Spinner replacing button text, button disabled

**Error Messages:**
- Alert component with error severity
- Position: Top of content area or inline with failed action
- Dismissible with close icon
- Text: sm, includes actionable next steps

**Success Confirmations:**
- Snackbar notifications, bottom-center, 4s auto-hide
- Simple message: "Task created successfully"

### Badges & Indicators
**Status Badges:**
- Chip components with soft backgrounds
- Text: xs, medium, uppercase
- Position: Inline with task metadata

**Assignee Avatars:**
- Size: 32px diameter in cards, 24px in compact views
- Fallback: Initials with generated background
- Multiple assignees: Overlapping avatar group, max 3 visible + "+N" indicator

## Interaction Patterns

**Primary Actions:**
- Floating Action Button (FAB): Fixed bottom-right for "Create Task"
- Size: 56px diameter with elevation-6
- Icon: Plus symbol

**Bulk Actions:**
- Appear in elevated toolbar when items selected
- Actions: Change status, reassign, set priority, delete
- Positioned: Top of list/grid, replacing filters

**Quick Filters:**
- Chip-based filter bar above task views
- Common filters: My Tasks, Due Today, High Priority, Overdue
- Active filters removable with X icon

**Drag & Drop:**
- Enable for kanban-style status changes
- Visual feedback: Card elevation increase during drag
- Drop zones with highlighted backgrounds

## Responsive Behavior

**Breakpoints:**
- Mobile: < 768px - Single column, bottom navigation
- Tablet: 768-1024px - 2-column grids, drawer toggles to modal
- Desktop: > 1024px - Full layout with persistent navigation

**Mobile Adaptations:**
- Bottom navigation replaces side drawer (5 icons max)
- Task cards expand to full width
- Calendar switches to agenda view by default
- FAB remains accessible, positioned for thumb reach

## Accessibility Essentials

- Focus indicators visible on all interactive elements (2px outline)
- Skip links for keyboard navigation
- ARIA labels on icon-only buttons
- Form fields with proper label associations
- Keyboard shortcuts for common actions (documented in help)
- Adequate touch targets (minimum 44x44px)

This design creates a professional, efficient task management interface that prioritizes speed and clarity while maintaining visual polish through Material Design's proven patterns.