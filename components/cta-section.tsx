"use client"

import { useEffect, useState, useRef } from "react"
import { Play, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

export function CTASection() {
  const [isVisible, setIsVisible] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        setIsVisible(entry.isIntersecting)
        if (entry.isIntersecting) {
          setTimeout(() => setIsRecording(true), 500)
        }
      },
      { threshold: 0.3 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-20 sm:py-24 md:py-32 relative overflow-hidden">
      {/* Clean gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B1020] via-[#0f1419] to-[#0B1020]" />
      
      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 rounded-full blur-[120px]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Recording indicator */}
          <div className="flex justify-center mb-8 sm:mb-10">
            <div
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/20 backdrop-blur-sm border transition-all duration-500",
                isRecording
                  ? "border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                  : "border-white/10"
              )}
            >
              <div className="relative">
                <Circle
                  className={cn(
                    "w-2 h-2 transition-all duration-500",
                    isRecording ? "fill-red-500 text-red-500" : "fill-gray-500 text-gray-500"
                  )}
                />
                {isRecording && (
                  <Circle className="absolute inset-0 w-2 h-2 fill-red-500 text-red-500 animate-ping" />
                )}
              </div>
              <span
                className={cn(
                  "text-xs font-medium transition-colors duration-500",
                  isRecording ? "text-red-400" : "text-gray-400"
                )}
              >
                {isRecording ? "RECORDING" : "STANDBY"}
              </span>
            </div>
          </div>

          {/* Main content card */}
          <div className="relative">
            {/* Subtle glow behind card */}
            <div className="absolute -inset-px bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Main card */}
            <div className="relative bg-gradient-to-br from-slate-900/80 via-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
              {/* Subtle top border accent */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
              
              {/* Content */}
              <div className="p-8 sm:p-12 md:p-16 lg:p-20">
                {/* Heading */}
                <div className="text-center mb-10 sm:mb-12">
                  <h2
                    className={cn(
                      "text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 transition-all duration-1000",
                      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    )}
                  >
                    Clip It.{" "}
                    <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                      Submit It.
                    </span>
                    <br />
                    Win It.
                  </h2>
                  
                  <p
                    className={cn(
                      "text-lg sm:text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-200",
                      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    )}
                  >
                    Turn your greatest gaming moments into competitive glory.
                    <br className="hidden sm:block" />
                    <span className="text-slate-400">No gimmicks. Just pure skill.</span>
                  </p>
                </div>

                {/* Features grid - clean and minimal */}
                <div
                  className={cn(
                    "grid md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto transition-all duration-1000 delay-400",
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  )}
                >
                  <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-cyan-500/30 transition-all duration-300 group">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 text-cyan-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Upload Clips</h3>
                    <p className="text-sm text-slate-400">Share your best plays</p>
                  </div>

                  <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-blue-500/30 transition-all duration-300 group">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Compete</h3>
                    <p className="text-sm text-slate-400">Join weekly tournaments</p>
                  </div>

                  <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300 group">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Win Prizes</h3>
                    <p className="text-sm text-slate-400">Earn real rewards</p>
                  </div>
                </div>

                {/* CTA Button */}
                <div
                  className={cn(
                    "text-center transition-all duration-1000 delay-600",
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  )}
                >
                  <a
                    href="#early-access"
                    className="group relative inline-flex items-center gap-3 px-8 sm:px-10 md:px-12 py-4 sm:py-5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white rounded-full font-semibold text-base sm:text-lg overflow-hidden shadow-[0_0_40px_rgba(59,130,246,0.3)] hover:shadow-[0_0_60px_rgba(59,130,246,0.5)] transition-all duration-300 hover:scale-105"
                  >
                    {/* Animated shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                    
                    <span className="relative z-10">Get Early Access</span>
                    
                    <svg 
                      className="relative z-10 w-5 h-5 transition-transform group-hover:translate-x-1" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </a>

                  <p className="mt-6 text-sm text-slate-500">
                    Join the platform. Start competing.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom accent line */}
          <div className="mt-12 flex justify-center">
            <div className="h-px w-48 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  )
}
