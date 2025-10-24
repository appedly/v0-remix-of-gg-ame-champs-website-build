"use client"

import type React from "react"

interface AnimatedIconProps {
  children: React.ReactNode
  className?: string
}

export function AnimatedIcon({ children, className = "" }: AnimatedIconProps) {
  return (
    <div
      className={`
        relative w-14 h-14 flex items-center justify-center
        ${className}
      `}
    >
      {/* Animated border container */}
      <div className="absolute inset-0 rounded-xl overflow-hidden">
        {/* Gradient border animation */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#4A6CFF] via-[#00C2FF] to-[#4A6CFF] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Inner background */}
        <div className="absolute inset-0.5 bg-gradient-to-br from-[#4A6CFF]/10 to-[#00C2FF]/10 rounded-[10px]" />
      </div>

      {/* Icon content */}
      <div className="relative z-10 flex items-center justify-center w-full h-full">{children}</div>

      {/* Animated glow effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#4A6CFF]/20 to-[#00C2FF]/20 opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-300 -z-10" />
    </div>
  )
}
