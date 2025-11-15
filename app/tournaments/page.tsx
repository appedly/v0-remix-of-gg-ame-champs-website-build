"use client"

import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { UserNav } from "@/components/user-nav"
import { Search, Filter, ChevronLeft, ChevronRight, Trophy, Calendar, DollarSign, Gamepad2, Clock, Users } from "lucide-react"
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

const gameThemes: { [key: string]: { bg: string, accent: string, border: string } } = {
  "Fortnite": { bg: "from-purple-900/20 to-pink-900/20", accent: "purple", border: "purple-500/20" },
  "Valorant": { bg: "from-red-900/20 to-orange-900/20", accent: "red", border: "red-500/20" },
  "Call of Duty": { bg: "from-green-900/20 to-emerald-900/20", accent: "green", border: "green-500/20" },
  "Apex Legends": { bg: "from-blue-900/20 to-cyan-900/20", accent: "blue", border: "blue-500/20" },
  "League of Legends": { bg: "from-yellow-900/20 to-amber-900/20", accent: "yellow", border: "yellow-500/20" },
  "CS2": { bg: "from-gray-900/20 to-slate-900/20", accent: "gray", border: "gray-500/20" },
  "Overwatch 2": { bg: "from-indigo-900/20 to-purple-900/20", accent: "indigo", border: "indigo-500/20" },
  "Rocket League": { bg: "from-blue-900/20 to-sky-900/20", accent: "sky", border: "sky-500/20" },
  "Minecraft": { bg: "from-green-900/20 to-lime-900/20", accent: "green", border: "green-500/20" },
  "FIFA": { bg: "from-green-900/20 to-emerald-900/20", accent: "green", border: "green-500/20" },
  "NBA 2K": { bg: "from-orange-900/20 to-red-900/20", accent: "orange", border: "orange-500/20" },
  "Madden": { bg: "from-red-900/20 to-amber-900/20", accent: "red", border: "red-500/20" },
  "Fortnite Creative": { bg: "from-purple-900/20 to-pink-900/20", accent: "purple", border: "purple-500/20" },
  "Warzone": { bg: "from-green-900/20 to-emerald-900/20", accent: "green", border: "green-500/20" },
}

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [filteredTournaments, setFilteredTournaments] = useState<Tournament[]>([])
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [userData, setUserData] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterGame, setFilterGame] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterPrize, setFilterPrize] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const carouselRef = useRef<HTMLDivElement>(null)
  const [isAutoScrolling, setIsAutoScrolling] = useState(true)

  useEffect(() => {
    fetchUser()
    fetchTournaments()
  }, [])

  const fetchUser = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    
    if (user) {
      const { data: userData } = await supabase.from("users").select("*").eq("id", user.id).single()
      setUserData(userData)
    }
  }

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
    const scrollSpeed = 0.5

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
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

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
      const scrollAmount = 320
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      })
      // Resume auto-scrolling after 5 seconds
      setTimeout(() => setIsAutoScrolling(true), 5000)
    }
  }

  const handleCarouselInteraction = () => {
    setIsAutoScrolling(false)
    setTimeout(() => setIsAutoScrolling(true), 5000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500/10 text-green-400 border-green-500/20"
      case "upcoming": return "bg-blue-500/10 text-blue-400 border-blue-500/20"
      case "completed": return "bg-slate-500/10 text-slate-400 border-slate-500/20"
      default: return "bg-slate-500/10 text-slate-400 border-slate-500/20"
    }
  }

  const uniqueGames = Array.from(new Set(tournaments.map(t => t.game)))

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900">
        <UserNav userName="User" />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <div className="text-white text-lg">Loading tournaments...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <UserNav userName={userData?.display_name || "User"} />

      {/* Hero Banner with Selected Tournament */}
      {selectedTournament && (
        <div className="relative overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-br ${gameThemes[selectedTournament.game]?.bg || "from-slate-900/20 to-slate-800/20"} opacity-30`} />
          <div className="relative container mx-auto px-4 py-6 max-w-7xl">
            <div className="bg-slate-800/90 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
              <div className="grid lg:grid-cols-3 gap-6 p-6">
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-2">
                      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">{selectedTournament.title}</h1>
                      <div className="flex flex-wrap items-center gap-3">
                        <Gamepad2 className="w-4 h-4 text-blue-400" />
                        <span className="text-base sm:text-xl text-blue-400">{selectedTournament.game}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedTournament.status)}`}>
                          {selectedTournament.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {selectedTournament.description && (
                    <p className="text-slate-300 text-sm sm:text-base leading-relaxed line-clamp-2 sm:line-clamp-3">{selectedTournament.description}</p>
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
                      <div className="flex items-center gap-2 mb-1">
                        <Trophy className="w-3 h-3 text-yellow-400" />
                        <span className="text-slate-500 text-xs uppercase tracking-wide">Prize</span>
                      </div>
                      <p className="text-sm sm:text-base font-bold text-yellow-400">${selectedTournament.prize_pool.toLocaleString()}</p>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-3 h-3 text-blue-400" />
                        <span className="text-slate-500 text-xs uppercase tracking-wide">Start</span>
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-white">{new Date(selectedTournament.start_date).toLocaleDateString()}</p>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-3 h-3 text-red-400" />
                        <span className="text-slate-500 text-xs uppercase tracking-wide">End</span>
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-white">{new Date(selectedTournament.end_date).toLocaleDateString()}</p>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="w-3 h-3 text-green-400" />
                        <span className="text-slate-500 text-xs uppercase tracking-wide">Type</span>
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-white capitalize">{selectedTournament.status}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <Link 
                      href={`/tournaments/${selectedTournament.id}`}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all hover:shadow-lg hover:shadow-blue-500/20 text-sm sm:text-base"
                    >
                      {selectedTournament.status === "active" ? "Join Tournament" : selectedTournament.status === "upcoming" ? "View Details" : "View Results"}
                    </Link>
                    <button className="bg-slate-700 hover:bg-slate-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all text-sm sm:text-base">
                      Learn More
                    </button>
                  </div>
                </div>

                <div className="relative h-40 sm:h-48 lg:h-auto">
                  <img
                    src={gameImages[selectedTournament.game] || "/placeholder.jpg"}
                    alt={selectedTournament.game}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="container mx-auto px-4 py-4 sm:py-6 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Search tournaments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 sm:py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 text-sm sm:text-base"
            />
          </div>

          <div className="flex gap-3 items-center w-full lg:w-auto justify-between lg:justify-end">
            <div className="text-slate-400 text-sm">
              {filteredTournaments.length} {filteredTournaments.length === 1 ? 'tournament' : 'tournaments'}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white hover:bg-slate-700 transition-all text-sm sm:text-base"
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 p-3 sm:p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div>
                <label className="block text-slate-400 text-xs sm:text-sm mb-1 sm:mb-2">Game</label>
                <select
                  value={filterGame}
                  onChange={(e) => setFilterGame(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500 text-sm"
                >
                  <option value="all">All Games</option>
                  {uniqueGames.map(game => (
                    <option key={game} value={game}>{game}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 text-xs sm:text-sm mb-1 sm:mb-2">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500 text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 text-xs sm:text-sm mb-1 sm:mb-2">Prize Pool</label>
                <select
                  value={filterPrize}
                  onChange={(e) => setFilterPrize(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500 text-sm"
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
                  className="w-full px-3 sm:px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all text-sm"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tournament Carousel */}
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-bold text-white">All Tournaments</h2>
            <span className="hidden sm:inline text-slate-500 text-xs">Use arrow keys to navigate</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => scrollCarousel("left")}
              className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-white transition-all"
              title="Previous (←)"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => scrollCarousel("right")}
              className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-white transition-all"
              title="Next (→)"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        <div
          ref={carouselRef}
          className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          onMouseEnter={handleCarouselInteraction}
          onTouchStart={handleCarouselInteraction}
        >
          {filteredTournaments.map((tournament) => (
            <div
              key={tournament.id}
              onClick={() => setSelectedTournament(tournament)}
              className={`flex-shrink-0 w-56 sm:w-64 md:w-72 cursor-pointer transition-all duration-300 ${
                selectedTournament?.id === tournament.id 
                  ? "scale-105 ring-2 ring-blue-500 shadow-lg shadow-blue-500/20" 
                  : "hover:scale-102 hover:shadow-lg hover:shadow-slate-500/10"
              }`}
            >
              <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden hover:border-blue-500/50 transition-all duration-300 group h-full">
                <div className="relative h-28 sm:h-32">
                  <img
                    src={gameImages[tournament.game] || "/placeholder.jpg"}
                    alt={tournament.game}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${gameThemes[tournament.game]?.bg || "from-slate-900 to-transparent"} opacity-80`} />
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border backdrop-blur-sm ${getStatusColor(tournament.status)}`}>
                      {tournament.status}
                    </span>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2">
                    <h3 className="text-base sm:text-lg font-bold text-white drop-shadow-lg">{tournament.game}</h3>
                  </div>
                </div>

                <div className="p-3 sm:p-4 space-y-3">
                  <h4 className="font-semibold text-white group-hover:text-blue-400 transition-colors line-clamp-1 text-sm sm:text-base">
                    {tournament.title}
                  </h4>

                  {tournament.description && (
                    <p className="text-slate-400 text-xs sm:text-sm line-clamp-2 leading-relaxed">{tournament.description}</p>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
                      <span className="text-yellow-400 font-semibold text-xs sm:text-sm">${tournament.prize_pool.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400" />
                      <span className="text-slate-400 text-xs">{new Date(tournament.end_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredTournaments.length === 0 && (
            <div className="w-full py-12 text-center">
              <p className="text-slate-400">No tournaments found matching your criteria</p>
            </div>
          )}
        </div>
      </div>

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
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}