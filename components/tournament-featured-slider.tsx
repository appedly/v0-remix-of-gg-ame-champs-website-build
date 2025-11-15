"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Trophy, Calendar, Trophy as TrophyIcon } from "lucide-react"

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
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)

  const selectedTournament = tournaments[selectedIndex] || tournaments[0]

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
    <div className="space-y-8">
      {/* Hero Banner - Featured Tournament */}
      <div className="relative group overflow-hidden rounded-2xl border border-slate-700 bg-gradient-to-r from-slate-800 to-slate-900">
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
        <div className="relative z-20 px-8 md:px-12 py-12 md:py-16 lg:py-20">
          <div className="max-w-3xl">
            {/* Status Badge */}
            <div className="mb-4 inline-block">
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(
                  selectedTournament.status
                )}`}
              >
                {selectedTournament.status.toUpperCase()}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-4 leading-tight">
              {selectedTournament.title}
            </h1>

            {/* Game & Description */}
            <div className="mb-8">
              <p className="text-xl md:text-2xl text-blue-400 font-semibold mb-3">{selectedTournament.game}</p>
              {selectedTournament.description && (
                <p className="text-lg md:text-xl text-slate-300 max-w-2xl leading-relaxed">
                  {selectedTournament.description}
                </p>
              )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
              <div className="bg-slate-900/60 backdrop-blur rounded-lg p-4 border border-slate-700/50">
                <p className="text-slate-400 text-xs md:text-sm uppercase tracking-widest font-semibold mb-2">
                  Prize Pool
                </p>
                <p className="text-2xl md:text-3xl font-bold text-blue-400">
                  ${selectedTournament.prize_pool.toLocaleString()}
                </p>
              </div>

              <div className="bg-slate-900/60 backdrop-blur rounded-lg p-4 border border-slate-700/50">
                <p className="text-slate-400 text-xs md:text-sm uppercase tracking-widest font-semibold mb-2">
                  Start Date
                </p>
                <p className="text-lg md:text-xl font-bold text-slate-200">
                  {new Date(selectedTournament.start_date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>

              <div className="bg-slate-900/60 backdrop-blur rounded-lg p-4 border border-slate-700/50">
                <p className="text-slate-400 text-xs md:text-sm uppercase tracking-widest font-semibold mb-2">
                  End Date
                </p>
                <p className="text-lg md:text-xl font-bold text-slate-200">
                  {new Date(selectedTournament.end_date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>

              <div className="bg-slate-900/60 backdrop-blur rounded-lg p-4 border border-slate-700/50">
                <p className="text-slate-400 text-xs md:text-sm uppercase tracking-widest font-semibold mb-2">
                  Days Left
                </p>
                <p className="text-lg md:text-xl font-bold text-green-400">
                  {Math.max(0, getDaysRemaining(selectedTournament.end_date))}
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col md:flex-row gap-4">
              <Link
                href={`/tournaments/${selectedTournament.id}`}
                className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all hover:shadow-lg hover:shadow-blue-500/30 group/btn"
              >
                <span>View Tournament</span>
                <span className="ml-2 group-hover/btn:translate-x-1 transition-transform">→</span>
              </Link>

              <button
                onClick={() => setIsAutoPlay(!isAutoPlay)}
                className="inline-flex items-center justify-center px-8 py-4 bg-slate-700/40 hover:bg-slate-700/60 text-white font-bold rounded-lg transition-all border border-slate-600/50 backdrop-blur"
              >
                {isAutoPlay ? "Pause" : "Auto Play"}
              </button>
            </div>
          </div>
        </div>

        {/* Animated gradient accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      </div>

      {/* Carousel Controls */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white">More Tournaments</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevious}
            disabled={tournaments.length <= 1}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed border border-slate-700"
            aria-label="Previous tournament"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            disabled={tournaments.length <= 1}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed border border-slate-700"
            aria-label="Next tournament"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Carousel - Horizontally Scrollable */}
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory"
          style={{
            scrollBehavior: "smooth",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {tournaments.map((tournament, index) => (
            <div
              key={tournament.id}
              data-carousel-item
              className="flex-shrink-0 w-80 snap-center"
              onClick={() => handleSelectTournament(index)}
            >
              <div
                className={`relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all duration-300 transform group ${
                  selectedIndex === index
                    ? "border-blue-500 shadow-lg shadow-blue-500/30 scale-100"
                    : "border-slate-700 hover:border-slate-600 hover:scale-105"
                }`}
              >
                {/* Card Image/Background */}
                <div className="relative h-48 bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
                  {tournament.thumbnail_url && (
                    <img
                      src={tournament.thumbnail_url}
                      alt={tournament.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                        tournament.status
                      )}`}
                    >
                      {tournament.status}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="bg-slate-800 p-4 border-t border-slate-700">
                  {/* Game Type */}
                  <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-2">
                    {tournament.game}
                  </p>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
                    {tournament.title}
                  </h3>

                  {/* Prize Pool */}
                  <div className="flex items-center gap-2 mb-3 text-blue-400 font-semibold">
                    <Trophy className="w-4 h-4" />
                    <span>${tournament.prize_pool.toLocaleString()}</span>
                  </div>

                  {/* End Date */}
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>Ends {new Date(tournament.end_date).toLocaleDateString()}</span>
                  </div>

                  {/* Selection Indicator */}
                  {selectedIndex === index && (
                    <div className="mt-3 pt-3 border-t border-slate-700 text-center">
                      <p className="text-blue-400 text-xs font-bold uppercase tracking-widest">Selected</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Gradient fade on edges */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-slate-900 to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-slate-900 to-transparent pointer-events-none" />
      </div>

      {/* Indicator Dots */}
      <div className="flex justify-center gap-2 pt-6">
        {tournaments.map((_, index) => (
          <button
            key={index}
            onClick={() => handleSelectTournament(index)}
            className={`h-2 rounded-full transition-all ${
              selectedIndex === index
                ? "bg-blue-500 w-8"
                : "bg-slate-700 hover:bg-slate-600 w-2 hover:w-4"
            }`}
            aria-label={`Go to tournament ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
