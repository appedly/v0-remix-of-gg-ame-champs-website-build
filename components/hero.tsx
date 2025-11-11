"use client"

import Image from "next/image"
import { useEffect, useState, useRef } from "react"

export function Hero() {
  const [mounted, setMounted] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height
        setMousePosition({ x, y })
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-32 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image src="/hero-bg.png" alt="Gaming Background" fill className="object-cover opacity-30" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1020]/60 via-[#0B1020]/80 to-[#0B1020]" />
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b0a_1px,transparent_1px),linear-gradient(to_bottom,#1e293b0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] z-0" />

      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#4fc3f7]/5 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#4A6CFF]/5 rounded-full blur-[120px] pointer-events-none z-0" />

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
            className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-8 text-balance leading-[1.1] tracking-tight transition-all duration-700 delay-100 ${
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
            <a
              href="#early-access"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#4fc3f7] to-[#00C2FF] text-[#0a0f1e] rounded-full font-semibold text-lg hover:shadow-[0_0_40px_rgba(79,195,247,0.3)] transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Get Early Access
              <span className="inline-block group-hover:translate-x-1 transition-transform">→</span>
            </a>
            <a
              href="#how-it-works"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 border border-white/10 text-white rounded-full font-semibold text-lg hover:bg-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-sm"
            >
              How It Works
              <span className="inline-block group-hover:translate-y-1 transition-transform">↓</span>
            </a>
          </div>

          <div
            ref={containerRef}
            className={`grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto transition-all duration-700 delay-500 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div
              className="group relative bg-gradient-to-br from-[#4fc3f7]/10 via-slate-900/50 to-slate-950/50 backdrop-blur-md rounded-2xl p-6 border border-[#4fc3f7]/20 overflow-hidden transition-all duration-500 hover:border-[#4fc3f7]/50 hover:shadow-[0_0_30px_rgba(79,195,247,0.15)] cursor-pointer"
              style={{
                transform: `perspective(1000px) rotateX(${mousePosition.y * 2}deg) rotateY(${mousePosition.x * 2}deg) translateZ(0)`,
                transition: "transform 0.1s ease-out"
              }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#4fc3f7]/10 rounded-full blur-2xl group-hover:bg-[#4fc3f7]/20 transition-all duration-500" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-[#4fc3f7]/10 border border-[#4fc3f7]/30 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-[#4fc3f7]/20 transition-all duration-300">
                  <svg className="w-6 h-6 text-[#4fc3f7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#4fc3f7] transition-colors">Instant Submission</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Upload clips directly. One-click tournament entry with automatic processing.</p>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#4fc3f7]/50 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            </div>

            <div
              className="group relative bg-gradient-to-br from-[#FFD166]/10 via-slate-900/50 to-slate-950/50 backdrop-blur-md rounded-2xl p-6 border border-[#FFD166]/20 overflow-hidden transition-all duration-500 hover:border-[#FFD166]/50 hover:shadow-[0_0_30px_rgba(255,209,102,0.15)] cursor-pointer"
              style={{
                transform: `perspective(1000px) rotateX(${mousePosition.y * 2}deg) rotateY(${mousePosition.x * 2}deg) translateZ(0)`,
                transition: "transform 0.1s ease-out"
              }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD166]/10 rounded-full blur-2xl group-hover:bg-[#FFD166]/20 transition-all duration-500" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-[#FFD166]/10 border border-[#FFD166]/30 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-[#FFD166]/20 transition-all duration-300">
                  <svg className="w-6 h-6 text-[#FFD166]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#FFD166] transition-colors">Community Voting</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Your peers decide. Fair ranking system with anti-manipulation protection.</p>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FFD166]/50 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            </div>

            <div
              className="group relative bg-gradient-to-br from-[#00C2FF]/10 via-slate-900/50 to-slate-950/50 backdrop-blur-md rounded-2xl p-6 border border-[#00C2FF]/20 overflow-hidden transition-all duration-500 hover:border-[#00C2FF]/50 hover:shadow-[0_0_30px_rgba(0,194,255,0.15)] cursor-pointer"
              style={{
                transform: `perspective(1000px) rotateX(${mousePosition.y * 2}deg) rotateY(${mousePosition.x * 2}deg) translateZ(0)`,
                transition: "transform 0.1s ease-out"
              }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#00C2FF]/10 rounded-full blur-2xl group-hover:bg-[#00C2FF]/20 transition-all duration-500" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-[#00C2FF]/10 border border-[#00C2FF]/30 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-[#00C2FF]/20 transition-all duration-300">
                  <svg className="w-6 h-6 text-[#00C2FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#00C2FF] transition-colors">Real Rewards</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Win actual prizes. Cash, gear, and exclusive tournament invitations.</p>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#00C2FF]/50 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="flex flex-col items-center gap-2 text-white/40 hover:text-white/60 transition-colors cursor-pointer">
          <span className="text-xs font-medium tracking-wider">SCROLL TO EXPLORE</span>
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
