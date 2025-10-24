"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { VotingCard } from "@/components/voting-card"

interface Submission {
  id: string
  title: string
  description: string
  clip_url: string
  user: { display_name: string }
  votes: number
  likes: number
  comments: number
  userVoted: boolean
}

interface Tournament {
  id: string
  title: string
  game: string
}

export default function TournamentVotePage() {
  const params = useParams()
  const tournamentId = params.tournamentId as string
  const [tournament, setTournament] = useState<Tournament | null>(null)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [userSession, setUserSession] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()

      // Get user session
      const { data: sessionData } = await supabase.auth.getSession()
      setUserSession(sessionData.session?.user)

      // Fetch tournament
      const { data: tournamentData } = await supabase
        .from("tournaments")
        .select("*")
        .eq("id", tournamentId)
        .maybeSingle()

      setTournament(tournamentData)

      const { data: submissionsData } = await supabase
        .from("submissions")
        .select(
          `
          id,
          title,
          description,
          clip_url,
          user:users(display_name),
          votes(id),
          likes(id),
          comments(id)
        `,
        )
        .eq("tournament_id", tournamentId)
        .eq("status", "approved")

      if (submissionsData) {
        const formattedSubmissions = submissionsData.map((sub: any) => ({
          id: sub.id,
          title: sub.title,
          description: sub.description,
          clip_url: sub.clip_url,
          user: sub.user,
          votes: sub.votes?.length || 0,
          likes: sub.likes?.length || 0,
          comments: sub.comments?.length || 0,
          userVoted: sessionData.session?.user
            ? sub.votes?.some((v: any) => v.user_id === sessionData.session.user.id)
            : false,
        }))
        setSubmissions(formattedSubmissions)
      }

      setIsLoading(false)
    }

    fetchData()
  }, [tournamentId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!tournament) {
    return (
      <div className="min-h-screen bg-[#0a0f1e]">
        <Navbar />
        <main className="container mx-auto px-4 py-16">
          <p className="text-white/60">Tournament not found</p>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e]">
      <Navbar />

      <main className="container mx-auto px-4 py-16">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">{tournament.title}</h1>
          <p className="text-white/60 mb-4">{tournament.game}</p>
          <div className="bg-[#1a2332] rounded-lg border border-[#2a3342] p-4 inline-block">
            <p className="text-white/80 text-sm">
              <span className="font-semibold">Voting System:</span> Vote for 1st (3pts), 2nd (2pts), or 3rd (1pt) place
              clips. Everyone can vote!
            </p>
          </div>
        </div>

        {submissions.length === 0 ? (
          <div className="bg-[#1a2332] rounded-lg border border-[#2a3342] p-12 text-center">
            <p className="text-white/60">No submissions available for voting yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {submissions.map((submission) => (
              <VotingCard
                key={submission.id}
                submission={submission}
                tournamentId={tournamentId}
                userSession={userSession}
                onVoteUpdate={() => {
                  // Refresh submissions
                }}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
