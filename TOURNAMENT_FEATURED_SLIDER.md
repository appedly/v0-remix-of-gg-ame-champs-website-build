# Tournament Featured Slider - PlayStation-Inspired UI

## Overview

The Tournament Featured Slider is a modern, interactive carousel component that displays tournaments with a PlayStation-inspired featured slider UI. It provides users with an engaging way to browse and select tournaments.

## Features

### 1. **Hero Banner (Featured Section)**
- Large, prominent display of the selected tournament
- Background image with gradient overlay for visual hierarchy
- Displays key tournament information:
  - Tournament title
  - Game type
  - Description
  - Prize pool
  - Start and end dates
  - Days remaining until tournament ends
  - Status badge (Active/Upcoming/Completed)

### 2. **Interactive Carousel**
- Horizontally scrollable tournament cards below the hero
- Each card shows:
  - Tournament thumbnail image
  - Game type tag
  - Tournament title
  - Prize pool with trophy icon
  - End date with calendar icon
  - Status badge
- Smooth, responsive scrolling with snap alignment
- Keyboard and mouse navigation support
- Edge gradients to indicate more content available

### 3. **Auto-Play Functionality**
- Automatically cycles through tournaments every 6 seconds
- Pause/Auto Play button to control automatic cycling
- Auto-play pauses when user manually interacts with carousel

### 4. **Navigation Controls**
- Previous/Next buttons for manual tournament selection
- Click on any card to select and update hero banner
- Indicator dots at the bottom for quick navigation
- Smooth transitions and animations between selections

### 5. **Responsive Design**
- Fully responsive on mobile, tablet, and desktop
- Hero banner scales and adapts to different screen sizes
- Carousel maintains optimal card width across all devices
- Touch-friendly controls on mobile devices
- Text sizing adapts responsively

### 6. **Visual Hierarchy**
- Selected tournament highlighted with blue border and shadow
- Hover effects on carousel cards (scale up, border highlight)
- Status badges with color-coded backgrounds
- Prize pool and dates prominently displayed
- Trophy and calendar icons for visual recognition

### 7. **Call-to-Action**
- "View Tournament" button to navigate to tournament details
- Auto Play/Pause button for carousel control
- Links to full tournament pages

## Component Structure

```
TournamentFeaturedSlider
├── Hero Banner (Featured Tournament)
│   ├── Background Image with Overlay
│   ├── Status Badge
│   ├── Tournament Title
│   ├── Game Type
│   ├── Description
│   ├── Stats Grid (Prize Pool, Dates, Days Left)
│   └── Action Buttons (View Tournament, Auto Play)
│
├── Carousel Controls
│   ├── Previous/Next Buttons
│   └── Section Title
│
├── Horizontally Scrollable Carousel
│   ├── Tournament Cards (multiple)
│   │   ├── Image/Thumbnail
│   │   ├── Status Badge
│   │   ├── Game Type Tag
│   │   ├── Title
│   │   ├── Prize Pool Display
│   │   └── End Date Display
│   ├── Edge Gradients (visual indicators)
│   └── Selection Indicator
│
└── Navigation Dots
    └── Interactive indicator dots for quick access
```

## Usage

### Basic Implementation

```tsx
import { TournamentFeaturedSlider } from "@/components/tournament-featured-slider"

export default function TournamentsPage() {
  const tournaments = [
    {
      id: "1",
      title: "Fortnite Championship",
      game: "Fortnite",
      description: "Compete for $50,000 in prizes",
      prize_pool: 50000,
      start_date: "2024-12-01",
      end_date: "2024-12-31",
      status: "active",
      max_submissions: 100,
      created_at: "2024-11-01",
      thumbnail_url: "/images/fortnite.jpg"
    },
    // More tournaments...
  ]

  return (
    <div className="min-h-screen bg-slate-900">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-12">Tournaments</h1>
        <TournamentFeaturedSlider tournaments={tournaments} />
      </main>
    </div>
  )
}
```

## Props

### TournamentFeaturedSliderProps

```typescript
interface TournamentFeaturedSliderProps {
  tournaments: Tournament[]
}

type Tournament = {
  id: string
  title: string
  game: string
  description: string | null
  prize_pool: number
  start_date: string
  end_date: string
  status: string
  max_submissions: number | null
  created_at: string
  thumbnail_url?: string | null
}
```

## Styling

The component uses Tailwind CSS classes and follows the project's design system:

- **Color Scheme**: Slate (900/800/700) with blue accents (600/400)
- **Status Colors**:
  - Active: Green (`bg-green-500/20 text-green-400`)
  - Upcoming: Blue (`bg-blue-500/20 text-blue-400`)
  - Completed: Slate (`bg-slate-500/20 text-slate-400`)
- **Typography**: 
  - Hero title: `text-5xl md:text-6xl lg:text-7xl font-black`
  - Card title: `text-lg font-bold`
- **Spacing**: Consistent use of Tailwind's gap and padding utilities

## Interactions

### 1. **Click Tournament Card**
- Selects the tournament
- Updates hero banner with selected tournament's details
- Stops auto-play
- Scrolls card into view with smooth animation

### 2. **Hover Card**
- Slight scale increase (105%)
- Border color change
- Visual feedback for interactivity

### 3. **Auto Play Toggle**
- Button switches between "Auto Play" and "Pause" states
- Continues cycling every 6 seconds when active
- Manual interaction pauses auto-play

### 4. **Navigation Buttons**
- Previous/Next buttons disable when only one tournament exists
- Smooth scroll to selected card
- Stops auto-play on click

### 5. **Indicator Dots**
- Click any dot to jump to that tournament
- Expands on hover for better visibility
- Shows active state with larger, blue indicator

## Animations & Transitions

- **Smooth Scrolling**: CSS `scroll-behavior: smooth`
- **Hover Effects**: `transition-all duration-300`
- **Image Zoom**: `group-hover:scale-110 transition-transform duration-300`
- **Border Transitions**: `border-2 transition-all duration-300`
- **Text Color**: `group-hover:text-blue-400 transition-colors`

## Responsive Breakpoints

- **Mobile** (< 768px):
  - Single column layout for stats
  - Smaller text sizes
  - Full-width carousel cards
  - Touch-friendly button sizes

- **Tablet** (768px - 1024px):
  - 2-column grid for stats
  - Medium text sizes
  - Adjusted card widths

- **Desktop** (> 1024px):
  - 4-column grid for stats
  - Larger text and spacing
  - Optimal card widths for carousel

## Accessibility Features

- Semantic HTML with proper heading hierarchy
- ARIA labels on buttons (`aria-label="Previous tournament"`)
- Keyboard navigation support
- Color-coded status indicators (not relying on color alone)
- Sufficient color contrast ratios
- Focus states on interactive elements

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Considerations

- Images should be optimized (WebP format recommended)
- Lazy loading for carousel images
- Efficient re-renders using React hooks
- No unnecessary state updates
- Smooth 60fps animations with CSS transforms

## Future Enhancements

1. **Thumbnail Upload**: Allow admin to upload custom tournament thumbnails
2. **Advanced Filters**: Filter by game, status, prize pool range
3. **Search**: Search tournaments by name or game
4. **Favorites**: Users can favorite tournaments
5. **Notifications**: Notify users when tournaments start/end
6. **Tournament Stats**: Show live participant count, submission count
7. **Comparison View**: Compare multiple tournaments side-by-side
8. **Video Previews**: Auto-play video previews on hover

## Integration Points

- **Navigation**: Links to `/tournaments/[id]` for full tournament details
- **Database**: Fetches tournament data from Supabase `tournaments` table
- **User Context**: Uses user ID for personalized interactions (future)
- **Responsive**: Works within Next.js 15 App Router structure

## Code Quality

- TypeScript for type safety
- Proper error handling
- Clean, readable code structure
- Comments for complex logic
- Follows project code conventions
- No hardcoded values (uses props/state)

## Testing Recommendations

1. **Unit Tests**: Test carousel navigation logic
2. **Integration Tests**: Test with real tournament data
3. **Responsive Tests**: Verify mobile/tablet/desktop layouts
4. **Accessibility Tests**: Screen reader compatibility
5. **Performance Tests**: Measure animation frame rates
6. **Cross-browser Tests**: Safari, Firefox, Chrome

## Troubleshooting

### Carousel not scrolling smoothly
- Ensure `scroll-behavior: smooth` is not disabled in global CSS
- Check for JavaScript errors in console

### Images not loading
- Verify `thumbnail_url` is a valid URL
- Check image file permissions
- Ensure CORS headers are set correctly

### Auto-play not working
- Check browser console for JavaScript errors
- Verify `isAutoPlay` state is being updated
- Clear browser cache and reload

### Responsive layout issues
- Verify Tailwind CSS is properly configured
- Check for conflicting CSS classes
- Test in different viewport sizes

## Related Files

- `/app/tournaments/page.tsx` - Main tournaments page
- `/components/tournament-featured-slider.tsx` - Slider component
- `/app/tournaments/[id]/page.tsx` - Tournament detail page
- `/components/tournament-submissions.tsx` - Submissions component

## Version History

### v1.0 (Initial Release)
- Featured slider with hero banner
- Horizontally scrollable carousel
- Auto-play functionality
- Navigation controls
- Responsive design
- Smooth animations and transitions
