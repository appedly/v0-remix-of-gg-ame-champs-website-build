"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Trophy, Calendar, Search, X, Filter } from "lucide-react"

type Tournament = {
  id: string
  title: string
  game: string
  description: string | null
  prize_pool: number
  start_date: string
  end_date: string
  status: string
  max_submissions: number | null
  created_at: string
  thumbnail_url?: string | null
}

interface TournamentFeaturedSliderProps {
  tournaments: Tournament[]
}

export function TournamentFeaturedSlider({ tournaments }: TournamentFeaturedSliderProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGame, setSelectedGame] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [prizeRange, setPrizeRange] = useState<[number, number] | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)

  const games = useMemo(() => [...new Set(tournaments.map(t => t.game))], [tournaments])
  const maxPrize = useMemo(() => Math.max(...tournaments.map(t => t.prize_pool)), [tournaments])

  const filteredTournaments = useMemo(() => {
    return tournaments.filter(t => {
      if (searchTerm && !t.title.toLowerCase().includes(searchTerm.toLowerCase())) return false
      if (selectedGame && t.game !== selectedGame) return false
      if (selectedStatus && t.status !== selectedStatus) return false
      if (prizeRange && (t.prize_pool < prizeRange[0] || t.prize_pool > prizeRange[1])) return false
      return true
    })
  }, [tournaments, searchTerm, selectedGame, selectedStatus, prizeRange])

  const displayTournaments = filteredTournaments.length > 0 ? filteredTournaments : tournaments
  const selectedTournament = displayTournaments[Math.min(selectedIndex, displayTournaments.length - 1)] || tournaments[0]

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlay || tournaments.length <= 1) return

    autoPlayRef.current = setInterval(() => {
      setSelectedIndex((prev) => (prev + 1) % tournaments.length)
    }, 6000) // Change every 6 seconds

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current)
    }
  }, [isAutoPlay, tournaments.length])

  // Scroll carousel to show selected item
  useEffect(() => {
    if (!scrollContainerRef.current) return

    const container = scrollContainerRef.current
    const cards = container.querySelectorAll("[data-carousel-item]")
    const selectedCard = cards[selectedIndex] as HTMLElement

    if (selectedCard) {
      selectedCard.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      })
    }
  }, [selectedIndex])

  const handlePrevious = () => {
    setIsAutoPlay(false)
    setSelectedIndex((prev) => (prev - 1 + tournaments.length) % tournaments.length)
  }

  const handleNext = () => {
    setIsAutoPlay(false)
    setSelectedIndex((prev) => (prev + 1) % tournaments.length)
  }

  const handleSelectTournament = (index: number) => {
    setIsAutoPlay(false)
    setSelectedIndex(index)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "upcoming":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "completed":
        return "bg-slate-500/20 text-slate-400 border-slate-500/30"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30"
    }
  }

  const getDaysRemaining = (endDate: string) => {
    const now = new Date()
    const end = new Date(endDate)
    const diffTime = end.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  if (!selectedTournament) {
    return (
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-12 text-center">
        <p className="text-slate-400">No tournaments available</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="space-y-3">
        <div className="flex gap-2 flex-wrap">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search tournaments..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setSelectedIndex(0)
              }}
              className="w-full pl-10 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              showFilters
                ? "bg-blue-600 text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3 space-y-2 text-sm">
            <div>
              <p className="text-slate-400 font-semibold mb-1">Status</p>
              <div className="flex flex-wrap gap-2">
                {["active", "upcoming", "completed"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setSelectedStatus(selectedStatus === status ? null : status)}
                    className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                      selectedStatus === status
                        ? "bg-blue-600 text-white"
                        : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-slate-400 font-semibold mb-1">Game</p>
              <div className="flex flex-wrap gap-2 max-h-[100px] overflow-y-auto">
                {games.map((game) => (
                  <button
                    key={game}
                    onClick={() => setSelectedGame(selectedGame === game ? null : game)}
                    className={`px-3 py-1 rounded text-xs font-medium transition-all whitespace-nowrap ${
                      selectedGame === game
                        ? "bg-blue-600 text-white"
                        : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                    }`}
                  >
                    {game}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hero Banner - Featured Tournament */}
      <div className="relative group overflow-hidden rounded-xl border border-slate-700 bg-gradient-to-r from-slate-800 to-slate-900">
        {/* Background image with overlay */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent z-10"
            style={{
              backgroundImage: selectedTournament.thumbnail_url
                ? `url(${selectedTournament.thumbnail_url})`
                : "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/70 to-slate-900/40" />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-20 px-6 md:px-8 py-6 md:py-8">
          <div className="max-w-3xl">
            {/* Status Badge */}
            <div className="mb-2 inline-block">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                  selectedTournament.status
                )}`}
              >
                {selectedTournament.status.toUpperCase()}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2 leading-tight line-clamp-2">
              {selectedTournament.title}
            </h1>

            {/* Game & Description */}
            <div className="mb-4">
              <p className="text-sm md:text-base text-blue-400 font-semibold mb-1">{selectedTournament.game}</p>
              {selectedTournament.description && (
                <p className="text-xs md:text-sm text-slate-300 max-w-2xl line-clamp-2">
                  {selectedTournament.description}
                </p>
              )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
              <div className="bg-slate-900/60 backdrop-blur rounded p-2 border border-slate-700/50">
                <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1">Prize</p>
                <p className="text-sm md:text-base font-bold text-blue-400">
                  ${(selectedTournament.prize_pool / 1000).toFixed(0)}K
                </p>
              </div>

              <div className="bg-slate-900/60 backdrop-blur rounded p-2 border border-slate-700/50">
                <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1">Start</p>
                <p className="text-xs md:text-sm font-bold text-slate-200">
                  {new Date(selectedTournament.start_date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>

              <div className="bg-slate-900/60 backdrop-blur rounded p-2 border border-slate-700/50">
                <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1">End</p>
                <p className="text-xs md:text-sm font-bold text-slate-200">
                  {new Date(selectedTournament.end_date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>

              <div className="bg-slate-900/60 backdrop-blur rounded p-2 border border-slate-700/50">
                <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1">Days</p>
                <p className="text-xs md:text-sm font-bold text-green-400">
                  {Math.max(0, getDaysRemaining(selectedTournament.end_date))}
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col md:flex-row gap-2">
              <Link
                href={`/tournaments/${selectedTournament.id}`}
                className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded transition-all hover:shadow-lg hover:shadow-blue-500/30 group/btn"
              >
                <span>View</span>
                <span className="ml-1 group-hover/btn:translate-x-0.5 transition-transform text-xs">→</span>
              </Link>

              <button
                onClick={() => setIsAutoPlay(!isAutoPlay)}
                className="inline-flex items-center justify-center px-4 py-2 bg-slate-700/40 hover:bg-slate-700/60 text-white text-sm font-bold rounded transition-all border border-slate-600/50 backdrop-blur"
              >
                {isAutoPlay ? "⏸" : "▶"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Carousel Controls */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-base md:text-lg font-bold text-white">Featured Tournaments</h2>
        <div className="flex items-center gap-1">
          <button
            onClick={handlePrevious}
            disabled={displayTournaments.length <= 1}
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed border border-slate-700"
            aria-label="Previous tournament"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            disabled={displayTournaments.length <= 1}
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed border border-slate-700"
            aria-label="Next tournament"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Carousel - Horizontally Scrollable */}
      <div className="relative group">
        <style>{`
          .tournament-carousel {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          .tournament-carousel::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        <div
          ref={scrollContainerRef}
          className="tournament-carousel flex gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-1"
          style={{
            scrollBehavior: "smooth",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {displayTournaments.map((tournament, index) => (
            <div
              key={tournament.id}
              data-carousel-item
              className="flex-shrink-0 w-60 md:w-72 snap-center"
              onClick={() => handleSelectTournament(index)}
            >
              <div
                className={`relative rounded-lg overflow-hidden border cursor-pointer transition-all duration-300 transform group/card h-full flex flex-col ${
                  selectedIndex === index
                    ? "border-blue-500 shadow-lg shadow-blue-500/30"
                    : "border-slate-700 hover:border-slate-600 hover:scale-105"
                }`}
              >
                {/* Card Image/Background */}
                <div className="relative h-32 bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden flex-shrink-0">
                  {tournament.thumbnail_url && (
                    <img
                      src={tournament.thumbnail_url}
                      alt={tournament.title}
                      className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-300"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

                  {/* Status Badge */}
                  <div className="absolute top-2 right-2">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-semibold border ${getStatusColor(
                        tournament.status
                      )}`}
                    >
                      {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="bg-slate-800 px-3 py-2 border-t border-slate-700 flex-1 flex flex-col">
                  {/* Game Type */}
                  <p className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">
                    {tournament.game}
                  </p>

                  {/* Title */}
                  <h3 className="text-sm font-bold text-white mb-2 line-clamp-2 group-hover/card:text-blue-400 transition-colors flex-1">
                    {tournament.title}
                  </h3>

                  {/* Prize Pool */}
                  <div className="flex items-center gap-1.5 text-blue-400 font-semibold text-xs mb-1">
                    <Trophy className="w-3.5 h-3.5" />
                    <span>${(tournament.prize_pool / 1000).toFixed(0)}K</span>
                  </div>

                  {/* End Date */}
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(tournament.end_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Gradient fade on edges */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-slate-900 to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-900 to-transparent pointer-events-none" />
      </div>

      {/* Indicator Dots */}
      {displayTournaments.length > 1 && (
        <div className="flex justify-center gap-1.5 pt-2">
          {displayTournaments.map((_, index) => (
            <button
              key={index}
              onClick={() => handleSelectTournament(index)}
              className={`h-1.5 rounded-full transition-all ${
                selectedIndex === index
                  ? "bg-blue-500 w-6"
                  : "bg-slate-700 hover:bg-slate-600 w-1.5 hover:w-3"
              }`}
              aria-label={`Go to tournament ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
