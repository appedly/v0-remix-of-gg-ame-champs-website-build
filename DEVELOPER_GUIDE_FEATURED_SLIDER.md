# Developer Guide - Tournament Featured Slider

## Quick Start

### Installation
The component is already integrated into the project. No additional packages are required.

### Basic Usage
```tsx
import { TournamentFeaturedSlider } from "@/components/tournament-featured-slider"

// In your page/component
<TournamentFeaturedSlider tournaments={tournamentList} />
```

## File Structure

```
/home/engine/project/
├── components/
│   ├── tournament-featured-slider.tsx    # Main component (350+ lines)
│   ├── tournament-submissions.tsx        # Related: submission display
│   └── tournament-list.tsx              # Legacy: old tournament listing
│
├── app/tournaments/
│   ├── page.tsx                         # Uses TournamentFeaturedSlider
│   └── [id]/
│       └── page.tsx                     # Tournament detail page
│
└── Documentation/
    ├── TOURNAMENT_FEATURED_SLIDER.md          # Feature overview
    ├── TOURNAMENT_FEATURED_SLIDER_DESIGN.md   # Visual design guide
    └── DEVELOPER_GUIDE_FEATURED_SLIDER.md     # This file
```

## Architecture

### Component States

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

### Internal State Management

```typescript
// useState
const [selectedIndex, setSelectedIndex] = useState(0)    // Current selected tournament
const [isAutoPlay, setIsAutoPlay] = useState(true)       // Auto-play toggle

// useRef
const scrollContainerRef = useRef<HTMLDivElement>(null)  // Carousel container
const autoPlayRef = useRef<NodeJS.Timeout | null>(null)  // Timer reference
```

### Effect Hooks

```typescript
// Auto-play effect
useEffect(() => {
  // Sets interval to cycle through tournaments every 6 seconds
  // Clears on unmount or when isAutoPlay changes
}, [isAutoPlay, tournaments.length])

// Scroll effect
useEffect(() => {
  // Scrolls carousel to keep selected item in view
  // Uses scrollIntoView with smooth behavior
}, [selectedIndex])
```

## Key Functions

### 1. `handlePrevious()` / `handleNext()`
```typescript
const handlePrevious = () => {
  setIsAutoPlay(false)                                    // Pause auto-play
  setSelectedIndex((prev) => (prev - 1 + tournaments.length) % tournaments.length)
}
```
- Navigates to previous/next tournament
- Stops auto-play on user interaction
- Uses modulo arithmetic for circular navigation

### 2. `handleSelectTournament(index)`
```typescript
const handleSelectTournament = (index: number) => {
  setIsAutoPlay(false)
  setSelectedIndex(index)
}
```
- Sets selected tournament to specific index
- Stops auto-play
- Carousel auto-scrolls to show selected card

### 3. `getStatusColor(status)`
```typescript
const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-500/20 text-green-400 border-green-500/30"
    case "upcoming":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30"
    case "completed":
      return "bg-slate-500/20 text-slate-400 border-slate-500/30"
    default:
      return "bg-slate-500/20 text-slate-400 border-slate-500/30"
  }
}
```
- Maps tournament status to Tailwind color classes
- Ensures consistent styling across component

### 4. `getDaysRemaining(endDate)`
```typescript
const getDaysRemaining = (endDate: string) => {
  const now = new Date()
  const end = new Date(endDate)
  const diffTime = end.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}
```
- Calculates remaining days until tournament end
- Handles date conversion
- Returns whole number of days

## Component Sections

### 1. Hero Banner
```tsx
<div className="relative group overflow-hidden rounded-2xl border border-slate-700">
  {/* Background with overlay */}
  {/* Status badge */}
  {/* Title, game, description */}
  {/* Stats grid (4 columns) */}
  {/* CTA buttons */}
</div>
```
- Takes up ~20-30% of viewport height
- Shows all key tournament information
- Smooth background image transitions

### 2. Carousel Controls
```tsx
<div className="flex items-center justify-between">
  <h2>More Tournaments</h2>
  <div className="flex gap-2">
    <button onClick={handlePrevious}>← Previous</button>
    <button onClick={handleNext}>Next →</button>
  </div>
</div>
```
- Simple button-based navigation
- Buttons disabled if only one tournament

### 3. Scrollable Carousel
```tsx
<div ref={scrollContainerRef} className="flex gap-4 overflow-x-auto scroll-smooth">
  {tournaments.map((tournament, index) => (
    <div key={tournament.id} data-carousel-item onClick={() => handleSelectTournament(index)}>
      {/* Card content */}
    </div>
  ))}
</div>
```
- Uses horizontal overflow
- Snap alignment for better UX
- Smooth scroll behavior

### 4. Indicator Dots
```tsx
<div className="flex justify-center gap-2">
  {tournaments.map((_, index) => (
    <button
      key={index}
      onClick={() => handleSelectTournament(index)}
      className={selectedIndex === index ? "w-8 bg-blue-500" : "w-2 bg-slate-700"}
    />
  ))}
</div>
```
- Visual indicator of current position
- Click to jump to any tournament
- Width animates between states

## Customization Guide

### 1. Changing Auto-play Duration

Find this line in the component:
```typescript
autoPlayRef.current = setInterval(() => {
  setSelectedIndex((prev) => (prev + 1) % tournaments.length)
}, 6000) // Change this value (milliseconds)
```

Change to: `}, 4000)` for 4 seconds, `}, 8000)` for 8 seconds, etc.

### 2. Adjusting Card Width

Find this line:
```tsx
<div className="flex-shrink-0 w-80 snap-center">
```

Change `w-80` to:
- `w-72` for smaller cards
- `w-96` for larger cards
- `w-screen` for full-width cards

### 3. Modifying Hero Banner Background

Current implementation:
```tsx
backgroundImage: selectedTournament.thumbnail_url
  ? `url(${selectedTournament.thumbnail_url})`
  : "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"
```

To add custom gradient overlay:
```tsx
backgroundImage: selectedTournament.thumbnail_url
  ? `linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.5) 100%), url(${selectedTournament.thumbnail_url})`
  : "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"
```

### 4. Adding Sound Effects

After state changes, add:
```typescript
const handleSelectTournament = (index: number) => {
  playSound('/sounds/select.mp3') // Add this line
  setIsAutoPlay(false)
  setSelectedIndex(index)
}
```

Requires adding sound files to `/public/sounds/`

### 5. Changing Color Scheme

Example: Change blue to purple accent
```tsx
// Change from:
className="border-blue-500 shadow-lg shadow-blue-500/30"
// To:
className="border-purple-500 shadow-lg shadow-purple-500/30"

// And button from:
className="bg-blue-600 hover:bg-blue-700"
// To:
className="bg-purple-600 hover:bg-purple-700"
```

## Performance Optimization

### Current Optimizations
1. **useRef for DOM access**: Avoids re-renders when scrolling carousel
2. **Proper dependency arrays**: Only re-run effects when needed
3. **CSS transforms**: Use GPU acceleration for animations
4. **No inline functions**: All event handlers are stable

### Additional Optimizations
```typescript
// Memoize component if using in multiple places
export const TournamentFeaturedSlider = memo(TournamentFeaturedSliderComponent)

// Debounce resize events if adding responsive logic
import { useDebouncedValue } from "@/lib/hooks"

// Lazy load images
<img
  loading="lazy"
  src={tournament.thumbnail_url}
  alt={tournament.title}
/>
```

## Testing

### Unit Tests Example
```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { TournamentFeaturedSlider } from './tournament-featured-slider'

describe('TournamentFeaturedSlider', () => {
  const mockTournaments = [
    {
      id: '1',
      title: 'Tournament 1',
      game: 'Fortnite',
      description: 'Test',
      prize_pool: 1000,
      start_date: '2024-01-01',
      end_date: '2024-01-31',
      status: 'active',
      max_submissions: 100,
      created_at: '2024-01-01'
    }
  ]

  it('renders hero banner with tournament details', () => {
    render(<TournamentFeaturedSlider tournaments={mockTournaments} />)
    expect(screen.getByText('Tournament 1')).toBeInTheDocument()
  })

  it('navigates to next tournament', () => {
    render(<TournamentFeaturedSlider tournaments={mockTournaments} />)
    const nextButton = screen.getByLabelText('Next tournament')
    fireEvent.click(nextButton)
    // Assert selection changed
  })
})
```

### Integration Tests
```typescript
// Test with real data from Supabase
const { data: tournaments } = await supabase.from('tournaments').select('*')
render(<TournamentFeaturedSlider tournaments={tournaments} />)
// Verify all tournaments render
```

### E2E Tests (Cypress)
```typescript
describe('Tournament Featured Slider E2E', () => {
  it('displays and cycles through tournaments', () => {
    cy.visit('/tournaments')
    cy.get('[data-carousel-item]').should('have.length.greaterThan', 0)
    cy.contains('More Tournaments').should('be.visible')
    cy.get('button:contains("Next")').click()
    // Verify hero updated
  })
})
```

## Troubleshooting

### Issue: Carousel not scrolling to selected item
**Cause**: `scrollContainerRef` not properly attached
**Solution**: 
```typescript
// Verify ref is attached
<div ref={scrollContainerRef} className="flex gap-4 overflow-x-auto">
```

### Issue: Auto-play not working
**Cause**: Timer not starting or being cleared prematurely
**Solution**: Check the useEffect dependency array
```typescript
useEffect(() => {
  // Must have correct dependencies
}, [isAutoPlay, tournaments.length]) // NOT missing any dependencies
```

### Issue: Slow performance with many tournaments
**Cause**: Re-rendering all cards on each update
**Solution**: Memoize carousel items
```typescript
const TournamentCard = memo(({ tournament, isSelected, onClick }) => (
  // Card JSX
))
```

### Issue: Images not loading
**Cause**: Invalid `thumbnail_url` or CORS issue
**Solution**:
```typescript
// Add error handling
<img
  src={tournament.thumbnail_url || '/placeholder.jpg'}
  onError={(e) => {
    e.currentTarget.src = '/placeholder.jpg'
  }}
  alt={tournament.title}
/>
```

## Browser DevTools Tips

### Debugging State
```javascript
// In DevTools Console
// Check current state (if component exported Redux/Zustand state)
console.log(state.selectedIndex)
```

### Performance Profiling
1. Open React DevTools
2. Switch to "Profiler" tab
3. Record interaction
4. Check component render times
5. Look for unnecessary re-renders

### Network Debugging
1. Open DevTools Network tab
2. Check image loading times
3. Verify lazy loading is working
4. Monitor carousel scroll performance

## Advanced Features to Add

### 1. Filtering
```typescript
const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'upcoming'>('all')
const filteredTournaments = tournaments.filter(t => 
  filterStatus === 'all' || t.status === filterStatus
)
```

### 2. Search
```typescript
const [searchTerm, setSearchTerm] = useState('')
const searchedTournaments = tournaments.filter(t =>
  t.title.toLowerCase().includes(searchTerm.toLowerCase())
)
```

### 3. Favorites
```typescript
const [favorites, setFavorites] = useState<string[]>([])
const toggleFavorite = (id: string) => {
  setFavorites(prev => 
    prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
  )
}
```

### 4. Infinite Scroll
```typescript
useEffect(() => {
  const container = scrollContainerRef.current
  if (!container) return
  
  container.addEventListener('scroll', () => {
    if (container.scrollLeft + container.clientWidth >= container.scrollWidth) {
      // Load more tournaments
    }
  })
}, [])
```

### 5. Keyboard Navigation
```typescript
useEffect(() => {
  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') handlePrevious()
    if (e.key === 'ArrowRight') handleNext()
  }
  
  window.addEventListener('keydown', handleKeyPress)
  return () => window.removeEventListener('keydown', handleKeyPress)
}, [])
```

## API Reference

### Component Props
```typescript
interface TournamentFeaturedSliderProps {
  tournaments: Tournament[]
}
```

### Tournament Data Structure
```typescript
type Tournament = {
  id: string              // Unique identifier
  title: string           // Tournament name
  game: string            // Game title (e.g., "Fortnite")
  description: string | null  // Tournament description
  prize_pool: number      // Prize amount in dollars
  start_date: string      // ISO date string
  end_date: string        // ISO date string
  status: string          // 'active' | 'upcoming' | 'completed'
  max_submissions: number | null  // Max participant clips
  created_at: string      // ISO date string
  thumbnail_url?: string | null  // Background image URL
}
```

### Exported Component
```typescript
export function TournamentFeaturedSlider({ tournaments }: TournamentFeaturedSliderProps)
```

## Version History

### v1.0.0 (Current)
- Initial release with featured slider
- Hero banner with tournament details
- Horizontally scrollable carousel
- Auto-play functionality
- Navigation controls
- Indicator dots
- Responsive design
- Smooth animations

## Contributing

When modifying this component:

1. **Follow existing patterns**: Use same hooks and state management
2. **Maintain responsiveness**: Test on mobile, tablet, desktop
3. **Preserve animations**: Keep smooth transitions working
4. **Update documentation**: Add comments for complex logic
5. **Test thoroughly**: Try with various tournament counts

## Related Documentation

- [TOURNAMENT_FEATURED_SLIDER.md](./TOURNAMENT_FEATURED_SLIDER.md) - Feature overview
- [TOURNAMENT_FEATURED_SLIDER_DESIGN.md](./TOURNAMENT_FEATURED_SLIDER_DESIGN.md) - Visual design
- Component file: `components/tournament-featured-slider.tsx`
- Usage: `app/tournaments/page.tsx`
