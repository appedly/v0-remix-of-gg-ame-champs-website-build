import Image from "next/image"
import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import { ArrowRight, Clapperboard, Coins, Film, Gamepad2, Swords, Zap } from "lucide-react"

import { CountdownTimer } from "@/components/countdown-timer"

const heroGlyphs: Array<{
  icon: LucideIcon
  className: string
  glow: string
  delay: string
}> = [
  {
    icon: Clapperboard,
    className: "left-[-9%] top-[22%]",
    glow: "from-[#FFD166]/45 to-transparent",
    delay: "0s",
  },
  {
    icon: Film,
    className: "right-[-6%] top-[30%]",
    glow: "from-[#4fc3f7]/40 to-transparent",
    delay: "0.25s",
  },
  {
    icon: Gamepad2,
    className: "left-[6%] bottom-[32%]",
    glow: "from-[#00c2ff]/35 to-transparent",
    delay: "0.45s",
  },
  {
    icon: Swords,
    className: "right-[10%] bottom-[24%]",
    glow: "from-[#4a6cff]/40 to-transparent",
    delay: "0.65s",
  },
  {
    icon: Coins,
    className: "left-[18%] top-[62%]",
    glow: "from-[#FFD166]/35 to-transparent",
    delay: "0.85s",
  },
  {
    icon: Zap,
    className: "right-[4%] top-[56%]",
    glow: "from-[#29b6f6]/40 to-transparent",
    delay: "1.05s",
  },
]

export function Hero() {
  return (
    <section className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-[#0c1220] pb-24 pt-32">
      <div className="absolute inset-0 -z-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(38,62,130,0.65)_0%,rgba(12,18,32,0.94)_52%,rgba(4,7,16,1)_100%)]" />
        <Image src="/hero-bg.png" alt="Gaming Background" fill className="object-cover opacity-10 mix-blend-screen" priority />
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(79,195,247,0.18)_0%,rgba(15,21,40,0.92)_38%,rgba(8,12,23,0.98)_100%)]" />
        <div className="absolute inset-0 bg-[length:200px_200px] bg-[linear-gradient(0deg,rgba(255,255,255,0.04)_1px,transparent_0),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_0)] opacity-30 mix-blend-overlay" />
      </div>

      <div className="absolute inset-0 -z-20 pointer-events-none">
        <div className="stars-small" />
        <div className="stars-medium" />
        <div className="stars-large" />
        <div className="absolute left-[-12%] top-[-8%] h-[420px] w-[420px] rounded-full bg-[#4fc3f7]/18 blur-[160px]" />
        <div className="absolute right-[-8%] bottom-[-18%] h-[520px] w-[520px] rounded-full bg-[#FFD166]/16 blur-[160px]" />
        <div className="absolute inset-x-0 bottom-[-35%] h-[480px] bg-gradient-to-t from-[#05070f] via-transparent to-transparent" />
      </div>

      <div className="absolute inset-0 -z-10 hidden pointer-events-none lg:block">
        {heroGlyphs.map((glyph, index) => {
          const GlyphIcon = glyph.icon
          return (
            <div
              key={`${glyph.className}-${index}`}
              className={`absolute flex h-28 w-28 items-center justify-center rounded-[1.75rem] border border-white/10 bg-white/[0.04] shadow-[0_25px_60px_-35px_rgba(12,17,38,0.65)] backdrop-blur-2xl ${glyph.className} animate-[hero-float_8s_ease-in-out_infinite]`}
              style={{ animationDelay: glyph.delay }}
            >
              <div className={`absolute inset-[18%] rounded-[1.1rem] bg-gradient-to-br ${glyph.glow} opacity-80`} />
              <GlyphIcon className="relative z-10 h-9 w-9 text-white/85" aria-hidden="true" />
            </div>
          )
        })}
      </div>

      <div className="container relative z-20 mx-auto px-6">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-[#f6ce6d]/60 bg-[linear-gradient(135deg,#f9d46d_0%,#f6bd3c_45%,#f09a24_100%)] px-6 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.45em] text-[#2a1602] shadow-[0_0_35px_rgba(245,190,69,0.45)]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-white/70 blur-[2px]" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#2a1602]" />
            </span>
            Launching Soon...
          </div>

          <h1 className="mt-12 text-balance text-5xl font-black leading-[1.05] tracking-tight text-[#f5f5f5] drop-shadow-[0_20px_50px_rgba(5,7,18,0.65)] md:mt-14 md:text-7xl lg:text-[5.75rem] xl:text-[6.25rem]">
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

          <p className="mx-auto mt-10 max-w-3xl text-balance text-lg font-normal leading-[1.65] text-white/75 md:text-xl">
            Enter invite-only tournaments, drop your cleanest reels, and be ready when the arena opens to the world.
          </p>

          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/signup"
              className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full px-12 py-5 text-lg font-semibold uppercase tracking-[0.16em] text-[#04121f] shadow-[0_18px_45px_-28px_rgba(79,195,247,0.65)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:scale-[1.04] hover:shadow-[0_38px_95px_-35px_rgba(41,182,246,0.9)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#4fc3f7]/40"
            >
              <span className="pointer-events-none absolute inset-0 rounded-full bg-[linear-gradient(135deg,#4fc3f7_0%,#00c2ff_40%,#4a6cff_100%)]" aria-hidden="true" />
              <span className="pointer-events-none absolute inset-0 rounded-full bg-[linear-gradient(135deg,rgba(255,255,255,0.35)_0%,rgba(255,255,255,0)_70%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden="true" />
              <span className="pointer-events-none absolute inset-[-18%] rounded-full bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.55)_0%,rgba(255,255,255,0)_70%)] opacity-0 transition-opacity duration-500 group-hover:opacity-75" aria-hidden="true" />
              <span className="pointer-events-none absolute inset-0 rounded-full border border-white/40 opacity-0 transition-opacity duration-500 group-hover:opacity-60" aria-hidden="true" />
              <span className="pointer-events-none absolute inset-0 rounded-full shadow-[0_28px_65px_-30px_rgba(41,182,246,0.85)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" aria-hidden="true" />
              <span className="relative z-10">Join the Waitlist</span>
              <ArrowRight className="relative z-10 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-10 py-5 text-lg font-medium text-white/80 transition-all duration-300 hover:border-white/50 hover:bg-white/10 hover:text-white"
            >
              Explore How It Works
            </a>
          </div>

          <CountdownTimer className="mx-auto mt-12 max-w-2xl" />
        </div>
      </div>
    </section>
  )
}
