"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"

export function TournamentsSection() {
  const scrollRef = useRef<HTMLDivElement>(null)

  const games = [
    { name: "Fortnite", image: "/generic-battle-royale.png" },
    { name: "Valorant", image: "/valorant-game.jpg" },
    { name: "Call of Duty", image: "/call-of-duty-game.jpg" },
    { name: "Apex Legends", image: "/futuristic-battle-arena.png" },
    { name: "League of Legends", image: "/league-of-legends-game.jpg" },
    { name: "CS2", image: "/tactical-shooter-scene.png" },
    { name: "Overwatch 2", image: "/overwatch-2-game.jpg" },
    { name: "Rocket League", image: "/rocket-league-game.jpg" },
  ]

  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    let scrollAmount = 0
    const scrollSpeed = 0.3

    const scroll = () => {
      scrollAmount += scrollSpeed
      if (scrollAmount >= scrollContainer.scrollWidth / 2) {
        scrollAmount = 0
      }
      scrollContainer.scrollLeft = scrollAmount
    }

    const interval = setInterval(scroll, 30)
    return () => clearInterval(interval)
  }, [])

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
            <p className="text-2xl md:text-3xl font-bold text-white">Tournaments for all games coming soon</p>
            <p className="text-lg md:text-xl text-white/60 leading-relaxed">
              Compete in epic tournaments across your favorite games, showcase your best clips, and climb the leaderboards for real prizes and recognition.
            </p>
          </div>
        </div>

        {/* Games Showcase */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-white mb-4">Supported Games</h3>
            <p className="text-white/60">Compete across the most popular gaming titles</p>
          </div>
          
          <div ref={scrollRef} className="flex gap-6 overflow-x-hidden px-4" style={{ scrollBehavior: "auto" }}>
            {/* Duplicate games for infinite scroll effect */}
            {[...games, ...games].map((game, index) => (
              <div key={index} className="flex-shrink-0 w-[350px] h-[220px] relative rounded-xl overflow-hidden group">
                <img
                  src={game.image || "/placeholder.svg"}
                  alt={game.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1020] via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-bold text-white">{game.name}</h3>
                  <p className="text-white/70 text-sm mt-1">Tournaments Coming Soon</p>
                </div>
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#4fc3f7] transition-all duration-300 rounded-xl" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#4fc3f7]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
              </div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex justify-center items-center">
          <Link
            href="/signup"
            className="group inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-[#4fc3f7] to-[#4A6CFF] text-white rounded-full font-semibold text-lg hover:from-[#4fc3f7]/90 hover:to-[#4A6CFF]/90 transition-all hover:scale-105 shadow-xl hover:shadow-[0_0_40px_rgba(79,195,247,0.4)]"
          >
            Pre Register Now
            <span className="inline-block group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
