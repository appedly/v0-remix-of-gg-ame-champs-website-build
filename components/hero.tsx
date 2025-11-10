import Image from "next/image"
import type { LucideIcon } from "lucide-react"
import { ArrowRight, Sparkles, Trophy, Users } from "lucide-react"

import { CountdownTimer } from "@/components/countdown-timer"

const launchBenefits: Array<{
  title: string
  description: string
  icon: LucideIcon
}> = [
  {
    title: "Compete Before the Crowd",
    description: "Secure your slot in invitational tournaments and rack up wins before leaderboards go public.",
    icon: Trophy,
  },
  {
    title: "Showcase Your Best Clips",
    description: "Unlock premium submission tools to spotlight your highlights with cinematic playback and overlays.",
    icon: Sparkles,
  },
  {
    title: "Level Up with the Community",
    description: "Join 10,000+ early members trading pro tips, collabs, and feedback while earning referral rewards.",
    icon: Users,
  },
]

export function Hero() {
  return (
    <section className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-[#0c1220] pb-24 pt-32">
      <div className="absolute inset-0 -z-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(32,56,120,0.65)_0%,_rgba(12,18,32,0.95)_55%,_rgba(5,8,18,1)_100%)]" />
        <Image src="/hero-bg.png" alt="Gaming Background" fill className="object-cover opacity-15 mix-blend-screen" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-[#121a2e]/90 via-[#0c1220]/92 to-[#05070f]" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(79,195,247,0.12)_0%,_transparent_60%)] blur-3xl" />
          <div className="absolute inset-0 bg-[length:160px_160px] bg-[linear-gradient(0deg,_rgba(255,255,255,0.06)_1px,_transparent_0),linear-gradient(90deg,_rgba(255,255,255,0.06)_1px,_transparent_0)] opacity-40 mix-blend-overlay" />
        </div>
        <div className="absolute inset-0 pointer-events-none">
          <div className="stars-small" />
          <div className="stars-medium" />
          <div className="stars-large" />
        </div>
        <div className="absolute -left-1/4 top-[-30%] h-[520px] w-[520px] rounded-full bg-[#46d8ff]/10 blur-[160px]" />
        <div className="absolute -right-1/4 bottom-[-30%] h-[520px] w-[520px] rounded-full bg-[#4a6cff]/10 blur-[160px]" />
      </div>

      <div className="container relative z-20 mx-auto px-6">
        <div className="mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-3 rounded-full border border-[#FFD166]/35 bg-[#FFD166]/10 px-5 py-2 text-xs font-semibold tracking-[0.35em] text-[#FFD166] shadow-[0_0_30px_rgba(255,209,102,0.25)] animate-pulse-slow">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#FFD166] opacity-60 blur-sm" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#FFD166]" />
            </span>
            PRE-LAUNCH ACCESS
          </div>

          <h1 className="text-balance text-5xl font-black tracking-tight text-[#f5f5f5] drop-shadow-[0_20px_50px_rgba(5,7,18,0.65)] md:text-7xl lg:text-[5.75rem] xl:text-[6.5rem] leading-[1.05]">
            <span className="block animate-in fade-in-0 slide-in-from-bottom-6 duration-700">
              Turn Your Gaming Clips into
              <span className="ml-3 inline-flex items-center">
                <span className="relative inline-block bg-gradient-to-r from-[#4fc3f7] via-[#00c2ff] to-[#29b6f6] bg-clip-text text-transparent">
                  Glory
                </span>
                <span className="ml-3 h-2 w-2 animate-pulse rounded-full bg-[#4fc3f7]/80" aria-hidden="true" />
              </span>
            </span>
          </h1>

          <p className="mx-auto mt-12 max-w-3xl text-balance text-lg font-normal leading-[1.7] text-white/75 md:text-xl">
            Join tournaments, showcase clips, and rise through the ranks before anyone else. We open the arena soon —
            claim your edge before the season goes live.
          </p>

          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#early-access"
              className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full bg-[linear-gradient(135deg,_#4fc3f7_0%,_#00c2ff_45%,_#4a6cff_100%)] px-12 py-5 text-lg font-semibold text-[#04121f] shadow-[0_25px_60px_-25px_rgba(79,195,247,0.95)] transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#4fc3f7]/40"
            >
              <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.35)_0%,_transparent_65%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <span className="relative z-10">Join the Waitlist</span>
              <ArrowRight className="relative z-10 size-5 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-10 py-5 text-lg font-medium text-white/80 transition-all duration-300 hover:border-white/50 hover:bg-white/10 hover:text-white"
            >
              Explore How It Works
            </a>
          </div>

          <div className="mt-8 flex flex-col items-center gap-2 text-sm text-white/60">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#4fc3f7]" aria-hidden="true" />
              Join 12,480+ creators sharpening their reels for launch.
            </div>
            <span className="text-white/40">No spam — just early brackets, perks, and insider updates.</span>
          </div>

          <CountdownTimer className="mx-auto mt-12 max-w-2xl" />

          <div className="mt-16 grid gap-5 text-left sm:grid-cols-3">
            {launchBenefits.map((benefit) => (
              <div
                key={benefit.title}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/20"
              >
                <div className="relative z-10 flex items-start gap-3">
                  <benefit.icon className="mt-1 size-7 text-[#4fc3f7]" aria-hidden="true" />
                  <div>
                    <h3 className="text-lg font-semibold text-[#f5f5f5]">{benefit.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/60">{benefit.description}</p>
                  </div>
                </div>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#4fc3f7]/0 via-[#4fc3f7]/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
