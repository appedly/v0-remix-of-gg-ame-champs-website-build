"use client"

import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { UserNav } from "@/components/user-nav"
import { Search, Filter, ChevronLeft, ChevronRight, Trophy, Calendar, Gamepad2, Clock, X, Play, Info, Star, Sparkles } from "lucide-react"
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

// High-quality game banners from official sources
const gameImages: { [key: string]: string } = {
  "Fortnite": "https://cdn2.unrealengine.com/fortnite-chapter-5-season-1-key-art-3840x2160-b0c71bf8f597.jpg",
  "Valorant": "https://cmsassets.rgpub.io/sanity/images/dsfx7636/news/4a9c5434b37e6aecfd9e63b48c6b4b48e457b635-1920x1080.jpg",
  "Call of Duty": "https://www.callofduty.com/content/dam/atvi/callofduty/cod-touchui/blog/hero/mw-wz/WZ-Season-Three-Announce-TOUT.jpg",
  "Apex Legends": "https://media.contentapi.ea.com/content/dam/apex-legends/common/articles/season-19-ignite/apex-section-ignite-4k-jpg.jpg",
  "League of Legends": "https://cmsassets.rgpub.io/sanity/images/dsfx7636/news/bb1f0b5e36c0b3b1e91d1d1f1e6a0a5e9e7e3f5a-3840x2160.jpg",
  "CS2": "https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg",
  "CSGO": "https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg",
  "CS:GO": "https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg",
  "Counter-Strike 2": "https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg",
  "Overwatch 2": "https://blz-contentstack-images.akamaized.net/v3/assets/blt9c12f249ac15c7ec/blt7c6c23d54bf6e0c7/62e283af5533cf0ee3c66555/OW2_KeyArt_Logo_6-9_PNG.png",
  "Rocket League": "https://cdn2.unrealengine.com/24br2-egs-rocketleague-psyonixllc-s1-2560x1440-553143324.jpg",
  "Minecraft": "https://www.minecraft.net/content/dam/games/minecraft/marketplace/mediablock-buzzybees.jpg",
  "FIFA": "https://media.contentapi.ea.com/content/dam/ea/fifa/fifa-23/common/featured-tiles/fifa-23-announce-featured-tile.jpg.adapt.crop191x100.1200w.jpg",
  "NBA 2K": "https://cdn2.unrealengine.com/egs-nba2k24-visualconcepts-g1a-00-1920x1080-b0c71bf8f597.jpg",
  "Madden": "https://media.contentapi.ea.com/content/dam/ea/madden-nfl/madden-nfl-24/common/featured-tiles/madden-24-featured-tile-16x9.jpg.adapt.crop191x100.1200w.jpg",
  "Fortnite Creative": "https://cdn2.unrealengine.com/fortnite-chapter-5-season-1-key-art-3840x2160-b0c71bf8f597.jpg",
  "Warzone": "https://www.callofduty.com/content/dam/atvi/callofduty/cod-touchui/blog/hero/mw-wz/WZ-Season-Three-Announce-TOUT.jpg",
  "Red Dead Redemption 2": "https://media-rockstargames-com.akamaized.net/rockstargames-newsite/img/global/games/fob/1280/reddeadredemption2.jpg",
  "RDR2": "https://media-rockstargames-com.akamaized.net/rockstargames-newsite/img/global/games/fob/1280/reddeadredemption2.jpg",
  "GTA V": "https://media-rockstargames-com.akamaized.net/rockstargames-newsite/img/global/games/fob/1280/V.jpg",
  "Dota 2": "https://cdn.cloudflare.steamstatic.com/steam/apps/570/header.jpg",
  "Destiny 2": "https://www.bungie.net/7/ca/destiny/bgs/season20/s20_hero_desktop_16x9.jpg",
}

// Function to get tournament image with fallback to game image
const getTournamentImage = (tournament: Tournament) => {
  // Use custom tournament image if available (admin uploaded)
  if (tournament.image_url && tournament.image_url.trim() !== "") {
    return tournament.image_url
  }
  // Fallback to game-specific image
  return gameImages[tournament.game] || "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1920&q=80"
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
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      <UserNav userName={userData?.display_name || "User"} />

      {/* Main Content Container - 2:1 Ratio Layout */}
      <div className="flex-1 flex flex-col">
        
        {/* Hero Section - 2/3 of viewport height */}
        <div className="relative h-[66vh] overflow-hidden">
          {selectedTournament && (
            <>
              {/* Background Image with Parallax Effect */}
              <div className="absolute inset-0 transition-all duration-1000 ease-in-out">
                <img
                  key={selectedTournament.id}
                  src={getTournamentImage(selectedTournament)}
                  alt={`${selectedTournament.game} tournament`}
                  className="w-full h-full object-cover scale-105 animate-ken-burns"
                />
                {/* Multi-layer gradient overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/40"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-transparent to-slate-900/60"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900"></div>
              </div>

              {/* Content Overlay */}
              <div className="relative z-10 h-full flex items-end">
                <div className="container mx-auto px-6 lg:px-12 pb-12 lg:pb-16">
                  <div className="max-w-4xl space-y-6">
                    
                    {/* Status Badge */}
                    {selectedTournament.status === "active" && (
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 backdrop-blur-xl rounded-full border border-emerald-400/30">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                        <span className="text-sm font-semibold text-emerald-300 uppercase tracking-wider">Live Now</span>
                      </div>
                    )}
                    
                    {selectedTournament.status === "upcoming" && (
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 backdrop-blur-xl rounded-full border border-blue-400/30">
                        <Clock className="w-3.5 h-3.5 text-blue-300" />
                        <span className="text-sm font-semibold text-blue-300 uppercase tracking-wider">Coming Soon</span>
                      </div>
                    )}

                    {/* Game Tag */}
                    <div className="flex items-center gap-3">
                      <Gamepad2 className="w-5 h-5 text-blue-400" />
                      <span className="text-blue-300 font-semibold text-lg tracking-wide">{selectedTournament.game}</span>
                    </div>

                    {/* Title with Fade-in Animation */}
                    <h1 
                      key={`title-${selectedTournament.id}`}
                      className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight animate-fade-in-up"
                      style={{ 
                        textShadow: '0 4px 12px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.3)'
                      }}
                    >
                      {selectedTournament.title}
                    </h1>

                    {/* Description */}
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

                    {/* Stats Grid */}
                    <div 
                      key={`stats-${selectedTournament.id}`}
                      className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 animate-fade-in-up-delay-2"
                    >
                      {/* Prize Pool */}
                      <div className="group relative bg-gradient-to-br from-amber-500/20 to-orange-600/20 backdrop-blur-xl rounded-2xl p-5 border border-amber-400/30 hover:border-amber-400/60 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/20">
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-400/0 to-orange-500/0 group-hover:from-amber-400/10 group-hover:to-orange-500/10 rounded-2xl transition-all duration-500"></div>
                        <Trophy className="w-5 h-5 text-amber-400 mb-2" />
                        <p className="text-xs text-amber-200/80 uppercase tracking-widest font-bold mb-1">Prize Pool</p>
                        <p className="text-2xl font-black text-white">${selectedTournament.prize_pool.toLocaleString()}</p>
                      </div>

                      {/* Start Date */}
                      <div className="group relative bg-gradient-to-br from-blue-500/20 to-indigo-600/20 backdrop-blur-xl rounded-2xl p-5 border border-blue-400/30 hover:border-blue-400/60 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/0 to-indigo-500/0 group-hover:from-blue-400/10 group-hover:to-indigo-500/10 rounded-2xl transition-all duration-500"></div>
                        <Calendar className="w-5 h-5 text-blue-400 mb-2" />
                        <p className="text-xs text-blue-200/80 uppercase tracking-widest font-bold mb-1">Starts</p>
                        <p className="text-base font-bold text-white">{new Date(selectedTournament.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      </div>

                      {/* End Date */}
                      <div className="group relative bg-gradient-to-br from-purple-500/20 to-pink-600/20 backdrop-blur-xl rounded-2xl p-5 border border-purple-400/30 hover:border-purple-400/60 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-400/0 to-pink-500/0 group-hover:from-purple-400/10 group-hover:to-pink-500/10 rounded-2xl transition-all duration-500"></div>
                        <Clock className="w-5 h-5 text-purple-400 mb-2" />
                        <p className="text-xs text-purple-200/80 uppercase tracking-widest font-bold mb-1">Ends</p>
                        <p className="text-base font-bold text-white">{new Date(selectedTournament.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      </div>

                      {/* Status */}
                      <div className="group relative bg-gradient-to-br from-emerald-500/20 to-teal-600/20 backdrop-blur-xl rounded-2xl p-5 border border-emerald-400/30 hover:border-emerald-400/60 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/20">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/0 to-teal-500/0 group-hover:from-emerald-400/10 group-hover:to-teal-500/10 rounded-2xl transition-all duration-500"></div>
                        <Star className="w-5 h-5 text-emerald-400 mb-2" />
                        <p className="text-xs text-emerald-200/80 uppercase tracking-widest font-bold mb-1">Status</p>
                        <p className="text-base font-bold text-white capitalize">{selectedTournament.status}</p>
                      </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-wrap gap-4 pt-4">
                      <Link
                        href={`/tournaments/${selectedTournament.id}`}
                        className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/50 overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                        <span className="relative flex items-center gap-2">
                          {selectedTournament.status === "active" ? (
                            <>
                              <Play className="w-5 h-5" />
                              Join Tournament
                            </>
                          ) : selectedTournament.status === "upcoming" ? (
                            <>
                              <Info className="w-5 h-5" />
                              View Details
                            </>
                          ) : (
                            <>
                              <Trophy className="w-5 h-5" />
                              View Results
                            </>
                          )}
                        </span>
                      </Link>

                      <button
                        onClick={() => openTournamentModal(selectedTournament)}
                        className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white font-bold rounded-xl transition-all duration-300 border border-white/20 hover:border-white/40 hover:scale-105"
                      >
                        Learn More
                      </button>
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

        {/* Tournament Carousel - 1/3 of viewport height */}
        <div className="relative h-[34vh] bg-gradient-to-b from-slate-900 to-slate-950 border-t border-slate-800/50">
          
          {/* Filter Bar */}
          <div className="absolute top-0 left-0 right-0 z-30 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/50">
            <div className="container mx-auto px-6 lg:px-12 py-4">
              <div className="flex items-center justify-between gap-4">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search tournaments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                  />
                </div>

                {/* Filter Toggle & Count */}
                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-xl border border-slate-700/50">
                    <span className="text-slate-400 text-sm font-medium">{filteredTournaments.length} Tournaments</span>
                  </div>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-4 py-3 transition-all duration-300 rounded-xl border font-medium ${
                      showFilters 
                        ? 'bg-blue-600/30 border-blue-400/50 text-blue-300' 
                        : 'bg-slate-800/50 border-slate-700/50 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Filter className="w-4 h-4" />
                    <span className="hidden sm:inline">Filters</span>
                  </button>
                </div>
              </div>

              {/* Filter Options */}
              {showFilters && (
                <div className="mt-4 p-4 bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700/50 animate-in slide-in-from-top-2 duration-300">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <select
                      value={filterGame}
                      onChange={(e) => setFilterGame(e.target.value)}
                      className="px-4 py-2.5 bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                    >
                      <option value="all">All Games</option>
                      {uniqueGames.map(game => (
                        <option key={game} value={game}>{game}</option>
                      ))}
                    </select>

                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-4 py-2.5 bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="upcoming">Upcoming</option>
                      <option value="completed">Completed</option>
                    </select>

                    <select
                      value={filterPrize}
                      onChange={(e) => setFilterPrize(e.target.value)}
                      className="px-4 py-2.5 bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
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
                      className="px-4 py-2.5 bg-slate-900/50 backdrop-blur-xl hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-all duration-300 border border-slate-700/50"
                    >
                      Clear All
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Horizontal Scrolling Carousel */}
          <div className={`h-full ${showFilters ? 'pt-40' : 'pt-20'} transition-all duration-300`}>
            <div className="container mx-auto px-6 lg:px-12 h-full">
              <div className="relative h-full" ref={carouselRef}>
                
                {filteredTournaments.length > 0 ? (
                  <div className="flex gap-4 overflow-x-auto scrollbar-hide h-full pb-6 scroll-smooth">
                    {filteredTournaments.map((tournament, index) => (
                      <div
                        key={tournament.id}
                        data-tournament-id={tournament.id}
                        onClick={() => {
                          setSelectedTournament(tournament)
                          setCurrentTournamentIndex(index)
                        }}
                        className={`group cursor-pointer transition-all duration-500 flex-shrink-0 w-80 ${
                          selectedTournament?.id === tournament.id 
                            ? "scale-105 ring-2 ring-blue-500 ring-offset-4 ring-offset-slate-900" 
                            : "hover:scale-102"
                        }`}
                      >
                        <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 overflow-hidden transition-all duration-500 h-full shadow-xl hover:shadow-2xl hover:border-slate-600/50">
                          
                          {/* Thumbnail */}
                          <div className="relative h-32 overflow-hidden">
                            <img
                              src={getTournamentImage(tournament)}
                              alt={`${tournament.game} tournament`}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
                            
                            {/* Active Indicator */}
                            {tournament.status === "active" && (
                              <div className="absolute top-3 right-3">
                                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/30 backdrop-blur-xl rounded-full border border-emerald-400/50">
                                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                                  <span className="text-xs font-bold text-emerald-200 uppercase tracking-wide">Live</span>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="p-4 space-y-3">
                            {/* Game Tag */}
                            <div className="flex items-center gap-2">
                              <Gamepad2 className="w-3.5 h-3.5 text-blue-400" />
                              <span className="text-xs text-blue-300 font-semibold uppercase tracking-wider">{tournament.game}</span>
                            </div>

                            {/* Title */}
                            <h4 className="text-base font-bold text-white line-clamp-2 leading-snug">
                              {tournament.title}
                            </h4>

                            {/* Stats */}
                            <div className="flex items-center justify-between gap-3 pt-2">
                              <div className="flex items-center gap-1.5">
                                <Trophy className="w-4 h-4 text-amber-400" />
                                <span className="text-sm font-bold text-white">${tournament.prize_pool.toLocaleString()}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                <span className="text-xs text-slate-300">{new Date(tournament.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                              </div>
                            </div>

                            {/* View Button */}
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

                          {/* Selected Indicator */}
                          {selectedTournament?.id === tournament.id && (
                            <div className="absolute inset-0 pointer-events-none">
                              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
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

                {/* Scroll Fade Effects */}
                {filteredTournaments.length > 0 && (
                  <>
                    <div className="absolute left-0 top-0 bottom-6 bg-gradient-to-r from-slate-950 to-transparent w-12 pointer-events-none"></div>
                    <div className="absolute right-0 top-0 bottom-6 bg-gradient-to-l from-slate-950 to-transparent w-12 pointer-events-none"></div>
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

            {/* Modal Content */}
            <div className="p-8">
              
              {/* Stats Grid */}
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

              {/* Description */}
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

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href={`/tournaments/${selectedTournament.id}`}
                  className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold text-center rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-105"
                >
                  {selectedTournament.status === "active" ? "Join Tournament Now" : selectedTournament.status === "upcoming" ? "View Full Details" : "View Results"}
                </Link>

                <button
                  onClick={() => setShowModal(false)}
                  className="px-8 py-4 bg-slate-800/50 hover:bg-slate-800 text-white font-bold rounded-xl transition-all duration-300 border border-slate-700/50"
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
        @keyframes ken-burns {
          0% {
            transform: scale(1.05);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1.05);
          }
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
        .hover\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  )
}
