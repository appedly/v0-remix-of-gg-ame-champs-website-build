"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Play, Target, Trophy } from "lucide-react"

import { cn } from "@/lib/utils"

const highlights = [
  {
    icon: Play,
    title: "Upload Clips",
    description: "Share the highlights that capture your best plays.",
  },
  {
    icon: Target,
    title: "Compete Weekly",
    description: "Enter curated tournaments built for real skill.",
  },
  {
    icon: Trophy,
    title: "Earn Recognition",
    description: "Climb the leaderboard and take home the win.",
  },
]

export function CTASection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

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

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-20 sm:py-24 md:py-32">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B1020] via-[#101726] to-[#0B1020]" />
      <div className="absolute inset-0 opacity-[0.04]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.35)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(79,195,247,0.22),rgba(74,108,255,0.18),transparent_70%)] blur-[120px]" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div
            className={cn(
              "relative overflow-hidden rounded-3xl border border-white/10 bg-[#121929]/85 shadow-[0_25px_60px_rgba(3,7,18,0.45)] backdrop-blur",
              "px-6 py-12 sm:px-12 sm:py-16 lg:px-16 lg:py-20",
              "transition-all duration-700 ease-out",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}
          >
            <div className="pointer-events-none absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-transparent via-[#4A6CFF] to-transparent opacity-70" />
            <div className="pointer-events-none absolute inset-x-6 inset-y-8 rounded-[28px] border border-white/5" />
            <div className="relative space-y-12">
              {/* Heading */}
              <div className="space-y-6 text-center">
                <div className="flex justify-center">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-semibold tracking-[0.35em] text-slate-300">
                    EARLY ACCESS
                  </span>
                </div>

                <div className="space-y-4">
                  <h2 className="text-3xl font-black text-white sm:text-4xl md:text-5xl lg:text-6xl leading-tight">
                    Clip It.<span className="text-transparent">_</span>
                    <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                      Submit It.
                    </span>
                    <br />
                    Win It.
                  </h2>

                  <p className="text-lg text-slate-400 sm:text-xl leading-relaxed">
                    Turn your best moments into a competitive edge. Crafted for players who want their clips to carry weight.
                  </p>
                </div>
              </div>

              {/* Highlights */}
              <div className="grid gap-4 sm:grid-cols-3">
                {highlights.map(({ icon: Icon, title, description }) => (
                  <div
                    key={title}
                    className="group flex flex-col gap-3 rounded-2xl border border-white/5 bg-white/5 p-6 text-center transition-all duration-300 hover:border-[#4A6CFF]/40 hover:bg-white/10"
                  >
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#4fc3f7]/15 to-[#4A6CFF]/15 text-[#4fc3f7] group-hover:scale-105 group-hover:text-[#4A6CFF] transition-transform">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-base font-semibold text-white sm:text-lg">{title}</h3>
                    <p className="text-sm text-slate-400">{description}</p>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="flex flex-col items-center gap-4">
                <Link
                  href="/signup"
                  className="group relative inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#4fc3f7] via-[#4A6CFF] to-[#6A5CFF] px-8 py-4 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.03] sm:px-12 sm:py-5 sm:text-base"
                >
                  <span className="relative z-10">Get Early Access</span>
                  <svg
                    className="relative z-10 h-5 w-5 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  <span className="absolute inset-0 rounded-full bg-white/0 transition-opacity duration-300 group-hover:bg-white/10" />
                </Link>

                <p className="text-xs text-slate-500 sm:text-sm">Join the platform and submit your next winning clip.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
