"use client"

import { useEffect, useMemo, useState } from "react"

import { cn } from "@/lib/utils"

type CountdownTimerProps = {
  /** ISO string or Date for the target launch moment */
  target?: string | Date
  className?: string
}

type CountdownState = {
  total: number
  days: string
  hours: string
  minutes: string
  seconds: string
}

const DEFAULT_TARGET = "2025-02-01T00:00:00Z"

const pad = (value: number, minimumDigits = 2) => value.toString().padStart(minimumDigits, "0")

function getTimeRemaining(targetDate: Date): CountdownState {
  const total = targetDate.getTime() - Date.now()

  if (!Number.isFinite(total) || total <= 0) {
    return {
      total: 0,
      days: "00",
      hours: "00",
      minutes: "00",
      seconds: "00",
    }
  }

  const totalSeconds = Math.floor(total / 1000)
  const days = Math.floor(totalSeconds / (3600 * 24))
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return {
    total,
    days: days > 99 ? days.toString() : pad(days),
    hours: pad(hours),
    minutes: pad(minutes),
    seconds: pad(seconds),
  }
}

export function CountdownTimer({ target = DEFAULT_TARGET, className }: CountdownTimerProps) {
  const targetDate = useMemo(() => {
    if (target instanceof Date) return target
    const parsed = new Date(target)
    return Number.isNaN(parsed.getTime()) ? new Date(DEFAULT_TARGET) : parsed
  }, [target])

  const [timeLeft, setTimeLeft] = useState<CountdownState>(() => getTimeRemaining(targetDate))

  useEffect(() => {
    setTimeLeft(getTimeRemaining(targetDate))

    const interval = window.setInterval(() => {
      setTimeLeft(getTimeRemaining(targetDate))
    }, 1000)

    return () => window.clearInterval(interval)
  }, [targetDate])

  if (timeLeft.total <= 0) {
    return (
      <div
        className={cn(
          "rounded-3xl border border-white/10 bg-white/5 px-6 py-4 text-center text-sm font-medium uppercase tracking-[0.35em] text-white/70 backdrop-blur",
          className,
        )}
        aria-live="polite"
      >
        Launching Soon
      </div>
    )
  }

  const segments = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ]

  return (
    <div className={cn("grid grid-cols-2 gap-3 text-left sm:grid-cols-4 sm:gap-4", className)} aria-live="polite">
      {segments.map((segment) => (
        <div
          key={segment.label}
          className="rounded-3xl border border-white/10 bg-white/5 px-4 py-5 text-center shadow-[0_12px_35px_-20px_rgba(79,195,247,0.55)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_22px_45px_-18px_rgba(41,182,246,0.65)]"
        >
          <span className="block text-3xl font-semibold tracking-tight text-[#f5f5f5] sm:text-4xl">
            {segment.value}
          </span>
          <span className="mt-2 block text-[0.65rem] font-medium uppercase tracking-[0.4em] text-white/55">
            {segment.label}
          </span>
        </div>
      ))}
    </div>
  )
}
