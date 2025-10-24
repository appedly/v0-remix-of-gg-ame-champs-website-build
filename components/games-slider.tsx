"use client"

import { useEffect, useRef } from "react"

export function GamesSlider() {
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
    const scrollSpeed = 0.5

    const scroll = () => {
      scrollAmount += scrollSpeed
      if (scrollAmount >= scrollContainer.scrollWidth / 2) {
        scrollAmount = 0
      }
      scrollContainer.scrollLeft = scrollAmount
    }

    const interval = setInterval(scroll, 20)
    return () => clearInterval(interval)
  }, [])

  return (
    <section id="games" className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 mb-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Supported Games</h2>
          <p className="text-lg text-white/70">Compete across your favorite titles with more games added regularly</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex gap-6 overflow-x-hidden px-4" style={{ scrollBehavior: "auto" }}>
        {/* Duplicate games for infinite scroll effect */}
        {[...games, ...games].map((game, index) => (
          <div key={index} className="flex-shrink-0 w-[300px] h-[200px] relative rounded-lg overflow-hidden group">
            <img
              src={game.image || "/placeholder.svg"}
              alt={game.name}
              className="w-full h-full object-cover transition-transform group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1020] via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-xl font-bold text-white">{game.name}</h3>
            </div>
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#4A6CFF] transition-colors rounded-lg" />
          </div>
        ))}
      </div>
    </section>
  )
}
