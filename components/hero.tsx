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
    { name: "Fortnite", position: { left: '8%', top: '15%' }, delay: '0s', image: "https://cdn1.epicgames.com/offer/cbd5b3d310a54b12bf3fe8c41994174f/EGS_VALORANT_RiotGames_S1_2560x1440-892482f9cbec5827c7c4989d7feb2bf1.png" },
    { name: "Valorant", position: { left: '15%', top: '35%' }, delay: '0.2s', image: "https://cdn1.epicgames.com/offer/cbd5b3d310a54b12bf3fe8c41994174f/EGS_VALORANT_RiotGames_S1_2560x1440-892482f9cbec5827c7c4989d7feb2bf1.png" },
    { name: "CS2", position: { right: '12%', top: '15%' }, delay: '0.4s', image: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2669320/86a267ec44fc57124127eba46f25120813374317/capsule_616x353.jpg?t=1752681627" },
    { name: "Apex Legends", position: { right: '8%', top: '35%' }, delay: '0.6s', image: "https://cdn1.epicgames.com/offer/cbd5b3d310a54b12bf3fe8c41994174f/EGS_ApexLegends_R1_2560x1440-892482f9cbec5827c7c4989d7feb2bf1.png" },
    { name: "League of Legends", position: { left: '8%', top: '50%' }, delay: '0.8s', image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTI29PK-OT68a3Jx-n5U0Fi4rvZNv3mYxZKXDOnE2BbiJEqH0ofqVtBto_ofYVkXrZptHZT&s=10&usqp=CAU&COUNTER_STRIKE_2:https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwyhWdjp7THruWS8PYpCoLS1HGvhvdoVCe3pJyaKTBR2oQpbV0Slst0swq19bDBFoVQyk&usqp=CAU" },
    { name: "Call of Duty", position: { left: '15%', top: '65%' }, delay: '1.0s', image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/730/capsule_616x353.jpg?t=1749053861" },
    { name: "Overwatch 2", position: { right: '15%', top: '80%' }, delay: '1.2s', image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTI29PK-OT68a3Jx-n5U0Fi4rvZNv3mYxZKXDOnE2BbiJEqH0ofqVtBto_ofYVkXrZptHZT&s=10&usqp=CAU" },
    { name: "Rocket League", position: { right: '8%', top: '85%' }, delay: '1.4s', image: "https://image.api.playstation.com/vulcan/ap/rnd/202407/0401/670c294ded3baf4fa11068db2ec6758c63f7daeb266a35a1.png" },
  ]

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-32 overflow-hidden">
      {/* Professional animated background */}
      <div className="absolute inset-0 z-0">
        {/* Main gradient layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B1020] via-[#1a1f2e] to-[#0f172a]" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0f1e] via-[#4A6CFF]/20 to-[#0B1020]/80" />
        <div className="absolute inset-0 bg-gradient-to-bl from-[#00C2FF]/10 via-[#4A6CFF]/10 to-[#0B1020]/80" />

        {/* Dynamic radial gradients */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[radial-gradient(circle_at_0%_50%,rgba(79,195,247,0.15),transparent_70%)] animate-pulse" />
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[radial-gradient(circle_at_100%_50%,rgba(74,108,255,0.12),transparent_70%)] animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[radial-gradient(circle_at_0%_100%,rgba(0,194,255,0.08),transparent_70%)] animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[radial-gradient(circle_at_100%_100%,rgba(74,108,255,0.05),transparent_70%)] animate-pulse" style={{ animationDelay: '3s' }} />
        </div>

        {/* Animated mesh overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(45deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100px_100px]" />

        <Image src="/hero-bg.png" alt="Gaming Background" fill className="object-cover opacity-30 mix-blend-overlay" priority />
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
                className="w-32 h-32 rounded-3xl bg-gradient-to-br from-[#1a2332]/80 to-[#0f1621] border-2 border-white/20 flex items-center justify-center transition-all duration-500 hover:scale-110 hover:border-white/30 backdrop-blur-sm"
              >
                <img
                  src={game.image}
                  alt={game.name}
                  className="w-20 h-20 object-contain transition-all duration-300 group-hover:scale-110"
                />
                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-gradient-to-br from-white/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Enhanced glow effect */}
              <div
                className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(79,195,247,0.3), rgba(74,108,255,0.2))',
                }}
              />

              {/* Particle effects */}
              {isVisible && (
                <div className="absolute inset-0">
                  <div className="absolute -top-3 -left-3 w-2 h-2 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: `${index * 0.4}s` }} />
                  <div className="absolute -top-3 -right-3 w-2 h-2 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: `${index * 0.4 + 0.1}s` }} />
                  <div className="absolute top-3 left-3 w-2 h-2 bg-cyan-400 rounded-full animate-ping" style={{ animationDelay: `${index * 0.4 + 0.2}s` }} />
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

          <p className="text-xl md:text-2xl text-white/70 mb-12 text-pretty max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
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
