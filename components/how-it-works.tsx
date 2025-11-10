"use client"

import { useEffect, useRef, useState } from "react"
import { User, Upload, ThumbsUp, DollarSign } from "lucide-react"

import { cn } from "@/lib/utils"

const steps = [
  {
    title: "Create Your Account",
    description:
      "Sign up in seconds, personalize your profile, and unlock access to every community tournament we host.",
    icon: User,
    bgElements: [
      { type: 'circle', color: '#00C2FF', size: 'w-2 h-2', delay: '0s' },
      { type: 'square', color: '#4A6CFF', size: 'w-3 h-3', delay: '0.2s' },
      { type: 'triangle', color: '#00C2FF', size: 'w-2 h-2', delay: '0.4s' },
    ],
  },
  {
    title: "Upload Your Best Clips",
    description:
      "Drop your most electric gaming highlights. Our upload flow is fast, polished, and built for high-quality footage.",
    icon: Upload,
    bgElements: [
      { type: 'hexagon', color: '#FF6B6B', size: 'w-3 h-3', delay: '0s' },
      { type: 'circle', color: '#4ECDC4', size: 'w-2 h-2', delay: '0.3s' },
      { type: 'square', color: '#45B7D1', size: 'w-2 h-2', delay: '0.6s' },
    ],
  },
  {
    title: "Get Votes & Rise Up",
    description:
      "Watch the leaderboard react in real-time as the community votes. Climb the brackets, earn prestige, and secure finals spots.",
    icon: ThumbsUp,
    bgElements: [
      { type: 'heart', color: '#FF6B6B', size: 'w-3 h-3', delay: '0s' },
      { type: 'star', color: '#FFD93D', size: 'w-2 h-2', delay: '0.2s' },
      { type: 'circle', color: '#6BCF7F', size: 'w-2 h-2', delay: '0.4s' },
    ],
  },
  {
    title: "Earn Real Money",
    description:
      "Champions take home cash, rewards, and sponsorship opportunities. The better the clip, the bigger the payoff.",
    icon: DollarSign,
    bgElements: [
      { type: 'diamond', color: '#FFD700', size: 'w-3 h-3', delay: '0s' },
      { type: 'coin', color: '#FFA500', size: 'w-2 h-2', delay: '0.3s' },
      { type: 'star', color: '#FFD700', size: 'w-2 h-2', delay: '0.6s' },
    ],
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
    <section id="how-it-works" className="relative overflow-hidden py-32">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[10%] h-[640px] w-[640px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(0,194,255,0.08),rgba(0,0,0,0)_70%)] blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(11,16,32,0),rgba(11,16,32,0.95)_60%,rgba(11,16,32,1)_100%)]" />
      </div>

      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#00C2FF]/30 bg-[#00C2FF]/10 px-5 py-2 text-xs font-semibold tracking-[0.4em] text-[#00C2FF]/80">
            HOW IT WORKS
          </div>
          <h2 className="mt-8 text-5xl font-semibold text-white md:text-6xl">
            Start Competing in 4 Simple Steps
          </h2>
          <p className="mt-4 text-lg text-white/70 md:text-xl">
            Every tournament is engineered for momentum. Scroll through the four stages to see how players turn raw clips
            into championship payouts.
          </p>
        </div>

        <div className="relative mx-auto mt-20 max-w-4xl">
          <div className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px bg-white/10 md:block">
            <div
              className="absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 rounded-full bg-gradient-to-b from-[#4A6CFF]/50 via-[#00C2FF]/30 to-transparent transition-all duration-700 ease-out"
              style={{ height: `${progressLine}%` }}
            />
            <div
              className="lightning-pulse absolute left-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#00C2FF]/30 bg-[#00C2FF]/10"
              style={{ top: `${indicatorPosition}%` }}
            />
          </div>

          <div className="space-y-16 md:space-y-20">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={step.title} ref={(element) => (stepRefs.current[index] = element)} data-index={index} className="relative">
                  <div
                    className={cn(
                      "pointer-events-none absolute left-1/2 top-8 hidden h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border border-white/15 bg-[#0B1020]/90 text-white/60 backdrop-blur md:flex z-20",
                      activeStep >= index && "border-[#00C2FF]/50 text-white"
                    )}
                  >
                    <span className="text-xs font-semibold">{String(index + 1).padStart(2, "0")}</span>
                  </div>

                  <div className="relative">
                    {/* Background elements that appear from behind */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      {step.bgElements.map((element, elementIndex) => (
                        <div
                          key={elementIndex}
                          className={cn(
                            "absolute opacity-0 transition-all duration-1000",
                            activeStep === index && "opacity-100"
                          )}
                          style={{
                            animationDelay: element.delay,
                            animation: activeStep === index ? `float-${elementIndex} 3s ease-in-out infinite` : 'none',
                            left: `${20 + elementIndex * 30}%`,
                            top: `${10 + elementIndex * 15}%`,
                          }}
                        >
                          {element.type === 'circle' && (
                            <div 
                              className={cn("rounded-full", element.size)}
                              style={{ backgroundColor: element.color }}
                            />
                          )}
                          {element.type === 'square' && (
                            <div 
                              className={cn("rotate-45", element.size)}
                              style={{ backgroundColor: element.color }}
                            />
                          )}
                          {element.type === 'triangle' && (
                            <div 
                              className={cn(element.size)}
                              style={{
                                width: 0,
                                height: 0,
                                borderLeft: `${parseInt(element.size.split(' ')[0].replace('w-', '')) * 4}px solid transparent`,
                                borderRight: `${parseInt(element.size.split(' ')[0].replace('w-', '')) * 4}px solid transparent`,
                                borderBottom: `${parseInt(element.size.split(' ')[0].replace('w-', '')) * 6}px solid ${element.color}`,
                              }}
                            />
                          )}
                          {element.type === 'hexagon' && (
                            <div className={cn(element.size)} style={{ color: element.color }}>
                              ⬡
                            </div>
                          )}
                          {element.type === 'heart' && (
                            <div className={cn(element.size)} style={{ color: element.color }}>
                              ♥
                            </div>
                          )}
                          {element.type === 'star' && (
                            <div className={cn(element.size)} style={{ color: element.color }}>
                              ★
                            </div>
                          )}
                          {element.type === 'diamond' && (
                            <div className={cn(element.size)} style={{ color: element.color }}>
                              ♦
                            </div>
                          )}
                          {element.type === 'coin' && (
                            <div className={cn(element.size, "rounded-full border-2")} style={{ borderColor: element.color }}>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-center">
                      <div
                        className={cn(
                          "relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-10 shadow-[0px_20px_80px_rgba(4,7,20,0.45)] transition-all duration-500 ease-out backdrop-blur-xl max-w-2xl w-full",
                          activeStep === index
                            ? "border-[#00C2FF]/40 bg-white/[0.04] shadow-[0_40px_120px_rgba(0,194,255,0.15)]"
                            : "hover:border-white/20 hover:bg-white/[0.03]"
                        )}
                      >
                        <div
                          className={cn(
                            "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-out",
                            activeStep === index && "opacity-100"
                          )}
                        >
                          {activeStep === index && (
                            <div className="lightning-trace absolute inset-y-0 -left-1/2 w-[200%] bg-[linear-gradient(120deg,rgba(74,108,255,0)_0%,rgba(74,108,255,0.25)_45%,rgba(0,194,255,0.4)_55%,rgba(0,194,255,0)_100%)]" />
                          )}
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,194,255,0.08),rgba(0,0,0,0)_70%)]" />
                        </div>

                        <div className="relative z-10 text-center space-y-6">
                          <div className="flex items-center justify-center gap-3">
                            <Icon className="w-6 h-6 text-[#00C2FF]" />
                            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
                              Stage {String(index + 1).padStart(2, "0")}
                            </span>
                          </div>
                          <h3 className="text-3xl font-semibold text-white md:text-4xl">{step.title}</h3>
                          <p className="text-lg leading-relaxed text-white/70 md:text-xl max-w-lg mx-auto">{step.description}</p>
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
          @keyframes float-0 {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
          }
          @keyframes float-1 {
            0%, 100% { transform: translateY(0px) translateX(0px); }
            50% { transform: translateY(-15px) translateX(10px); }
          }
          @keyframes float-2 {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-25px) rotate(-90deg); }
          }
        `}</style>
      </div>
    </section>
  )
}
