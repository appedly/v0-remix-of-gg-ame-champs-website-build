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
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <div className="text-white text-xl font-bold">Loading Tournaments...</div>
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
                src={gameImages[selectedTournament.game] || "/placeholder.jpg"}
                alt={selectedTournament.game}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
            </div>

            {/* Hero Content - Simple and Clean */}
            <div className="relative z-10 h-full flex items-center">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg leading-tight">
                      {selectedTournament.title}
                    </h1>
                    <div className={`px-4 py-2 rounded-full ${getStatusStyles(selectedTournament.status).bg} ${getStatusStyles(selectedTournament.status).border} border-2`}>
                      <span className="text-white font-bold text-sm uppercase tracking-wide">
                        {selectedTournament.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 mb-6">
                    <Gamepad2 className="w-5 h-5 text-blue-400" />
                    <span className="text-lg font-semibold text-white">{selectedTournament.game}</span>
                  </div>
                  
                  {selectedTournament.description && (
                    <p className="text-white/90 mb-6 max-w-3xl leading-relaxed">
                      {selectedTournament.description}
                    </p>
                  )}

                  {/* Simple Info Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                      <Trophy className="w-5 h-5 text-yellow-400 mb-2" />
                      <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">Prize Pool</p>
                      <p className="text-xl font-bold text-yellow-400">${selectedTournament.prize_pool.toLocaleString()}</p>
                    </div>
                    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                      <Calendar className="w-5 h-5 text-blue-400 mb-2" />
                      <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">Start Date</p>
                      <p className="text-sm font-semibold text-white">{new Date(selectedTournament.start_date).toLocaleDateString()}</p>
                    </div>
                    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                      <Clock className="w-5 h-5 text-red-400 mb-2" />
                      <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">End Date</p>
                      <p className="text-sm font-semibold text-white">{new Date(selectedTournament.end_date).toLocaleDateString()}</p>
                    </div>
                    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                      <Users className="w-5 h-5 text-green-400 mb-2" />
                      <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">Type</p>
                      <p className="text-sm font-semibold text-white capitalize">{selectedTournament.status}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <button
                      onClick={() => openTournamentModal(selectedTournament)}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors duration-200"
                    >
                      {selectedTournament.status === "active" ? "Join Tournament" : selectedTournament.status === "upcoming" ? "View Details" : "View Results"}
                    </button>
                    <button
                      onClick={() => openTournamentModal(selectedTournament)}
                      className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition-colors duration-200"
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

      {/* Simple Filter Bar */}
      <div className="sticky top-0 z-40 bg-slate-800 border-b border-slate-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tournaments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-slate-600 transition-colors duration-200"
              />
            </div>

            <div className="flex gap-3 items-center w-full lg:w-auto justify-between lg:justify-end">
              <div className="text-slate-400 text-sm">
                {filteredTournaments.length} {filteredTournaments.length === 1 ? 'tournament' : 'tournaments'}
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 text-white rounded-lg transition-colors duration-200"
              >
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filters</span>
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 p-4 bg-slate-700 rounded-lg border border-slate-600">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Game</label>
                  <select
                    value={filterGame}
                    onChange={(e) => setFilterGame(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="all">All Games</option>
                    {uniqueGames.map(game => (
                      <option key={game} value={game}>{game}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Prize Pool</label>
                  <select
                    value={filterPrize}
                    onChange={(e) => setFilterPrize(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white focus:outline-none focus:border-blue-500"
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
                    className="w-full px-3 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors duration-200"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tournament Carousel */}
      <div className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl md:text-3xl font-bold text-white">Tournaments</h2>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => scrollCarousel("left")}
                className="p-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 text-white rounded-lg transition-colors duration-200"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollCarousel("right")}
                className="p-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 text-white rounded-lg transition-colors duration-200"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div
            ref={carouselRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
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
                className={`flex-shrink-0 w-72 cursor-pointer transition-all duration-200 ${
                  selectedTournament?.id === tournament.id 
                    ? "ring-2 ring-blue-500" 
                    : hoveredCard === tournament.id ? "scale-105" : ""
                }`}
              >
                <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden hover:border-blue-500/50 transition-all duration-200">
                  {/* Clean Game Image */}
                  <div className="relative h-40">
                    <img
                      src={gameImages[tournament.game] || "/placeholder.jpg"}
                      alt={tournament.game}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                  </div>

                  {/* Status Badge */}
                  <div className="absolute top-3 right-3 z-10">
                    <div className={`px-3 py-1 rounded-full ${getStatusStyles(tournament.status).bg} ${getStatusStyles(tournament.status).border} border`}>
                      <span className="text-white font-bold text-xs uppercase tracking-wide">
                        {tournament.status}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-white mb-2">{tournament.game}</h3>
                    <h4 className="text-base font-semibold text-white/90 mb-3 line-clamp-1">{tournament.title}</h4>

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-400 font-semibold">${tournament.prize_pool.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-400 text-sm">{new Date(tournament.end_date).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        openTournamentModal(tournament)
                      }}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors duration-200"
                    >
                      {tournament.status === "active" ? "Join Now" : tournament.status === "upcoming" ? "View Details" : "View Results"}
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredTournaments.length === 0 && (
              <div className="w-full py-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trophy className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-400 text-lg font-medium">No tournaments found</p>
                  <p className="text-slate-500 text-sm mt-1">Try adjusting your filters or search terms</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tournament Details Modal */}
      {showModal && selectedTournament && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-800 rounded-xl border border-slate-700">
            {/* Modal Header */}
            <div className="relative h-56 overflow-hidden">
              <div className="absolute inset-0">
                <img
                  src={gameImages[selectedTournament.game] || "/placeholder.jpg"}
                  alt={selectedTournament.game}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
              </div>
              
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 p-2 bg-slate-700/80 hover:bg-slate-700 rounded-full text-white transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-4 right-4">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">{selectedTournament.title}</h2>
                <div className="flex flex-wrap gap-2">
                  <div className={`px-3 py-1 rounded-full ${getStatusStyles(selectedTournament.status).bg} ${getStatusStyles(selectedTournament.status).border} border`}>
                    <span className="text-white font-bold text-sm uppercase tracking-wide">
                      {selectedTournament.status}
                    </span>
                  </div>
                  <div className="px-3 py-1 bg-slate-700/80 rounded-full">
                    <span className="text-white font-bold text-sm">{selectedTournament.game}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">About This Tournament</h3>
                    <p className="text-slate-300 leading-relaxed">
                      {selectedTournament.description || "Compete in this exciting tournament and showcase your skills. Join players from around the world in thrilling matches for a chance to win amazing prizes and claim victory!"}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-700 rounded-lg p-3 border border-slate-600">
                      <Trophy className="w-5 h-5 text-yellow-400 mb-2" />
                      <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">Prize Pool</p>
                      <p className="text-xl font-bold text-yellow-400">${selectedTournament.prize_pool.toLocaleString()}</p>
                    </div>
                    <div className="bg-slate-700 rounded-lg p-3 border border-slate-600">
                      <Calendar className="w-5 h-5 text-blue-400 mb-2" />
                      <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">Start Date</p>
                      <p className="text-sm font-semibold text-white">{new Date(selectedTournament.start_date).toLocaleDateString()}</p>
                    </div>
                    <div className="bg-slate-700 rounded-lg p-3 border border-slate-600">
                      <Clock className="w-5 h-5 text-red-400 mb-2" />
                      <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">End Date</p>
                      <p className="text-sm font-semibold text-white">{new Date(selectedTournament.end_date).toLocaleDateString()}</p>
                    </div>
                    <div className="bg-slate-700 rounded-lg p-3 border border-slate-600">
                      <Users className="w-5 h-5 text-green-400 mb-2" />
                      <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">Status</p>
                      <p className="text-sm font-semibold text-white capitalize">{selectedTournament.status}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">How to Participate</h3>
                    <ul className="space-y-2 text-slate-300">
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Register for tournament using "Join Tournament" button</span>
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

                  <div className="flex flex-col gap-3">
                    <Link
                      href={`/tournaments/${selectedTournament.id}`}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors duration-200 text-center"
                    >
                      {selectedTournament.status === "active" ? "Join Tournament Now" : selectedTournament.status === "upcoming" ? "View Full Details" : "View Results"}
                    </Link>
                    
                    <button
                      onClick={() => setShowModal(false)}
                      className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition-colors duration-200"
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
        .drop-shadow-lg {
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
        }
      `}</style>
    </div>
  )
}