import Image from "next/image"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-32 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image src="/hero-bg.png" alt="Gaming Background" fill className="object-cover opacity-30" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1020]/60 via-[#0B1020]/80 to-[#0B1020]" />
      </div>

      {/* Subtle ambient glow effects */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#4fc3f7]/5 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#4A6CFF]/5 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FFD166]/10 border border-[#FFD166]/30 rounded-full mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFD166] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FFD166]"></span>
            </span>
            <span className="text-[#FFD166] text-sm font-semibold">PRE-LAUNCH • JOIN THE WAITLIST</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-semibold text-white mb-6 text-balance leading-[1.1] tracking-tight">
            Turn Your Gaming Clips into{" "}
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4fc3f7] via-[#00C2FF] to-[#29b6f6]">
                Glory
              </span>
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-white/50 mb-12 text-pretty max-w-3xl mx-auto leading-relaxed font-light">
            Join tournaments, showcase clips, and rise through the ranks before anyone else.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <a
              href="https://gg-test-site.vercel.app/signup"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#0a0f1e] rounded-full font-semibold text-lg hover:bg-white/90 transition-all hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Pre Register Now
              <span className="inline-block group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
