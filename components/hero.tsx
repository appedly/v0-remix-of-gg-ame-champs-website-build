"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Sparkles, ArrowRight, ChevronDown } from "lucide-react"

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
          {/* Badge */}
          <div
            className={`inline-flex items-center gap-2 px-5 py-2 bg-blue-500/10 border border-blue-400/30 rounded-full mb-8 backdrop-blur-sm transition-all duration-700 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
            }`}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-400"></span>
            </span>
            <span className="text-blue-300 text-sm font-semibold tracking-wide">PRE-LAUNCH • EARLY ACCESS AVAILABLE</span>
            <Sparkles className="w-4 h-4 text-blue-400" />
          </div>

          <h1
            className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white mb-8 text-balance leading-[1.1] tracking-tight transition-all duration-700 delay-100 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Compete. Dominate.{" "}
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500">
                Win Prizes.
              </span>
            </span>
          </h1>

          <p
            className={`text-xl sm:text-2xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed transition-all duration-700 delay-200 ${
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
            {/* Primary CTA Button */}
            <Link
              href="/signup"
              className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-full font-bold text-base overflow-hidden transition-all duration-200 hover:bg-blue-500 hover:-translate-y-1 active:translate-y-0 shadow-lg hover:shadow-xl"
            >
              <span className="relative z-10">JOIN WAITLIST</span>
              <ArrowRight className="w-5 h-5 relative z-10 transition-transform group-hover:translate-x-1" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </Link>

            {/* Secondary Button */}
            <a
              href="#how-it-works"
              className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-800 border border-slate-700 text-white rounded-full font-bold text-base transition-all duration-200 hover:bg-slate-700 hover:border-slate-600 hover:-translate-y-1 active:translate-y-0"
            >
              <span>HOW IT WORKS</span>
              <ChevronDown className="w-5 h-5 transition-transform group-hover:translate-y-1" />
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="flex flex-col items-center gap-2 text-slate-500 hover:text-slate-400 transition-colors cursor-pointer">
          <span className="text-xs font-medium tracking-wide">SCROLL TO EXPLORE</span>
          <ChevronDown className="w-5 h-5" />
        </div>
      </div>
    </section>
  )
}
