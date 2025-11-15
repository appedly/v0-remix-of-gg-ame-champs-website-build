"use client"

import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { UserNav } from "@/components/user-nav"
import { Search, Filter, ChevronLeft, ChevronRight, Trophy, Calendar, DollarSign, Gamepad2, Clock, Users, X, Play, Info, Star, ExternalLink, TrendingUp, Sparkles } from "lucide-react"
import Link from "next/link"

interface Tournament {
  id: string
  title: string
  game: string
  description: string
  prize_pool: number
  status: "active" | "upcoming" | "completed"
  start_date: string
  end_date: string
  image_url?: string
}

const gameImages: { [key: string]: string } = {
  "Fortnite": "/generic-battle-royale.png",
  "Valorant": "/valorant-game.jpg",
  "Call of Duty": "/call-of-duty-game.jpg",
  "Apex Legends": "/futuristic-battle-arena.png",
  "League of Legends": "/league-of-legends-game.jpg",
  "CS2": "/tactical-shooter-scene.png",
  "Overwatch 2": "/overwatch-2-game.jpg",
  "Rocket League": "/rocket-league-game.jpg",
  "Minecraft": "/minecraft-game.jpg",
  "FIFA": "/fifa-game.jpg",
  "NBA 2K": "/nba-2k-game.jpg",
  "Madden": "/madden-game.jpg",
  "Fortnite Creative": "/generic-battle-royale.png",
  "Warzone": "/call-of-duty-game.jpg",
}

// Function to get tournament image with fallback to game image
const getTournamentImage = (tournament: Tournament) => {
  // Use custom tournament image if available (admin uploaded)
  if (tournament.image_url && tournament.image_url.trim() !== "") {
    return tournament.image_url
  }
  // Fallback to game-specific image
  return gameImages[tournament.game] || "/placeholder.jpg"
}

// Recommended image sizes for tournaments
// For custom tournament images: 1024x576 (16:9 aspect ratio) works best
// This provides good quality while maintaining reasonable file size
// For hero section display, this size ensures sharp images on most screens

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [filteredTournaments, setFilteredTournaments] = useState<Tournament[]>([])
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [userData, setUserData] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterGame, setFilterGame] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterPrize, setFilterPrize] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [currentTournamentIndex, setCurrentTournamentIndex] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchUser()
    fetchTournaments()
  }, [])

  useEffect(() => {
    filterTournaments()
  }, [tournaments, searchTerm, filterGame, filterStatus, filterPrize])

  useEffect(() => {
    if (filteredTournaments.length > 0 && !selectedTournament) {
      setSelectedTournament(filteredTournaments[0])
      setCurrentTournamentIndex(0)
    }
  }, [filteredTournaments])

  // Auto-rotate tournaments every 8 seconds with smooth transitions
  useEffect(() => {
    if (filteredTournaments.length === 0) return

    const interval = setInterval(() => {
      setCurrentTournamentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % filteredTournaments.length
        setSelectedTournament(filteredTournaments[nextIndex])
        return nextIndex
      })
    }, 8000)

    return () => clearInterval(interval)
  }, [filteredTournaments])

  // Auto-scroll to selected tournament with smooth behavior
  useEffect(() => {
    if (selectedTournament && carouselRef.current) {
      const selectedElement = carouselRef.current.querySelector(`[data-tournament-id="${selectedTournament.id}"]`)
      if (selectedElement) {
        setTimeout(() => {
          selectedElement.scrollIntoView({ 
            behavior: 'smooth', 
            inline: 'center', 
            block: 'nearest' 
          })
        }, 100)
      }
    }
  }, [selectedTournament])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setCurrentTournamentIndex((prevIndex) => {
          const newIndex = prevIndex === 0 ? filteredTournaments.length - 1 : prevIndex - 1
          setSelectedTournament(filteredTournaments[newIndex])
          return newIndex
        })
      } else if (e.key === "ArrowRight") {
        setCurrentTournamentIndex((prevIndex) => {
          const newIndex = (prevIndex + 1) % filteredTournaments.length
          setSelectedTournament(filteredTournaments[newIndex])
          return newIndex
        })
      } else if (e.key === "Escape" && showModal) {
        setShowModal(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [showModal, filteredTournaments])

  const fetchUser = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    
    if (user) {
      const { data: userData } = await supabase.from("users").select("*").eq("id", user.id).single()
      setUserData(userData)
    }
  }

  const fetchTournaments = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("tournaments")
      .select("*")
      .order("start_date", { ascending: false })

    if (error) {
      console.error("Error fetching tournaments:", error)
    } else {
      setTournaments(data || [])
    }
    setLoading(false)
  }

  const filterTournaments = () => {
    let filtered = [...tournaments]

    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.game.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (filterGame !== "all") {
      filtered = filtered.filter(t => t.game === filterGame)
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter(t => t.status === filterStatus)
    }

    if (filterPrize !== "all") {
      filtered = filtered.filter(t => {
        if (filterPrize === "small") return t.prize_pool < 1000
        if (filterPrize === "medium") return t.prize_pool >= 1000 && t.prize_pool < 5000
        if (filterPrize === "large") return t.prize_pool >= 5000 && t.prize_pool < 10000
        if (filterPrize === "huge") return t.prize_pool >= 10000
        return true
      })
    }

    setFilteredTournaments(filtered)
  }

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "active": 
        return { 
          bg: "bg-blue-600", 
          text: "text-white",
          border: "border-blue-600"
        }
      case "upcoming": 
        return { 
          bg: "bg-slate-600", 
          text: "text-white",
          border: "border-slate-600"
        }
      case "completed": 
        return { 
          bg: "bg-slate-700", 
          text: "text-white",
          border: "border-slate-700"
        }
      default: 
        return { 
          bg: "bg-slate-700", 
          text: "text-white",
          border: "border-slate-700"
        }
    }
  }

  const openTournamentModal = (tournament: Tournament) => {
    setSelectedTournament(tournament)
    setShowModal(true)
  }

  const uniqueGames = Array.from(new Set(tournaments.map(t => t.game)))

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900">
        <UserNav userName="User" />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="relative mb-8">
              <div className="w-20 h-20 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Trophy className="w-8 h-8 text-blue-400" />
              </div>
            </div>
            <div className="text-white text-xl font-bold mb-2">Loading Tournaments...</div>
            <div className="text-slate-400 text-sm animate-pulse">Preparing your gaming experience</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <UserNav userName={userData?.display_name || "User"} />

      {/* Hero Section - Clean and Simple */}
      <div className="relative h-96 overflow-hidden">
        {selectedTournament && (
          <>
            {/* Clean Game Image Background */}
            <div className="absolute inset-0">
              <img
                src={getTournamentImage(selectedTournament)}
                alt={`${selectedTournament.game} tournament`}
                className="w-full h-full object-cover transition-transform duration-1000 ease-out hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900/40 via-transparent to-slate-900/40"></div>
            </div>

            {/* Hero Content - Simple and Clean */}
            <div className="relative z-10 h-full flex items-center">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-1 h-8 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full"></div>
                      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                        {selectedTournament.title}
                      </h1>
                    </div>
                    <div className={`px-4 py-2 rounded-full ${getStatusStyles(selectedTournament.status).bg} ${getStatusStyles(selectedTournament.status).border} border-2 shadow-lg backdrop-blur-sm`}>
                      <span className="text-white font-bold text-sm uppercase tracking-wide flex items-center gap-2">
                        {selectedTournament.status === "active" && <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>}
                        {selectedTournament.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-2 px-3 py-1 bg-slate-800/60 backdrop-blur-sm rounded-lg border border-slate-700">
                      <Gamepad2 className="w-5 h-5 text-blue-400" />
                      <span className="text-lg font-semibold text-white">{selectedTournament.game}</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-slate-800/60 backdrop-blur-sm rounded-lg border border-slate-700">
                      <Sparkles className="w-4 h-4 text-yellow-400" />
                      <span className="text-white/90 text-sm font-medium">Featured Tournament</span>
                    </div>
                  </div>
                  
                  {selectedTournament.description && (
                    <p className="text-white/90 mb-6 max-w-3xl leading-relaxed">
                      {selectedTournament.description}
                    </p>
                  )}

                  {/* Enhanced Info Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 border border-slate-700 hover:border-yellow-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/10">
                      <div className="flex items-center justify-between mb-2">
                        <Trophy className="w-5 h-5 text-yellow-400" />
                        <div className="w-2 h-2 bg-yellow-400/50 rounded-full"></div>
                      </div>
                      <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">Prize Pool</p>
                      <p className="text-xl font-bold text-yellow-400">${selectedTournament.prize_pool.toLocaleString()}</p>
                    </div>
                    <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 border border-slate-700 hover:border-blue-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
                      <div className="flex items-center justify-between mb-2">
                        <Calendar className="w-5 h-5 text-blue-400" />
                        <div className="w-2 h-2 bg-blue-400/50 rounded-full"></div>
                      </div>
                      <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">Start Date</p>
                      <p className="text-sm font-semibold text-white">{new Date(selectedTournament.start_date).toLocaleDateString()}</p>
                    </div>
                    <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 border border-slate-700 hover:border-red-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/10">
                      <div className="flex items-center justify-between mb-2">
                        <Clock className="w-5 h-5 text-red-400" />
                        <div className="w-2 h-2 bg-red-400/50 rounded-full"></div>
                      </div>
                      <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">End Date</p>
                      <p className="text-sm font-semibold text-white">{new Date(selectedTournament.end_date).toLocaleDateString()}</p>
                    </div>
                    <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 border border-slate-700 hover:border-green-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10">
                      <div className="flex items-center justify-between mb-2">
                        <Users className="w-5 h-5 text-green-400" />
                        <div className="w-2 h-2 bg-green-400/50 rounded-full"></div>
                      </div>
                      <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">Type</p>
                      <p className="text-sm font-semibold text-white capitalize">{selectedTournament.status}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <button
                      onClick={() => openTournamentModal(selectedTournament)}
                      className="group relative px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
                    >
                      <span className="relative z-10">{selectedTournament.status === "active" ? "Join Tournament" : selectedTournament.status === "upcoming" ? "View Details" : "View Results"}</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur"></div>
                    </button>
                    <button
                      onClick={() => openTournamentModal(selectedTournament)}
                      className="px-6 py-3 bg-slate-700/80 backdrop-blur-sm hover:bg-slate-600 text-white font-bold rounded-lg transition-all duration-300 border border-slate-600 hover:border-slate-500 transform hover:scale-105"
                    >
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Enhanced Filter Bar */}
      <div className="sticky top-0 z-40 bg-slate-800/95 backdrop-blur-md border-b border-slate-700/50 shadow-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tournaments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-700/80 backdrop-blur-sm border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-slate-700 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
              />
            </div>

            <div className="flex gap-3 items-center w-full lg:w-auto justify-between lg:justify-end">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-700/50 backdrop-blur-sm rounded-lg border border-slate-600/30">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-slate-300 text-sm font-medium">
                  {filteredTournaments.length} {filteredTournaments.length === 1 ? 'tournament' : 'tournaments'}
                </span>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2.5 transition-all duration-300 rounded-lg border ${
                  showFilters 
                    ? 'bg-blue-600/20 border-blue-500/50 text-blue-400' 
                    : 'bg-slate-700/80 backdrop-blur-sm hover:bg-slate-600/80 border-slate-600/50 text-white'
                }`}
              >
                <Filter className={`w-4 h-4 ${showFilters ? 'text-blue-400' : ''}`} />
                <span className="hidden sm:inline">Filters</span>
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 p-4 bg-slate-700/80 backdrop-blur-sm rounded-xl border border-slate-600/50 shadow-xl animate-in slide-in-from-top-2 duration-300">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    <Gamepad2 className="inline w-4 h-4 mr-1 text-blue-400" />
                    Game
                  </label>
                  <select
                    value={filterGame}
                    onChange={(e) => setFilterGame(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-600/80 backdrop-blur-sm border border-slate-500/50 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                  >
                    <option value="all">All Games</option>
                    {uniqueGames.map(game => (
                      <option key={game} value={game}>{game}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    <Star className="inline w-4 h-4 mr-1 text-yellow-400" />
                    Status
                  </label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-600/80 backdrop-blur-sm border border-slate-500/50 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    <Trophy className="inline w-4 h-4 mr-1 text-yellow-400" />
                    Prize Pool
                  </label>
                  <select
                    value={filterPrize}
                    onChange={(e) => setFilterPrize(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-600/80 backdrop-blur-sm border border-slate-500/50 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                  >
                    <option value="all">All Prizes</option>
                    <option value="small">Under $1,000</option>
                    <option value="medium">$1,000 - $5,000</option>
                    <option value="large">$5,000 - $10,000</option>
                    <option value="huge">$10,000+</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSearchTerm("")
                      setFilterGame("all")
                      setFilterStatus("all")
                      setFilterPrize("all")
                    }}
                    className="w-full px-3 py-2 bg-slate-600/80 backdrop-blur-sm hover:bg-slate-500/80 text-white rounded-lg transition-all duration-300 border border-slate-500/50 hover:border-slate-400/50 transform hover:scale-105"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tournament Cards */}
      <div className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full"></div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">Tournaments</h2>
              </div>
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-800/60 backdrop-blur-sm rounded-lg border border-slate-700">
                <span className="text-slate-400 text-sm">Use</span>
                <kbd className="px-2 py-0.5 bg-slate-700 rounded text-xs text-slate-300">←</kbd>
                <kbd className="px-2 py-0.5 bg-slate-700 rounded text-xs text-slate-300">→</kbd>
                <span className="text-slate-400 text-sm">to navigate</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Tournament count */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-800/60 backdrop-blur-sm rounded-lg border border-slate-700">
                <span className="text-slate-300 text-sm font-medium">
                  {currentTournamentIndex + 1} / {filteredTournaments.length}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const newIndex = currentTournamentIndex === 0 ? filteredTournaments.length - 1 : currentTournamentIndex - 1
                    setCurrentTournamentIndex(newIndex)
                    setSelectedTournament(filteredTournaments[newIndex])
                  }}
                  className="p-2 bg-slate-700/80 backdrop-blur-sm hover:bg-slate-600 border border-slate-600 text-white rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    const newIndex = (currentTournamentIndex + 1) % filteredTournaments.length
                    setCurrentTournamentIndex(newIndex)
                    setSelectedTournament(filteredTournaments[newIndex])
                  }}
                  className="p-2 bg-slate-700/80 backdrop-blur-sm hover:bg-slate-600 border border-slate-600 text-white rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Horizontal Tournament Scroller */}
          <div className="relative" ref={carouselRef}>
            <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 scroll-smooth">
              {filteredTournaments.map((tournament, index) => (
              <div
                key={tournament.id}
                data-tournament-id={tournament.id}
                onClick={() => {
                  setSelectedTournament(tournament)
                  setCurrentTournamentIndex(index)
                }}
                className={`group cursor-pointer transition-all duration-300 ease-out flex-shrink-0 w-80 ${
                  selectedTournament?.id === tournament.id 
                    ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-900 scale-105" 
                    : ""
                }`}
              >
                <div className="bg-slate-800/90 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden hover:border-blue-500/50 transition-all duration-300 ease-out hover:shadow-lg hover:shadow-blue-500/10 h-full">
                  {/* Enhanced Game Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={getTournamentImage(tournament)}
                      alt={`${tournament.game} tournament`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                    
                    {/* Removed hover overlay to prevent unwanted effects */}
                  </div>

                  {/* Enhanced Content */}
                  <div className="p-4">
                    {/* Status Badge - Positioned below image */}
                    <div className="flex justify-center mb-3">
                      <div className={`px-3 py-1 rounded-full ${getStatusStyles(tournament.status).bg} ${getStatusStyles(tournament.status).border} border backdrop-blur-sm shadow-md transition-all duration-300 ${
                        tournament.status === "active" ? "animate-pulse" : ""
                      }`}>
                        <span className="text-white font-bold text-xs uppercase tracking-wide flex items-center gap-1.5">
                          {tournament.status === "active" && <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>}
                          {tournament.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full"></div>
                      <h3 className="text-lg font-bold text-white">{tournament.game}</h3>
                    </div>
                    <h4 className="text-base font-semibold text-white/90 mb-4 line-clamp-1 leading-tight">{tournament.title}</h4>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-700/60 backdrop-blur-sm rounded-lg border border-slate-600/30">
                        <Trophy className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-400 font-semibold text-sm">${tournament.prize_pool.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-700/60 backdrop-blur-sm rounded-lg border border-slate-600/30">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-400 text-sm">{new Date(tournament.end_date).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          openTournamentModal(tournament)
                        }}
                        className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-lg transition-all duration-300 ease-out transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 border border-blue-500/30"
                      >
                        <span className="relative z-10">
                          {tournament.status === "active" ? "Join Now" : tournament.status === "upcoming" ? "View Details" : "View Results"}
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur"></div>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          openTournamentModal(tournament)
                        }}
                        className="px-4 py-2.5 bg-slate-700/80 backdrop-blur-sm hover:bg-slate-600 text-white font-semibold rounded-lg transition-all duration-300 ease-out border border-slate-600/50 hover:border-slate-500 transform hover:scale-105"
                      >
                        Learn More
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              ))}
            </div>
            
            {/* Scroll indicators */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent w-12 h-32 pointer-events-none"></div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-gradient-to-l from-slate-900 via-slate-900/80 to-transparent w-12 h-32 pointer-events-none"></div>
          </div>
        </div>

        {filteredTournaments.length === 0 && (
          <div className="w-full py-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto">
                  <Trophy className="w-10 h-10 text-slate-400" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-slate-600 rounded-full flex items-center justify-center">
                  <X className="w-3 h-3 text-slate-400" />
                </div>
              </div>
              <p className="text-slate-400 text-lg font-medium mb-2">No tournaments found</p>
              <p className="text-slate-500 text-sm mb-4">Try adjusting your filters or search terms</p>
              <button
                onClick={() => {
                  setSearchTerm("")
                  setFilterGame("all")
                  setFilterStatus("all")
                  setFilterPrize("all")
                }}
                className="px-4 py-2 bg-slate-700/80 backdrop-blur-sm hover:bg-slate-600 text-white rounded-lg transition-all duration-300 border border-slate-600 hover:border-slate-500 transform hover:scale-105"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Tournament Details Modal */}
      {showModal && selectedTournament && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-800/95 backdrop-blur-md rounded-xl border border-slate-700/50 shadow-2xl animate-in zoom-in-95 duration-300">
            {/* Enhanced Modal Header */}
            <div className="relative h-56 overflow-hidden">
              <div className="absolute inset-0">
                <img
                  src={getTournamentImage(selectedTournament)}
                  alt={`${selectedTournament.game} tournament`}
                  className="w-full h-full object-cover transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/40 via-transparent to-slate-900/40"></div>
              </div>
              
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 p-2.5 bg-slate-700/80 backdrop-blur-sm hover:bg-slate-600/80 rounded-full text-white transition-all duration-300 transform hover:scale-110 border border-slate-600/50"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-1 h-6 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full"></div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">{selectedTournament.title}</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  <div className={`px-3 py-1 rounded-full ${getStatusStyles(selectedTournament.status).bg} ${getStatusStyles(selectedTournament.status).border} border backdrop-blur-sm shadow-lg`}>
                    <span className="text-white font-bold text-sm uppercase tracking-wide flex items-center gap-1.5">
                      {selectedTournament.status === "active" && <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>}
                      {selectedTournament.status}
                    </span>
                  </div>
                  <div className="px-3 py-1 bg-slate-700/80 backdrop-blur-sm rounded-full border border-slate-600/50">
                    <span className="text-white font-bold text-sm">{selectedTournament.game}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Modal Content */}
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-1 h-5 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full"></div>
                      <h3 className="text-lg font-bold text-white">About This Tournament</h3>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      {selectedTournament.description || "Compete in this exciting tournament and showcase your skills. Join players from around the world in thrilling matches for a chance to win amazing prizes and claim victory!"}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-700/80 backdrop-blur-sm rounded-xl p-3 border border-slate-600/50 hover:border-yellow-500/30 transition-all duration-300">
                      <div className="flex items-center justify-between mb-2">
                        <Trophy className="w-5 h-5 text-yellow-400" />
                        <div className="w-2 h-2 bg-yellow-400/50 rounded-full"></div>
                      </div>
                      <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">Prize Pool</p>
                      <p className="text-xl font-bold text-yellow-400">${selectedTournament.prize_pool.toLocaleString()}</p>
                    </div>
                    <div className="bg-slate-700/80 backdrop-blur-sm rounded-xl p-3 border border-slate-600/50 hover:border-blue-500/30 transition-all duration-300">
                      <div className="flex items-center justify-between mb-2">
                        <Calendar className="w-5 h-5 text-blue-400" />
                        <div className="w-2 h-2 bg-blue-400/50 rounded-full"></div>
                      </div>
                      <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">Start Date</p>
                      <p className="text-sm font-semibold text-white">{new Date(selectedTournament.start_date).toLocaleDateString()}</p>
                    </div>
                    <div className="bg-slate-700/80 backdrop-blur-sm rounded-xl p-3 border border-slate-600/50 hover:border-red-500/30 transition-all duration-300">
                      <div className="flex items-center justify-between mb-2">
                        <Clock className="w-5 h-5 text-red-400" />
                        <div className="w-2 h-2 bg-red-400/50 rounded-full"></div>
                      </div>
                      <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">End Date</p>
                      <p className="text-sm font-semibold text-white">{new Date(selectedTournament.end_date).toLocaleDateString()}</p>
                    </div>
                    <div className="bg-slate-700/80 backdrop-blur-sm rounded-xl p-3 border border-slate-600/50 hover:border-green-500/30 transition-all duration-300">
                      <div className="flex items-center justify-between mb-2">
                        <Users className="w-5 h-5 text-green-400" />
                        <div className="w-2 h-2 bg-green-400/50 rounded-full"></div>
                      </div>
                      <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">Status</p>
                      <p className="text-sm font-semibold text-white capitalize">{selectedTournament.status}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-1 h-5 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full"></div>
                      <h3 className="text-lg font-bold text-white">How to Participate</h3>
                    </div>
                    <ul className="space-y-3 text-slate-300">
                      <li className="flex items-start gap-3 group">
                        <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-blue-500/30 transition-colors duration-200">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        </div>
                        <span className="group-hover:text-white transition-colors duration-200">Register for tournament using "Join Tournament" button</span>
                      </li>
                      <li className="flex items-start gap-3 group">
                        <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-blue-500/30 transition-colors duration-200">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        </div>
                        <span className="group-hover:text-white transition-colors duration-200">Submit your best gameplay clips before the deadline</span>
                      </li>
                      <li className="flex items-start gap-3 group">
                        <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-blue-500/30 transition-colors duration-200">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        </div>
                        <span className="group-hover:text-white transition-colors duration-200">Vote for other submissions to increase engagement</span>
                      </li>
                      <li className="flex items-start gap-3 group">
                        <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-blue-500/30 transition-colors duration-200">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        </div>
                        <span className="group-hover:text-white transition-colors duration-200">Win prizes based on community votes and rankings</span>
                      </li>
                    </ul>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Link
                      href={`/tournaments/${selectedTournament.id}`}
                      className="group relative px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 text-center"
                    >
                      <span className="relative z-10">{selectedTournament.status === "active" ? "Join Tournament Now" : selectedTournament.status === "upcoming" ? "View Full Details" : "View Results"}</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur"></div>
                    </Link>
                    
                    <button
                      onClick={() => setShowModal(false)}
                      className="px-6 py-3 bg-slate-700/80 backdrop-blur-sm hover:bg-slate-600 text-white font-bold rounded-lg transition-all duration-300 border border-slate-600 hover:border-slate-500 transform hover:scale-105"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .drop-shadow-lg {
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        @keyframes animate-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-in {
          animation: animate-in 0.3s ease-out;
        }
        .fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .zoom-in-95 {
          animation: zoom-in-95 0.3s ease-out;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes zoom-in-95 {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .slide-in-from-top-2 {
          animation: slide-in-from-top-2 0.3s ease-out;
        }
        @keyframes slide-in-from-top-2 {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}