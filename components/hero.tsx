"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

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
        className="absolute w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none z-0 transition-all duration-700 ease-out"
        style={{
          left: `${20 + (mousePosition.x - 50) * 0.1}%`,
          top: `${30 + (mousePosition.y - 40) * 0.15}%`
        }}
      />
      <div 
        className="absolute w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none z-0 transition-all duration-700 ease-out"
        style={{
          right: `${20 - (mousePosition.x - 50) * 0.1}%`,
          bottom: `${30 - (mousePosition.y - 40) * 0.15}%`
        }}
      />

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          <div
            className={`inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#FFD166]/10 to-[#4fc3f7]/10 border border-[#FFD166]/20 rounded-full mb-8 backdrop-blur-sm transition-all duration-700 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
            }`}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFD166] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FFD166]"></span>
            </span>
            <span className="text-[#FFD166] text-sm font-semibold tracking-wide">PRE-LAUNCH • EARLY ACCESS AVAILABLE</span>
          </div>

          <h1
            className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-minecraft text-white mb-8 text-balance leading-[1.4] tracking-tight transition-all duration-700 delay-100 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Compete. Dominate.{" "}
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4fc3f7] via-[#00C2FF] to-[#29b6f6]">
                Win Prizes.
              </span>
              <div className="absolute -bottom-2 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#4fc3f7] to-transparent" />
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
            <Link
              href="/signup"
              className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 bg-gradient-to-r from-[#4fc3f7] via-[#00C2FF] to-[#29b6f6] text-white rounded-full font-bold text-base sm:text-lg overflow-hidden transition-all duration-300 hover:scale-105 shadow-[0_0_30px_rgba(79,195,247,0.3)] hover:shadow-[0_0_50px_rgba(79,195,247,0.5)]"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-[#29b6f6] via-[#00C2FF] to-[#4fc3f7] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative flex items-center gap-3">
                <span className="relative">
                  <span className="absolute inset-0 blur-lg bg-white/30 group-hover:bg-white/50 transition-all"></span>
                  <span className="relative">JOIN WAITLIST</span>
                </span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <div className="absolute inset-0 -top-full group-hover:top-0 bg-white/20 transition-all duration-300 skew-y-12"></div>
            </Link>
            <a
              href="#how-it-works"
              className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 bg-slate-800/50 border-2 border-blue-400/30 text-white rounded-full font-bold text-base sm:text-lg hover:bg-slate-800/70 hover:border-blue-400/50 transition-all duration-300 backdrop-blur-sm overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative flex items-center gap-3">
                <span>HOW IT WORKS</span>
                <svg className="w-5 h-5 group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
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
