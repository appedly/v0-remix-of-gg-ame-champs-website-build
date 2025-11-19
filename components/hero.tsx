"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Sparkles } from "lucide-react"

export function Hero() {
  const [mounted, setMounted] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 40 })

  useEffect(() => {
    setMounted(true)
    
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100
      const y = (e.clientY / window.innerHeight) * 100
      setMousePosition({ x, y })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-32 overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 z-0">
        <Image src="/hero-bg.png" alt="Gaming Background" fill className="object-cover opacity-30" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1020]/60 via-[#0B1020]/80 to-[#0B1020]" />
      </div>

      {/* Dynamic parabolic grid pattern that follows cursor */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f620_1px,transparent_1px),linear-gradient(to_bottom,#3b82f620_1px,transparent_1px)] bg-[size:2rem_2rem] z-0 transition-all duration-300 ease-out"
        style={{
          maskImage: `radial-gradient(ellipse 90% 60% at ${mousePosition.x}% ${mousePosition.y}%, #000 30%, transparent 100%)`,
          WebkitMaskImage: `radial-gradient(ellipse 90% 60% at ${mousePosition.x}% ${mousePosition.y}%, #000 30%, transparent 100%)`
        }}
      />

      {/* Animated gradient orbs that follow cursor subtly */}
      <div 
        className="absolute w-[600px] h-[600px] bg-blue-500/15 rounded-full blur-[120px] pointer-events-none z-0 transition-all duration-700 ease-out animate-pulse-slow"
        style={{
          left: `${20 + (mousePosition.x - 50) * 0.15}%`,
          top: `${30 + (mousePosition.y - 40) * 0.2}%`
        }}
      />
      <div 
        className="absolute w-[600px] h-[600px] bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none z-0 transition-all duration-700 ease-out animate-pulse-slow"
        style={{
          right: `${20 - (mousePosition.x - 50) * 0.15}%`,
          bottom: `${30 - (mousePosition.y - 40) * 0.2}%`,
          animationDelay: '1s'
        }}
      />
      
      {/* Additional interactive orbs */}
      <div 
        className="absolute w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none z-0 transition-all duration-500 ease-out"
        style={{
          left: `${mousePosition.x * 0.3}%`,
          top: `${mousePosition.y * 0.4}%`
        }}
      />

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          {/* Enhanced badge */}
          <div
            className={`inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#FFD166]/20 via-[#4fc3f7]/20 to-[#FFD166]/20 border border-[#FFD166]/30 rounded-full mb-8 backdrop-blur-md transition-all duration-700 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,209,102,0.3)] ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
            }`}
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFD166] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FFD166]"></span>
            </span>
            <span className="text-[#FFD166] text-sm font-bold tracking-wide uppercase">PRE-LAUNCH • EARLY ACCESS AVAILABLE</span>
            <Sparkles className="w-4 h-4 text-[#4fc3f7] animate-pulse" />
          </div>

          <h1
            className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-minecraft text-white mb-8 text-balance leading-[1.4] tracking-tight transition-all duration-700 delay-100 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Compete. Dominate.{" "}
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4fc3f7] via-[#00C2FF] to-[#29b6f6] animate-gradient">
                Win Prizes.
              </span>
              <div className="absolute -bottom-2 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#4fc3f7] to-transparent animate-pulse-slow" />
            </span>
          </h1>

          <p
            className={`text-lg sm:text-xl md:text-2xl text-slate-300 mb-10 text-pretty max-w-3xl mx-auto leading-relaxed transition-all duration-700 delay-200 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Submit your best gaming moments, compete in weekly tournaments, and climb the leaderboard. 
            Your skills deserve recognition.
          </p>

          <div
            className={`flex flex-col sm:flex-row gap-4 justify-center mb-16 transition-all duration-700 delay-300 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {/* Sick Join Waitlist Button */}
            <Link
              href="/signup"
              className="group relative inline-flex items-center justify-center gap-3 px-12 py-6 bg-gradient-to-r from-[#4fc3f7] via-[#00C2FF] to-[#29b6f6] text-white rounded-full font-black text-base sm:text-lg overflow-hidden transition-all duration-300 hover:scale-110 shadow-[0_0_40px_rgba(79,195,247,0.4),0_0_80px_rgba(79,195,247,0.2)] hover:shadow-[0_0_60px_rgba(79,195,247,0.6),0_0_120px_rgba(79,195,247,0.3)] uppercase tracking-wide"
            >
              {/* Animated gradient overlay */}
              <span className="absolute inset-0 bg-gradient-to-r from-[#29b6f6] via-[#00C2FF] to-[#4fc3f7] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              
              {/* Shimmer effect */}
              <span className="absolute inset-0 -top-full group-hover:top-0 bg-gradient-to-b from-white/30 via-white/5 to-transparent transition-all duration-500"></span>
              
              {/* Pulse rings */}
              <span className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping opacity-0 group-hover:opacity-75"></span>
              
              <span className="relative flex items-center gap-3 z-10">
                <span className="relative">
                  <span className="absolute inset-0 blur-lg bg-white/40 group-hover:bg-white/60 transition-all"></span>
                  <span className="relative drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">JOIN WAITLIST</span>
                </span>
                <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>

            {/* Enhanced How It Works Button */}
            <a
              href="#how-it-works"
              className="group relative inline-flex items-center justify-center gap-3 px-12 py-6 bg-slate-800/60 border-2 border-blue-400/40 text-white rounded-full font-bold text-base sm:text-lg hover:bg-slate-800/80 hover:border-blue-400/60 transition-all duration-300 backdrop-blur-md overflow-hidden uppercase tracking-wide hover:scale-105 shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:shadow-[0_0_40px_rgba(59,130,246,0.4)]"
            >
              {/* Gradient overlay on hover */}
              <span className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              
              {/* Scanning line effect */}
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700"></span>
              
              <span className="relative flex items-center gap-3 z-10">
                <span className="group-hover:text-blue-300 transition-colors">HOW IT WORKS</span>
                <svg className="w-6 h-6 group-hover:translate-y-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </span>
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="flex flex-col items-center gap-2 text-white/40 hover:text-white/60 transition-colors cursor-pointer">
          <span className="text-[10px] font-minecraft font-medium tracking-wider">SCROLL TO EXPLORE</span>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  )
}
