"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { Trophy, Zap, Star, Gamepad2, Target, Crown } from "lucide-react"

export function Hero() {
  const [activeIcons, setActiveIcons] = useState(false)
  
  useEffect(() => {
    const timer = setTimeout(() => setActiveIcons(true), 500)
    return () => clearTimeout(timer)
  }, [])

  const floatingIcons = [
    { icon: Trophy, side: 'left', position: 'top', delay: '0s', tilt: -15, color: '#FFD166' },
    { icon: Zap, side: 'right', position: 'middle', delay: '0.3s', tilt: 12, color: '#4A6CFF' },
    { icon: Star, side: 'left', position: 'bottom', delay: '0.6s', tilt: -8, color: '#FF7A1A' },
    { icon: Gamepad2, side: 'right', position: 'top', delay: '0.9s', tilt: 18, color: '#4fc3f7' },
    { icon: Target, side: 'left', position: 'middle', delay: '1.2s', tilt: 10, color: '#00C2FF' },
    { icon: Crown, side: 'right', position: 'bottom', delay: '1.5s', tilt: -12, color: '#FFD166' },
  ]

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-32 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image src="/hero-bg.png" alt="Gaming Background" fill className="object-cover opacity-30" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1020]/60 via-[#0B1020]/80 to-[#0B1020]" />
      </div>

      {/* Subtle ambient glow effects */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#4fc3f7]/5 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#4A6CFF]/5 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Floating Icons */}
      <div className="absolute inset-0 pointer-events-none">
        {floatingIcons.map((floatingIcon, index) => {
          const FloatingIcon = floatingIcon.icon
          const isLeft = floatingIcon.side === 'left'
          const positionY = floatingIcon.position === 'top' ? '20%' : floatingIcon.position === 'bottom' ? '80%' : '50%'
          const positionX = isLeft ? '10%' : '90%'
          
          return (
            <div
              key={index}
              className={`absolute transition-all duration-1000 ease-out ${activeIcons ? 'opacity-100' : 'opacity-0'}`}
              style={{
                left: positionX,
                top: positionY,
                transform: `translateY(-50%) rotate(${floatingIcon.tilt}deg)`,
                animationDelay: floatingIcon.delay,
                animation: activeIcons ? `float-hero-icon-${index} 4s ease-in-out infinite` : 'none',
              }}
            >
              <div className="relative group">
                {/* Icon shadow */}
                <div 
                  className="absolute rounded-full blur-xl transition-all duration-500 w-12 h-12"
                  style={{
                    backgroundColor: `${floatingIcon.color}20`,
                    transform: isLeft ? 'translateX(20px) translateY(10px)' : 'translateX(-20px) translateY(10px)',
                    opacity: activeIcons ? 0.6 : 0,
                  }}
                />
                
                {/* Main icon */}
                <div
                  className="relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 border-2"
                  style={{
                    backgroundColor: `${floatingIcon.color}15`,
                    borderColor: `${floatingIcon.color}40`,
                    color: floatingIcon.color,
                  }}
                >
                  <FloatingIcon className="w-6 h-6" />
                  
                  {/* Glow effect on hover */}
                  <div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      backgroundColor: floatingIcon.color,
                      filter: 'blur(8px)',
                    }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FFD166]/10 border border-[#FFD166]/30 rounded-full mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFD166] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FFD166]"></span>
            </span>
            <span className="text-[#FFD166] text-sm font-semibold">PRE-LAUNCH • JOIN THE WAITLIST</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-semibold text-white mb-6 text-balance leading-[1.1] tracking-tight" style={{ fontFamily: 'var(--font-eb-garamond), Georgia, serif' }}>
            Turn Your Gaming Clips into{" "}
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4fc3f7] via-[#00C2FF] to-[#29b6f6]">
                Glory
              </span>
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-white/50 mb-12 text-pretty max-w-3xl mx-auto leading-relaxed font-light" style={{ fontFamily: 'var(--font-eb-garamond), Georgia, serif' }}>
            Join tournaments, showcase clips, and rise through the ranks before anyone else.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <a
              href="/signup"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#0a0f1e] rounded-full font-semibold text-lg hover:bg-white/90 transition-all hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Join the Waitlist
              <span className="inline-block group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float-hero-icon-0 {
          0%, 100% { transform: translateY(-50%) rotate(-15deg) translateX(0px); }
          25% { transform: translateY(-52%) rotate(-12deg) translateX(-5px); }
          50% { transform: translateY(-48%) rotate(-18deg) translateX(3px); }
          75% { transform: translateY(-50%) rotate(-10deg) translateX(-3px); }
        }
        @keyframes float-hero-icon-1 {
          0%, 100% { transform: translateY(-50%) rotate(12deg) translateX(0px); }
          25% { transform: translateY(-48%) rotate(15deg) translateX(4px); }
          50% { transform: translateY(-52%) rotate(8deg) translateX(-4px); }
          75% { transform: translateY(-50%) rotate(14deg) translateX(2px); }
        }
        @keyframes float-hero-icon-2 {
          0%, 100% { transform: translateY(-50%) rotate(-8deg) translateX(0px); }
          33% { transform: translateY(-53%) rotate(-5deg) translateX(-3px); }
          66% { transform: translateY(-47%) rotate(-11deg) translateX(3px); }
        }
        @keyframes float-hero-icon-3 {
          0%, 100% { transform: translateY(-50%) rotate(18deg) translateX(0px); }
          25% { transform: translateY(-52%) rotate(15deg) translateX(-4px); }
          50% { transform: translateY(-48%) rotate(21deg) translateX(4px); }
          75% { transform: translateY(-50%) rotate(16deg) translateX(-2px); }
        }
        @keyframes float-hero-icon-4 {
          0%, 100% { transform: translateY(-50%) rotate(10deg) translateX(0px); }
          33% { transform: translateY(-52%) rotate(7deg) translateX(-3px); }
          66% { transform: translateY(-48%) rotate(13deg) translateX(3px); }
        }
        @keyframes float-hero-icon-5 {
          0%, 100% { transform: translateY(-50%) rotate(-12deg) translateX(0px); }
          25% { transform: translateY(-53%) rotate(-9deg) translateX(4px); }
          50% { transform: translateY(-47%) rotate(-15deg) translateX(-4px); }
          75% { transform: translateY(-50%) rotate(-10deg) translateX(-2px); }
        }
      `}</style>
    </section>
  )
}
