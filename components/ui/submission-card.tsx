import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from './avatar'
import { Badge } from './badge'
import { Button } from './button'
import { Card, CardContent } from './card'
import { 
  Play, 
  Eye, 
  Trophy, 
  Heart, 
  Share2, 
  BarChart3, 
  MoreVertical,
  Star,
  TrendingUp
} from 'lucide-react'

const submissionCardVariants = cva(
  "card group w-full max-w-md hover:shadow-xl transition-all duration-300",
  {
    variants: {
      performance: {
        top10: "border-warning/30 bg-gradient-to-br from-warning/5 to-transparent",
        top25: "border-neutral/30 bg-gradient-to-br from-neutral/10 to-transparent", 
        top50: "border-primary/30 bg-gradient-to-br from-primary/5 to-transparent",
        standard: "",
      },
    },
    defaultVariants: {
      performance: "standard",
    },
  }
)

interface SubmissionCardProps extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof submissionCardVariants> {
  id: string
  title: string
  thumbnail: string
  videoUrl?: string
  game: string
  tournament: string
  status: 'approved' | 'pending' | 'rejected'
  rank?: number
  totalSubmissions?: number
  views: number
  votes: number
  likes: number
  submittedAt: string
  author: {
    username: string
    avatar?: string
  }
  onShare?: () => void
  onAnalytics?: () => void
  onPlay?: () => void
}

function SubmissionCard({
  className,
  performance,
  id,
  title,
  thumbnail,
  videoUrl,
  game,
  tournament,
  status,
  rank,
  totalSubmissions,
  views,
  votes,
  likes,
  submittedAt,
  author,
  onShare,
  onAnalytics,
  onPlay,
  ...props
}: SubmissionCardProps) {
  const getPerformanceBadge = () => {
    if (!rank || !totalSubmissions) return null
    const percentile = (rank / totalSubmissions) * 100
    
    if (percentile <= 10) {
      return (
        <div className="flex items-center gap-1 text-warning">
          <Star className="size-4 fill-warning text-warning" />
          <span className="text-caption font-medium">Top 10%</span>
        </div>
      )
    }
    if (percentile <= 25) {
      return (
        <div className="flex items-center gap-1 text-neutral-300">
          <Star className="size-4 fill-neutral-300 text-neutral-300" />
          <span className="text-caption font-medium">Top 25%</span>
        </div>
      )
    }
    if (percentile <= 50) {
      return (
        <div className="flex items-center gap-1 text-warning/60">
          <Star className="size-4 fill-warning/60 text-warning/60" />
          <span className="text-caption font-medium">Top 50%</span>
        </div>
      )
    }
    return null
  }

  const getPerformanceVariant = (): 'top10' | 'top25' | 'top50' | 'standard' => {
    if (!rank || !totalSubmissions) return 'standard'
    const percentile = (rank / totalSubmissions) * 100
    if (percentile <= 10) return 'top10'
    if (percentile <= 25) return 'top25'
    if (percentile <= 50) return 'top50'
    return 'standard'
  }

  const votePercentage = totalSubmissions ? ((votes / totalSubmissions) * 100).toFixed(1) : '0.1'

  return (
    <div
      className={cn(submissionCardVariants({ performance: getPerformanceVariant(), className }))}
      {...props}
    >
      {/* Video Thumbnail */}
      <div className="relative h-48 overflow-hidden rounded-t-xl">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        {/* Play Button Overlay */}
        <button
          onClick={onPlay}
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <div className="bg-primary/90 hover:bg-primary text-white rounded-full p-4 transition-colors duration-200 hover:scale-110 transform">
            <Play className="size-8 fill-white ml-1" />
          </div>
        </button>

        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <Badge 
            variant={status === 'approved' ? 'success' : status === 'pending' ? 'warning' : 'destructive'}
          >
            {status.toUpperCase()}
          </Badge>
        </div>

        {/* Rank Badge */}
        {rank && totalSubmissions && (
          <div className="absolute top-4 right-4">
            <Badge variant="secondary">
              Rank: #{rank}/{totalSubmissions}
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <CardContent className="p-4 space-y-4">
        {/* Title and Performance */}
        <div>
          <h3 className="text-h4 font-semibold text-primary mb-1 line-clamp-2">
            {title}
          </h3>
          <div className="flex items-center justify-between">
            <div className="text-caption text-secondary">
              {game} → {tournament}
            </div>
            {getPerformanceBadge()}
          </div>
        </div>

        {/* Author Info */}
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={author.avatar} alt={author.username} />
            <AvatarFallback className="text-xs">
              {author.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-caption text-secondary">{author.username}</span>
        </div>

        {/* Engagement Metrics */}
        <div className="flex items-center justify-between text-body-small text-secondary">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Eye className="size-4" />
              <span>{views.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Trophy className="size-4" />
              <span>{votes} ({votePercentage}%)</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="size-4" />
              <span>{likes}</span>
            </div>
          </div>
        </div>

        {/* Submission Info */}
        <div className="text-caption text-muted text-mono">
          Submitted {submittedAt} • ID: {id.slice(0, 8)}
        </div>

        {/* Mini Chart - Placeholder for vote accumulation over time */}
        <div className="h-8 flex items-end gap-1">
          {[40, 65, 45, 80, 60, 90, 75].map((height, index) => (
            <div
              key={index}
              className="flex-1 bg-primary/20 rounded-t"
              style={{ height: `${height}%` }}
            />
          ))}
          <div className="absolute inset-0 flex items-center justify-center opacity-30">
            <TrendingUp className="size-4 text-primary" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2 border-t border-border">
          <Button variant="tertiary" size="sm" className="flex-1" onClick={onShare}>
            <Share2 className="size-4" />
            Share
          </Button>
          <Button variant="tertiary" size="sm" className="flex-1" onClick={onAnalytics}>
            <BarChart3 className="size-4" />
            Analytics
          </Button>
          <Button variant="tertiary" size="sm" className="p-2">
            <MoreVertical className="size-4" />
          </Button>
        </div>
      </CardContent>
    </div>
  )
}

export { SubmissionCard, submissionCardVariants }