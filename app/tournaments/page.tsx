"use client"

import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { UserNav } from "@/components/user-nav"
import { Search, Filter, ChevronLeft, ChevronRight, Trophy, Calendar, Gamepad2, Clock, X, Info, Sparkles } from "lucide-react"
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

// High-quality game banners - local fallbacks with CDN options
// Recommended hero image size: 1920x1080 (16:9 ratio) for best quality
const gameImages: { [key: string]: string } = {
  "Fortnite": "/generic-battle-royale.png",
  "Valorant": "/valorant-game.jpg",
  "Call of Duty": "/call-of-duty-game.jpg",
  "Apex Legends": "/futuristic-battle-arena.png",
  "League of Legends": "/league-of-legends-game.jpg",
  "CS2": "/tactical-shooter-scene.png",
  "CSGO": "/tactical-shooter-scene.png",
  "CS:GO": "/tactical-shooter-scene.png",
  "Counter-Strike 2": "/tactical-shooter-scene.png",
  "Overwatch 2": "/overwatch-2-game.jpg",
  "Rocket League": "/rocket-league-game.jpg",
  "Minecraft": "https://www.minecraft.net/content/dam/games/minecraft/marketplace/mediablock-buzzybees.jpg",
  "FIFA": "https://media.contentapi.ea.com/content/dam/ea/fifa/fifa-23/common/featured-tiles/fifa-23-announce-featured-tile.jpg.adapt.crop191x100.1200w.jpg",
  "NBA 2K": "https://cdn2.unrealengine.com/egs-nba2k24-visualconcepts-g1a-00-1920x1080-b0c71bf8f597.jpg",
  "Madden": "https://media.contentapi.ea.com/content/dam/ea/madden-nfl/madden-nfl-24/common/featured-tiles/madden-24-featured-tile-16x9.jpg.adapt.crop191x100.1200w.jpg",
  "Fortnite Creative": "/generic-battle-royale.png",
  "Warzone": "/call-of-duty-game.jpg",
  "Red Dead Redemption 2": "https://media-rockstargames-com.akamaized.net/rockstargames-newsite/img/global/games/fob/1280/reddeadredemption2.jpg",
  "RDR2": "https://media-rockstargames-com.akamaized.net/rockstargames-newsite/img/global/games/fob/1280/reddeadredemption2.jpg",
  "GTA V": "https://media-rockstargames-com.akamaized.net/rockstargames-newsite/img/global/games/fob/1280/V.jpg",
  "Dota 2": "https://cdn.cloudflare.steamstatic.com/steam/apps/570/header.jpg",
  "Destiny 2": "https://www.bungie.net/7/ca/destiny/bgs/season20/s20_hero_desktop_16x9.jpg",
}

const getTournamentImage = (tournament: Tournament) => {
  if (tournament.image_url && tournament.image_url.trim() !== "") {
    return tournament.image_url
  }
  return gameImages[tournament.game] || "/hero-bg.png"
}

const getDaysRemaining = (endDate: string) => {
  const end = new Date(endDate)
  const now = new Date()
  const diff = end.getTime() - now.getTime()
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
  
  if (days < 0) return "Ended"
  if (days === 0) return "Ends today"
  if (days === 1) return "Ends in 1 day"
  return `Ends in ${days} days`
}

const getTimeUntilStart = (startDate: string) => {
  const start = new Date(startDate)
  const now = new Date()
  const diff = start.getTime() - now.getTime()
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
  
  if (days < 0) return "Started"
  if (days === 0) return "Starts today"
  if (days === 1) return "Starts in 1 day"
  return `Starts in ${days} days`
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
  const carouselRef = useRef<HTMLDivElement>(null)
  const [joinButtonHover, setJoinButtonHover] = useState(false)
  const [learnMoreHover, setLearnMoreHover] = useState(false)

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

  useEffect(() => {
    if (filteredTournaments.length === 0) return

    const interval = setInterval(() => {
      setCurrentTournamentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % filteredTournaments.length
        setSelectedTournament(filteredTournaments[nextIndex])
        return nextIndex
      })
    }, 18000) // Changed to 18 seconds

    return () => clearInterval(interval)
  }, [filteredTournaments])

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

  useEffect(() => {
    setJoinButtonHover(false)
    setLearnMoreHover(false)
  }, [selectedTournament?.id])

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

  const openTournamentModal = (tournament: Tournament) => {
    setSelectedTournament(tournament)
    setShowModal(true)
  }

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 320
      const container = carouselRef.current.querySelector('.carousel-container')
      if (container) {
        container.scrollBy({
          left: direction === 'left' ? -scrollAmount : scrollAmount,
          behavior: 'smooth'
        })
      }
    }
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
    <div className="min-h-screen bg-slate-900 text-white flex flex-col font-gaming">
      <UserNav userName={userData?.display_name || "User"} />

      <div className="flex-1 flex flex-col">
        
        {/* Hero Section - 2/3 */}
        <div className="relative h-[66vh] overflow-hidden">
          {selectedTournament && (
            <>
              <div className="absolute inset-0 transition-all duration-1000 ease-in-out">
                <img
                  key={selectedTournament.id}
                  src={getTournamentImage(selectedTournament)}
                  alt={`${selectedTournament.game} tournament`}
                  className="w-full h-full object-cover scale-105 animate-ken-burns"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/40"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-transparent to-slate-900/60"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900"></div>
              </div>

              <div className="relative z-10 h-full flex items-end">
                <div className="container mx-auto px-6 lg:px-12 pb-12 lg:pb-16">
                  <div className="max-w-6xl space-y-6">

                    <div className="flex items-center gap-3">
                      <Gamepad2 className="w-5 h-5 text-blue-400" />
                      <span className="text-blue-300 font-semibold text-lg tracking-wide">{selectedTournament.game}</span>
                    </div>

                    <h1 
                      key={`title-${selectedTournament.id}`}
                      className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight animate-fade-in-up"
                      style={{ 
                        textShadow: '0 4px 12px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.3)',
                        letterSpacing: '-0.02em'
                      }}
                    >
                      {selectedTournament.title}
                    </h1>

                    {selectedTournament.description && (
                      <p 
                        key={`desc-${selectedTournament.id}`}
                        className="text-lg text-slate-200 max-w-3xl leading-relaxed animate-fade-in-up-delay"
                        style={{ 
                          textShadow: '0 2px 8px rgba(0,0,0,0.6)'
                        }}
                      >
                        {selectedTournament.description}
                      </p>
                    )}

                    {/* Redesigned CTA Section with sleek stat cards */}
                    <div 
                      key={`cta-${selectedTournament.id}`}
                      className="flex flex-wrap items-center gap-6 pt-6 animate-fade-in-up-delay-2"
                    >
                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-4">
                        <Link
                          href={`/tournaments/${selectedTournament.id}`}
                          onMouseEnter={() => setJoinButtonHover(true)}
                          onMouseLeave={() => setJoinButtonHover(false)}
                          className="group relative px-10 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white font-bold rounded-xl transition-all duration-500 overflow-hidden border-2 border-slate-700 hover:border-slate-600 shadow-lg hover:shadow-2xl"
                        >
                          {joinButtonHover && (
                            <>
                              <div className="fire-particle fire-particle-1"></div>
                              <div className="fire-particle fire-particle-2"></div>
                              <div className="fire-particle fire-particle-3"></div>
                              <div className="fire-particle fire-particle-4"></div>
                              <div className="ember ember-1"></div>
                              <div className="ember ember-2"></div>
                              <div className="ember ember-3"></div>
                              <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 via-red-600/20 to-orange-600/20 animate-pulse"></div>
                            </>
                          )}
                          <span className="relative z-10">
                            {selectedTournament.status === "active" ? "Join Tournament" : selectedTournament.status === "upcoming" ? "View Details" : "View Results"}
                          </span>
                        </Link>

                        <button
                          onClick={() => openTournamentModal(selectedTournament)}
                          onMouseEnter={() => setLearnMoreHover(true)}
                          onMouseLeave={() => setLearnMoreHover(false)}
                          className="group relative px-10 py-4 bg-gradient-to-br from-slate-100 to-white text-slate-900 font-bold rounded-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden shadow-lg hover:shadow-2xl"
                        >
                          <div className={`absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 transition-opacity duration-300 ${learnMoreHover ? 'opacity-100' : 'opacity-0'}`}></div>
                          <span className="relative z-10 flex items-center gap-2">
                            <Info className="w-4 h-4" />
                            Learn More
                          </span>
                        </button>
                      </div>

                      {/* Sleek Tournament Stats Cards - Only Prize Pool and Time */}
                      <div className="flex flex-wrap gap-4">
                        {/* Prize Pool Card */}
                        <div className="group relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl p-5 border border-slate-700/50 hover:border-amber-500/50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-amber-500/20">
                          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-orange-500/0 group-hover:from-amber-500/10 group-hover:to-orange-500/10 rounded-2xl transition-all duration-300"></div>
                          <div className="relative flex items-center gap-4">
                            <div className="p-3 bg-amber-500/20 rounded-xl border border-amber-500/30">
                              <Trophy className="w-6 h-6 text-amber-400" />
                            </div>
                            <div>
                              <p className="text-xs text-amber-300/70 uppercase tracking-[0.15em] font-bold mb-1">Prize Pool</p>
                              <p className="text-2xl font-black text-white">${selectedTournament.prize_pool.toLocaleString()}</p>
                            </div>
                          </div>
                        </div>

                        {/* Time Card - Dynamic based on status */}
                        <div className="group relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl p-5 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-blue-500/20">
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-indigo-500/0 group-hover:from-blue-500/10 group-hover:to-indigo-500/10 rounded-2xl transition-all duration-300"></div>
                          <div className="relative flex items-center gap-4">
                            <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-500/30">
                              {selectedTournament.status === "upcoming" ? (
                                <Calendar className="w-6 h-6 text-blue-400" />
                              ) : (
                                <Clock className="w-6 h-6 text-blue-400" />
                              )}
                            </div>
                            <div>
                              <p className="text-xs text-blue-300/70 uppercase tracking-[0.15em] font-bold mb-1">
                                {selectedTournament.status === "upcoming" ? "Starts" : "Ends"}
                              </p>
                              <p className="text-lg font-black text-white">
                                {selectedTournament.status === "upcoming" 
                                  ? getTimeUntilStart(selectedTournament.start_date)
                                  : getDaysRemaining(selectedTournament.end_date)
                                }
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Arrows */}
              <div className="absolute top-1/2 left-0 right-0 z-20 flex justify-between px-6 -translate-y-1/2 pointer-events-none">
                <button
                  onClick={() => {
                    const newIndex = currentTournamentIndex === 0 ? filteredTournaments.length - 1 : currentTournamentIndex - 1
                    setCurrentTournamentIndex(newIndex)
                    setSelectedTournament(filteredTournaments[newIndex])
                  }}
                  className="pointer-events-auto p-4 bg-black/40 hover:bg-black/60 backdrop-blur-xl text-white rounded-full transition-all duration-300 border border-white/20 hover:border-white/40 hover:scale-110 group"
                >
                  <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform" />
                </button>
                <button
                  onClick={() => {
                    const newIndex = (currentTournamentIndex + 1) % filteredTournaments.length
                    setCurrentTournamentIndex(newIndex)
                    setSelectedTournament(filteredTournaments[newIndex])
                  }}
                  className="pointer-events-auto p-4 bg-black/40 hover:bg-black/60 backdrop-blur-xl text-white rounded-full transition-all duration-300 border border-white/20 hover:border-white/40 hover:scale-110 group"
                >
                  <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </>
          )}
        </div>

        {/* Tournament Carousel - 1/3 */}
        <div className="relative h-[34vh] bg-gradient-to-b from-slate-900 to-slate-950 border-t border-slate-800/50">
          
          {/* Enhanced Filter Bar */}
          <div className="absolute top-0 left-0 right-0 z-30 bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-slate-900/80 backdrop-blur-2xl border-b border-slate-700/50 shadow-2xl">
            <div className="container mx-auto px-6 lg:px-12 py-5">
              <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search tournaments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-800/60 backdrop-blur-xl border border-slate-700/60 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/30 transition-all duration-300 shadow-lg"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex items-center gap-2 px-5 py-3 bg-slate-800/60 rounded-xl border border-slate-700/60 shadow-lg backdrop-blur-xl">
                    <Trophy className="w-4 h-4 text-blue-400" />
                    <span className="text-slate-300 text-sm font-semibold">{filteredTournaments.length} Active</span>
                  </div>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-5 py-3.5 transition-all duration-300 rounded-xl border font-semibold shadow-lg ${
                      showFilters 
                        ? 'bg-blue-600/40 border-blue-400/60 text-blue-200 shadow-blue-500/20' 
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <Filter className="w-4 h-4" />
                    <span className="hidden sm:inline">Filters</span>
                  </button>
                </div>
              </div>

              {showFilters && (
                <div className="mt-5 p-5 bg-slate-800/60 backdrop-blur-xl rounded-xl border border-slate-700/60 animate-in slide-in-from-top-2 duration-300 shadow-xl">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <select
                      value={filterGame}
                      onChange={(e) => setFilterGame(e.target.value)}
                      className="px-4 py-3 bg-slate-900/60 backdrop-blur-xl border border-slate-700/60 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/30 transition-all duration-300 shadow-lg"
                    >
                      <option value="all">All Games</option>
                      {uniqueGames.map(game => (
                        <option key={game} value={game}>{game}</option>
                      ))}
                    </select>

                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-4 py-3 bg-slate-900/60 backdrop-blur-xl border border-slate-700/60 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/30 transition-all duration-300 shadow-lg"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="upcoming">Upcoming</option>
                      <option value="completed">Completed</option>
                    </select>

                    <select
                      value={filterPrize}
                      onChange={(e) => setFilterPrize(e.target.value)}
                      className="px-4 py-3 bg-slate-900/60 backdrop-blur-xl border border-slate-700/60 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/30 transition-all duration-300 shadow-lg"
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
                      className="px-4 py-3 bg-slate-900/60 backdrop-blur-xl hover:bg-slate-800/80 text-white text-sm font-semibold rounded-lg transition-all duration-300 border border-slate-700/60 shadow-lg"
                    >
                      Clear All
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Horizontal Scrolling Carousel with Manual Controls */}
          <div className={`h-full ${showFilters ? 'pt-44' : 'pt-24'} transition-all duration-300`}>
            <div className="container mx-auto px-6 lg:px-12 h-full">
              <div className="relative h-full" ref={carouselRef}>
                
                {filteredTournaments.length > 0 ? (
                  <>
                    {/* Manual Scroll Buttons */}
                    <button
                      onClick={() => scrollCarousel('left')}
                      className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-3 bg-slate-800/90 hover:bg-slate-700 backdrop-blur-xl text-white rounded-full transition-all duration-300 border border-slate-700/50 hover:scale-110 shadow-xl"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => scrollCarousel('right')}
                      className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-3 bg-slate-800/90 hover:bg-slate-700 backdrop-blur-xl text-white rounded-full transition-all duration-300 border border-slate-700/50 hover:scale-110 shadow-xl"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>

                    <div className="carousel-container flex gap-4 overflow-x-auto scrollbar-hide h-full pb-6 scroll-smooth px-12">
                      {filteredTournaments.map((tournament, index) => (
                        <div
                          key={tournament.id}
                          data-tournament-id={tournament.id}
                          onClick={() => {
                            setSelectedTournament(tournament)
                            setCurrentTournamentIndex(index)
                          }}
                          className={`group cursor-pointer transition-all duration-300 flex-shrink-0 w-80 focus:outline-none ${
                            selectedTournament?.id === tournament.id 
                              ? "scale-[1.02]" 
                              : "hover:scale-[1.01]"
                          }`}
                        >
                          <div className={`relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border overflow-hidden transition-all duration-300 shadow-xl hover:shadow-2xl flex flex-col ${
                            selectedTournament?.id === tournament.id
                              ? "border-blue-500/60 shadow-blue-500/20"
                              : "border-slate-700/50 hover:border-slate-600/50"
                          }`} style={{ height: 'calc(100% - 1.5rem)' }}>
                            
                            {/* Thumbnail */}
                            <div className="relative h-36 overflow-hidden flex-shrink-0">
                              <img
                                src={getTournamentImage(tournament)}
                                alt={`${tournament.game} tournament`}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
                            </div>

                            {/* Content - Fixed layout to prevent text cutoff */}
                            <div className="p-4 flex flex-col flex-1">
                              {/* Game Tag */}
                              <div className="flex items-center gap-2 mb-3">
                                <Gamepad2 className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                                <span className="text-xs text-blue-300 font-semibold uppercase tracking-wider truncate">{tournament.game}</span>
                              </div>

                              {/* Title */}
                              <h4 className="text-base font-bold text-white leading-snug mb-auto line-clamp-2">
                                {tournament.title}
                              </h4>

                              {/* Info Section - Fixed at bottom */}
                              <div className="space-y-3 pt-3 mt-3 border-t border-slate-700/50">
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-1.5 flex-1 min-w-0">
                                    <Trophy className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                                    <span className="text-sm font-bold text-white truncate">${tournament.prize_pool.toLocaleString()}</span>
                                  </div>
                                  <div className="px-2.5 py-1 bg-slate-700/50 rounded text-xs text-slate-300 font-semibold whitespace-nowrap">
                                    {getDaysRemaining(tournament.end_date)}
                                  </div>
                                </div>
                                
                                {tournament.status === "active" && (
                                  <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse flex-shrink-0"></div>
                                    <span className="text-xs text-emerald-300 font-semibold">Active Tournament</span>
                                  </div>
                                )}

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    openTournamentModal(tournament)
                                  }}
                                  className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-sm font-bold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30"
                                >
                                  View Details
                                </button>
                              </div>
                            </div>

                            {selectedTournament?.id === tournament.id && (
                              <div className="absolute inset-0 pointer-events-none">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center max-w-md">
                      <div className="w-20 h-20 bg-slate-800/50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-700/50">
                        <Trophy className="w-10 h-10 text-slate-500" />
                      </div>
                      <p className="text-slate-300 text-lg font-semibold mb-2">No tournaments found</p>
                      <p className="text-slate-400 text-sm mb-6">Try adjusting your filters or search terms</p>
                      <button
                        onClick={() => {
                          setSearchTerm("")
                          setFilterGame("all")
                          setFilterStatus("all")
                          setFilterPrize("all")
                        }}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors duration-300"
                      >
                        Clear Filters
                      </button>
                    </div>
                  </div>
                )}

                {filteredTournaments.length > 0 && (
                  <>
                    <div className="absolute left-0 top-0 bottom-6 bg-gradient-to-r from-slate-950 to-transparent w-16 pointer-events-none"></div>
                    <div className="absolute right-0 top-0 bottom-6 bg-gradient-to-l from-slate-950 to-transparent w-16 pointer-events-none"></div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tournament Details Modal */}
      {showModal && selectedTournament && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl border border-slate-700/50 shadow-2xl animate-in zoom-in-95 duration-300">
            
            <div className="relative h-64 overflow-hidden">
              <img
                src={getTournamentImage(selectedTournament)}
                alt={`${selectedTournament.game} tournament`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>

              <button
                onClick={() => setShowModal(false)}
                className="absolute top-6 right-6 p-3 bg-black/50 backdrop-blur-xl hover:bg-black/70 rounded-full text-white transition-all duration-300 border border-white/20 hover:scale-110"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center gap-2 mb-3">
                  <Gamepad2 className="w-5 h-5 text-blue-400" />
                  <span className="text-blue-300 font-semibold">{selectedTournament.game}</span>
                </div>
                <h2 className="text-3xl font-black text-white mb-2">{selectedTournament.title}</h2>
                {selectedTournament.status === "active" && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 backdrop-blur-xl rounded-full border border-emerald-400/30">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold text-emerald-300">Live Tournament</span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-8">
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-amber-500/20 to-orange-600/20 rounded-2xl p-6 border border-amber-400/30">
                  <Trophy className="w-6 h-6 text-amber-400 mb-3" />
                  <p className="text-xs text-amber-200/80 uppercase tracking-widest font-bold mb-2">Prize Pool</p>
                  <p className="text-3xl font-black text-white">${selectedTournament.prize_pool.toLocaleString()}</p>
                </div>
                <div className="bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-2xl p-6 border border-blue-400/30">
                  <Calendar className="w-6 h-6 text-blue-400 mb-3" />
                  <p className="text-xs text-blue-200/80 uppercase tracking-widest font-bold mb-2">Start Date</p>
                  <p className="text-lg font-bold text-white">{new Date(selectedTournament.start_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-2xl p-6 border border-purple-400/30">
                  <Clock className="w-6 h-6 text-purple-400 mb-3" />
                  <p className="text-xs text-purple-200/80 uppercase tracking-widest font-bold mb-2">End Date</p>
                  <p className="text-lg font-bold text-white">{new Date(selectedTournament.end_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>
              </div>

              <div className="space-y-6 mb-8">
                <div>
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Info className="w-5 h-5 text-blue-400" />
                    About This Tournament
                  </h3>
                  <p className="text-slate-300 leading-relaxed text-lg">
                    {selectedTournament.description || "Compete in this exciting tournament and showcase your skills. Join players from around the world for a chance to win amazing prizes and claim your spot at the top of the leaderboard."}
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-400" />
                    How to Participate
                  </h3>
                  <ul className="space-y-3 text-slate-300">
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-600/30 rounded-full flex items-center justify-center text-blue-400 font-bold text-sm">1</span>
                      <span>Register using the "Join Tournament" button below</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-600/30 rounded-full flex items-center justify-center text-blue-400 font-bold text-sm">2</span>
                      <span>Submit your best gameplay clips before the deadline</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-600/30 rounded-full flex items-center justify-center text-blue-400 font-bold text-sm">3</span>
                      <span>Vote for other submissions to increase community engagement</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-600/30 rounded-full flex items-center justify-center text-blue-400 font-bold text-sm">4</span>
                      <span>Win prizes based on community votes and final rankings</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href={`/tournaments/${selectedTournament.id}`}
                  className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold text-center rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5"
                >
                  {selectedTournament.status === "active" ? "Join Tournament Now" : selectedTournament.status === "upcoming" ? "View Full Details" : "View Results"}
                </Link>

                <button
                  onClick={() => setShowModal(false)}
                  className="px-8 py-4 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-xl transition-all duration-300 hover:-translate-y-0.5"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        
        /* Improved Fire Effect Particles */
        .fire-particle {
          position: absolute;
          width: 5px;
          height: 10px;
          border-radius: 50%;
          opacity: 0;
          filter: blur(1.5px);
        }
        
        .fire-particle-1 {
          left: 15%;
          bottom: 0;
          background: linear-gradient(to top, #ff6b00, #ff0000, #ff4400);
          animation: fire-rise-1 2s ease-out infinite;
        }
        
        .fire-particle-2 {
          left: 40%;
          bottom: 0;
          background: linear-gradient(to top, #ff8800, #ff2200, #ff5500);
          animation: fire-rise-2 1.8s ease-out infinite 0.3s;
        }
        
        .fire-particle-3 {
          right: 40%;
          bottom: 0;
          background: linear-gradient(to top, #ffaa00, #ff4400, #ff6600);
          animation: fire-rise-1 1.9s ease-out infinite 0.5s;
        }
        
        .fire-particle-4 {
          right: 15%;
          bottom: 0;
          background: linear-gradient(to top, #ff6b00, #ff0000, #ff3300);
          animation: fire-rise-2 2.1s ease-out infinite 0.2s;
        }
        
        /* Ember particles */
        .ember {
          position: absolute;
          width: 2.5px;
          height: 2.5px;
          border-radius: 50%;
          background: #ffdd00;
          opacity: 0;
          box-shadow: 0 0 4px #ffdd00;
        }
        
        .ember-1 {
          left: 25%;
          bottom: 0;
          animation: ember-float-1 2.5s ease-out infinite;
        }
        
        .ember-2 {
          left: 55%;
          bottom: 0;
          animation: ember-float-2 2.8s ease-out infinite 0.4s;
        }
        
        .ember-3 {
          right: 35%;
          bottom: 0;
          animation: ember-float-3 2.3s ease-out infinite 0.7s;
        }
        
        @keyframes fire-rise-1 {
          0% {
            opacity: 0;
            transform: translateY(0) translateX(0) scale(1);
          }
          20% {
            opacity: 1;
          }
          80% {
            opacity: 0.7;
          }
          100% {
            opacity: 0;
            transform: translateY(-45px) translateX(-10px) scale(0.4);
          }
        }
        
        @keyframes fire-rise-2 {
          0% {
            opacity: 0;
            transform: translateY(0) translateX(0) scale(1);
          }
          20% {
            opacity: 1;
          }
          80% {
            opacity: 0.6;
          }
          100% {
            opacity: 0;
            transform: translateY(-40px) translateX(12px) scale(0.3);
          }
        }
        
        @keyframes ember-float-1 {
          0% {
            opacity: 0;
            transform: translateY(0) translateX(0);
          }
          30% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateY(-55px) translateX(-15px);
          }
        }
        
        @keyframes ember-float-2 {
          0% {
            opacity: 0;
            transform: translateY(0) translateX(0);
          }
          30% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateY(-50px) translateX(10px);
          }
        }
        
        @keyframes ember-float-3 {
          0% {
            opacity: 0;
            transform: translateY(0) translateX(0);
          }
          30% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateY(-60px) translateX(5px);
          }
        }
        
        @keyframes ken-burns {
          0% { transform: scale(1.05); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1.05); }
        }
        
        .animate-ken-burns {
          animation: ken-burns 20s ease-in-out infinite;
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }
        
        .animate-fade-in-up-delay {
          animation: fade-in-up 0.8s ease-out 0.2s both;
        }
        
        .animate-fade-in-up-delay-2 {
          animation: fade-in-up 0.8s ease-out 0.4s both;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
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
          from { opacity: 0; }
          to { opacity: 1; }
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
