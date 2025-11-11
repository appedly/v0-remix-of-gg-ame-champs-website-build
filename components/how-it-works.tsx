"use client"

import { useEffect, useRef, useState } from "react"
import { User, Upload, ThumbsUp, DollarSign, Camera, Trophy, Coins, Wallet, Star } from "lucide-react"

import { cn } from "@/lib/utils"

const steps = [
  {
    title: "Create Your Account",
    description:
      "Sign up in seconds, personalize your profile, and unlock access to every community tournament we host.",
    icon: User,
    floatingIcons: [
      { icon: User, side: 'left', position: 'top', delay: '0s', tilt: -15 },
      { icon: User, side: 'right', position: 'middle', delay: '0.2s', tilt: 12 },
    ],
    isMoneyCard: false,
  },
  {
    title: "Upload Your Best Clips",
    description:
      "Drop your most electric gaming highlights. Our upload flow is fast, polished, and built for high-quality footage.",
    icon: Upload,
    floatingIcons: [
      { icon: Camera, side: 'left', position: 'middle', delay: '0s', tilt: -8 },
      { icon: Upload, side: 'right', position: 'bottom', delay: '0.3s', tilt: 18 },
    ],
    isMoneyCard: false,
  },
  {
    title: "Get Votes & Rise Up",
    description:
      "Watch the leaderboard react in real-time as the community votes. Climb the brackets, earn prestige, and secure finals spots.",
    icon: ThumbsUp,
    floatingIcons: [
      { icon: Star, side: 'left', position: 'bottom', delay: '0s', tilt: -12 },
      { icon: Trophy, side: 'right', position: 'top', delay: '0.2s', tilt: 10 },
    ],
    isMoneyCard: false,
  },
  {
    title: "Earn Real Money",
    description:
      "Champions take home cash, rewards, and sponsorship opportunities. The better the clip, the bigger the payoff.",
    icon: DollarSign,
    floatingIcons: [
      { icon: Coins, side: 'left', position: 'top', delay: '0s', tilt: -20 },
      { icon: Wallet, side: 'left', position: 'bottom', delay: '0.2s', tilt: 15 },
      { icon: DollarSign, side: 'right', position: 'middle', delay: '0.1s', tilt: -10, large: true },
      { icon: Star, side: 'right', position: 'top', delay: '0.3s', tilt: 8 },
    ],
    isMoneyCard: true,
  },
]

export function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0)
  const stepRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

        if (visibleEntry) {
          const nextIndex = Number((visibleEntry.target as HTMLElement).dataset.index ?? "0")
          if (!Number.isNaN(nextIndex)) {
            setActiveStep(nextIndex)
          }
        }
      },
      { threshold: [0.25, 0.45, 0.65], rootMargin: "-15% 0px -25% 0px" }
    )

    stepRefs.current.forEach((step) => {
      if (step) {
        observer.observe(step)
      }
    })

    return () => observer.disconnect()
  }, [])

  const progressLine =
    steps.length > 0 ? Math.min(100, Math.max(0, ((activeStep + 1) / steps.length) * 100)) : 100
  const indicatorPosition =
    steps.length > 0 ? Math.min(100, Math.max(0, ((activeStep + 0.5) / steps.length) * 100)) : 100

  return (
    <section id="how-it-works" className="relative overflow-hidden py-40">
      <div className="pointer-events-none absolute inset-0">
        {/* Main background gradient */}
        <div className="absolute left-1/2 top-[15%] h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(0,194,255,0.12),rgba(138,43,226,0.08),rgba(0,0,0,0)_75%)] blur-3xl" />
        <div className="absolute right-1/4 top-1/4 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,0,255,0.06),rgba(0,255,255,0.04),rgba(0,0,0,0)_70%)] blur-3xl" />
        <div className="absolute left-1/4 bottom-1/4 h-[300px] w-[300px] rounded-full bg-[radial-gradient(circle_at_center,rgba(0,255,127,0.05),rgba(255,127,0,0.03),rgba(0,0,0,0)_65%)] blur-2xl" />
        
        {/* Animated background particles */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-1 h-1 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0s', animationDuration: '3s' }} />
          <div className="absolute top-40 right-20 w-1 h-1 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '1s', animationDuration: '3s' }} />
          <div className="absolute bottom-40 left-1/4 w-1 h-1 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '2s', animationDuration: '3s' }} />
          <div className="absolute top-60 right-1/3 w-1 h-1 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s', animationDuration: '3s' }} />
          <div className="absolute bottom-60 right-1/4 w-1 h-1 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '1.5s', animationDuration: '3s' }} />
        </div>
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(11,16,32,0),rgba(11,16,32,0.97)_55%,rgba(11,16,32,1)_100%)]" />
      </div>

      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#00C2FF]/30 bg-[#00C2FF]/10 px-5 py-2 text-xs font-semibold tracking-[0.4em] text-[#00C2FF]/80">
            HOW IT WORKS
          </div>
          <h2 className="mt-8 text-5xl font-semibold text-white md:text-6xl lg:text-7xl">
            Start Competing in 4 Simple Steps
          </h2>
          <p className="mt-6 text-lg text-white/70 md:text-xl leading-relaxed">
            Every tournament is engineered for momentum. Scroll through the four stages to see how players turn raw clips into championship payouts.
          </p>
        </div>

        <div className="relative mx-auto mt-20 max-w-4xl">
          <div className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px bg-white/10 md:block">
            {/* Main gradient line */}
            <div
              className="absolute left-1/2 top-0 h-full w-[3px] -translate-x-1/2 rounded-full bg-gradient-to-b from-[#4A6CFF]/60 via-[#00C2FF]/40 via-purple-500/30 to-transparent transition-all duration-700 ease-out"
              style={{ height: `${progressLine}%` }}
            />
            
            {/* Glowing core line */}
            <div
              className="absolute left-1/2 top-0 h-full w-[1px] -translate-x-1/2 rounded-full bg-gradient-to-b from-white/40 via-cyan-400/30 to-transparent transition-all duration-700 ease-out"
              style={{ height: `${progressLine}%` }}
            />
            
            {/* Animated sparks along the line */}
            <div className="absolute inset-0 overflow-hidden">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute left-1/2 w-2 h-2 -translate-x-1/2 rounded-full opacity-0 transition-opacity duration-500"
                  style={{
                    top: `${(i + 1) * 12}%`,
                    backgroundColor: ['#00C2FF', '#8A2BE2', '#FF1493', '#00FF7F', '#FFD700', '#FF69B4', '#00CED1', '#FF6347'][i],
                    opacity: activeStep >= i ? 1 : 0,
                    animation: activeStep >= i ? `spark-${i} 2s ease-in-out infinite` : 'none',
                    animationDelay: `${i * 0.2}s`,
                  }}
                />
              ))}
            </div>
            
            {/* Main indicator with enhanced glow */}
            <div
              className="absolute left-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#00C2FF]/50 bg-[#00C2FF]/15 transition-all duration-300"
              style={{ top: `${indicatorPosition}%` }}
            >
              <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(0,194,255,0.4),transparent_70%)] animate-pulse" />
              <div className="absolute inset-0 rounded-full border border-cyan-400/30 animate-ping" />
              <div className="absolute inset-0 rounded-full border border-purple-400/20 animate-ping" style={{ animationDelay: '0.5s' }} />
            </div>
          </div>

          <div className="space-y-16 md:space-y-20">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={step.title} ref={(element) => (stepRefs.current[index] = element)} data-index={index} className="relative">

                  <div className="relative">
                    {/* Floating Side Icons */}
                    <div className="absolute inset-0 pointer-events-none">
                      {step.floatingIcons.map((floatingIcon, iconIndex) => {
                        const FloatingIcon = floatingIcon.icon
                        const isLeft = floatingIcon.side === 'left'
                        const positionY = floatingIcon.position === 'top' ? '20%' : floatingIcon.position === 'bottom' ? '80%' : '50%'
                        const positionX = isLeft ? '-15%' : '115%'
                        const iconSize = floatingIcon.large ? 'w-16 h-16' : 'w-12 h-12'
                        
                        return (
                          <div
                            key={iconIndex}
                            className={cn(
                              "absolute transition-all duration-1000 ease-out",
                              activeStep === index ? "opacity-100" : "opacity-0"
                            )}
                            style={{
                              left: positionX,
                              top: positionY,
                              transform: `translateY(-50%) rotate(${floatingIcon.tilt}deg)`,
                              animationDelay: floatingIcon.delay,
                              animation: activeStep === index ? `float-icon-${iconIndex} 4s ease-in-out infinite` : 'none',
                            }}
                          >
                            <div
                              className={cn(
                                "relative",
                                activeStep === index && "group"
                              )}
                            >
                              {/* Icon shadow cast on card */}
                              <div 
                                className={cn(
                                  "absolute rounded-full blur-xl transition-all duration-500",
                                  iconSize,
                                  step.isMoneyCard 
                                    ? "bg-gradient-to-br from-yellow-400/20 to-amber-600/20" 
                                    : "bg-gradient-to-br from-blue-400/20 to-purple-600/20"
                                )}
                                style={{
                                  transform: isLeft ? 'translateX(20px) translateY(10px)' : 'translateX(-20px) translateY(10px)',
                                  opacity: activeStep === index ? 0.6 : 0,
                                }}
                              />
                              
                              {/* Main icon */}
                              <div
                                className={cn(
                                  "relative transition-all duration-300",
                                  iconSize,
                                  "rounded-2xl",
                                  "flex items-center justify-center",
                                  step.isMoneyCard 
                                    ? "bg-gradient-to-br from-yellow-400 to-amber-600 text-white shadow-lg shadow-yellow-500/25"
                                    : "bg-gradient-to-br from-slate-800 to-slate-900 text-cyan-400 shadow-lg shadow-cyan-500/15 border border-cyan-500/20",
                                  activeStep === index && [
                                    "hover:scale-110 cursor-pointer",
                                    step.isMoneyCard && "animate-pulse"
                                  ]
                                )}
                              >
                                <FloatingIcon className={cn(floatingIcon.large ? "w-8 h-8" : "w-6 h-6")} />
                                
                                {/* Glow effect on hover/focus */}
                                {activeStep === index && (
                                  <div
                                    className={cn(
                                      "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                                      step.isMoneyCard 
                                        ? "bg-gradient-to-br from-yellow-400 to-amber-600"
                                        : "bg-gradient-to-br from-cyan-400 to-blue-600"
                                    )}
                                    style={{ filter: 'blur(8px)' }}
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    <div className="flex justify-center">
                      <div
                        className={cn(
                          "relative overflow-hidden rounded-2xl p-8 transition-all duration-500 ease-out max-w-2xl w-full",
                          step.isMoneyCard 
                            ? "bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-yellow-500/50 shadow-[0_20px_60px_rgba(250,204,21,0.15)]"
                            : "bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/50 shadow-[0_10px_40px_rgba(0,0,0,0.3)]",
                          activeStep === index && [
                            step.isMoneyCard 
                              ? "border-yellow-400 shadow-[0_30px_80px_rgba(250,204,21,0.25)]"
                              : "border-cyan-500/30 shadow-[0_20px_60px_rgba(0,194,255,0.1)]"
                          ],
                          "hover:shadow-[0_25px_70px_rgba(0,0,0,0.4)]"
                        )}
                      >
                        {/* Special watermark for money card */}
                        {step.isMoneyCard && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
                            <DollarSign className="w-64 h-64 text-yellow-400" />
                          </div>
                        )}

                        <div className="relative z-10 space-y-6">
                          {/* Icon and title section */}
                          <div className="flex items-center gap-4">
                            <div
                              className={cn(
                                "rounded-xl p-3",
                                step.isMoneyCard 
                                  ? "bg-gradient-to-br from-yellow-400 to-amber-600 text-white"
                                  : "bg-gradient-to-br from-cyan-500/20 to-blue-600/20 text-cyan-400 border border-cyan-500/30"
                              )}
                            >
                              <Icon className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                              <h3 className={cn(
                                "text-2xl md:text-3xl font-semibold text-white",
                                step.isMoneyCard && "bg-gradient-to-r from-yellow-400 to-amber-600 bg-clip-text text-transparent"
                              )}>
                                {step.title}
                              </h3>
                              {/* Divider line */}
                              <div 
                                className={cn(
                                  "mt-2 h-0.5 rounded-full",
                                  step.isMoneyCard 
                                    ? "bg-gradient-to-r from-yellow-400 to-amber-600"
                                    : "bg-gradient-to-r from-cyan-500 to-blue-600"
                                )}
                              />
                            </div>
                          </div>
                          
                          {/* Description */}
                          <p className="text-base md:text-lg leading-relaxed text-white/70 text-left">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <style jsx>{`
          @keyframes float-icon-0 {
            0%, 100% { transform: translateY(-50%) rotate(-15deg) translateX(0px); }
            25% { transform: translateY(-50%) rotate(-12deg) translateX(-5px); }
            50% { transform: translateY(-55%) rotate(-18deg) translateX(3px); }
            75% { transform: translateY(-50%) rotate(-10deg) translateX(-3px); }
          }
          @keyframes float-icon-1 {
            0%, 100% { transform: translateY(-50%) rotate(12deg) translateX(0px); }
            25% { transform: translateY(-52%) rotate(15deg) translateX(4px); }
            50% { transform: translateY(-48%) rotate(8deg) translateX(-4px); }
            75% { transform: translateY(-50%) rotate(14deg) translateX(2px); }
          }
          @keyframes float-icon-2 {
            0%, 100% { transform: translateY(-50%) rotate(-8deg) translateX(0px); }
            33% { transform: translateY(-53%) rotate(-5deg) translateX(-3px); }
            66% { transform: translateY(-47%) rotate(-11deg) translateX(3px); }
          }
          @keyframes float-icon-3 {
            0%, 100% { transform: translateY(-50%) rotate(18deg) translateX(0px); }
            25% { transform: translateY(-52%) rotate(15deg) translateX(-4px); }
            50% { transform: translateY(-48%) rotate(21deg) translateX(4px); }
            75% { transform: translateY(-50%) rotate(16deg) translateX(-2px); }
          }
          @keyframes float-icon-4 {
            0%, 100% { transform: translateY(-50%) rotate(-20deg) translateX(0px); }
            25% { transform: translateY(-55%) rotate(-17deg) translateX(5px); }
            50% { transform: translateY(-45%) rotate(-23deg) translateX(-5px); }
            75% { transform: translateY(-50%) rotate(-18deg) translateX(2px); }
          }
          @keyframes float-icon-5 {
            0%, 100% { transform: translateY(-50%) rotate(15deg) translateX(0px); }
            33% { transform: translateY(-52%) rotate(12deg) translateX(-3px); }
            66% { transform: translateY(-48%) rotate(18deg) translateX(3px); }
          }
          @keyframes float-icon-6 {
            0%, 100% { transform: translateY(-50%) rotate(-10deg) translateX(0px); }
            25% { transform: translateY(-53%) rotate(-7deg) translateX(4px); }
            50% { transform: translateY(-47%) rotate(-13deg) translateX(-4px); }
            75% { transform: translateY(-50%) rotate(-8deg) translateX(-2px); }
          }
          @keyframes float-icon-7 {
            0%, 100% { transform: translateY(-50%) rotate(8deg) translateX(0px); }
            33% { transform: translateY(-52%) rotate(5deg) translateX(-3px); }
            66% { transform: translateY(-48%) rotate(11deg) translateX(3px); }
          }
          @keyframes spark-0 {
            0%, 100% { transform: translateX(-50%) scale(1); opacity: 0.8; }
            50% { transform: translateX(-50%) scale(1.5); opacity: 1; box-shadow: 0 0 10px currentColor; }
          }
          @keyframes spark-1 {
            0%, 100% { transform: translateX(-50%) translateY(0) scale(1); opacity: 0.7; }
            50% { transform: translateX(-50%) translateY(-3px) scale(1.3); opacity: 1; box-shadow: 0 0 8px currentColor; }
          }
          @keyframes spark-2 {
            0%, 100% { transform: translateX(-50%) translateY(0) scale(1); opacity: 0.9; }
            50% { transform: translateX(-50%) translateY(3px) scale(1.4); opacity: 1; box-shadow: 0 0 12px currentColor; }
          }
          @keyframes spark-3 {
            0%, 100% { transform: translateX(-50%) scale(1); opacity: 0.6; }
            50% { transform: translateX(-50%) scale(1.6); opacity: 1; box-shadow: 0 0 15px currentColor; }
          }
          @keyframes spark-4 {
            0%, 100% { transform: translateX(-50%) translateY(0) scale(1); opacity: 0.8; }
            50% { transform: translateX(-50%) translateY(-2px) scale(1.2); opacity: 1; box-shadow: 0 0 10px currentColor; }
          }
          @keyframes spark-5 {
            0%, 100% { transform: translateX(-50%) scale(1); opacity: 0.7; }
            50% { transform: translateX(-50%) translateY(2px) scale(1.5); opacity: 1; box-shadow: 0 0 11px currentColor; }
          }
          @keyframes spark-6 {
            0%, 100% { transform: translateX(-50%) scale(1); opacity: 0.9; }
            50% { transform: translateX(-50%) translateY(-4px) scale(1.3); opacity: 1; box-shadow: 0 0 9px currentColor; }
          }
          @keyframes spark-7 {
            0%, 100% { transform: translateX(-50%) scale(1); opacity: 0.6; }
            50% { transform: translateX(-50%) translateY(4px) scale(1.4); opacity: 1; box-shadow: 0 0 13px currentColor; }
          }
        `}</style>
      </div>
    </section>
  )
}
