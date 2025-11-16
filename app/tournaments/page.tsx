"use client"

import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { UserNav } from "@/components/user-nav"
import { Search, Filter, Trophy, Calendar, DollarSign, Gamepad2, Clock, Users, X, Play, Info, Star, ExternalLink, TrendingUp, Sparkles, ChevronRight, ArrowLeft, ArrowRight } from "lucide-react"
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
  "CS:GO": "/tactical-shooter-scene.png",
  "Counter-Strike": "/tactical-shooter-scene.png",
  "Overwatch 2": "/overwatch-2-game.jpg",
  "Rocket League": "/rocket-league-game.jpg",
  "Minecraft": "/minecraft-banner.jpg",
  "FIFA": "/fifa-game.jpg",
  "NBA 2K": "/nba2k-banner.jpg",
  "Madden": "/fifa-game.jpg",
  "Fortnite Creative": "/generic-battle-royale.png",
  "Warzone": "/call-of-duty-game.jpg",
  "Red Dead Redemption": "/rdr2-banner.jpg",
  "RDR2": "/rdr2-banner.jpg",
  "GTA V": "/call-of-duty-game.jpg",
  "GTA 5": "/call-of-duty-game.jpg",
  "Grand Theft Auto": "/call-of-duty-game.jpg",
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
  const [isTransitioning, setIsTransitioning] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)

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
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentTournamentIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % filteredTournaments.length
          setSelectedTournament(filteredTournaments[nextIndex])
          return nextIndex
        })
        setIsTransitioning(false)
      }, 300)
    }, 8000)

    return () => clearInterval(interval)
  }, [filteredTournaments])

  // Auto-scroll to selected tournament in sidebar
  useEffect(() => {
    if (selectedTournament && sidebarRef.current) {
      const selectedElement = sidebarRef.current.querySelector(`[data-tournament-id="${selectedTournament.id}"]`)
      if (selectedElement) {
        setTimeout(() => {
          selectedElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          })
        }, 100)
      }
    }
  }, [selectedTournament])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePrevTournament()
      } else if (e.key === "ArrowRight") {
        handleNextTournament()
      } else if (e.key === "Escape" && showModal) {
        setShowModal(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [showModal, filteredTournaments, currentTournamentIndex])

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

  const handlePrevTournament = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentTournamentIndex((prevIndex) => {
        const newIndex = prevIndex === 0 ? filteredTournaments.length - 1 : prevIndex - 1
        setSelectedTournament(filteredTournaments[newIndex])
        return newIndex
      })
      setIsTransitioning(false)
    }, 300)
  }

  const handleNextTournament = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentTournamentIndex((prevIndex) => {
        const newIndex = (prevIndex + 1) % filteredTournaments.length
        setSelectedTournament(filteredTournaments[newIndex])
        return newIndex
      })
      setIsTransitioning(false)
    }, 300)
  }

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "active": 
        return { 
          bg: "bg-green-500/20", 
          text: "text-green-400",
          border: "border-green-500/30",
          dot: "bg-green-400"
        }
      case "upcoming": 
        return { 
          bg: "bg-blue-500/20", 
          text: "text-blue-400",
          border: "border-blue-500/30",
          dot: "bg-blue-400"
        }
      case "completed": 
        return { 
          bg: "bg-slate-500/20", 
          text: "text-slate-400",
          border: "border-slate-500/30",
          dot: "bg-slate-400"
        }
      default: 
        return { 
          bg: "bg-slate-500/20", 
          text: "text-slate-400",
          border: "border-slate-500/30",
          dot: "bg-slate-400"
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

      {/* Filter Bar - Compact */}
      <div className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tournaments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all duration-300"
              />
            </div>

            <div className="flex items-center gap-3">
              <span className="text-slate-400 text-sm">{filteredTournaments.length} tournaments</span>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-3 py-2 transition-all duration-300 rounded-lg border ${
                  showFilters 
                    ? 'bg-blue-600/20 border-blue-400/50 text-blue-400' 
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-3 p-4 bg-slate-800/50 backdrop-blur rounded-lg border border-slate-700 animate-in slide-in-from-top-2 duration-300">
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                <select
                  value={filterGame}
                  onChange={(e) => setFilterGame(e.target.value)}
                  className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all duration-300"
                >
                  <option value="all">All Games</option>
                  {uniqueGames.map(game => (
                    <option key={game} value={game}>{game}</option>
                  ))}
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all duration-300"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="completed">Completed</option>
                </select>

                <select
                  value={filterPrize}
                  onChange={(e) => setFilterPrize(e.target.value)}
                  className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all duration-300"
                >
                  <option value="all">All Prizes</option>
                  <option value="small">Under $1,000</option>
                  <option value="medium">$1,000 - $5,000</option>
                  <option value="large">$5,000 - $10,000</option>
                  <option value="huge">$10,000+</option>
                </select>

                <button
                  onClick={() => {
                    setSearchTerm("")
                    setFilterGame("all")
                    setFilterStatus("all")
                    setFilterPrize("all")
                  }}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm rounded-lg transition-all duration-300 border border-slate-700"
                >
                  Clear All
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content - 2/3 Showcase + 1/3 Sidebar */}
      <div className="flex h-[calc(100vh-120px)]">
        {/* Main Showcase - 2/3 */}
        <div className="w-2/3 relative overflow-hidden">
          {selectedTournament && (
            <div className={`h-full transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
              {/* Background Image with Overlay */}
              <div className="absolute inset-0">
                <img
                  src={getTournamentImage(selectedTournament)}
                  alt={`${selectedTournament.game} tournament`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/60 to-slate-900/80"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/30"></div>
              </div>

              {/* Main Content */}
              <div className="relative h-full flex flex-col justify-end p-12">
                <div className="max-w-4xl space-y-6">
                  {/* Status Badge */}
                  <div className="flex items-center gap-4">
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusStyles(selectedTournament.status).bg} ${getStatusStyles(selectedTournament.status).border}`}>
                      <div className={`w-2 h-2 rounded-full ${getStatusStyles(selectedTournament.status).dot} ${selectedTournament.status === 'active' ? 'animate-pulse' : ''}`}></div>
                      <span className={`text-sm font-medium uppercase tracking-wide ${getStatusStyles(selectedTournament.status).text}`}>
                        {selectedTournament.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <Gamepad2 className="w-4 h-4" />
                      <span className="font-medium">{selectedTournament.game}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                    {selectedTournament.title}
                  </h1>

                  {/* Description */}
                  {selectedTournament.description && (
                    <p className="text-xl text-slate-200 max-w-3xl leading-relaxed">
                      {selectedTournament.description}
                    </p>
                  )}

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                      <p className="text-slate-300 text-sm uppercase tracking-widest mb-2">Prize Pool</p>
                      <p className="text-3xl font-bold text-white">${selectedTournament.prize_pool.toLocaleString()}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                      <p className="text-slate-300 text-sm uppercase tracking-widest mb-2">Start Date</p>
                      <p className="text-lg font-semibold text-white">{new Date(selectedTournament.start_date).toLocaleDateString()}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                      <p className="text-slate-300 text-sm uppercase tracking-widest mb-2">End Date</p>
                      <p className="text-lg font-semibold text-white">{new Date(selectedTournament.end_date).toLocaleDateString()}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                      <p className="text-slate-300 text-sm uppercase tracking-widest mb-2">Duration</p>
                      <p className="text-lg font-semibold text-white">
                        {Math.ceil((new Date(selectedTournament.end_date).getTime() - new Date(selectedTournament.start_date).getTime()) / (1000 * 60 * 60 * 24))} days
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <Link
                      href={`/tournaments/${selectedTournament.id}`}
                      className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-blue-600/25"
                    >
                      {selectedTournament.status === "active" ? "Join Tournament" : selectedTournament.status === "upcoming" ? "View Details" : "View Results"}
                    </Link>
                    <button
                      onClick={() => openTournamentModal(selectedTournament)}
                      className="px-8 py-4 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white font-bold rounded-xl transition-all duration-300 border border-white/20"
                    >
                      More Info
                    </button>
                  </div>
                </div>

                {/* Navigation Arrows */}
                <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4">
                  <button
                    onClick={handlePrevTournament}
                    className="p-3 bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/20 text-white rounded-full transition-all duration-300"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNextTournament}
                    className="p-3 bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/20 text-white rounded-full transition-all duration-300"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Progress Indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                  {filteredTournaments.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setIsTransitioning(true)
                        setTimeout(() => {
                          setCurrentTournamentIndex(index)
                          setSelectedTournament(filteredTournaments[index])
                          setIsTransitioning(false)
                        }, 300)
                      }}
                      className={`transition-all duration-300 ${
                        index === currentTournamentIndex 
                          ? 'w-8 h-2 bg-blue-500 rounded-full' 
                          : 'w-2 h-2 bg-white/30 hover:bg-white/50 rounded-full'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - 1/3 Tournament List */}
        <div className="w-1/3 bg-slate-800/50 backdrop-blur-md border-l border-slate-700 flex flex-col">
          <div className="p-6 border-b border-slate-700">
            <h2 className="text-xl font-bold text-white">All Tournaments</h2>
            <p className="text-slate-400 text-sm mt-1">Click to view details</p>
          </div>

          <div 
            ref={sidebarRef}
            className="flex-1 overflow-y-auto p-4 space-y-3"
            style={{ scrollbarWidth: 'thin', scrollbarColor: '#475569 #1e293b' }}
          >
            {filteredTournaments.map((tournament, index) => (
              <div
                key={tournament.id}
                data-tournament-id={tournament.id}
                onClick={() => {
                  setIsTransitioning(true)
                  setTimeout(() => {
                    setSelectedTournament(tournament)
                    setCurrentTournamentIndex(index)
                    setIsTransitioning(false)
                  }, 300)
                }}
                className={`cursor-pointer transition-all duration-300 rounded-xl overflow-hidden ${
                  selectedTournament?.id === tournament.id 
                    ? "ring-2 ring-blue-500 bg-slate-700/50" 
                    : "bg-slate-800/50 hover:bg-slate-700/50"
                }`}
              >
                <div className="relative h-24 overflow-hidden">
                  <img
                    src={getTournamentImage(tournament)}
                    alt={`${tournament.game} tournament`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
                  
                  {/* Status Badge */}
                  <div className="absolute top-2 right-2">
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getStatusStyles(tournament.status).bg} ${getStatusStyles(tournament.status).border}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${getStatusStyles(tournament.status).dot} ${tournament.status === 'active' ? 'animate-pulse' : ''}`}></div>
                      <span className={`font-medium ${getStatusStyles(tournament.status).text}`}>
                        {tournament.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">{tournament.game}</p>
                    <h3 className="text-sm font-semibold text-white line-clamp-1">{tournament.title}</h3>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1">
                      <Trophy className="w-3 h-3 text-yellow-400" />
                      <span className="text-slate-300">${tournament.prize_pool.toLocaleString()}</span>
                    </div>
                    <div className="text-slate-400">
                      {new Date(tournament.start_date).toLocaleDateString()}
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      openTournamentModal(tournament)
                    }}
                    className="w-full px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors duration-300"
                  >
                    {tournament.status === "active" ? "Join" : "View"}
                  </button>
                </div>
              </div>
            ))}

            {filteredTournaments.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-300 font-medium mb-2">No tournaments found</p>
                <p className="text-slate-400 text-sm">Try adjusting your filters</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tournament Details Modal */}
      {showModal && selectedTournament && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-800 rounded-xl border border-slate-700 shadow-2xl animate-in zoom-in-95 duration-300">
             {/* Modal Header */}
             <div className="relative h-64 overflow-hidden">
               <img
                 src={getTournamentImage(selectedTournament)}
                 alt={`${selectedTournament.game} tournament`}
                 className="w-full h-full object-cover"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>

               <button
                 onClick={() => setShowModal(false)}
                 className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-full text-white transition-colors duration-300"
               >
                 <X className="w-5 h-5" />
               </button>

               <div className="absolute bottom-6 left-6 right-6">
                 <div className="flex items-center gap-3 mb-3">
                   <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusStyles(selectedTournament.status).bg} ${getStatusStyles(selectedTournament.status).border}`}>
                     <div className={`w-2 h-2 rounded-full ${getStatusStyles(selectedTournament.status).dot} ${selectedTournament.status === 'active' ? 'animate-pulse' : ''}`}></div>
                     <span className={`text-sm font-medium uppercase tracking-wide ${getStatusStyles(selectedTournament.status).text}`}>
                       {selectedTournament.status}
                     </span>
                   </div>
                   <div className="flex items-center gap-2 text-slate-200">
                     <Gamepad2 className="w-4 h-4" />
                     <span className="font-medium">{selectedTournament.game}</span>
                   </div>
                 </div>
                 <h2 className="text-3xl font-bold text-white mb-2">{selectedTournament.title}</h2>
               </div>
             </div>

             {/* Modal Content */}
             <div className="p-6">
               <div className="grid md:grid-cols-4 gap-4 mb-6">
                 <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
                   <p className="text-slate-400 text-xs uppercase tracking-widest mb-2">Prize Pool</p>
                   <p className="text-2xl font-bold text-white">${selectedTournament.prize_pool.toLocaleString()}</p>
                 </div>
                 <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
                   <p className="text-slate-400 text-xs uppercase tracking-widest mb-2">Start Date</p>
                   <p className="text-lg font-semibold text-white">{new Date(selectedTournament.start_date).toLocaleDateString()}</p>
                 </div>
                 <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
                   <p className="text-slate-400 text-xs uppercase tracking-widest mb-2">End Date</p>
                   <p className="text-lg font-semibold text-white">{new Date(selectedTournament.end_date).toLocaleDateString()}</p>
                 </div>
                 <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
                   <p className="text-slate-400 text-xs uppercase tracking-widest mb-2">Duration</p>
                   <p className="text-lg font-semibold text-white">
                     {Math.ceil((new Date(selectedTournament.end_date).getTime() - new Date(selectedTournament.start_date).getTime()) / (1000 * 60 * 60 * 24))} days
                   </p>
                 </div>
               </div>

               <div className="space-y-6">
                 <div>
                   <h3 className="text-xl font-semibold text-white mb-3">About Tournament</h3>
                   <p className="text-slate-300 leading-relaxed">
                     {selectedTournament.description || "Compete in this exciting tournament and showcase your skills. Join players from around the world for a chance to win amazing prizes and recognition in the gaming community."}
                   </p>
                 </div>

                 <div>
                   <h3 className="text-xl font-semibold text-white mb-3">How to Participate</h3>
                   <ul className="space-y-2 text-slate-300">
                     <li className="flex items-start gap-2">
                       <span className="text-blue-400 mt-1">●</span>
                       <span>Register for the tournament using the "Join Tournament" button</span>
                     </li>
                     <li className="flex items-start gap-2">
                       <span className="text-blue-400 mt-1">●</span>
                       <span>Submit your best gameplay clips before the tournament deadline</span>
                     </li>
                     <li className="flex items-start gap-2">
                       <span className="text-blue-400 mt-1">●</span>
                       <span>Vote for other submissions to increase community engagement</span>
                     </li>
                     <li className="flex items-start gap-2">
                       <span className="text-blue-400 mt-1">●</span>
                       <span>Win prizes based on community votes and tournament rankings</span>
                     </li>
                   </ul>
                 </div>

                 <div className="flex gap-4">
                   <Link
                     href={`/tournaments/${selectedTournament.id}`}
                     className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all duration-300 text-center"
                   >
                     {selectedTournament.status === "active" ? "Join Tournament Now" : selectedTournament.status === "upcoming" ? "View Full Details" : "View Results"}
                   </Link>

                   <button
                     onClick={() => setShowModal(false)}
                     className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-all duration-300"
                   >
                     Close
                   </button>
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
        .animate-in {
          animation-duration: 0.3s;
          animation-fill-mode: both;
        }
        .fade-in {
          animation-name: fade-in;
        }
        .zoom-in-95 {
          animation-name: zoom-in-95;
        }
        .slide-in-from-top-2 {
          animation-name: slide-in-from-top-2;
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
        /* Custom scrollbar for webkit browsers */
        div::-webkit-scrollbar {
          width: 6px;
        }
        div::-webkit-scrollbar-track {
          background: #1e293b;
        }
        div::-webkit-scrollbar-thumb {
          background: #475569;
          border-radius: 3px;
        }
        div::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }
      `}</style>
    </div>
  )
}