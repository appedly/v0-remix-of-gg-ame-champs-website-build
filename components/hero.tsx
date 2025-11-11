"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"

export function Hero() {
  const [isVisible, setIsVisible] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const heroRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const gameLogos = [
    { name: "Fortnite", position: { left: '10%', top: '20%' }, delay: '0s' },
    { name: "Valorant", position: { left: '15%', top: '35%' }, delay: '0.2s' },
    { name: "CS2", position: { left: '8%', top: '50%' }, delay: '0.4s' },
    { name: "Apex Legends", position: { right: '15%', top: '25%' }, delay: '0.6s' },
    { name: "League of Legends", position: { right: '10%', top: '40%' }, delay: '0.8s' },
    { name: "Call of Duty", position: { right: '8%', top: '60%' }, delay: '1.0s' },
    { name: "Overwatch 2", position: { left: '12%', top: '75%' }, delay: '1.2s' },
    { name: "Rocket League", position: { right: '12%', top: '80%' }, delay: '1.4s' },
  ]

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-32 overflow-hidden">
      {/* Enhanced animated background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B1020] via-[#1a1f2e] to-[#0f172a]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(79,195,247,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(74,108,255,0.08),transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(255,109,76,0.08),transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,194,255,0.05),transparent_60%)] animate-pulse" />

        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

        <Image src="/hero-bg.png" alt="Gaming Background" fill className="object-cover opacity-20 mix-blend-overlay" priority />
      </div>

      {/* Game Logos */}
      <div className="absolute inset-0 pointer-events-none">
        {gameLogos.map((game, index) => (
          <div
            key={index}
            className={`absolute transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}
            style={{
              left: game.position.left,
              top: game.position.top,
              transform: 'translate(-50%, -50%)',
              animationDelay: game.delay,
              animation: isVisible ? `float-game-logo-${index} 8s ease-in-out infinite` : 'none',
            }}
          >
            <div className="relative group">
              {/* Logo container with enhanced styling */}
              <div
                className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#1a2332]/80 to-[#0f1621] border-2 border-white/10 flex items-center justify-center transition-all duration-500 hover:scale-110 hover:border-white/30"
              >
                <div className="text-3xl font-bold text-white/90 group-hover:text-white">
                  {game.name.charAt(0)}
                </div>
                <div className="text-xs font-medium text-white/70 uppercase tracking-wider">
                  {game.name.slice(1)}
                </div>
              </div>

              {/* Enhanced glow effect */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(79,195,247,0.3), rgba(74,108,255,0.2))',
                }}
              />

              {/* Particle effects */}
              {isVisible && (
                <div className="absolute inset-0">
                  <div className="absolute -top-2 -left-2 w-1 h-1 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: `${index * 0.3}s` }} />
                  <div className="absolute -top-1 -right-2 w-1 h-1 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: `${index * 0.3 + 0.1}s` }} />
                  <div className="absolute top-2 left-2 w-1 h-1 bg-cyan-400 rounded-full animate-ping" style={{ animationDelay: `${index * 0.3 + 0.2}s` }} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FFD166]/20 to-[#FF7A1A]/20 border border-[#FFD166]/40 rounded-full mb-8 backdrop-blur-sm">
            <div className="w-2 h-2 bg-[#FFD166] rounded-full animate-pulse mr-2" />
            <span className="text-[#FFD166] text-sm font-bold tracking-wider uppercase">PRE-LAUNCH</span>
            <span className="text-white/80 text-sm">JOIN THE WAITLIST</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 text-balance leading-[1.1] tracking-tight" style={{ fontFamily: 'var(--font-eb-garamond), Georgia, serif' }}>
            Turn Your Gaming Clips into{" "}
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4fc3f7] via-[#00C2FF] to-[#29b6f6]">
                Glory
              </span>
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-white/70 mb-12 text-pretty max-w-3xl mx-auto leading-relaxed font-light" style={{ fontFamily: 'var(--font-eb-garamond), Georgia, serif' }}>
            Join tournaments, showcase clips, and rise through the ranks before anyone else.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <a
              href="/signup"
              className="group relative inline-flex items-center justify-center gap-3 px-10 py-4 bg-gradient-to-r from-[#4fc3f7] to-[#00C2FF] text-white rounded-full font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(79,195,247,0.4)] hover:shadow-[0_0_60px_rgba(79,195,247,0.6)]"
            >
              Join the Waitlist
              <span className="inline-block group-hover:translate-x-1 transition-transform duration-300">→</span>
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float-game-logo-0 {
          0%, 100% { transform: translate(-50%, -50%) rotate(-5deg) scale(1); }
          25% { transform: translate(-50%, -50%) rotate(-3deg) scale(1.05); }
          50% { transform: translate(-50%, -50%) rotate(-8deg) scale(0.95); }
          75% { transform: translate(-50%, -50%) rotate(-2deg) scale(1.05); }
        }
        @keyframes float-game-logo-1 {
          0%, 100% { transform: translate(-50%, -50%) rotate(3deg) scale(1); }
          25% { transform: translate(-50%, -50%) rotate(5deg) scale(1.05); }
          50% { transform: translate(-50%, -50%) rotate(2deg) scale(0.95); }
          75% { transform: translate(-50%, -50%) rotate(1deg) scale(1.05); }
        }
        @keyframes float-game-logo-2 {
          0%, 100% { transform: translate(-50%, -50%) rotate(-2deg) scale(1); }
          25% { transform: translate(-50%, -50%) rotate(2deg) scale(1.05); }
          50% { transform: translate(-50%, -50%) rotate(1deg) scale(0.95); }
          75% { transform: translate(-50%, -50%) rotate(0deg) scale(1.05); }
        }
        @keyframes float-game-logo-3 {
          0%, 100% { transform: translate(-50%, -50%) rotate(2deg) scale(1); }
          25% { transform: translate(-50%, -50%) rotate(1deg) scale(1.05); }
          50% { transform: translate(-50%, -50%) rotate(0deg) scale(0.95); }
          75% { transform: translate(-50%, -50%) rotate(-1deg) scale(1.05); }
        }
        @keyframes float-game-logo-4 {
          0%, 100% { transform: translate(-50%, -50%) rotate(1deg) scale(1); }
          25% { transform: translate(-50%, -50%) rotate(0deg) scale(1.05); }
          50% { transform: translate(-50%, -50%) rotate(-1deg) scale(0.95); }
          75% { transform: translate(-50%, -50%) rotate(2deg) scale(1.05); }
        }
        @keyframes float-game-logo-5 {
          0%, 100% { transform: translate(-50%, -50%) rotate(0deg) scale(1); }
          25% { transform: translate(-50%, -50%) rotate(0deg) scale(1.05); }
          50% { transform: translate(-50%, -50%) rotate(-1deg) scale(0.95); }
          75% { transform: translate(-50%, -50%) rotate(2deg) scale(1.05); }
        }
        @keyframes float-game-logo-6 {
          0%, 100% { transform: translate(-50%, -50%) rotate(-2deg) scale(1); }
          25% { transform: translate(-50%, -50%) rotate(1deg) scale(1.05); }
          50% { transform: translate(-50%, -50%) rotate(0deg) scale(0.95); }
          75% { transform: translate(-50%, -50%) rotate(2deg) scale(1.05); }
        }
      `}</style>
    </section>
  )
}
