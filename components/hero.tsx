"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { Trophy, Zap, Star, Gamepad2, Target, Crown, Sword, Shield, Sparkles, Medal } from "lucide-react"

export function Hero() {
  const [activeIcons, setActiveIcons] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const heroRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const timer = setTimeout(() => setActiveIcons(true), 500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const floatingIcons = [
    { icon: Trophy, side: 'left', position: 'top', delay: '0s', tilt: -15, color: '#FFD166', size: 'large' },
    { icon: Sword, side: 'right', position: 'middle', delay: '0.2s', tilt: 12, color: '#4A6CFF', size: 'medium' },
    { icon: Shield, side: 'left', position: 'middle', delay: '0.4s', tilt: -8, color: '#FF7A1A', size: 'medium' },
    { icon: Star, side: 'right', position: 'top', delay: '0.6s', tilt: 18, color: '#4fc3f7', size: 'small' },
    { icon: Target, side: 'left', position: 'bottom', delay: '0.8s', tilt: 10, color: '#00C2FF', size: 'medium' },
    { icon: Medal, side: 'right', position: 'middle', delay: '1.0s', tilt: -12, color: '#FFD166', size: 'small' },
    { icon: Sparkles, side: 'left', position: 'top', delay: '1.2s', tilt: 15, color: '#4A6CFF', size: 'small' },
    { icon: Crown, side: 'right', position: 'bottom', delay: '1.4s', tilt: -18, color: '#FF7A1A', size: 'large' },
  ]

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-32 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image src="/hero-bg.png" alt="Gaming Background" fill className="object-cover opacity-30" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1020]/60 via-[#0B1020]/80 to-[#0B1020]" />
        
        {/* Interactive mouse-following glow effect */}
        <div 
          className="absolute w-96 h-96 rounded-full pointer-events-none z-0 transition-all duration-1000 ease-out"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(79, 195, 247, 0.1), transparent 70%)`,
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>

      {/* Enhanced ambient glow effects */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#4fc3f7]/5 rounded-full blur-[120px] pointer-events-none z-0 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#4A6CFF]/5 rounded-full blur-[120px] pointer-events-none z-0 animate-pulse" style={{ animationDelay: "1s" }} />
      <div className="absolute top-1/2 left-1/3 w-[400px] h-[400px] bg-[#FFD166]/4 rounded-full blur-[100px] pointer-events-none z-0 animate-pulse" style={{ animationDelay: "2s" }} />

      {/* Floating Icons */}
      <div className="absolute inset-0 pointer-events-none">
        {floatingIcons.map((floatingIcon, index) => {
          const FloatingIcon = floatingIcon.icon
          const isLeft = floatingIcon.side === 'left'
          const positionY = floatingIcon.position === 'top' ? '15%' : floatingIcon.position === 'bottom' ? '85%' : '50%'
          const positionX = isLeft ? '8%' : '92%'
          const iconSize = floatingIcon.size === 'large' ? 'w-16 h-16' : floatingIcon.size === 'medium' ? 'w-12 h-12' : 'w-10 h-10'
          
          return (
            <div
              key={index}
              className={`absolute transition-all duration-1000 ease-out ${activeIcons ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}
              style={{
                left: positionX,
                top: positionY,
                transform: `translateY(-50%) rotate(${floatingIcon.tilt}deg)`,
                animationDelay: floatingIcon.delay,
                animation: activeIcons ? `float-hero-icon-${index} 6s ease-in-out infinite` : 'none',
              }}
            >
              <div className="relative group">
                {/* Icon shadow with enhanced glow */}
                <div 
                  className={`absolute rounded-full blur-2xl transition-all duration-700 ${iconSize} opacity-80`}
                  style={{
                    background: `radial-gradient(circle, ${floatingIcon.color}30, transparent)`,
                    transform: isLeft ? 'translateX(15px) translateY(8px)' : 'translateX(-15px) translateY(8px)',
                  }}
                />
                
                {/* Main icon with enhanced styling */}
                <div
                  className={`relative ${iconSize} rounded-2xl flex items-center justify-center transition-all duration-500 border-2 backdrop-blur-sm`}
                  style={{
                    background: `linear-gradient(135deg, ${floatingIcon.color}20, ${floatingIcon.color}10)`,
                    borderColor: `${floatingIcon.color}60`,
                    color: floatingIcon.color,
                    boxShadow: `0 0 30px ${floatingIcon.color}20`,
                  }}
                >
                  <FloatingIcon className={floatingIcon.size === 'large' ? "w-8 h-8" : floatingIcon.size === 'medium' ? "w-6 h-6" : "w-5 h-5"} />
                  
                  {/* Enhanced glow effect on hover */}
                  <div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md"
                    style={{
                      background: `linear-gradient(135deg, ${floatingIcon.color}, ${floatingIcon.color}80)`,
                    }}
                  />
                  
                  {/* Particle effects */}
                  {activeIcons && (
                    <div className="absolute inset-0">
                      <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: `${index * 0.2}s` }} />
                      <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: `${index * 0.2 + 0.1}s` }} />
                    </div>
                  )}
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
          0%, 100% { transform: translateY(-50%) rotate(-15deg) translateX(0px) scale(1); }
          25% { transform: translateY(-52%) rotate(-12deg) translateX(-8px) scale(1.1); }
          50% { transform: translateY(-48%) rotate(-18deg) translateX(5px) scale(0.95); }
          75% { transform: translateY(-50%) rotate(-10deg) translateX(-3px) scale(1.05); }
        }
        @keyframes float-hero-icon-1 {
          0%, 100% { transform: translateY(-50%) rotate(12deg) translateX(0px) scale(1); }
          25% { transform: translateY(-48%) rotate(15deg) translateX(6px) scale(1.1); }
          50% { transform: translateY(-52%) rotate(8deg) translateX(-6px) scale(0.95); }
          75% { transform: translateY(-50%) rotate(14deg) translateX(3px) scale(1.05); }
        }
        @keyframes float-hero-icon-2 {
          0%, 100% { transform: translateY(-50%) rotate(-8deg) translateX(0px) scale(1); }
          33% { transform: translateY(-53%) rotate(-5deg) translateX(-5px) scale(1.1); }
          66% { transform: translateY(-47%) rotate(-11deg) translateX(5px) scale(0.95); }
        }
        @keyframes float-hero-icon-3 {
          0%, 100% { transform: translateY(-50%) rotate(18deg) translateX(0px) scale(1); }
          25% { transform: translateY(-52%) rotate(15deg) translateX(-7px) scale(1.1); }
          50% { transform: translateY(-48%) rotate(21deg) translateX(7px) scale(0.95); }
          75% { transform: translateY(-50%) rotate(16deg) translateX(-4px) scale(1.05); }
        }
        @keyframes float-hero-icon-4 {
          0%, 100% { transform: translateY(-50%) rotate(10deg) translateX(0px) scale(1); }
          33% { transform: translateY(-52%) rotate(7deg) translateX(-4px) scale(1.1); }
          66% { transform: translateY(-48%) rotate(13deg) translateX(4px) scale(0.95); }
        }
        @keyframes float-hero-icon-5 {
          0%, 100% { transform: translateY(-50%) rotate(-12deg) translateX(0px) scale(1); }
          25% { transform: translateY(-53%) rotate(-9deg) translateX(6px) scale(1.1); }
          50% { transform: translateY(-47%) rotate(-15deg) translateX(-6px) scale(0.95); }
          75% { transform: translateY(-50%) rotate(-10deg) translateX(-4px) scale(1.05); }
        }
        @keyframes float-hero-icon-6 {
          0%, 100% { transform: translateY(-50%) rotate(15deg) translateX(0px) scale(1); }
          25% { transform: translateY(-52%) rotate(-18deg) translateX(-8px) scale(1.1); }
          50% { transform: translateY(-48%) rotate(-12deg) translateX(8px) scale(0.95); }
          75% { transform: translateY(-50%) rotate(-18deg) translateX(-4px) scale(1.05); }
        }
      `}</style>
    </section>
  )
}
