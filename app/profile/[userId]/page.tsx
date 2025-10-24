import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { UserNav } from "@/components/user-nav"
import { Award, Video } from "lucide-react"

export default async function UserProfilePage({ params }: { params: { userId: string } }) {
  const supabase = await createClient()

  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser()

  if (!currentUser) {
    redirect("/login")
  }

  // Get the profile user
  const { data: profileUser } = await supabase.from("users").select("*").eq("id", params.userId).single()

  if (!profileUser) {
    notFound()
  }

  // Get user's submissions
  const { data: submissions } = await supabase
    .from("submissions")
    .select("*")
    .eq("user_id", params.userId)
    .eq("status", "approved")
    .order("created_at", { ascending: false })

  const { data: currentUserData } = await supabase.from("users").select("*").eq("id", currentUser.id).single()

  return (
    <div className="min-h-screen bg-[#0B1020]">
      <UserNav userName={currentUserData?.display_name || "User"} />

      <main className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-[#1a2332] rounded-lg border border-[#2a3342] p-8 mb-8">
          <div className="flex items-start gap-6 mb-6">
            {profileUser.avatar_url && (
              <img
                src={profileUser.avatar_url || "/placeholder.svg"}
                alt={profileUser.display_name}
                className="w-24 h-24 rounded-lg object-cover"
              />
            )}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-white">{profileUser.display_name}</h1>
                {profileUser.founding_member && (
                  <div className="flex items-center gap-1 px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full">
                    <Award className="w-4 h-4 text-yellow-400" />
                    <span className="text-xs font-semibold text-yellow-400">Founding Member</span>
                  </div>
                )}
              </div>
              {profileUser.bio && <p className="text-white/70 mb-4">{profileUser.bio}</p>}
              <div className="flex items-center gap-4 text-white/60 text-sm">
                <span>Joined {new Date(profileUser.created_at).toLocaleDateString()}</span>
                <span>{submissions?.length || 0} submissions</span>
              </div>
            </div>
          </div>
        </div>

        {/* Submissions */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Video className="w-6 h-6" />
            Submissions
          </h2>

          {submissions && submissions.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {submissions.map((submission) => (
                <div
                  key={submission.id}
                  className="bg-[#1a2332] rounded-lg border border-[#2a3342] overflow-hidden hover:border-[#4A6CFF]/50 transition-colors"
                >
                  <div className="aspect-video bg-[#0B1020] flex items-center justify-center">
                    <Video className="w-8 h-8 text-white/40" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-white mb-1 truncate">{submission.title}</h3>
                    <p className="text-white/60 text-sm mb-3 line-clamp-2">{submission.description}</p>
                    <p className="text-white/40 text-xs">{new Date(submission.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#1a2332] rounded-lg border border-[#2a3342] p-12 text-center">
              <p className="text-white/60">No submissions yet</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
