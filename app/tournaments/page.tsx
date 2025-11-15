"use client"

import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { UserNav } from "@/components/user-nav"
import { Search, Filter, ChevronLeft, ChevronRight, Trophy, Calendar, DollarSign, Gamepad2, Clock, Users, X, Play, Info, Star } from "lucide-react"
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

const gameThemes: { [key: string]: { primary: string, secondary: string, accent: string, glow: string } } = {
  "Fortnite": { 
    primary: "from-purple-600 via-pink-600 to-purple-800", 
    secondary: "from-purple-900/90 to-pink-900/90", 
    accent: "text-purple-400",
    glow: "shadow-purple-500/50"
  },
  "Valorant": { 
    primary: "from-red-600 via-orange-600 to-red-800", 
    secondary: "from-red-900/90 to-orange-900/90", 
    accent: "text-red-400",
    glow: "shadow-red-500/50"
  },
  "Call of Duty": { 
    primary: "from-green-600 via-emerald-600 to-green-800", 
    secondary: "from-green-900/90 to-emerald-900/90", 
    accent: "text-green-400",
    glow: "shadow-green-500/50"
  },
  "Apex Legends": { 
    primary: "from-blue-600 via-cyan-600 to-blue-800", 
    secondary: "from-blue-900/90 to-cyan-900/90", 
    accent: "text-blue-400",
    glow: "shadow-blue-500/50"
  },
  "League of Legends": { 
    primary: "from-yellow-600 via-amber-600 to-yellow-800", 
    secondary: "from-yellow-900/90 to-amber-900/90", 
    accent: "text-yellow-400",
    glow: "shadow-yellow-500/50"
  },
  "CS2": { 
    primary: "from-gray-600 via-slate-600 to-gray-800", 
    secondary: "from-gray-900/90 to-slate-900/90", 
    accent: "text-gray-400",
    glow: "shadow-gray-500/50"
  },
  "Overwatch 2": { 
    primary: "from-indigo-600 via-purple-600 to-indigo-800", 
    secondary: "from-indigo-900/90 to-purple-900/90", 
    accent: "text-indigo-400",
    glow: "shadow-indigo-500/50"
  },
  "Rocket League": { 
    primary: "from-sky-600 via-blue-600 to-sky-800", 
    secondary: "from-sky-900/90 to-blue-900/90", 
    accent: "text-sky-400",
    glow: "shadow-sky-500/50"
  },
  "Minecraft": { 
    primary: "from-green-600 via-lime-600 to-green-800", 
    secondary: "from-green-900/90 to-lime-900/90", 
    accent: "text-green-400",
    glow: "shadow-green-500/50"
  },
  "FIFA": { 
    primary: "from-green-600 via-emerald-600 to-green-800", 
    secondary: "from-green-900/90 to-emerald-900/90", 
    accent: "text-green-400",
    glow: "shadow-green-500/50"
  },
  "NBA 2K": { 
    primary: "from-orange-600 via-red-600 to-orange-800", 
    secondary: "from-orange-900/90 to-red-900/90", 
    accent: "text-orange-400",
    glow: "shadow-orange-500/50"
  },
  "Madden": { 
    primary: "from-red-600 via-amber-600 to-red-800", 
    secondary: "from-red-900/90 to-amber-900/90", 
    accent: "text-red-400",
    glow: "shadow-red-500/50"
  },
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
      const scrollAmount = 400
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

  const getStatusColors = (status: string) => {
    switch (status) {
      case "active": 
        return { 
          bg: "bg-gradient-to-r from-green-500 to-emerald-600", 
          text: "text-white",
          shadow: "shadow-green-500/50"
        }
      case "upcoming": 
        return { 
          bg: "bg-gradient-to-r from-blue-500 to-indigo-600", 
          text: "text-white",
          shadow: "shadow-blue-500/50"
        }
      case "completed": 
        return { 
          bg: "bg-gradient-to-r from-gray-600 to-gray-700", 
          text: "text-white",
          shadow: "shadow-gray-500/50"
        }
      default: 
        return { 
          bg: "bg-gradient-to-r from-gray-600 to-gray-700", 
          text: "text-white",
          shadow: "shadow-gray-500/50"
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
      <div className="min-h-screen bg-black">
        <UserNav userName="User" />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <div className="text-white text-xl font-bold">Loading Tournaments...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <UserNav userName={userData?.display_name || "User"} />

      {/* Hero Banner with Animated Background */}
      <div className="relative h-96 md:h-[500px] overflow-hidden">
        {selectedTournament && (
          <>
            {/* Animated Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${gameThemes[selectedTournament.game]?.primary || "from-purple-600 to-purple-800"} opacity-90`}>
              <div className="absolute inset-0 bg-black/20"></div>
              <img
                src={gameImages[selectedTournament.game] || "/placeholder.jpg"}
                alt={selectedTournament.game}
                className="w-full h-full object-cover opacity-30 mix-blend-overlay animate-pulse"
              />
            </div>
            
            {/* Floating Particles Effect */}
            <div className="absolute inset-0">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 5}s`,
                    animationDuration: `${3 + Math.random() * 4}s`
                  }}
                />
              ))}
            </div>

            {/* Hero Content */}
            <div className="relative z-10 h-full flex items-center">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white drop-shadow-2xl leading-tight">
                      {selectedTournament.title}
                    </h1>
                    <div className={`px-6 py-3 rounded-full ${getStatusColors(selectedTournament.status).bg} ${getStatusColors(selectedTournament.status).shadow} shadow-2xl`}>
                      <span className="text-white font-bold text-sm uppercase tracking-wider">
                        {selectedTournament.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 mb-8">
                    <Gamepad2 className="w-6 h-6 text-white/80" />
                    <span className="text-xl font-semibold text-white/90">{selectedTournament.game}</span>
                    <div className="w-2 h-2 bg-white/50 rounded-full"></div>
                    <Star className="w-5 h-5 text-yellow-400" />
                    <span className="text-white/80">Featured Tournament</span>
                  </div>
                  
                  {selectedTournament.description && (
                    <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-3xl leading-relaxed">
                      {selectedTournament.description}
                    </p>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                      <Trophy className="w-6 h-6 text-yellow-400 mb-2" />
                      <p className="text-white/70 text-sm mb-1">Prize Pool</p>
                      <p className="text-2xl font-black text-yellow-400">${selectedTournament.prize_pool.toLocaleString()}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                      <Calendar className="w-6 h-6 text-blue-400 mb-2" />
                      <p className="text-white/70 text-sm mb-1">Start Date</p>
                      <p className="text-lg font-bold text-white">{new Date(selectedTournament.start_date).toLocaleDateString()}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                      <Clock className="w-6 h-6 text-red-400 mb-2" />
                      <p className="text-white/70 text-sm mb-1">End Date</p>
                      <p className="text-lg font-bold text-white">{new Date(selectedTournament.end_date).toLocaleDateString()}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                      <Users className="w-6 h-6 text-green-400 mb-2" />
                      <p className="text-white/70 text-sm mb-1">Type</p>
                      <p className="text-lg font-bold text-white capitalize">{selectedTournament.status}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <button
                      onClick={() => openTournamentModal(selectedTournament)}
                      className={`group relative px-8 py-4 bg-gradient-to-r ${gameThemes[selectedTournament.game]?.primary || "from-purple-600 to-purple-800"} text-white font-bold text-lg rounded-xl shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-3xl`}
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        {selectedTournament.status === "active" ? <><Play className="w-5 h-5" /> Join Tournament</> : selectedTournament.status === "upcoming" ? <><Info className="w-5 h-5" /> View Details</> : <><Trophy className="w-5 h-5" /> View Results</>}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>
                    <button
                      onClick={() => openTournamentModal(selectedTournament)}
                      className="px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white font-bold text-lg rounded-xl hover:bg-white/20 transition-all duration-300"
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

      {/* Search and Filters */}
      <div className="sticky top-0 z-40 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
              <input
                type="text"
                placeholder="Search tournaments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-300"
              />
            </div>

            <div className="flex gap-3 items-center w-full lg:w-auto justify-between lg:justify-end">
              <div className="text-white/60 text-sm font-medium">
                {filteredTournaments.length} {filteredTournaments.length === 1 ? 'Tournament' : 'Tournaments'}
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-300"
              >
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline font-medium">Filters</span>
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 p-4 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">Game</label>
                  <select
                    value={filterGame}
                    onChange={(e) => setFilterGame(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white focus:outline-none focus:border-white/40 transition-all duration-300"
                  >
                    <option value="all" className="bg-gray-900">All Games</option>
                    {uniqueGames.map(game => (
                      <option key={game} value={game} className="bg-gray-900">{game}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white focus:outline-none focus:border-white/40 transition-all duration-300"
                  >
                    <option value="all" className="bg-gray-900">All Status</option>
                    <option value="active" className="bg-gray-900">Active</option>
                    <option value="upcoming" className="bg-gray-900">Upcoming</option>
                    <option value="completed" className="bg-gray-900">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">Prize Pool</label>
                  <select
                    value={filterPrize}
                    onChange={(e) => setFilterPrize(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white focus:outline-none focus:border-white/40 transition-all duration-300"
                  >
                    <option value="all" className="bg-gray-900">All Prizes</option>
                    <option value="small" className="bg-gray-900">Under $1,000</option>
                    <option value="medium" className="bg-gray-900">$1,000 - $5,000</option>
                    <option value="large" className="bg-gray-900">$5,000 - $10,000</option>
                    <option value="huge" className="bg-gray-900">$10,000+</option>
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
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-300 font-medium"
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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl md:text-4xl font-black text-white">Featured Tournaments</h2>
              <div className="hidden sm:flex items-center gap-2 text-white/60 text-sm">
                <span>Use</span>
                <kbd className="px-2 py-1 bg-white/10 rounded text-xs">←</kbd>
                <kbd className="px-2 py-1 bg-white/10 rounded text-xs">→</kbd>
                <span>to navigate</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => scrollCarousel("left")}
                className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-300"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scrollCarousel("right")}
                className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-300"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div
            ref={carouselRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
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
                    ? "border-white shadow-2xl shadow-white/20" 
                    : "border-white/20 hover:border-white/40 hover:shadow-xl hover:shadow-white/10"
                }`}>
                  {/* Background Image with Overlay */}
                  <div className="absolute inset-0">
                    <img
                      src={gameImages[tournament.game] || "/placeholder.jpg"}
                      alt={tournament.game}
                      className="w-full h-full object-cover"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${gameThemes[tournament.game]?.secondary || "from-purple-900/90 to-purple-900/90"} backdrop-blur-sm`}></div>
                  </div>

                  {/* Status Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <div className={`px-4 py-2 rounded-full ${getStatusColors(tournament.status).bg} ${getStatusColors(tournament.status).shadow} shadow-lg`}>
                      <span className="text-white font-bold text-xs uppercase tracking-wider">
                        {tournament.status}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-between p-6">
                    <div>
                      <h3 className="text-2xl font-black text-white mb-2 drop-shadow-lg">{tournament.game}</h3>
                      <h4 className="text-lg font-bold text-white/90 line-clamp-2">{tournament.title}</h4>
                    </div>

                    <div className="space-y-3">
                      {tournament.description && (
                        <p className="text-white/80 text-sm line-clamp-2">{tournament.description}</p>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Trophy className="w-4 h-4 text-yellow-400" />
                          <span className="text-yellow-400 font-bold">${tournament.prize_pool.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-white/60" />
                          <span className="text-white/60 text-sm">{new Date(tournament.end_date).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          openTournamentModal(tournament)
                        }}
                        className={`w-full py-3 bg-gradient-to-r ${gameThemes[tournament.game]?.primary || "from-purple-600 to-purple-800"} text-white font-bold rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl`}
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
                  <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Trophy className="w-10 h-10 text-white/40" />
                  </div>
                  <p className="text-white/60 text-lg font-medium">No tournaments found</p>
                  <p className="text-white/40 text-sm mt-2">Try adjusting your filters or search terms</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tournament Details Modal */}
      {showModal && selectedTournament && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-gray-900 to-black rounded-3xl border border-white/20 shadow-2xl shadow-white/10">
            {/* Modal Header */}
            <div className="relative h-64 md:h-80 overflow-hidden rounded-t-3xl">
              <div className={`absolute inset-0 bg-gradient-to-br ${gameThemes[selectedTournament.game]?.primary || "from-purple-600 to-purple-800"} opacity-90`}>
                <img
                  src={gameImages[selectedTournament.game] || "/placeholder.jpg"}
                  alt={selectedTournament.game}
                  className="w-full h-full object-cover opacity-30 mix-blend-overlay"
                />
              </div>
              
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-6 right-6 p-3 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-black/70 transition-all duration-300"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="absolute bottom-6 left-6 right-6">
                <h2 className="text-3xl md:text-4xl font-black text-white mb-4">{selectedTournament.title}</h2>
                <div className="flex flex-wrap gap-3">
                  <div className={`px-4 py-2 rounded-full ${getStatusColors(selectedTournament.status).bg} ${getStatusColors(selectedTournament.status).shadow} shadow-lg`}>
                    <span className="text-white font-bold text-sm uppercase tracking-wider">
                      {selectedTournament.status}
                    </span>
                  </div>
                  <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full">
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
                    <p className="text-white/80 leading-relaxed">
                      {selectedTournament.description || "Compete in this exciting tournament and showcase your skills. Join players from around the world in thrilling matches for a chance to win amazing prizes and claim victory!"}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
                      <Trophy className="w-6 h-6 text-yellow-400 mb-2" />
                      <p className="text-white/60 text-sm mb-1">Prize Pool</p>
                      <p className="text-2xl font-black text-yellow-400">${selectedTournament.prize_pool.toLocaleString()}</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
                      <Calendar className="w-6 h-6 text-blue-400 mb-2" />
                      <p className="text-white/60 text-sm mb-1">Start Date</p>
                      <p className="text-lg font-bold text-white">{new Date(selectedTournament.start_date).toLocaleDateString()}</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
                      <Clock className="w-6 h-6 text-red-400 mb-2" />
                      <p className="text-white/60 text-sm mb-1">End Date</p>
                      <p className="text-lg font-bold text-white">{new Date(selectedTournament.end_date).toLocaleDateString()}</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
                      <Users className="w-6 h-6 text-green-400 mb-2" />
                      <p className="text-white/60 text-sm mb-1">Status</p>
                      <p className="text-lg font-bold text-white capitalize">{selectedTournament.status}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3">How to Participate</h3>
                    <ul className="space-y-2 text-white/80">
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Register for the tournament using the "Join Tournament" button</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Submit your best gameplay clips before the deadline</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Vote for other submissions to increase engagement</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Win prizes based on community votes and rankings</span>
                      </li>
                    </ul>
                  </div>

                  <div className="flex flex-col gap-4">
                    <Link
                      href={`/tournaments/${selectedTournament.id}`}
                      className={`group relative px-8 py-4 bg-gradient-to-r ${gameThemes[selectedTournament.game]?.primary || "from-purple-600 to-purple-800"} text-white font-bold text-lg rounded-xl shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-3xl text-center`}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {selectedTournament.status === "active" ? <><Play className="w-5 h-5" /> Join Tournament Now</> : selectedTournament.status === "upcoming" ? <><Info className="w-5 h-5" /> View Full Details</> : <><Trophy className="w-5 h-5" /> View Results</>}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </Link>
                    
                    <button
                      onClick={() => setShowModal(false)}
                      className="px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white font-bold text-lg rounded-xl hover:bg-white/20 transition-all duration-300"
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
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .drop-shadow-2xl {
          filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.5));
        }
        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.5);
        }
        .mix-blend-overlay {
          mix-blend-mode: overlay;
        }
        .backdrop-blur-sm {
          backdrop-filter: blur(4px);
        }
        .backdrop-blur-md {
          backdrop-filter: blur(8px);
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