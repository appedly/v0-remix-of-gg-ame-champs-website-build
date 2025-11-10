"use client"

import { useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

const steps = [
  {
    title: "Create Your Account",
    description:
      "Sign up in seconds, personalize your profile, and unlock access to every community tournament we host.",
  },
  {
    title: "Upload Your Best Clips",
    description:
      "Drop your most electric gaming highlights. Our upload flow is fast, polished, and built for high-quality footage.",
  },
  {
    title: "Get Votes & Rise Up",
    description:
      "Watch the leaderboard react in real-time as the community votes. Climb the brackets, earn prestige, and secure finals spots.",
  },
  {
    title: "Earn Real Money",
    description:
      "Champions take home cash, rewards, and sponsorship opportunities. The better the clip, the bigger the payoff.",
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
        <div className="absolute left-1/2 top-[10%] h-[640px] w-[640px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(0,194,255,0.18),rgba(0,0,0,0)_65%)] blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(11,16,32,0),rgba(11,16,32,0.92)_58%,rgba(11,16,32,1)_100%)]" />
      </div>

      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#00C2FF]/30 bg-[#00C2FF]/10 px-5 py-2 text-xs font-semibold tracking-[0.4em] text-[#00C2FF]/80">
            HOW IT WORKS
          </div>
          <h2 className="mt-8 text-5xl font-semibold text-white md:text-6xl">
            Your Lightning-Fast Path to the Podium
          </h2>
          <p className="mt-4 text-lg text-white/70 md:text-xl">
            Every tournament is engineered for momentum. Scroll through the four stages to see how players turn raw clips
            into championship payouts.
          </p>
        </div>

        <div className="relative mx-auto mt-20 max-w-5xl">
          <div className="pointer-events-none absolute left-6 top-0 hidden h-full w-px bg-white/10 md:block">
            <div
              className="absolute left-1/2 top-0 h-full w-[3px] -translate-x-1/2 rounded-full bg-gradient-to-b from-[#4A6CFF] via-[#00C2FF] to-transparent transition-all duration-700 ease-out"
              style={{ height: `${progressLine}%` }}
            />
            <div
              className="lightning-pulse absolute left-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#00C2FF]/40 bg-[#00C2FF]/20"
              style={{ top: `${indicatorPosition}%` }}
            />
          </div>

          <div className="space-y-12 md:space-y-16">
            {steps.map((step, index) => (
              <div key={step.title} ref={(element) => (stepRefs.current[index] = element)} data-index={index} className="relative md:pl-20">
                <div
                  className={cn(
                    "pointer-events-none absolute left-6 top-10 hidden h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full border border-white/15 bg-[#0B1020]/90 text-white/60 backdrop-blur md:flex",
                    activeStep >= index && "border-[#00C2FF]/70 text-white"
                  )}
                >
                  <span className="text-sm font-semibold">{String(index + 1).padStart(2, "0")}</span>
                </div>

                <div
                  className={cn(
                    "relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0px_20px_80px_rgba(4,7,20,0.45)] transition-all duration-500 ease-out backdrop-blur-xl md:p-10",
                    activeStep === index
                      ? "border-[#00C2FF]/60 bg-white/[0.04] shadow-[0_40px_120px_rgba(0,194,255,0.28)]"
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
                      <div className="lightning-trace absolute inset-y-0 -left-1/2 w-[200%] bg-[linear-gradient(120deg,rgba(74,108,255,0)_0%,rgba(74,108,255,0.55)_45%,rgba(0,194,255,0.9)_55%,rgba(0,194,255,0)_100%)]" />
                    )}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,194,255,0.18),rgba(0,0,0,0)_68%)]" />
                  </div>

                  <div className="relative z-10 space-y-5">
                    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
                      Stage {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-3xl font-semibold text-white md:text-4xl">{step.title}</h3>
                    <p className="text-lg leading-relaxed text-white/70 md:text-xl">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
