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
            className={`relative h-48 max-w-4xl mx-auto transition-all duration-700 delay-500 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div
              className="absolute left-[15%] top-1/2 -translate-y-1/2 w-32 h-32 group cursor-pointer"
              style={{
                transform: `translate(${mousePosition.x * 30}px, ${mousePosition.y * 30}px)`,
                transition: "transform 0.2s ease-out"
              }}
            >
              <div className="relative w-full h-full">
                <div className="absolute inset-0 bg-[#4fc3f7]/20 rounded-full blur-2xl animate-pulse" />
                <div className="absolute inset-0 bg-gradient-to-br from-[#4fc3f7] to-[#00C2FF] rounded-full opacity-90 group-hover:opacity-100 transition-opacity duration-300 animate-[spin_20s_linear_infinite]" style={{ animationDirection: 'reverse' }} />
                <div className="absolute inset-2 bg-[#0B1020]/80 backdrop-blur-sm rounded-full border-2 border-[#4fc3f7]/30 group-hover:border-[#4fc3f7] transition-all duration-300 flex items-center justify-center group-hover:scale-110">
                  <svg className="w-12 h-12 text-[#4fc3f7] group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-[#4fc3f7] to-transparent rounded-full opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300" />
              </div>
            </div>

            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 group cursor-pointer z-10"
              style={{
                transform: `translate(calc(-50% + ${mousePosition.x * -40}px), calc(-50% + ${mousePosition.y * -40}px))`,
                transition: "transform 0.2s ease-out"
              }}
            >
              <div className="relative w-full h-full">
                <div className="absolute inset-0 bg-[#FFD166]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.3s' }} />
                <div className="absolute inset-0 bg-gradient-to-br from-[#FFD166] to-[#FFA500] rounded-full opacity-90 group-hover:opacity-100 transition-opacity duration-300 animate-[spin_15s_linear_infinite]" />
                <div className="absolute inset-2 bg-[#0B1020]/80 backdrop-blur-sm rounded-full border-2 border-[#FFD166]/30 group-hover:border-[#FFD166] transition-all duration-300 flex items-center justify-center group-hover:scale-110">
                  <svg className="w-16 h-16 text-[#FFD166] group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-[#FFD166] to-transparent rounded-full opacity-0 group-hover:opacity-40 blur-xl transition-opacity duration-300" />
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#FFD166]/20 animate-[spin_30s_linear_infinite]" />
              </div>
            </div>

            <div
              className="absolute right-[15%] top-1/2 -translate-y-1/2 w-36 h-36 group cursor-pointer"
              style={{
                transform: `translate(${mousePosition.x * 25}px, ${mousePosition.y * 25}px)`,
                transition: "transform 0.2s ease-out"
              }}
            >
              <div className="relative w-full h-full">
                <div className="absolute inset-0 bg-[#00C2FF]/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '0.6s' }} />
                <div className="absolute inset-0 bg-gradient-to-br from-[#00C2FF] to-[#0080FF] rounded-full opacity-90 group-hover:opacity-100 transition-opacity duration-300 animate-[spin_18s_linear_infinite]" style={{ animationDirection: 'reverse' }} />
                <div className="absolute inset-2 bg-[#0B1020]/80 backdrop-blur-sm rounded-full border-2 border-[#00C2FF]/30 group-hover:border-[#00C2FF] transition-all duration-300 flex items-center justify-center group-hover:scale-110">
                  <svg className="w-14 h-14 text-[#00C2FF] group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-[#00C2FF] to-transparent rounded-full opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300" />
              </div>
            </div>

            <div className="absolute inset-0 pointer-events-none">
              <svg className="w-full h-full opacity-20" viewBox="0 0 800 200">
                <path
                  d="M 120 100 Q 250 80 400 100 T 680 100"
                  stroke="url(#gradient1)"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="5,5"
                  className="animate-[dash_20s_linear_infinite]"
                />
                <defs>
                  <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#4fc3f7" stopOpacity="0.5" />
                    <stop offset="50%" stopColor="#FFD166" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#00C2FF" stopOpacity="0.5" />
                  </linearGradient>
                </defs>
              </svg>
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
