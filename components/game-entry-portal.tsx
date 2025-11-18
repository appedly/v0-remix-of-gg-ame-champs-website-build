"use client"

import { useEffect, useState } from "react"

interface GameEntryPortalProps {
  isOpen: boolean
  onComplete: () => void
}

export function GameEntryPortal({ isOpen, onComplete }: GameEntryPortalProps) {
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setAnimate(true)
      const timer = setTimeout(() => {
        onComplete()
      }, 1800)
      return () => clearTimeout(timer)
    }
  }, [isOpen, onComplete])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[#0a0f1e]" />
      
      {/* Pixelated grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,#1a2845_25%,#0a0f1e_25%,#0a0f1e_50%,#1a2845_50%,#1a2845_75%,#0a0f1e_75%,#0a0f1e)] bg-[length:40px_40px] opacity-50" />
      
      {/* Portal rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-96 h-96">
          {/* Outer ring */}
          <div
            className="absolute inset-0 border-4 border-cyan-400 rounded-full"
            style={{
              animation: animate ? 'spin 2s linear forwards, portal-open 1.5s ease-out forwards' : 'none',
              opacity: animate ? 0.8 : 0,
            }}
          />
          
          {/* Middle ring */}
          <div
            className="absolute inset-8 border-2 border-amber-400 rounded-full"
            style={{
              animation: animate ? 'spin-reverse 1.5s linear forwards, portal-open 1.5s ease-out forwards' : 'none',
              opacity: animate ? 0.6 : 0,
            }}
          />
          
          {/* Inner glow */}
          <div
            className="absolute inset-20 border-2 border-cyan-300/50 rounded-full blur-sm"
            style={{
              animation: animate ? 'spin 1s linear forwards, portal-open 1.5s ease-out forwards' : 'none',
              opacity: animate ? 0.4 : 0,
            }}
          />
          
          {/* Center light */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              animation: animate ? 'scale 1.5s ease-out forwards' : 'none',
            }}
          >
            <div className="w-32 h-32 bg-gradient-to-r from-cyan-400 to-amber-400 rounded-full blur-2xl opacity-40" />
          </div>
        </div>
      </div>

      {/* Pixel rain effect */}
      {animate && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-cyan-400 rounded-full animate-pixel-rain"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.1}s`,
                opacity: Math.random() * 0.6 + 0.2,
              }}
            />
          ))}
        </div>
      )}

      {/* Text */}
      <div className="relative z-10 text-center">
        <div
          className="font-minecraft text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-amber-400 mb-4"
          style={{
            animation: animate ? 'minecraft-pop 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' : 'none',
          }}
        >
          ◆ ENTERING ◆
        </div>
        <div
          className="font-minecraft text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400"
          style={{
            animation: animate ? 'minecraft-pop 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' : 'none',
            animationDelay: '0.2s',
          }}
        >
          THE ARENA
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes scale {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }
      `}</style>
    </div>
  )
}
