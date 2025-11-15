import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from './avatar'
import { Badge } from './badge'
import { Crown, Medal, Award, TrendingUp, TrendingDown, Minus } from 'lucide-react'

const leaderboardVariants = cva(
  "w-full"
)

interface LeaderboardEntry {
  id: string
  rank: number
  previousRank?: number
  username: string
  avatar?: string
  isOnline?: boolean
  totalVotes: number
  voteTrend?: number
  winRate?: number
  submissionCount?: number
  game?: string
}

interface LeaderboardTableProps extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof leaderboardVariants> {
  entries: LeaderboardEntry[]
  showRankChange?: boolean
  showTrend?: boolean
  maxEntries?: number
}

function LeaderboardTable({
  className,
  entries,
  showRankChange = true,
  showTrend = true,
  maxEntries = 20,
  ...props
}: LeaderboardTableProps) {
  const getRankDisplay = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 text-white font-bold shadow-lg">
            <Crown className="size-6" />
          </div>
        )
      case 2:
        return (
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 text-white font-bold shadow-md">
            <Medal className="size-5" />
          </div>
        )
      case 3:
        return (
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-white font-bold shadow-md">
            <Award className="size-5" />
          </div>
        )
      default:
        return (
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-muted-foreground font-semibold text-sm">
            {rank}
          </div>
        )
    }
  }

  const getRankChange = (current: number, previous?: number) => {
    if (!previous) return { icon: <span className="text-xs">NEW</span>, color: 'text-success' }
    const change = previous - current
    if (change > 0) return { icon: <TrendingUp className="size-4" />, color: 'text-success', value: `+${change}` }
    if (change < 0) return { icon: <TrendingDown className="size-4" />, color: 'text-error', value: change.toString() }
    return { icon: <Minus className="size-4" />, color: 'text-muted', value: '0' }
  }

  const getVoteTrend = (trend?: number) => {
    if (!trend) return { icon: <Minus className="size-3" />, color: 'text-muted' }
    if (trend > 0) return { icon: <TrendingUp className="size-3" />, color: 'text-success', value: `+${trend}` }
    if (trend < 0) return { icon: <TrendingDown className="size-3" />, color: 'text-error', value: trend.toString() }
    return { icon: <Minus className="size-3" />, color: 'text-muted', value: '0' }
  }

  const getRowStyling = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-success/10 to-transparent border-l-4 border-success'
    if (rank === 2) return 'bg-gradient-to-r from-neutral/10 to-transparent border-l-4 border-neutral-400'
    if (rank === 3) return 'bg-gradient-to-r from-warning/10 to-transparent border-l-4 border-warning'
    if (rank <= 10) return 'hover:bg-muted/50'
    return 'opacity-85 hover:bg-muted/30'
  }

  const displayedEntries = entries.slice(0, maxEntries)

  return (
    <div className={cn(leaderboardVariants(), className)} {...props}>
      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 p-4 bg-muted/30 rounded-t-xl border-b border-border">
        <div className="col-span-1 text-center text-caption text-muted uppercase tracking-wide">Rank</div>
        <div className="col-span-4 text-caption text-muted uppercase tracking-wide">Player</div>
        <div className="col-span-2 text-center text-caption text-muted uppercase tracking-wide">Votes</div>
        {showTrend && (
          <div className="col-span-2 text-center text-caption text-muted uppercase tracking-wide">Trend</div>
        )}
        {showRankChange && (
          <div className="col-span-2 text-center text-caption text-muted uppercase tracking-wide">Change</div>
        )}
        <div className="col-span-1 text-center text-caption text-muted uppercase tracking-wide">Win Rate</div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-border">
        {displayedEntries.map((entry) => {
          const rankChange = getRankChange(entry.rank, entry.previousRank)
          const voteTrend = getVoteTrend(entry.voteTrend)
          
          return (
            <div
              key={entry.id}
              className={cn(
                "grid grid-cols-12 gap-4 p-4 items-center min-h-12 transition-all duration-200 hover:shadow-sm",
                getRowStyling(entry.rank)
              )}
            >
              {/* Rank */}
              <div className="col-span-1 flex justify-center">
                {getRankDisplay(entry.rank)}
              </div>

              {/* Player */}
              <div className="col-span-4 flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={entry.avatar} alt={entry.username} />
                    <AvatarFallback className="text-sm font-semibold">
                      {entry.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {entry.isOnline && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success rounded-full border-2 border-card" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className={cn(
                    "font-medium",
                    entry.rank === 1 ? "text-lg text-success font-bold" : 
                    entry.rank === 2 ? "text-base text-neutral-300 font-semibold" :
                    entry.rank === 3 ? "text-base text-warning font-semibold" :
                    "text-body-standard"
                  )}>
                    {entry.username}
                  </span>
                  {entry.game && (
                    <span className="text-caption text-muted">{entry.game}</span>
                  )}
                </div>
              </div>

              {/* Votes */}
              <div className="col-span-2 text-center">
                <div className="flex flex-col items-center">
                  <span className={cn(
                    "font-bold",
                    entry.rank <= 3 ? "text-lg" : "text-body-standard"
                  )}>
                    {entry.totalVotes.toLocaleString()}
                  </span>
                  {entry.submissionCount && (
                    <span className="text-caption text-muted">
                      {entry.submissionCount} clips
                    </span>
                  )}
                </div>
              </div>

              {/* Trend */}
              {showTrend && (
                <div className="col-span-2 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <span className={voteTrend.color}>
                      {voteTrend.icon}
                    </span>
                    {voteTrend.value !== '0' && (
                      <span className={cn("text-sm font-medium", voteTrend.color)}>
                        {voteTrend.value}%
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Rank Change */}
              {showRankChange && (
                <div className="col-span-2 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <span className={rankChange.color}>
                      {rankChange.icon}
                    </span>
                    {rankChange.value && (
                      <span className={cn("text-sm font-medium", rankChange.color)}>
                        {rankChange.value}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Win Rate */}
              <div className="col-span-1 text-center">
                {entry.winRate !== undefined ? (
                  <Badge 
                    variant={entry.winRate >= 70 ? 'success' : entry.winRate >= 50 ? 'warning' : 'secondary'}
                    className="text-xs"
                  >
                    {entry.winRate}%
                  </Badge>
                ) : (
                  <span className="text-muted text-sm">-</span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Load More */}
      {entries.length > maxEntries && (
        <div className="p-4 text-center border-t border-border">
          <button className="btn btn-tertiary">
            Show All {entries.length} Players
          </button>
        </div>
      )}
    </div>
  )
}

export { LeaderboardTable, leaderboardVariants }