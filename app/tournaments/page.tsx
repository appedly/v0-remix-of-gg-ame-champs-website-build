"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { UserNav } from "@/components/user-nav"
import { Search, Filter, Trophy, Calendar, DollarSign, Gamepad2, Clock, Users, Star, ExternalLink, TrendingUp, Zap, Target, Award, Sparkles } from "lucide-react"
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
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [userData, setUserData] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterGame, setFilterGame] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterPrize, setFilterPrize] = useState("all")
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchUser()
    fetchTournaments()
  }, [])

  useEffect(() => {
    filterTournaments()
  }, [tournaments, searchTerm, filterGame, filterStatus, filterPrize])

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
          bg: "bg-gradient-to-r from-green-500/20 to-emerald-500/20", 
          text: "text-green-400",
          border: "border-green-500/30",
          icon: Zap
        }
      case "upcoming": 
        return { 
          bg: "bg-gradient-to-r from-blue-500/20 to-indigo-500/20", 
          text: "text-blue-400",
          border: "border-blue-500/30",
          icon: Clock
        }
      case "completed": 
        return { 
          bg: "bg-gradient-to-r from-slate-500/20 to-gray-500/20", 
          text: "text-slate-400",
          border: "border-slate-500/30",
          icon: Award
        }
      default: 
        return { 
          bg: "bg-gradient-to-r from-slate-500/20 to-gray-500/20", 
          text: "text-slate-400",
          border: "border-slate-500/30",
          icon: Trophy
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

      {/* Modern Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-slate-900 to-purple-900/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(59,130,246,0.15),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(168,85,247,0.1),transparent_50%)]"></div>
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
              Gaming Tournaments
            </h1>
            
            <p className="text-xl text-slate-300 mb-8 leading-relaxed max-w-2xl mx-auto">
              Compete in thrilling tournaments, showcase your skills, and win amazing prizes. Join the ultimate gaming competition platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <div className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full">
                <Target className="w-5 h-5 text-blue-400" />
                <span className="text-blue-300 font-semibold">{filteredTournaments.length} Active Tournaments</span>
              </div>
              <div className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-full">
                <Zap className="w-5 h-5 text-green-400" />
                <span className="text-green-300 font-semibold">Join & Compete Now</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Filter Section */}
      <div className="sticky top-0 z-40 bg-slate-800/95 backdrop-blur-md border-b border-slate-700/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            <div className="relative flex-1 w-full max-w-xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search tournaments, games, or descriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-slate-700/70 transition-all duration-300"
              />
            </div>

            <div className="flex gap-4 items-center w-full lg:w-auto justify-between lg:justify-end">
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg">
                <Target className="w-4 h-4 text-blue-400" />
                <span className="text-blue-300 font-medium">
                  {filteredTournaments.length} {filteredTournaments.length === 1 ? 'Tournament' : 'Tournaments'}
                </span>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all duration-300 ${
                  showFilters 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25' 
                    : 'bg-slate-700/50 hover:bg-slate-700/70 border border-slate-600/50 text-white'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filters</span>
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-6 p-6 bg-slate-700/30 rounded-xl border border-slate-600/30 backdrop-blur-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-slate-300 text-sm font-semibold mb-3">
                    <Gamepad2 className="inline w-4 h-4 mr-2 text-blue-400" />
                    Game
                  </label>
                  <select
                    value={filterGame}
                    onChange={(e) => setFilterGame(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:bg-slate-700/70 transition-all duration-300"
                  >
                    <option value="all">All Games</option>
                    {uniqueGames.map(game => (
                      <option key={game} value={game}>{game}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-semibold mb-3">
                    <Star className="inline w-4 h-4 mr-2 text-yellow-400" />
                    Status
                  </label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:bg-slate-700/70 transition-all duration-300"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-semibold mb-3">
                    <Trophy className="inline w-4 h-4 mr-2 text-yellow-400" />
                    Prize Pool
                  </label>
                  <select
                    value={filterPrize}
                    onChange={(e) => setFilterPrize(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:bg-slate-700/70 transition-all duration-300"
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
                    className="w-full px-4 py-3 bg-slate-600/50 hover:bg-slate-500/50 text-white rounded-xl font-medium transition-all duration-300 border border-slate-500/30"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tournament Cards Grid */}
      <div className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-2">Available Tournaments</h2>
              <p className="text-slate-400">Compete in exciting gaming tournaments and win amazing prizes</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTournaments.map((tournament) => {
              const statusStyles = getStatusStyles(tournament.status)
              const StatusIcon = statusStyles.icon
              
              return (
                <div
                  key={tournament.id}
                  className="group relative bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden hover:border-blue-500/30 transition-all duration-500 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1"
                >
                  {/* Background Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Game Image Section */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={gameImages[tournament.game] || "/placeholder.jpg"}
                      alt={tournament.game}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      <div className={`flex items-center gap-2 px-3 py-2 rounded-full ${statusStyles.bg} ${statusStyles.border} border backdrop-blur-sm`}>
                        <StatusIcon className="w-3 h-3" />
                        <span className={`${statusStyles.text} font-bold text-xs uppercase tracking-wide`}>
                          {tournament.status}
                        </span>
                      </div>
                    </div>

                    {/* Game Badge */}
                    <div className="absolute bottom-4 left-4">
                      <div className="px-3 py-1 bg-slate-900/80 backdrop-blur-sm rounded-lg">
                        <span className="text-white font-semibold text-sm">{tournament.game}</span>
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6 relative">
                    <h3 className="text-xl font-bold text-white mb-3 overflow-hidden group-hover:text-blue-300 transition-colors duration-300" style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {tournament.title}
                    </h3>

                    {tournament.description && (
                      <p className="text-slate-400 text-sm mb-4 leading-relaxed overflow-hidden" style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}>
                        {tournament.description}
                      </p>
                    )}

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="flex items-center gap-2 p-3 bg-slate-700/30 rounded-lg border border-slate-600/30">
                        <Trophy className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                        <div>
                          <p className="text-slate-500 text-xs uppercase tracking-wide">Prize</p>
                          <p className="text-yellow-400 font-bold text-sm">${tournament.prize_pool.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-slate-700/30 rounded-lg border border-slate-600/30">
                        <Calendar className="w-4 h-4 text-blue-400 flex-shrink-0" />
                        <div>
                          <p className="text-slate-500 text-xs uppercase tracking-wide">Ends</p>
                          <p className="text-blue-400 font-bold text-sm">{new Date(tournament.end_date).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Link
                        href={`/tournaments/${tournament.id}`}
                        className={`flex-1 px-4 py-3 rounded-xl font-semibold text-center transition-all duration-300 ${
                          tournament.status === "active"
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40'
                            : tournament.status === "upcoming"
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40'
                            : 'bg-gradient-to-r from-slate-600 to-gray-600 hover:from-slate-700 hover:to-gray-700 text-white shadow-lg shadow-slate-600/25 hover:shadow-slate-600/40'
                        }`}
                      >
                        {tournament.status === "active" ? "Join Tournament" : tournament.status === "upcoming" ? "View Details" : "View Results"}
                      </Link>
                      
                      <Link
                        href={`/tournaments/${tournament.id}`}
                        className="px-4 py-3 bg-slate-700/50 hover:bg-slate-700/70 border border-slate-600/50 text-white rounded-xl font-semibold transition-all duration-300 hover:border-slate-500/50"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}

            {filteredTournaments.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-20 h-20 bg-slate-700/30 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-600/30">
                    <Trophy className="w-10 h-10 text-slate-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">No Tournaments Found</h3>
                  <p className="text-slate-400 mb-6">Try adjusting your filters or search terms to find available tournaments</p>
                  <button
                    onClick={() => {
                      setSearchTerm("")
                      setFilterGame("all")
                      setFilterStatus("all")
                      setFilterPrize("all")
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/25"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  )
}