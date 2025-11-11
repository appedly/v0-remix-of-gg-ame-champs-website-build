"use client"

import Image from "next/image"
import { useEffect, useState } from "react"

export function Hero() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
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
            className={`text-lg sm:text-xl md:text-2xl text-slate-300 mb-12 text-pretty max-w-3xl mx-auto leading-relaxed transition-all duration-700 delay-200 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            The platform where skilled gamers compete for real money and recognition.
          </p>

          <div
            className={`text-base sm:text-lg text-slate-300 mb-12 max-w-2xl mx-auto space-y-3 transition-all duration-700 delay-200 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-[#4fc3f7] font-bold mt-1">●</span>
              <span>Submit your best gaming moments and compete weekly</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#4fc3f7] font-bold mt-1">●</span>
              <span>Climb global leaderboards with real-time rankings</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#4fc3f7] font-bold mt-1">●</span>
              <span>Win cash prizes and sponsorship opportunities</span>
            </div>
          </div>

          <div
            className={`flex flex-col sm:flex-row gap-4 justify-center mb-20 transition-all duration-700 delay-300 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <a
              href="#early-access"
              className="group inline-flex items-center justify-center gap-2 px-10 py-5 bg-gradient-to-r from-[#FFD166] to-[#FF7A1A] text-[#0B1020] rounded-full font-bold text-lg hover:shadow-[0_0_50px_rgba(255,209,102,0.5)] transition-all duration-300 hover:scale-110 shadow-2xl"
            >
              Get Early Access
              <span className="inline-block group-hover:translate-x-1 transition-transform text-xl">→</span>
            </a>
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
