"use client"

import { useEffect, useState, useRef } from "react"
import { Trophy, Star, Crown, Gamepad2, Target, Swords } from "lucide-react"
import { cn } from "@/lib/utils"

const floatingIcons = [
  { icon: Trophy, side: "left", position: "top", delay: "0s", tilt: -15, size: "large" },
  { icon: Crown, side: "left", position: "bottom", delay: "0.2s", tilt: 12, size: "medium" },
  { icon: Star, side: "right", position: "top", delay: "0.1s", tilt: 18, size: "medium" },
  { icon: Target, side: "right", position: "middle", delay: "0.3s", tilt: -10, size: "large" },
  { icon: Gamepad2, side: "left", position: "middle", delay: "0.4s", tilt: -8, size: "small" },
  { icon: Swords, side: "right", position: "bottom", delay: "0.2s", tilt: 15, size: "small" },
]

export function CTASection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.3 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const getIconSize = (size: string) => {
    switch (size) {
      case 'small':
        return 'w-10 h-10'
      case 'medium':
        return 'w-14 h-14'
      case 'large':
        return 'w-20 h-20'
      default:
        return 'w-14 h-14'
    }
  }

  const getIconInnerSize = (size: string) => {
    switch (size) {
      case 'small':
        return 'w-5 h-5'
      case 'medium':
        return 'w-7 h-7'
      case 'large':
        return 'w-10 h-10'
      default:
        return 'w-7 h-7'
    }
  }

  return (
    <section ref={sectionRef} className="py-20 sm:py-24 md:py-32 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#4A6CFF]/5 to-transparent" />
      <div className="absolute top-1/4 left-1/4 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-[#FFD166]/8 rounded-full blur-[100px] sm:blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-[#4A6CFF]/8 rounded-full blur-[80px] sm:blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="relative group">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#FFD166] via-[#FF7A1A] to-[#FFD166] rounded-2xl sm:rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity" />
            
            {/* Main card */}
            <div className="relative bg-gradient-to-br from-[#1a2332] to-[#0f1621] p-8 sm:p-10 md:p-16 rounded-2xl sm:rounded-3xl border border-[#FFD166]/30 text-center overflow-hidden">
              {/* Floating Icons */}
              <div className="absolute inset-0 pointer-events-none hidden md:block">
                {floatingIcons.map((floatingIcon, index) => {
                  const Icon = floatingIcon.icon
                  const isLeft = floatingIcon.side === 'left'
                  const positionY = 
                    floatingIcon.position === 'top' ? '15%' : 
                    floatingIcon.position === 'bottom' ? '85%' : 
                    '50%'
                  const positionX = isLeft ? '-8%' : '108%'
                  const iconSize = getIconSize(floatingIcon.size)
                  const iconInnerSize = getIconInnerSize(floatingIcon.size)
                  
                  return (
                    <div
                      key={index}
                      className={cn(
                        "absolute transition-all duration-1000 ease-out",
                        isVisible ? "opacity-100" : "opacity-0"
                      )}
                      style={{
                        left: positionX,
                        top: positionY,
                        transform: `translateY(-50%) rotate(${floatingIcon.tilt}deg)`,
                        animationDelay: floatingIcon.delay,
                        animation: isVisible ? `float-cta-${index} 4s ease-in-out infinite` : 'none',
                      }}
                    >
                      <div className={cn("relative", isVisible && "group/icon")}>
                        {/* Icon shadow */}
                        <div 
                          className={cn(
                            "absolute rounded-xl sm:rounded-2xl blur-lg sm:blur-xl transition-all duration-500",
                            iconSize,
                            "bg-gradient-to-br from-yellow-400/30 to-orange-600/30"
                          )}
                          style={{
                            transform: isLeft ? 'translateX(15px) translateY(8px)' : 'translateX(-15px) translateY(8px)',
                            opacity: isVisible ? 0.7 : 0,
                          }}
                        />
                        
                        {/* Main icon */}
                        <div
                          className={cn(
                            "relative transition-all duration-300",
                            iconSize,
                            "rounded-xl sm:rounded-2xl",
                            "flex items-center justify-center",
                            "bg-gradient-to-br from-yellow-400 to-orange-600 text-white shadow-lg shadow-yellow-500/25",
                            isVisible && "hover:scale-110 cursor-pointer animate-pulse"
                          )}
                        >
                          <Icon className={iconInnerSize} />
                          
                          {/* Glow effect */}
                          {isVisible && (
                            <div
                              className="absolute inset-0 rounded-xl sm:rounded-2xl opacity-0 group-hover/icon:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-yellow-400 to-orange-600"
                              style={{ filter: 'blur(8px)' }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 text-balance leading-tight px-4 sm:px-0">
                Ready to Compete with the Best?
              </h2>

              <p className="text-base sm:text-lg md:text-xl text-white/70 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
                Join thousands of gamers competing for real prizes. Early access members get exclusive perks and free
                tournament entries.
              </p>

              <a
                href="#early-access"
                className="inline-flex items-center gap-2 sm:gap-3 px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-[#FFD166] to-[#FF7A1A] text-[#0B1020] rounded-xl font-bold text-base sm:text-lg hover:shadow-[0_0_40px_rgba(255,209,102,0.6)] transition-all hover:scale-105"
              >
                Join Early Access Now
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Animation keyframes */}
      <style jsx>{`
        @keyframes float-cta-0 {
          0%, 100% { transform: translateY(-50%) rotate(-15deg) translateX(0px); }
          25% { transform: translateY(-50%) rotate(-12deg) translateX(-8px); }
          50% { transform: translateY(-55%) rotate(-18deg) translateX(5px); }
          75% { transform: translateY(-50%) rotate(-10deg) translateX(-5px); }
        }
        @keyframes float-cta-1 {
          0%, 100% { transform: translateY(-50%) rotate(12deg) translateX(0px); }
          25% { transform: translateY(-52%) rotate(15deg) translateX(6px); }
          50% { transform: translateY(-48%) rotate(8deg) translateX(-6px); }
          75% { transform: translateY(-50%) rotate(14deg) translateX(3px); }
        }
        @keyframes float-cta-2 {
          0%, 100% { transform: translateY(-50%) rotate(18deg) translateX(0px); }
          33% { transform: translateY(-53%) rotate(21deg) translateX(-4px); }
          66% { transform: translateY(-47%) rotate(15deg) translateX(4px); }
        }
        @keyframes float-cta-3 {
          0%, 100% { transform: translateY(-50%) rotate(-10deg) translateX(0px); }
          25% { transform: translateY(-52%) rotate(-7deg) translateX(7px); }
          50% { transform: translateY(-48%) rotate(-13deg) translateX(-7px); }
          75% { transform: translateY(-50%) rotate(-9deg) translateX(4px); }
        }
        @keyframes float-cta-4 {
          0%, 100% { transform: translateY(-50%) rotate(-8deg) translateX(0px); }
          33% { transform: translateY(-55%) rotate(-5deg) translateX(-5px); }
          66% { transform: translateY(-45%) rotate(-11deg) translateX(5px); }
        }
        @keyframes float-cta-5 {
          0%, 100% { transform: translateY(-50%) rotate(15deg) translateX(0px); }
          25% { transform: translateY(-52%) rotate(18deg) translateX(-6px); }
          50% { transform: translateY(-48%) rotate(12deg) translateX(6px); }
          75% { transform: translateY(-50%) rotate(16deg) translateX(-3px); }
        }
      `}</style>
    </section>
  )
}
