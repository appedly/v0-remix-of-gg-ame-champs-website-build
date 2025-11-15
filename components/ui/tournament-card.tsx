import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { LucideIcon, Trophy, Users, Clock, Calendar, ChevronRight } from 'lucide-react'
import { Badge } from './badge'
import { Button } from './button'
import { Card, CardContent } from './card'

const tournamentCardVariants = cva(
  "card card-interactive group cursor-pointer h-80 flex flex-col",
  {
    variants: {
      status: {
        upcoming: "border-l-neutral",
        active: "border-l-success", 
        ending_soon: "border-l-error status-pulse",
        completed: "border-l-muted",
      },
    },
    defaultVariants: {
      status: "upcoming",
    },
  }
)

interface TournamentCardProps extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof tournamentCardVariants> {
  title: string
  game: string
  image: string
  prizePool: string
  participantCount: number
  maxParticipants: number
  submissionCount: number
  startDate: string
  endDate: string
  onJoin?: () => void
  onViewDetails?: () => void
}

function TournamentCard({
  className,
  status,
  title,
  game,
  image,
  prizePool,
  participantCount,
  maxParticipants,
  submissionCount,
  startDate,
  endDate,
  onJoin,
  onViewDetails,
  ...props
}: TournamentCardProps) {
  const getStatusBadge = () => {
    switch (status) {
      case 'ending_soon':
        return <Badge variant="destructive" className="absolute top-4 right-4 z-10">ENDING SOON</Badge>
      case 'active':
        return <Badge variant="success" className="absolute top-4 right-4 z-10">ACTIVE</Badge>
      case 'upcoming':
        return <Badge variant="secondary" className="absolute top-4 right-4 z-10">UPCOMING</Badge>
      case 'completed':
        return <Badge variant="outline" className="absolute top-4 right-4 z-10">COMPLETED</Badge>
      default:
        return null
    }
  }

  const getDaysRemaining = () => {
    const end = new Date(endDate)
    const now = new Date()
    const diffTime = end.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  const isJoinable = status === 'upcoming' || status === 'active'
  const daysRemaining = getDaysRemaining()

  return (
    <div
      className={cn(tournamentCardVariants({ status, className }))}
      {...props}
      onClick={onViewDetails}
    >
      {/* Status Badge */}
      {getStatusBadge()}

      {/* Image Section */}
      <div className="relative h-48 overflow-hidden rounded-t-xl">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        {/* Prize Pool Badge */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2">
          <div className="icon-bg-warning p-2 rounded-full">
            <Trophy className="size-4" />
          </div>
          <div>
            <p className="text-caption text-muted uppercase tracking-wide">Prize Pool</p>
            <p className="text-body-standard font-bold text-warning">{prizePool}</p>
          </div>
        </div>

        {/* Tournament Name Overlay */}
        <div className="absolute bottom-4 left-4 right-20">
          <h3 className="text-h4 font-bold text-white mb-1">{title}</h3>
          <p className="text-caption text-secondary">{game}</p>
        </div>
      </div>

      {/* Content Section */}
      <CardContent className="flex-1 flex flex-col justify-between p-4">
        {/* Tournament Info */}
        <div className="space-y-3">
          {/* Breadcrumb */}
          <div className="text-caption text-secondary">
            {game} → {title}
          </div>

          {/* Stats Row */}
          <div className="flex items-center justify-between text-body-small">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Users className="size-4 text-muted" />
                <span>{participantCount}/{maxParticipants}</span>
              </div>
              <div className="flex items-center gap-1">
                <Trophy className="size-4 text-muted" />
                <span>{submissionCount}</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="size-4 text-muted" />
              <span>{daysRemaining}d left</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          {isJoinable && (
            <Button 
              variant="primary" 
              size="sm" 
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation()
                onJoin?.()
              }}
            >
              Join Now
            </Button>
          )}
          <Button 
            variant="secondary" 
            size="sm" 
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation()
              onViewDetails?.()
            }}
          >
            View Details
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </CardContent>
    </div>
  )
}

export { TournamentCard, tournamentCardVariants }