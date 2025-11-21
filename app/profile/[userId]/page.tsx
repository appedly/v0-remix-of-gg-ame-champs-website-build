import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { UserNav } from "@/components/user-nav"
import { ProfileView } from "@/components/profile-view"

export default async function UserProfilePage({ params }: { params: { userId: string } }) {
  const supabase = await createClient()

  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser()

  if (!currentUser) {
    redirect("/login")
  }

  const { data: currentUserData } = await supabase.from("users").select("*").eq("id", currentUser.id).single()

  // If viewing own profile, redirect to /profile
  if (params.userId === currentUser.id) {
    redirect("/profile")
  }

  // Fetch the profile user's data
  const { data: profileUser } = await supabase.from("users").select("*").eq("id", params.userId).single()

  if (!profileUser) {
    redirect("/dashboard")
  }

  // Fetch profile user's submissions
  const { data: submissions } = await supabase
    .from("submissions")
    .select(`
      *,
      tournament:tournaments(title, status),
      likes:likes(count),
      votes:votes(count)
    `)
    .eq("user_id", params.userId)
    .eq("status", "approved")
    .order("created_at", { ascending: false })

  // Calculate total stats
  const totalLikes = submissions?.reduce((sum, sub) => {
    const likeCount = Array.isArray(sub.likes) ? sub.likes.length : 0
    return sum + likeCount
  }, 0) || 0

  const totalVotes = submissions?.reduce((sum, sub) => {
    const voteCount = Array.isArray(sub.votes) ? sub.votes.length : 0
    return sum + voteCount
  }, 0) || 0

  const totalPoints = submissions?.reduce((sum, sub) => sum + (sub.score || 0), 0) || 0

  return (
    <div className="min-h-screen bg-slate-900">
      <UserNav userName={currentUserData?.display_name || "User"} />
      <ProfileView
        profileUser={profileUser}
        submissions={submissions || []}
        totalLikes={totalLikes}
        totalVotes={totalVotes}
        totalPoints={totalPoints}
        isOwnProfile={false}
      />
    </div>
  )
}
