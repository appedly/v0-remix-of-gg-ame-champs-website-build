import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react'

const statCardVariants = cva(
  "card relative overflow-hidden",
  {
    variants: {
      size: {
        primary: "col-span-3",
        secondary: "col-span-2",
        compact: "col-span-1",
      },
      trend: {
        up: "border-l-4 border-success",
        down: "border-l-4 border-error", 
        neutral: "border-l-4 border-muted",
      },
    },
    defaultVariants: {
      size: "secondary",
      trend: "neutral",
    },
  }
)

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof statCardVariants> {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: number
    label?: string
  }
  sparkline?: number[]
}

function StatCard({ 
  className, 
  size, 
  trend, 
  title, 
  value, 
  icon: Icon, 
  trend: trendData,
  sparkline,
  ...props 
}: StatCardProps) {
  const getTrendIcon = () => {
    if (!trendData) return null
    if (trendData.value > 0) return <TrendingUp className="size-4" />
    if (trendData.value < 0) return <TrendingDown className="size-4" />
    return <Minus className="size-4" />
  }

  const getTrendColor = () => {
    if (!trendData) return 'text-muted'
    if (trendData.value > 0) return 'text-success'
    if (trendData.value < 0) return 'text-error'
    return 'text-muted'
  }

  const getTrendVariant = (): 'up' | 'down' | 'neutral' => {
    if (!trendData) return 'neutral'
    if (trendData.value > 0) return 'up'
    if (trendData.value < 0) return 'down'
    return 'neutral'
  }

  const renderSparkline = () => {
    if (!sparkline || sparkline.length < 2) return null
    
    const max = Math.max(...sparkline)
    const min = Math.min(...sparkline)
    const range = max - min || 1
    
    const points = sparkline.map((value, index) => {
      const x = (index / (sparkline.length - 1)) * 100
      const y = 100 - ((value - min) / range) * 100
      return `${x},${y}`
    }).join(' ')

    return (
      <svg 
        className="absolute top-2 right-2 w-16 h-4" 
        viewBox="0 0 100 25"
        preserveAspectRatio="none"
      >
        <polyline
          points={points}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={getTrendColor()}
          opacity="0.6"
        />
        <linearGradient id={`gradient-${title}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
        <polygon
          points={`${points} 100,25 0,25`}
          fill={`url(#gradient-${title})`}
          className={getTrendColor()}
        />
      </svg>
    )
  }

  return (
    <div
      className={cn(statCardVariants({ size, trend: getTrendVariant(), className }))}
      {...props}
    >
      {/* Background gradient overlay */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          background: `linear-gradient(90deg, ${getTrendVariant() === 'up' ? 'var(--color-success)' : getTrendVariant() === 'down' ? 'var(--color-error)' : 'var(--color-muted)'} 0%, transparent 100%)`
        }}
      />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-lg",
              getTrendVariant() === 'up' && "icon-bg-success",
              getTrendVariant() === 'down' && "icon-bg-error", 
              getTrendVariant() === 'neutral' && "icon-bg-primary"
            )}>
              <Icon className="size-5" />
            </div>
            <div>
              <p className="text-caption text-muted uppercase tracking-wide">
                {title}
              </p>
            </div>
          </div>
          
          {renderSparkline()}
        </div>

        {/* Main value */}
        <div className="mb-2">
          <p className="text-h2 font-bold text-primary animate-countUp">
            {value}
          </p>
        </div>

        {/* Trend indicator */}
        {trendData && (
          <div className="flex items-center gap-2">
            <span className={cn("flex items-center gap-1 text-caption", getTrendColor())}>
              {getTrendIcon()}
              <span>
                {trendData.value > 0 ? '+' : ''}{trendData.value}% 
                {trendData.label && ` ${trendData.label}`}
              </span>
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export { StatCard, statCardVariants }