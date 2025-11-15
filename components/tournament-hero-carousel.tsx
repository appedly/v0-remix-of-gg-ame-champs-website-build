"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Trophy, Calendar, Users, DollarSign, Search, Filter, X } from "lucide-react"

interface Tournament {
  id: string
  title: string
  description: string
  game: string
  prize_pool: string | number
  start_date: string
  end_date: string
  status: string
  max_participants?: number
  thumbnail_url?: string
}

interface TournamentHeroCarouselProps {
  tournaments: Tournament[]
}

const gameThemes: Record<string, { gradient: string; accent: string; image: string }> = {
  "Valorant": {
    gradient: "from-red-900/40 via-slate-900/80 to-slate-900",
    accent: "red",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&h=600&fit=crop"
  },
  "League of Legends": {
    gradient: "from-blue-900/40 via-slate-900/80 to-slate-900",
    accent: "blue",
    image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1200&h=600&fit=crop"
  },
  "CS:GO": {
    gradient: "from-orange-900/40 via-slate-900/80 to-slate-900",
    accent: "orange",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&h=600&fit=crop"
  },
  "Dota 2": {
    gradient: "from-purple-900/40 via-slate-900/80 to-slate-900",
    accent: "purple",
    image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&h=600&fit=crop"
  },
  "Fortnite": {
    gradient: "from-cyan-900/40 via-slate-900/80 to-slate-900",
    accent: "cyan",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&h=600&fit=crop"
  },
  "Apex Legends": {
    gradient: "from-red-900/40 via-slate-900/80 to-slate-900",
    accent: "red",
    image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=1200&h=600&fit=crop"
  },
  "default": {
    gradient: "from-slate-800/40 via-slate-900/80 to-slate-900",
    accent: "blue",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&h=600&fit=crop"
  }
}

export default function TournamentHeroCarousel({ tournaments }: TournamentHeroCarouselProps) {
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterGame, setFilterGame] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterPrize, setFilterPrize] = useState<string>("all")
  const [showFilters, setShowFilters] = useState(false)
  const [autoScroll, setAutoScroll] = useState(true)
  const carouselRef = useRef<HTMLDivElement>(null)
  const autoScrollInterval = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (tournaments.length > 0 && !selectedTournament) {
      const active = tournaments.find((t) => t.status === "active")
      setSelectedTournament(active || tournaments[0])
    }
  }, [tournaments, selectedTournament])

  useEffect(() => {
    if (autoScroll && carouselRef.current) {
      autoScrollInterval.current = setInterval(() => {
        if (carouselRef.current) {
          const scrollAmount = 320
          carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
          
          if (carouselRef.current.scrollLeft + carouselRef.current.clientWidth >= carouselRef.current.scrollWidth - 10) {
            setTimeout(() => {
              if (carouselRef.current) {
                carouselRef.current.scrollTo({ left: 0, behavior: "smooth" })
              }
            }, 500)
          }
        }
      }, 3000)
    }

    return () => {
      if (autoScrollInterval.current) {
        clearInterval(autoScrollInterval.current)
      }
    }
  }, [autoScroll])

  const handleManualScroll = () => {
    setAutoScroll(false)
    if (autoScrollInterval.current) {
      clearInterval(autoScrollInterval.current)
    }
  }

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 320
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      })
      handleManualScroll()
    }
  }

  const uniqueGames = Array.from(new Set(tournaments.map((t) => t.game)))

  const filteredTournaments = tournaments.filter((tournament) => {
    const matchesSearch = tournament.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         tournament.game.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesGame = filterGame === "all" || tournament.game === filterGame
    const matchesStatus = filterStatus === "all" || tournament.status === filterStatus
    
    let matchesPrize = true
    if (filterPrize !== "all") {
      const prizeValue = typeof tournament.prize_pool === "string" 
        ? parseFloat(tournament.prize_pool.replace(/[^0-9.]/g, ""))
        : tournament.prize_pool
      
      if (filterPrize === "low") matchesPrize = prizeValue < 1000
      else if (filterPrize === "medium") matchesPrize = prizeValue >= 1000 && prizeValue < 5000
      else if (filterPrize === "high") matchesPrize = prizeValue >= 5000
    }

    return matchesSearch && matchesGame && matchesStatus && matchesPrize
  })

  if (!selectedTournament || tournaments.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-slate-400">No tournaments available</p>
      </div>
    )
  }

  const theme = gameThemes[selectedTournament.game] || gameThemes.default
  const prizeValue = typeof selectedTournament.prize_pool === "string" 
    ? selectedTournament.prize_pool 
    : `$${selectedTournament.prize_pool.toLocaleString()}`

  return (
    <div className="w-full">
      {/* Hero Banner */}
      <div className="relative h-[70vh] min-h-[500px] max-h-[600px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700"
          style={{
            backgroundImage: `url(${selectedTournament.thumbnail_url || theme.image})`,
          }}
        />
        
        <div className={`absolute inset-0 bg-gradient-to-r ${theme.gradient}`} />
        
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

        <div className="relative h-full container mx-auto px-4 sm:px-6 flex items-end pb-8 sm:pb-12">
          <div className="max-w-3xl">
            <div className="mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
              <span
                className={`px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                  selectedTournament.status === "active"
                    ? "bg-green-500 text-white shadow-lg shadow-green-500/50"
                    : selectedTournament.status === "upcoming"
                      ? "bg-blue-500 text-white shadow-lg shadow-blue-500/50"
                      : "bg-slate-500 text-white"
                }`}
              >
                {selectedTournament.status}
              </span>
              <span className="text-slate-300 text-xs sm:text-sm font-medium">{selectedTournament.game}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 leading-tight">
              {selectedTournament.title}
            </h1>

            <p className="text-slate-200 text-sm sm:text-base md:text-lg mb-4 sm:mb-6 line-clamp-2 leading-relaxed">
              {selectedTournament.description}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="bg-slate-900/60 backdrop-blur-sm rounded-lg p-3 border border-slate-700/50">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400" />
                  <span className="text-slate-400 text-xs uppercase tracking-wide">Prize Pool</span>
                </div>
                <p className="text-white font-bold text-base sm:text-lg">{prizeValue}</p>
              </div>

              <div className="bg-slate-900/60 backdrop-blur-sm rounded-lg p-3 border border-slate-700/50">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
                  <span className="text-slate-400 text-xs uppercase tracking-wide">Ends</span>
                </div>
                <p className="text-white font-bold text-xs sm:text-sm">
                  {new Date(selectedTournament.end_date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                  })}
                </p>
              </div>

              {selectedTournament.max_participants && (
                <div className="bg-slate-900/60 backdrop-blur-sm rounded-lg p-3 border border-slate-700/50">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400" />
                    <span className="text-slate-400 text-xs uppercase tracking-wide">Max Players</span>
                  </div>
                  <p className="text-white font-bold text-base sm:text-lg">{selectedTournament.max_participants}</p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href={`/tournaments/${selectedTournament.id}`}
                className="px-6 sm:px-8 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-all hover:shadow-lg hover:shadow-blue-500/50 text-sm sm:text-base"
              >
                View Tournament
              </Link>
              <button className="px-6 sm:px-8 py-2.5 sm:py-3 bg-slate-800/80 hover:bg-slate-700 text-white font-semibold rounded-lg border border-slate-600 transition-all text-sm sm:text-base">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-slate-900 border-b border-slate-800 sticky top-0 z-20">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search tournaments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700 transition-all text-sm"
            >
              <Filter className="w-4 h-4" />
              Filters
              {(filterGame !== "all" || filterStatus !== "all" || filterPrize !== "all") && (
                <span className="w-2 h-2 bg-blue-500 rounded-full" />
              )}
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-2 uppercase tracking-wide">Game</label>
                  <select
                    value={filterGame}
                    onChange={(e) => setFilterGame(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="all">All Games</option>
                    {uniqueGames.map((game) => (
                      <option key={game} value={game}>
                        {game}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-2 uppercase tracking-wide">Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="completed">Completed</option>
                    <option value="ended">Ended</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-2 uppercase tracking-wide">Prize Pool</label>
                  <select
                    value={filterPrize}
                    onChange={(e) => setFilterPrize(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="all">All Prizes</option>
                    <option value="low">Under $1,000</option>
                    <option value="medium">$1,000 - $5,000</option>
                    <option value="high">$5,000+</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700">
                <p className="text-sm text-slate-400">
                  {filteredTournaments.length} tournament{filteredTournaments.length !== 1 ? "s" : ""} found
                </p>
                {(filterGame !== "all" || filterStatus !== "all" || filterPrize !== "all") && (
                  <button
                    onClick={() => {
                      setFilterGame("all")
                      setFilterStatus("all")
                      setFilterPrize("all")
                    }}
                    className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    <X className="w-4 h-4" />
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Carousel Section */}
      <div className="bg-slate-900 py-6 sm:py-8">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white">Browse Tournaments</h2>
            
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoScroll}
                  onChange={(e) => setAutoScroll(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-blue-500"
                />
                Auto-scroll
              </label>

              <div className="flex gap-2 ml-2 sm:ml-4">
                <button
                  onClick={() => scroll("left")}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700 transition-all"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={() => scroll("right")}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700 transition-all"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </div>

          <div
            ref={carouselRef}
            onScroll={handleManualScroll}
            className="flex gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800/50 pb-4"
            style={{ scrollbarWidth: "thin" }}
          >
            {filteredTournaments.map((tournament) => {
              const cardTheme = gameThemes[tournament.game] || gameThemes.default
              const isSelected = tournament.id === selectedTournament.id

              return (
                <button
                  key={tournament.id}
                  onClick={() => setSelectedTournament(tournament)}
                  className={`flex-shrink-0 w-[280px] sm:w-[300px] group relative overflow-hidden rounded-xl transition-all ${
                    isSelected
                      ? "ring-2 ring-blue-500 shadow-xl shadow-blue-500/20 scale-105"
                      : "hover:scale-105 hover:shadow-xl"
                  }`}
                >
                  <div className="relative h-[380px] sm:h-[400px]">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                      style={{
                        backgroundImage: `url(${tournament.thumbnail_url || cardTheme.image})`,
                      }}
                    />
                    
                    <div className={`absolute inset-0 bg-gradient-to-t ${cardTheme.gradient}`} />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />

                    <div className="relative h-full flex flex-col justify-between p-4 sm:p-5">
                      <div className="flex items-start justify-between">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                            tournament.status === "active"
                              ? "bg-green-500/90 text-white"
                              : tournament.status === "upcoming"
                                ? "bg-blue-500/90 text-white"
                                : "bg-slate-500/90 text-white"
                          }`}
                        >
                          {tournament.status}
                        </span>
                        {isSelected && (
                          <div className="bg-blue-500 p-1.5 rounded-full">
                            <Trophy className="w-3.5 h-3.5 text-white" />
                          </div>
                        )}
                      </div>

                      <div>
                        <p className="text-blue-400 text-xs sm:text-sm font-semibold mb-1.5 uppercase tracking-wide">
                          {tournament.game}
                        </p>
                        <h3 className="text-white font-bold text-base sm:text-lg mb-2 line-clamp-2 leading-tight">
                          {tournament.title}
                        </h3>
                        <p className="text-slate-300 text-xs sm:text-sm mb-3 line-clamp-2 leading-relaxed">
                          {tournament.description}
                        </p>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
                          <div>
                            <p className="text-slate-400 text-xs mb-0.5">Prize Pool</p>
                            <p className="text-green-400 font-bold text-sm">
                              {typeof tournament.prize_pool === "string" 
                                ? tournament.prize_pool 
                                : `$${tournament.prize_pool.toLocaleString()}`}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-slate-400 text-xs mb-0.5">Ends</p>
                            <p className="text-slate-200 font-semibold text-xs">
                              {new Date(tournament.end_date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric"
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {filteredTournaments.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-slate-600" />
              </div>
              <p className="text-slate-400 text-lg mb-2">No tournaments found</p>
              <p className="text-slate-500 text-sm">Try adjusting your filters or search query</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
