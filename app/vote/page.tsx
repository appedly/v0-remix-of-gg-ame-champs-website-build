"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

interface Tournament {
  id: string
  title: string
  game: string
  description: string
  status: string
  start_date: string
  end_date: string
}

export default function VotePage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTournaments = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from("tournaments")
        .select("*")
        .eq("status", "active")
        .order("start_date", { ascending: false })

      setTournaments(data || [])
      setIsLoading(false)
    }

    fetchTournaments()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
        <div className="text-white">Loading tournaments...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e]">
      <Navbar />

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Vote on Clips</h1>
          <p className="text-white/60 text-lg">Choose your favorite submissions and help determine the winners</p>
        </div>

        {tournaments.length === 0 ? (
          <div className="bg-[#1a2332] rounded-lg border border-[#2a3342] p-12 text-center">
            <p className="text-white/60 mb-4">No active tournaments available for voting</p>
            <Link href="/" className="text-[#4A6CFF] hover:text-[#5A7CFF]">
              Back to home
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournaments.map((tournament) => (
              <Link
                key={tournament.id}
                href={`/vote/${tournament.id}`}
                className="bg-[#1a2332] rounded-lg border border-[#2a3342] p-6 hover:border-[#4A6CFF] transition-colors group"
              >
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-[#4A6CFF] transition-colors">
                  {tournament.title}
                </h3>
                <p className="text-white/60 text-sm mb-4">{tournament.game}</p>
                <p className="text-white/40 text-sm line-clamp-2 mb-4">{tournament.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[#4A6CFF] text-sm font-medium">Vote Now →</span>
                  <span className="text-white/40 text-xs">
                    Ends: {new Date(tournament.end_date).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
