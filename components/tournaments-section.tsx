"use client"

import Link from "next/link"

export function TournamentsSection() {
  const tournaments = [
    {
      title: "FPS Championship",
      description: "Competitive First Person Shooter tournaments",
      icon: "🎯",
      prize: "$5K",
      participants: "500+",
    },
    {
      title: "Battle Royale Masters",
      description: "Ultimate survival gameplay showcase",
      icon: "👑",
      prize: "$10K",
      participants: "1000+",
    },
    {
      title: "Speed Run Challenge",
      description: "Record-breaking gameplay moments",
      icon: "⚡",
      prize: "$3K",
      participants: "300+",
    },
  ]

  return (
    <section id="tournaments" className="py-32 px-4 relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B1020] via-[#1a2332] to-[#0B1020]" />
      
      {/* Animated grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(79,195,247,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(79,195,247,0.05)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse" />

      {/* Glowing ambient orbs */}
      <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-[#4fc3f7]/20 rounded-full blur-[120px] pointer-events-none z-0 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/3 w-[600px] h-[600px] bg-[#4A6CFF]/20 rounded-full blur-[120px] pointer-events-none z-0 animate-pulse" style={{ animationDelay: "1s" }} />
      <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-[#10b981]/15 rounded-full blur-[80px] pointer-events-none z-0 animate-pulse" style={{ animationDelay: "2s" }} />

      <div className="container mx-auto relative z-10">
        {/* Header */}
        <div className="text-center space-y-8 mb-20">
          <div className="inline-block px-4 py-2 bg-[#4A6CFF]/10 border border-[#4A6CFF]/30 rounded-full mb-6">
            <span className="text-[#4A6CFF] text-sm font-semibold">TOURNAMENTS</span>
          </div>

          <div className="space-y-6">
            <h2 className="text-6xl md:text-7xl font-bold text-white">
              Tournaments
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4fc3f7] via-[#00C2FF] to-[#10b981]">
                Coming Soon
              </span>
            </h2>
          </div>

          <div className="space-y-3 max-w-2xl mx-auto">
            <p className="text-2xl md:text-3xl font-bold text-white">Your clips are worth more than you think</p>
            <p className="text-lg md:text-xl text-white/60 leading-relaxed">
              Compete in epic tournaments, showcase your best clips, and climb the leaderboards for real prizes and recognition.
            </p>
          </div>
        </div>

        {/* Tournament Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          {tournaments.map((tournament, index) => (
            <div
              key={index}
              className="group relative"
            >
              {/* Glowing border effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#4fc3f7] to-[#4A6CFF] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
              
              {/* Card background */}
              <div className="relative h-full p-8 bg-gradient-to-br from-[#1a2332]/90 to-[#0f1621]/90 rounded-2xl border border-[#2a3342]/60 group-hover:border-[#4A6CFF]/40 backdrop-blur-xl transition-all duration-300 hover:shadow-[0_0_40px_rgba(74,108,255,0.3)]">
                
                {/* Animated gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#4A6CFF]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                
                <div className="relative z-10 space-y-6">
                  {/* Icon and Title */}
                  <div className="space-y-3">
                    <div className="text-5xl mb-2">{tournament.icon}</div>
                    <h3 className="text-2xl font-bold text-white group-hover:text-[#4fc3f7] transition-colors duration-300">
                      {tournament.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-white/60 text-sm leading-relaxed group-hover:text-white/70 transition-colors duration-300">
                    {tournament.description}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#2a3342]/50">
                    <div>
                      <p className="text-[#4fc3f7] font-bold text-lg">{tournament.prize}</p>
                      <p className="text-white/50 text-xs">Prize Pool</p>
                    </div>
                    <div>
                      <p className="text-[#4A6CFF] font-bold text-lg">{tournament.participants}</p>
                      <p className="text-white/50 text-xs">Participants</p>
                    </div>
                  </div>

                  {/* Hover indicator */}
                  <div className="flex items-center text-[#4fc3f7] opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm font-semibold pt-2">
                    Learn More <span className="ml-1 inline-block group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/signup"
            className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-[#0a0f1e] rounded-full font-semibold text-lg hover:bg-white/90 transition-all hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Pre Register Now
            <span className="inline-block group-hover:translate-x-1 transition-transform">→</span>
          </Link>
          <button className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border-2 border-[#4A6CFF]/60 text-[#4A6CFF] rounded-full font-semibold text-lg hover:border-[#4A6CFF] hover:bg-[#4A6CFF]/10 transition-all hover:scale-105">
            View Full Schedule
          </button>
        </div>
      </div>
    </section>
  )
}
