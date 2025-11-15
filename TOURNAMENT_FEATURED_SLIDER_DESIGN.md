# Tournament Featured Slider - Design Overview

## Visual Layout

### Desktop View (1024px+)

```
┌─────────────────────────────────────────────────────────────────────┐
│                         TOURNAMENTS PAGE                            │
│                                                                     │
│  Page Header: "Tournaments"                                        │
│  Subtitle: "Discover and compete in epic tournaments"             │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    HERO BANNER (Featured)                  │   │
│  │                                                              │   │
│  │  [Background Image with Gradient Overlay]                  │   │
│  │                                                              │   │
│  │  [ACTIVE] Status Badge                                      │   │
│  │                                                              │   │
│  │  Fortnite Championship                         ← Title      │   │
│  │  FORTNITE                                      ← Game Type  │   │
│  │                                                              │   │
│  │  Compete for epic prizes and glory in this intense          │   │
│  │  Fortnite tournament featuring the best players.            │   │
│  │                              ← Description                  │   │
│  │                                                              │   │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──┐   │   │
│  │  │ PRIZE POOL   │ │ START DATE   │ │ END DATE     │ │DL│   │   │
│  │  │ $50,000      │ │ Dec 1        │ │ Dec 31       │ │15│   │   │
│  │  └──────────────┘ └──────────────┘ └──────────────┘ └──┘   │   │
│  │                         Stats Grid                          │   │
│  │                                                              │   │
│  │  [View Tournament Button] [Pause Button]                    │   │
│  │                                                              │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  More Tournaments                    [< Previous] [Next >]        │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │  [IMAGE]     │  │  [IMAGE]     │  │  [IMAGE]     │             │
│  │              │  │              │  │              │    (scroll)  │
│  │ Valorant     │  │ Call of Duty │  │ Apex Legends │  ──────→   │
│  │ Championship │  │   Invitational│ │   Pro League │             │
│  │ [UPCOMING]   │  │ [ACTIVE]     │  │ [COMPLETED] │             │
│  │ $25,000      │  │ $75,000      │  │ $100,000     │             │
│  │ Ends Jan 15  │  │ Ends Dec 25  │  │ Ended Nov 30 │             │
│  │              │  │              │  │              │             │
│  │ ◄Selected►   │  │              │  │              │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
│                                                                     │
│  ● ◐ ○ ○        ← Indicator Dots (click to navigate)             │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Mobile View (< 768px)

```
┌──────────────────────────┐
│  TOURNAMENTS             │
│  Discover tournaments    │
│                          │
│  ┌────────────────────┐  │
│  │  HERO BANNER      │  │
│  │                    │  │
│  │ [Background Img]   │  │
│  │                    │  │
│  │ [ACTIVE]          │  │
│  │ Fortnite          │  │
│  │ Championship      │  │
│  │ FORTNITE          │  │
│  │                    │  │
│  │ Compete for epic  │  │
│  │ prizes and glory  │  │
│  │                    │  │
│  │ PRIZE POOL        │  │
│  │ $50,000           │  │
│  │ START: Dec 1      │  │
│  │ END: Dec 31       │  │
│  │ DAYS LEFT: 15     │  │
│  │                    │  │
│  │ [View Tournament] │  │
│  │ [Pause]           │  │
│  └────────────────────┘  │
│                          │
│  More Tournaments        │
│  [< Prev] [Next >]       │
│                          │
│  ┌────────────────────┐  │
│  │ [IMAGE]            │  │
│  │ Valorant           │  │
│  │ Championship       │  │
│  │ [UPCOMING]         │  │
│  │ $25,000            │  │
│  │ Ends Jan 15        │  │
│  └────────────────────┘  │
│  (swipe for more)        │
│                          │
│  ● ◐ ○ ○              │
│                          │
└──────────────────────────┘
```

## Component Interactions

### 1. Hero Banner Interaction Flow

```
User Loads Page
        ↓
First Tournament Selected (index 0)
        ↓
Hero Banner Displays:
- Tournament image & details
- Status badge
- Prize pool & dates
- CTA buttons
        ↓
Auto-play starts (6s timer)
        ↓
User clicks Next/Prev Button OR Card
        ↓
Auto-play pauses
        ↓
Hero Banner Updates (smooth transition)
        ↓
Carousel scrolls to show selected card
```

### 2. Carousel Navigation

```
Carousel State at 3 items:

Initial:    ┌─────────────────────────────┐
            │ [Item 1] [Item 2] [Item 3]  │
            │   ▲ Selected                │
            └─────────────────────────────┘

After Click Item 2:
            ┌─────────────────────────────┐
            │ [Item 1] [Item 2] [Item 3]  │
            │          ▲ Selected         │
            └─────────────────────────────┘

After Click Item 3:
            ┌─────────────────────────────┐
            │ [Item 1] [Item 2] [Item 3]  │
            │                ▲ Selected   │
            └─────────────────────────────┘
```

### 3. Auto-play Loop

```
Timer = 0s     Timer = 3s     Timer = 6s     Timer = 9s
Item 1         Item 1         Item 2         Item 2
Selected       (waiting)      Selected       (waiting)
   ↓              ↓              ↓              ↓
   └──────────────┘──────────────┘──────────────┘
```

## Color Scheme

### Status Badges
```
Active:     [BG: green-500/20]  [TEXT: green-400]  [BORDER: green-500/30]
Upcoming:   [BG: blue-500/20]   [TEXT: blue-400]   [BORDER: blue-500/30]
Completed:  [BG: slate-500/20]  [TEXT: slate-400]  [BORDER: slate-500/30]
```

### Hero Banner
```
Background:      slate-900 with gradient overlay
Primary Text:    white (text-white)
Secondary Text:  slate-300 to slate-400
Accent Color:    blue-400 (for game type)
Stats Cards:     bg-slate-900/60 with backdrop blur
Button Primary:  bg-blue-600 hover:bg-blue-700
Button Secondary:bg-slate-700/40 hover:bg-slate-700/60
```

### Carousel Cards
```
Normal Border:   border-slate-700
Hover Border:    border-slate-600
Selected Border: border-blue-500 with shadow-lg shadow-blue-500/30
Card Background: bg-slate-800
Image Overlay:   bg-gradient-to-t from-slate-900 to-transparent
```

## Typography Hierarchy

```
Hero Banner Title:     text-5xl md:text-6xl lg:text-7xl font-black
Game Type Tag:         text-xl md:text-2xl font-semibold (blue-400)
Description:           text-lg md:text-xl text-slate-300
Stats Grid Heading:    text-xs md:text-sm uppercase tracking-widest font-semibold
Stats Grid Values:     text-2xl md:text-3xl font-bold (blue-400) or text-lg font-bold

Card Title:            text-lg font-bold text-white
Card Game Type:        text-xs font-bold uppercase tracking-widest (blue-400)
Card Subtitle:         text-slate-400 text-sm
```

## Spacing & Layout

### Hero Banner
```
Padding:           px-8 md:px-12 py-12 md:py-16 lg:py-20
Content Width:     max-w-3xl
Gap Between Stats: gap-4 md:gap-6 (grid)
Gap Between Sections: mb-8
```

### Carousel
```
Container Gap:     gap-4 (between cards)
Card Width:        w-80 (fixed)
Container Padding: pb-4 (bottom padding for scrollbar)
Edge Gradients:    w-12 (on left and right)
```

### Overall Page
```
Container Max Width:   max-w-7xl
Page Padding:          px-4 py-8 lg:py-12
Section Spacing:       mb-12 lg:mb-16
```

## Animations & Transitions

### Hover Effects
```
Card Hover:
- Scale: 105% (group-hover:scale-105)
- Transition: duration-300
- Border: transition to slate-600

Image Zoom:
- Scale: 110% (group-hover:scale-110)
- Transition: duration-300
```

### Selection Animation
```
Select Card:
- Border: transform to blue-500
- Shadow: add shadow-lg shadow-blue-500/30
- Scale: maintain (selected cards don't scale)
- Duration: 300ms
```

### Scroll Behavior
```
Carousel Scroll:     scroll-smooth
Hero Banner Update:  (instant, no transition needed)
Indicator Dot:       transition-all for width/color changes
```

## Responsive Breakpoints

### Small (< 768px)
- Hero title: text-5xl
- Stats grid: grid-cols-2
- Card width: ~full viewport
- Padding reduced on sides

### Medium (768px - 1024px)
- Hero title: text-6xl
- Stats grid: grid-cols-4
- Card width: w-80
- Moderate padding

### Large (> 1024px)
- Hero title: text-7xl
- Stats grid: grid-cols-4
- Card width: w-80
- Full padding (px-12)

## Accessibility Features

```
ARIA Labels:
- aria-label="Previous tournament"
- aria-label="Next tournament"
- aria-label="Go to tournament 1"

Focus States:
- All buttons have focus:outline-2 focus:outline-blue-500
- Tab order: Natural flow (left to right, top to bottom)

Semantic HTML:
- <h1> for page title
- <h2> for "More Tournaments" section
- <button> for all clickable elements
- <div> with data attributes for carousel items
```

## Performance Considerations

```
Rendering:
- Hero banner: Re-renders only on tournament selection
- Carousel: Uses scroll container ref (no full re-render)
- Indicator dots: Simple state update (no heavy calculations)

CSS:
- All animations use GPU-accelerated transforms
- No layout shifts (fixed dimensions)
- Backdrop blur for stats cards (lightweight)

JavaScript:
- useRef for scroll container (no state change)
- useEffect for auto-play timer (cleared on unmount)
- No unnecessary re-renders with proper dependency arrays
```

## Edge Cases & States

### No Tournaments
```
┌────────────────────────────────┐
│  No tournaments available      │
│  Check back soon for new       │
│  competitions                  │
└────────────────────────────────┘
```

### Single Tournament
```
Hero banner displayed
Carousel shows single card
Previous/Next buttons: disabled
Auto-play available
```

### Many Tournaments (10+)
```
Carousel scrolls smoothly
Edge gradients appear on both sides
Can cycle through all with arrows
Auto-play cycles indefinitely
```

### Thumbnail Not Available
```
Card shows: solid gradient background
Hero banner shows: gradient overlay effect
No broken images displayed
```

## Interactive Demo Flow

### Scenario 1: User browsing tournaments
```
1. Page loads → First tournament shown in hero
2. User waits → Auto-play cycles every 6 seconds
3. User clicks "Next" → Selected tournament updates, auto-play pauses
4. User clicks a card → Hero updates, indicator dot changes
5. User clicks "Auto Play" → Carousel resumes cycling
6. User clicks "View Tournament" → Navigate to tournament detail page
```

### Scenario 2: Mobile user
```
1. Page loads → Hero banner fills screen
2. User scrolls down → Carousel becomes visible
3. User touches "swipe" → Smooth scroll animation
4. User clicks dot → Jump to specific tournament
5. User clicks "View Tournament" → Navigate to detail page
```

## Browser Compatibility

```
Feature             Chrome  Firefox  Safari  Edge
─────────────────────────────────────────────────
Smooth Scroll       ✓       ✓        ✓      ✓
CSS Transform       ✓       ✓        ✓      ✓
Backdrop Blur       ✓       ✓        ✓ (11+)  ✓
Snap Align          ✓       ✓        ✓ (15+)  ✓
CSS Grid            ✓       ✓        ✓      ✓
CSS Gradients       ✓       ✓        ✓      ✓
Touch Events        ✓       ✓        ✓      ✓
─────────────────────────────────────────────────
```
