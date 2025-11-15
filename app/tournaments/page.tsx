"use client"

import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { UserNav } from "@/components/user-nav"
import { Search, Filter, ChevronLeft, ChevronRight, Trophy, Calendar, DollarSign, Gamepad2, Clock, Users, X, Play, Info, Star, ArrowLeft, ArrowRight, Sparkles } from "lucide-react"
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
  "Minecraft": "/placeholder.jpg",
  "FIFA": "/placeholder.jpg",
  "NBA 2K": "/placeholder.jpg",
  "Madden": "/placeholder.jpg",
  "Fortnite Creative": "/generic-battle-royale.png",
  "Warzone": "/call-of-duty-game.jpg",
}

const siteTheme = {
  primary: "from-blue-600 via-cyan-600 to-purple-600",
  secondary: "from-purple-600 via-pink-600 to-blue-600",
  accent: "cyan-400",
  glass: "rgba(59, 130, 246, 0.1)",
  glassBorder: "rgba(59, 130, 246, 0.2)",
  textPrimary: "text-white",
  textSecondary: "text-blue-200",
  shadow: "shadow-cyan-500/25",
  glow: "shadow-cyan-400/30"
}

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
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const carouselRef = useRef<HTMLDivElement>(null)
  const [isAutoScrolling, setIsAutoScrolling] = useState(true)

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
    }
  }, [filteredTournaments])

  useEffect(() => {
    if (!isAutoScrolling || !carouselRef.current) return

    const scrollContainer = carouselRef.current
    let scrollAmount = 0
    const scrollSpeed = 0.3

    const scroll = () => {
      if (!scrollContainer) return
      
      scrollAmount += scrollSpeed
      const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth
      
      if (scrollAmount >= maxScroll) {
        scrollAmount = 0
      }
      
      scrollContainer.scrollLeft = scrollAmount
    }

    const interval = setInterval(scroll, 30)
    return () => clearInterval(interval)
  }, [isAutoScrolling, filteredTournaments])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        scrollCarousel("left")
      } else if (e.key === "ArrowRight") {
        scrollCarousel("right")
      } else if (e.key === "Escape" && showModal) {
        setShowModal(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [showModal])

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

  const scrollCarousel = (direction: "left" | "right") => {
    setIsAutoScrolling(false)
    if (carouselRef.current) {
      const scrollAmount = 420
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      })
      setTimeout(() => setIsAutoScrolling(true), 5000)
    }
  }

  const handleCarouselInteraction = () => {
    setIsAutoScrolling(false)
    setTimeout(() => setIsAutoScrolling(true), 5000)
  }

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "active": 
        return { 
          bg: "bg-gradient-to-r from-green-500 to-emerald-500", 
          text: "text-white",
          shadow: "shadow-green-500/40"
        }
      case "upcoming": 
        return { 
          bg: "bg-gradient-to-r from-blue-500 to-cyan-500", 
          text: "text-white",
          shadow: "shadow-blue-500/40"
        }
      case "completed": 
        return { 
          bg: "bg-gradient-to-r from-gray-500 to-slate-500", 
          text: "text-white",
          shadow: "shadow-gray-500/40"
        }
      default: 
        return { 
          bg: "bg-gradient-to-r from-gray-500 to-slate-500", 
          text: "text-white",
          shadow: "shadow-gray-500/40"
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
      <div className={`min-h-screen bg-gradient-to-br ${siteTheme.primary}`}>
        <UserNav userName="User" />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className={`w-20 h-20 border-4 border-${siteTheme.accent} border-t-transparent rounded-full animate-spin mx-auto mb-6`}></div>
            <div className={`${siteTheme.textPrimary} text-xl font-bold`}>Loading Tournaments...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${siteTheme.primary} ${siteTheme.textPrimary}`}>
      <UserNav userName={userData?.display_name || "User"} />

      {/* Hero Section - Clean Game Image Background */}
      <div className="relative h-[500px] overflow-hidden">
        {selectedTournament && (
          <>
            {/* Clean Game Image - No Overlays */}
            <div className="absolute inset-0">
              <img
                src={gameImages[selectedTournament.game] || "/placeholder.jpg"}
                alt={selectedTournament.game}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Hero Content with Glassmorphism */}
            <div className="relative z-10 h-full flex items-center">
              <div className="container mx-auto px-6 lg:px-8">
                <div className="max-w-5xl">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                    <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white drop-shadow-2xl leading-tight">
                      {selectedTournament.title}
                    </h1>
                    <div className={`px-6 py-3 rounded-full ${getStatusStyles(selectedTournament.status).bg} ${getStatusStyles(selectedTournament.status).shadow} shadow-2xl`}>
                      <span className="text-white font-bold text-sm uppercase tracking-wider">
                        {selectedTournament.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 mb-8">
                    <Gamepad2 className="w-6 h-6 text-white/90" />
                    <span className="text-xl font-semibold text-white">{selectedTournament.game}</span>
                    <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                    <Sparkles className="w-5 h-5 text-cyan-400" />
                    <span className="text-white/90">Featured Tournament</span>
                  </div>
                  
                  {selectedTournament.description && (
                    <p className="text-lg sm:text-xl text-white/95 mb-8 max-w-3xl leading-relaxed">
                      {selectedTournament.description}
                    </p>
                  )}

                  {/* Glassmorphism Info Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className={`bg-gradient-to-br ${siteTheme.glass} backdrop-blur-lg rounded-2xl p-5 border ${siteTheme.glassBorder} shadow-lg`}>
                      <Trophy className="w-6 h-6 text-yellow-400 mb-3" />
                      <p className="text-white/70 text-sm font-medium mb-2">Prize Pool</p>
                      <p className="text-3xl font-black text-yellow-400">${selectedTournament.prize_pool.toLocaleString()}</p>
                    </div>
                    <div className={`bg-gradient-to-br ${siteTheme.glass} backdrop-blur-lg rounded-2xl p-5 border ${siteTheme.glassBorder} shadow-lg`}>
                      <Calendar className="w-6 h-6 text-cyan-400 mb-3" />
                      <p className="text-white/70 text-sm font-medium mb-2">Start Date</p>
                      <p className="text-xl font-bold text-white">{new Date(selectedTournament.start_date).toLocaleDateString()}</p>
                    </div>
                    <div className={`bg-gradient-to-br ${siteTheme.glass} backdrop-blur-lg rounded-2xl p-5 border ${siteTheme.glassBorder} shadow-lg`}>
                      <Clock className="w-6 h-6 text-red-400 mb-3" />
                      <p className="text-white/70 text-sm font-medium mb-2">End Date</p>
                      <p className="text-xl font-bold text-white">{new Date(selectedTournament.end_date).toLocaleDateString()}</p>
                    </div>
                    <div className={`bg-gradient-to-br ${siteTheme.glass} backdrop-blur-lg rounded-2xl p-5 border ${siteTheme.glassBorder} shadow-lg`}>
                      <Users className="w-6 h-6 text-green-400 mb-3" />
                      <p className="text-white/70 text-sm font-medium mb-2">Type</p>
                      <p className="text-xl font-bold text-white capitalize">{selectedTournament.status}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <button
                      onClick={() => openTournamentModal(selectedTournament)}
                      className={`group relative px-8 py-4 bg-gradient-to-r ${siteTheme.secondary} text-white font-bold text-lg rounded-2xl shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-3xl ${siteTheme.glow}`}
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        {selectedTournament.status === "active" ? <><Play className="w-5 h-5" /> Join Tournament</> : selectedTournament.status === "upcoming" ? <><Info className="w-5 h-5" /> View Details</> : <><Trophy className="w-5 h-5" /> View Results</>}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>
                    <button
                      onClick={() => openTournamentModal(selectedTournament)}
                      className={`px-8 py-4 bg-gradient-to-br ${siteTheme.glass} backdrop-blur-lg border-2 ${siteTheme.glassBorder} text-white font-bold text-lg rounded-2xl hover:bg-white/20 transition-all duration-300 shadow-lg`}
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

      {/* Floating Filter Bar */}
      <div className="sticky top-0 z-40 bg-gradient-to-r from-blue-600/10 via-cyan-600/10 to-purple-600/10 backdrop-blur-xl border-b border-cyan-500/20">
        <div className="container mx-auto px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search tournaments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 bg-gradient-to-br ${siteTheme.glass} backdrop-blur-lg border ${siteTheme.glassBorder} rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-cyan-400/50 focus:bg-white/10 transition-all duration-300 shadow-lg`}
              />
            </div>

            <div className="flex gap-3 items-center w-full lg:w-auto justify-between lg:justify-end">
              <div className={`${siteTheme.textSecondary} text-sm font-medium`}>
                {filteredTournaments.length} {filteredTournaments.length === 1 ? 'Tournament' : 'Tournaments'}
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-br ${siteTheme.glass} backdrop-blur-lg border ${siteTheme.glassBorder} text-white hover:bg-white/20 transition-all duration-300 rounded-xl shadow-lg`}
              >
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline font-medium">Filters</span>
              </button>
            </div>
          </div>

          {showFilters && (
            <div className={`mt-4 p-4 bg-gradient-to-br ${siteTheme.glass} backdrop-blur-lg rounded-2xl border ${siteTheme.glassBorder} shadow-xl`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className={`block ${siteTheme.textSecondary} text-sm font-medium mb-2`}>
                    <Gamepad2 className="inline w-4 h-4 mr-1" />
                    Game
                  </label>
                  <select
                    value={filterGame}
                    onChange={(e) => setFilterGame(e.target.value)}
                    className={`w-full px-4 py-3 bg-gradient-to-br ${siteTheme.glass} backdrop-blur-lg border ${siteTheme.glassBorder} rounded-xl text-white focus:outline-none focus:border-cyan-400/50 transition-all duration-300 shadow-lg`}
                  >
                    <option value="all" className="bg-slate-900">All Games</option>
                    {uniqueGames.map(game => (
                      <option key={game} value={game} className="bg-slate-900">{game}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`block ${siteTheme.textSecondary} text-sm font-medium mb-2`}>
                    <Star className="inline w-4 h-4 mr-1" />
                    Status
                  </label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className={`w-full px-4 py-3 bg-gradient-to-br ${siteTheme.glass} backdrop-blur-lg border ${siteTheme.glassBorder} rounded-xl text-white focus:outline-none focus:border-cyan-400/50 transition-all duration-300 shadow-lg`}
                  >
                    <option value="all" className="bg-slate-900">All Status</option>
                    <option value="active" className="bg-slate-900">Active</option>
                    <option value="upcoming" className="bg-slate-900">Upcoming</option>
                    <option value="completed" className="bg-slate-900">Completed</option>
                  </select>
                </div>

                <div>
                  <label className={`block ${siteTheme.textSecondary} text-sm font-medium mb-2`}>
                    <Trophy className="inline w-4 h-4 mr-1" />
                    Prize Pool
                  </label>
                  <select
                    value={filterPrize}
                    onChange={(e) => setFilterPrize(e.target.value)}
                    className={`w-full px-4 py-3 bg-gradient-to-br ${siteTheme.glass} backdrop-blur-lg border ${siteTheme.glassBorder} rounded-xl text-white focus:outline-none focus:border-cyan-400/50 transition-all duration-300 shadow-lg`}
                  >
                    <option value="all" className="bg-slate-900">All Prizes</option>
                    <option value="small" className="bg-slate-900">Under $1,000</option>
                    <option value="medium" className="bg-slate-900">$1,000 - $5,000</option>
                    <option value="large" className="bg-slate-900">$5,000 - $10,000</option>
                    <option value="huge" className="bg-slate-900">$10,000+</option>
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
                    className={`w-full px-4 py-3 bg-gradient-to-br ${siteTheme.glass} backdrop-blur-lg border ${siteTheme.glassBorder} text-white hover:bg-white/20 transition-all duration-300 rounded-xl shadow-lg font-medium`}
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Featured Tournaments Carousel */}
      <div className="py-12">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl md:text-4xl font-black text-white">Featured Tournaments</h2>
              <div className="hidden sm:flex items-center gap-2 text-cyan-300 text-sm">
                <span>Use</span>
                <kbd className={`px-2 py-1 bg-gradient-to-br ${siteTheme.glass} backdrop-blur-lg border ${siteTheme.glassBorder} rounded text-xs`}>←</kbd>
                <kbd className={`px-2 py-1 bg-gradient-to-br ${siteTheme.glass} backdrop-blur-lg border ${siteTheme.glassBorder} rounded text-xs`}>→</kbd>
                <span>to navigate</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => scrollCarousel("left")}
                className={`p-3 bg-gradient-to-br ${siteTheme.glass} backdrop-blur-lg border ${siteTheme.glassBorder} text-white hover:bg-white/20 transition-all duration-300 rounded-xl shadow-lg ${siteTheme.glow}`}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scrollCarousel("right")}
                className={`p-3 bg-gradient-to-br ${siteTheme.glass} backdrop-blur-lg border ${siteTheme.glassBorder} text-white hover:bg-white/20 transition-all duration-300 rounded-xl shadow-lg ${siteTheme.glow}`}
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div
            ref={carouselRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 px-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            onMouseEnter={handleCarouselInteraction}
            onTouchStart={handleCarouselInteraction}
          >
            {filteredTournaments.map((tournament) => (
              <div
                key={tournament.id}
                onClick={() => setSelectedTournament(tournament)}
                onMouseEnter={() => setHoveredCard(tournament.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`flex-shrink-0 w-80 cursor-pointer transition-all duration-500 transform ${
                  selectedTournament?.id === tournament.id 
                    ? "scale-105 -translate-y-2" 
                    : hoveredCard === tournament.id ? "scale-102 -translate-y-1" : ""
                }`}
              >
                <div className={`relative h-48 rounded-2xl overflow-hidden border-2 transition-all duration-500 ${
                  selectedTournament?.id === tournament.id 
                    ? `border-cyan-400 shadow-2xl ${siteTheme.glow}` 
                    : `border-cyan-400/30 hover:border-cyan-400/60 hover:shadow-xl hover:${siteTheme.glow}`
                }`}>
                  {/* Clean Game Image - No Overlays */}
                  <div className="absolute inset-0">
                    <img
                      src={gameImages[tournament.game] || "/placeholder.jpg"}
                      alt={tournament.game}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Status Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <div className={`px-4 py-2 rounded-full ${getStatusStyles(tournament.status).bg} ${getStatusStyles(tournament.status).shadow} shadow-lg`}>
                      <span className="text-white font-bold text-xs uppercase tracking-wider">
                        {tournament.status}
                      </span>
                    </div>
                  </div>

                  {/* Content with Glassmorphism */}
                  <div className="absolute inset-0 flex flex-col justify-between p-6">
                    <div>
                      <h3 className="text-2xl font-black text-white mb-2 drop-shadow-lg">{tournament.game}</h3>
                      <h4 className="text-lg font-bold text-white/95 line-clamp-1">{tournament.title}</h4>
                    </div>

                    <div className="space-y-3">
                      {tournament.description && (
                        <p className="text-white/90 text-sm line-clamp-2 drop-shadow">{tournament.description}</p>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Trophy className="w-4 h-4 text-yellow-400" />
                          <span className="text-yellow-400 font-bold">${tournament.prize_pool.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-white/80" />
                          <span className="text-white/80 text-sm">{new Date(tournament.end_date).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          openTournamentModal(tournament)
                        }}
                        className={`w-full py-3 bg-gradient-to-r ${siteTheme.secondary} text-white font-bold rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl ${siteTheme.glow}`}
                      >
                        {tournament.status === "active" ? "Join Now" : tournament.status === "upcoming" ? "View Details" : "View Results"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredTournaments.length === 0 && (
              <div className="w-full py-20 text-center">
                <div className="max-w-md mx-auto">
                  <div className={`w-20 h-20 bg-gradient-to-br ${siteTheme.glass} backdrop-blur-lg rounded-full flex items-center justify-center mx-auto mb-6 border ${siteTheme.glassBorder} shadow-lg`}>
                    <Trophy className="w-10 h-10 text-cyan-400" />
                  </div>
                  <p className={`${siteTheme.textSecondary} text-lg font-medium`}>No tournaments found</p>
                  <p className="text-white/60 text-sm mt-2">Try adjusting your filters or search terms</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tournament Details Modal */}
      {showModal && selectedTournament && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`relative w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-gradient-to-br ${siteTheme.primary} rounded-3xl border ${siteTheme.glassBorder} shadow-2xl ${siteTheme.glow}`}>
            {/* Modal Header */}
            <div className="relative h-80 overflow-hidden rounded-t-3xl">
              {/* Clean Game Image */}
              <div className="absolute inset-0">
                <img
                  src={gameImages[selectedTournament.game] || "/placeholder.jpg"}
                  alt={selectedTournament.game}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <button
                onClick={() => setShowModal(false)}
                className={`absolute top-6 right-6 p-3 bg-gradient-to-br ${siteTheme.glass} backdrop-blur-lg rounded-full text-white hover:bg-white/20 transition-all duration-300 border ${siteTheme.glassBorder} shadow-lg`}
              >
                <X className="w-6 h-6" />
              </button>

              <div className="absolute bottom-6 left-6 right-6">
                <h2 className="text-3xl md:text-4xl font-black text-white mb-4 drop-shadow-2xl">{selectedTournament.title}</h2>
                <div className="flex flex-wrap gap-3">
                  <div className={`px-4 py-2 rounded-full ${getStatusStyles(selectedTournament.status).bg} ${getStatusStyles(selectedTournament.status).shadow} shadow-lg`}>
                    <span className="text-white font-bold text-sm uppercase tracking-wider">
                      {selectedTournament.status}
                    </span>
                  </div>
                  <div className={`px-4 py-2 bg-gradient-to-br ${siteTheme.glass} backdrop-blur-lg rounded-full border ${siteTheme.glassBorder}`}>
                    <span className="text-white font-bold text-sm">{selectedTournament.game}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 md:p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3">About This Tournament</h3>
                    <p className="text-white/90 leading-relaxed">
                      {selectedTournament.description || "Compete in this exciting tournament and showcase your skills. Join players from around the world in thrilling matches for a chance to win amazing prizes and claim victory!"}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className={`bg-gradient-to-br ${siteTheme.glass} backdrop-blur-lg rounded-2xl p-4 border ${siteTheme.glassBorder} shadow-lg`}>
                      <Trophy className="w-6 h-6 text-yellow-400 mb-3" />
                      <p className="text-white/70 text-sm font-medium mb-2">Prize Pool</p>
                      <p className="text-2xl font-black text-yellow-400">${selectedTournament.prize_pool.toLocaleString()}</p>
                    </div>
                    <div className={`bg-gradient-to-br ${siteTheme.glass} backdrop-blur-lg rounded-2xl p-4 border ${siteTheme.glassBorder} shadow-lg`}>
                      <Calendar className="w-6 h-6 text-cyan-400 mb-3" />
                      <p className="text-white/70 text-sm font-medium mb-2">Start Date</p>
                      <p className="text-lg font-bold text-white">{new Date(selectedTournament.start_date).toLocaleDateString()}</p>
                    </div>
                    <div className={`bg-gradient-to-br ${siteTheme.glass} backdrop-blur-lg rounded-2xl p-4 border ${siteTheme.glassBorder} shadow-lg`}>
                      <Clock className="w-6 h-6 text-red-400 mb-3" />
                      <p className="text-white/70 text-sm font-medium mb-2">End Date</p>
                      <p className="text-lg font-bold text-white">{new Date(selectedTournament.end_date).toLocaleDateString()}</p>
                    </div>
                    <div className={`bg-gradient-to-br ${siteTheme.glass} backdrop-blur-lg rounded-2xl p-4 border ${siteTheme.glassBorder} shadow-lg`}>
                      <Users className="w-6 h-6 text-green-400 mb-3" />
                      <p className="text-white/70 text-sm font-medium mb-2">Status</p>
                      <p className="text-lg font-bold text-white capitalize">{selectedTournament.status}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3">How to Participate</h3>
                    <ul className="space-y-3 text-white/90">
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Register for tournament using "Join Tournament" button</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Submit your best gameplay clips before the deadline</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Vote for other submissions to increase engagement</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Win prizes based on community votes and rankings</span>
                      </li>
                    </ul>
                  </div>

                  <div className="flex flex-col gap-4">
                    <Link
                      href={`/tournaments/${selectedTournament.id}`}
                      className={`group relative px-8 py-4 bg-gradient-to-r ${siteTheme.secondary} text-white font-bold text-lg rounded-2xl shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-3xl ${siteTheme.glow} text-center`}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {selectedTournament.status === "active" ? <><Play className="w-5 h-5" /> Join Tournament Now</> : selectedTournament.status === "upcoming" ? <><Info className="w-5 h-5" /> View Full Details</> : <><Trophy className="w-5 h-5" /> View Results</>}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </Link>
                    
                    <button
                      onClick={() => setShowModal(false)}
                      className={`px-8 py-4 bg-gradient-to-br ${siteTheme.glass} backdrop-blur-lg border-2 ${siteTheme.glassBorder} text-white font-bold text-lg rounded-2xl hover:bg-white/20 transition-all duration-300 shadow-lg`}
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
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .drop-shadow-2xl {
          filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.7));
        }
        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.5);
        }
        .backdrop-blur-lg {
          backdrop-filter: blur(12px);
        }
        .backdrop-blur-xl {
          backdrop-filter: blur(16px);
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}