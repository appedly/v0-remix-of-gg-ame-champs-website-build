import Image from "next/image"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-32 overflow-hidden">
      {/* Enhanced background with patterns and light beams */}
      <div className="absolute inset-0 z-0">
        <Image src="/hero-bg.png" alt="Gaming Background" fill className="object-cover opacity-20" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1020]/40 via-[#0B1020]/60 to-[#0B1020]" />
        
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(79,195,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(79,195,247,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-40" />
        
        {/* Light beam effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-b from-[#4fc3f7]/15 to-transparent blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute top-20 right-1/3 w-80 h-80 bg-gradient-to-b from-[#00C2FF]/10 to-transparent blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: "0.5s" }} />
      </div>

      {/* Subtle ambient glow effects */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#4fc3f7]/8 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#4A6CFF]/8 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FFD166]/10 border border-[#FFD166]/30 rounded-full mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFD166] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FFD166]"></span>
            </span>
            <span className="text-[#FFD166] text-sm font-semibold">PRE-LAUNCH • JOIN THE WAITLIST</span>
          </div>

          <h1 className="serif-heading text-6xl md:text-7xl lg:text-8xl font-black text-white mb-6 text-balance leading-[1.1] tracking-tight">
            GGameChamps
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#FFD166] via-[#FF7A1A] to-[#FF6B6B] text-3xl md:text-4xl mt-4 font-semibold not-italic">
              Your Clips Are Worth More Than You Think
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-white/60 mb-12 text-pretty max-w-3xl mx-auto leading-relaxed font-light">
            Join tournaments, showcase clips, and rise through the ranks before anyone else.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <a
              href="/signup"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#0a0f1e] rounded-full font-semibold text-lg hover:bg-white/90 transition-all hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Join the Waitlist
              <span className="inline-block group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
