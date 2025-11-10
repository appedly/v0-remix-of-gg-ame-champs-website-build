"use client"

import Link from "next/link"

export function TournamentsSection() {
  return (
    <section id="tournaments" className="py-32 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B1020] via-[#1a2332] to-[#0B1020]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(79,195,247,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(79,195,247,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-[#4fc3f7]/3 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-[#4A6CFF]/3 rounded-full blur-[100px] pointer-events-none z-0" />

      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="text-center space-y-8">
          <div className="space-y-6">
            <h2 className="text-6xl md:text-7xl font-bold text-white">
              Tournaments
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10b981] to-[#059669]">
                Coming Soon
              </span>
            </h2>
          </div>

          <div className="space-y-3">
            <p className="text-2xl md:text-3xl font-bold text-white">Your clips are worth more than you think</p>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
              Compete, showcase, and earn recognition
            </p>
          </div>

          <div className="pt-4">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#0a0f1e] rounded-full font-semibold text-lg hover:bg-white/90 transition-all hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Pre Register Now
              <span className="inline-block group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
