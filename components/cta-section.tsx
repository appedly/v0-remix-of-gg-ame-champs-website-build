"use client"

import { useEffect, useMemo, useState, useRef } from "react"
import { Trophy, Zap, Skull, Swords, Award, Crosshair } from "lucide-react"
import { cn } from "@/lib/utils"

export function CTASection() {
  const [isVisible, setIsVisible] = useState(false)
  const [typedText, setTypedText] = useState("")
  const [showCursor, setShowCursor] = useState(true)
  const sectionRef = useRef<HTMLDivElement>(null)
  
  const fullText = "> READY_TO_COMPETE?"
  const particles = useMemo(
    () =>
      Array.from({ length: 20 }, () => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration: 3 + Math.random() * 4,
        delay: Math.random() * 2,
      })),
    []
  )

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.3 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) {
      setTypedText("")
      return
    }

    let currentIndex = 0
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setTypedText(fullText.slice(0, currentIndex))
        currentIndex++
      } else {
        clearInterval(typingInterval)
      }
    }, 80)

    return () => clearInterval(typingInterval)
  }, [isVisible])

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 500)
    return () => clearInterval(cursorInterval)
  }, [])

  return (
    <section ref={sectionRef} className="py-20 sm:py-24 md:py-32 relative overflow-hidden">
      {/* Dark tech background */}
      <div className="absolute inset-0 bg-[#050810]" />
      
      {/* Animated grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,170,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,170,0.3)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black_40%,transparent_100%)]" />
      </div>

      {/* Scanlines effect */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div
          className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,255,170,0.1)_50%)] bg-[length:100%_4px]"
          style={{ animation: "scan 12s linear infinite" }}
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-50"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animation: `float-particle ${particle.duration}s ease-in-out infinite`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Corner decorations */}
      <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-cyan-400/50" />
      <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-cyan-400/50" />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-cyan-400/50" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-cyan-400/50" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Console Header */}
          <div className="mb-8 sm:mb-12 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/40 border border-cyan-400/30 backdrop-blur-sm mb-4">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" style={{ animationDelay: "0.2s" }} />
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" style={{ animationDelay: "0.4s" }} />
              </div>
              <span className="text-cyan-400 text-xs font-mono">SYSTEM_READY</span>
            </div>
          </div>

          {/* Main Console Card */}
          <div className="relative">
            {/* Glowing border animation */}
            <div className="absolute -inset-[2px] bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 rounded-2xl opacity-75 blur-xl animate-pulse-glow" />
            
            {/* Main card */}
            <div className="relative bg-gradient-to-br from-[#0a1628] via-[#0d1b2a] to-[#0a1628] rounded-2xl overflow-hidden border border-cyan-400/30 shadow-2xl">
              {/* Top HUD bar */}
              <div className="flex items-center justify-between px-6 py-3 bg-black/40 border-b border-cyan-400/20">
                <div className="flex items-center gap-3">
                  <Crosshair className="w-4 h-4 text-cyan-400 animate-pulse" />
                  <span className="text-cyan-400 text-xs font-mono">TARGET_ACQUIRED</span>
                </div>
                <div className="flex gap-2">
                  <div className="w-16 h-1 bg-cyan-400/20 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-400 animate-pulse-bar" />
                  </div>
                  <div className="w-16 h-1 bg-purple-400/20 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-400 animate-pulse-bar" style={{ animationDelay: "0.5s" }} />
                  </div>
                </div>
              </div>

              {/* Glitch effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-purple-500/5 mix-blend-overlay pointer-events-none animate-glitch" />

              {/* Content */}
              <div className="relative p-8 sm:p-12 md:p-16">
                {/* Floating gaming icons */}
                <div className="absolute inset-0 pointer-events-none hidden lg:block overflow-hidden">
                  {[
                    { Icon: Trophy, pos: "top-20 left-12", delay: "0s" },
                    { Icon: Zap, pos: "top-32 right-16", delay: "0.3s" },
                    { Icon: Skull, pos: "bottom-24 left-20", delay: "0.6s" },
                    { Icon: Swords, pos: "bottom-32 right-12", delay: "0.9s" },
                    { Icon: Award, pos: "top-1/2 left-8", delay: "0.2s" },
                    { Icon: Crosshair, pos: "top-1/2 right-8", delay: "0.5s" },
                  ].map(({ Icon, pos, delay }, i) => (
                    <div
                      key={i}
                      className={cn(
                        "absolute",
                        pos,
                        isVisible ? "opacity-20" : "opacity-0"
                      )}
                      style={{
                        animation: isVisible ? `float-icon ${3 + i}s ease-in-out infinite` : "none",
                        animationDelay: delay,
                      }}
                    >
                      <Icon className="w-8 h-8 text-cyan-400" />
                    </div>
                  ))}
                </div>

                {/* Terminal-style heading */}
                <div className="mb-8 sm:mb-10">
                  <div className="flex items-start gap-2 mb-6">
                    <span className="text-cyan-400 font-mono text-sm sm:text-base flex-shrink-0">$</span>
                    <div className="flex-1">
                      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-mono text-white leading-tight">
                        {typedText}
                        {showCursor && isVisible && <span className="text-cyan-400 animate-pulse">▊</span>}
                      </h2>
                    </div>
                  </div>
                  
                  {/* Achievement unlock style */}
                  <div className="inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg backdrop-blur-sm mb-6">
                    <Trophy className="w-5 h-5 text-yellow-400 animate-bounce" />
                    <span className="text-yellow-300 text-sm font-semibold">ACHIEVEMENT UNLOCKED</span>
                  </div>
                </div>

                {/* Console output text */}
                <div className="space-y-4 mb-8 sm:mb-12 max-w-2xl mx-auto">
                  <div className="flex items-start gap-2 text-left">
                    <span className="text-cyan-400 font-mono text-sm flex-shrink-0">&gt;</span>
                    <p className="text-base sm:text-lg text-gray-300 font-mono leading-relaxed">
                      Join <span className="text-cyan-400 font-bold">10,000+ gamers</span> competing for{" "}
                      <span className="text-yellow-400 font-bold">real prizes</span>
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-2 text-left">
                    <span className="text-purple-400 font-mono text-sm flex-shrink-0">&gt;</span>
                    <p className="text-base sm:text-lg text-gray-300 font-mono leading-relaxed">
                      Early access: <span className="text-purple-400 font-bold">Exclusive perks</span> +{" "}
                      <span className="text-green-400 font-bold">FREE tournaments</span>
                    </p>
                  </div>

                  <div className="flex items-start gap-2 text-left">
                    <span className="text-green-400 font-mono text-sm flex-shrink-0">&gt;</span>
                    <p className="text-base sm:text-lg text-gray-300 font-mono leading-relaxed">
                      Status: <span className="text-green-400 font-bold animate-pulse">REGISTRATION_OPEN</span>
                    </p>
                  </div>
                </div>

                {/* Stats display */}
                <div className="grid grid-cols-3 gap-4 mb-10 max-w-2xl mx-auto">
                  <div className="bg-black/40 border border-cyan-400/30 rounded-lg p-4 text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-cyan-400 font-mono">1K+</div>
                    <div className="text-xs sm:text-sm text-gray-400 font-mono mt-1">PLAYERS</div>
                  </div>
                  <div className="bg-black/40 border border-yellow-400/30 rounded-lg p-4 text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-yellow-400 font-mono">$50K</div>
                    <div className="text-xs sm:text-sm text-gray-400 font-mono mt-1">PRIZES</div>
                  </div>
                  <div className="bg-black/40 border border-purple-400/30 rounded-lg p-4 text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-purple-400 font-mono">24/7</div>
                    <div className="text-xs sm:text-sm text-gray-400 font-mono mt-1">ACTIVE</div>
                  </div>
                </div>

                {/* Action button */}
                <div className="text-center">
                  <a
                    href="#early-access"
                    className="group relative inline-flex items-center gap-3 px-8 sm:px-12 py-4 sm:py-5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-bold font-mono text-sm sm:text-base uppercase tracking-wider overflow-hidden transition-all hover:scale-105"
                  >
                    {/* Animated background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    {/* Button content */}
                    <span className="relative z-10 flex items-center gap-3">
                      <Zap className="w-5 h-5 animate-pulse" />
                      INITIALIZE_ACCESS
                      <span className="inline-block group-hover:translate-x-1 transition-transform">&gt;&gt;</span>
                    </span>

                    {/* Glowing border effect */}
                    <div className="absolute inset-0 border-2 border-cyan-400 opacity-0 group-hover:opacity-100 animate-pulse" />
                  </a>

                  {/* Sub text */}
                  <p className="mt-4 text-xs sm:text-sm text-gray-500 font-mono">
                    &gt; Press to continue | ESC to cancel
                  </p>
                </div>
              </div>

              {/* Bottom HUD bar */}
              <div className="flex items-center justify-between px-6 py-3 bg-black/40 border-t border-cyan-400/20">
                <div className="flex items-center gap-2 text-xs font-mono text-gray-500">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span>ONLINE</span>
                </div>
                <div className="text-xs font-mono text-gray-500">
                  PING: <span className="text-green-400">12ms</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom terminal line */}
          <div className="mt-8 text-center">
            <p className="text-xs sm:text-sm font-mono text-gray-600">
              <span className="text-cyan-400">$</span> sudo join_tournament --access=early --mode=competitive
            </p>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes scan {
          0% { background-position: 0 0; }
          100% { background-position: 0 100%; }
        }
        
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        
        @keyframes pulse-bar {
          0%, 100% { width: 0%; }
          50% { width: 100%; }
        }
        
        @keyframes glitch {
          0%, 100% { 
            transform: translate(0, 0);
            opacity: 1;
          }
          20% { 
            transform: translate(-2px, 2px);
            opacity: 0.8;
          }
          40% { 
            transform: translate(-2px, -2px);
            opacity: 0.9;
          }
          60% { 
            transform: translate(2px, 2px);
            opacity: 0.8;
          }
          80% { 
            transform: translate(2px, -2px);
            opacity: 0.9;
          }
        }
        
        @keyframes float-particle {
          0%, 100% { 
            transform: translate(0, 0);
            opacity: 0.3;
          }
          50% { 
            transform: translate(10px, -20px);
            opacity: 0.6;
          }
        }
        
        @keyframes float-icon {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg);
          }
          50% { 
            transform: translateY(-20px) rotate(5deg);
          }
        }
      `}</style>
    </section>
  )
}
