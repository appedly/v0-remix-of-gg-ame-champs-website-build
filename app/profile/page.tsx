"use client"

import type React from "react"
import { Award, Gift, Zap, Crown } from "lucide-react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { UserNav } from "@/components/user-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [displayName, setDisplayName] = useState("")
  const [bio, setBio] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [stats, setStats] = useState({
    totalSubmissions: 0,
    totalVotes: 0,
    approvedSubmissions: 0,
    activeTournaments: 0,
  })
  const [badges, setBadges] = useState([])
  const [earlyBirdBonus, setEarlyBirdBonus] = useState(null)
  const [referralCount, setReferralCount] = useState(0)
  const [isFoundingMember, setIsFoundingMember] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      console.log("[v0] Profile - Session check:", { session: !!session, error: sessionError })

      if (!session || sessionError) {
        router.push("/login")
        return
      }

      setUser(session.user)

      // Fetch user profile data
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", session.user.id)
        .single()

      console.log("[v0] Profile data fetch:", { data: userData, error: userError })

      if (userData) {
        setDisplayName(userData.display_name || "")
        setBio(userData.bio || "")
        setIsFoundingMember(userData.founding_member || false)
      }

      // Fetch user stats
      const { data: submissions } = await supabase
        .from("submissions")
        .select("*, votes:votes(count), tournament:tournaments(status)")
        .eq("user_id", session.user.id)

      if (submissions) {
        const totalVotes = submissions.reduce((sum, sub) => sum + (sub.votes?.length || 0), 0)
        const approvedSubmissions = submissions.filter((sub) => sub.status === "approved").length
        const activeTournaments = new Set(
          submissions.filter((sub) => sub.tournament?.status === "active").map((sub) => sub.tournament_id),
        ).size

        setStats({
          totalSubmissions: submissions.length,
          totalVotes,
          approvedSubmissions,
          activeTournaments,
        })
      }

      const { data: badgesData } = await supabase.from("badges").select("*").eq("user_id", session.user.id)

      const { data: earlyBirdData } = await supabase
        .from("early_bird_bonuses")
        .select("*")
        .eq("user_id", session.user.id)
        .single()

      const { data: referralData, count: referralCount } = await supabase
        .from("user_referrals")
        .select("*", { count: "exact" })
        .eq("referrer_id", session.user.id)

      setBadges(badgesData || [])
      setEarlyBirdBonus(earlyBirdData)
      setReferralCount(referralCount || 0)

      setIsLoading(false)
    }

    checkAuth()
  }, [router])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage(null)

    const supabase = createClient()

    console.log("[v0] Updating profile for user:", user.id)

    const { data, error } = await supabase
      .from("users")
      .update({
        display_name: displayName,
        bio: bio || null,
      })
      .eq("id", user.id)
      .select()

    console.log("[v0] Profile update result:", { data, error })

    if (error) {
      setMessage({ type: "error", text: `Error: ${error.message}` })
    } else {
      setMessage({ type: "success", text: "Profile updated successfully!" })
    }

    setIsSaving(false)
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsChangingPassword(true)
    setMessage(null)

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" })
      setIsChangingPassword(false)
      return
    }

    if (newPassword.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters" })
      setIsChangingPassword(false)
      return
    }

    const supabase = createClient()

    console.log("[v0] Changing password for user:", user.id)

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    console.log("[v0] Password change result:", { error })

    if (error) {
      setMessage({ type: "error", text: `Error: ${error.message}` })
    } else {
      setMessage({ type: "success", text: "Password changed successfully!" })
      setNewPassword("")
      setConfirmPassword("")
    }

    setIsChangingPassword(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <UserNav userName={user?.display_name || "User"} />

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
            {isFoundingMember && (
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg border border-yellow-500/30">
                <Crown className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-400 font-bold text-sm">FOUNDING MEMBER</span>
              </div>
            )}
          </div>
          <p className="text-slate-400">Manage your account and view your stats</p>
        </div>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg border ${
              message.type === "success"
                ? "bg-green-500/10 border-green-500/20 text-green-400"
                : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Founding Member Badge (if applicable) */}
        {isFoundingMember && (
          <div className="mb-8">
            <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl border border-yellow-500/20 p-8">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <Crown className="w-10 h-10 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                    Founding Member
                    <span className="text-yellow-400">●</span>
                  </h2>
                  <p className="text-slate-300 mb-4">
                    You're one of the first 50 members to join our community! This exclusive badge recognizes your early
                    support and commitment to the platform.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-400 text-sm font-semibold">Early Supporter</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                      <Award className="w-4 h-4 text-blue-400" />
                      <span className="text-blue-400 text-sm font-semibold">Community Pioneer</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Referral Stats */}
        <div className="mb-8 bg-slate-800 rounded-xl border border-slate-700 p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Gift className="w-5 h-5 text-blue-400" />
            Referral Stats
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
              <p className="text-slate-400 text-sm mb-1">Total Referrals</p>
              <p className="text-3xl font-bold text-blue-400">{referralCount}</p>
            </div>
            <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
              <p className="text-slate-400 text-sm mb-1">Access Codes Generated</p>
              <p className="text-3xl font-bold text-blue-400">{stats.totalSubmissions}</p>
            </div>
            <a
              href="/dashboard/referral-codes"
              className="bg-blue-600 rounded-lg p-4 border border-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              Manage Referrals
            </a>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
            <div className="text-slate-400 text-sm mb-1">Total Submissions</div>
            <div className="text-2xl font-bold text-white">{stats.totalSubmissions}</div>
          </div>
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
            <div className="text-slate-400 text-sm mb-1">Approved</div>
            <div className="text-2xl font-bold text-green-400">{stats.approvedSubmissions}</div>
          </div>
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
            <div className="text-slate-400 text-sm mb-1">Total Votes</div>
            <div className="text-2xl font-bold text-blue-400">{stats.totalVotes}</div>
          </div>
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
            <div className="text-slate-400 text-sm mb-1">Active Tournaments</div>
            <div className="text-2xl font-bold text-blue-400">{stats.activeTournaments}</div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Profile Information */}
          <form
            onSubmit={handleUpdateProfile}
            className="bg-slate-800 rounded-xl border border-slate-700 p-6 md:p-8 space-y-6"
          >
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Profile Information</h2>
              <p className="text-slate-400 text-sm mb-6">Update your display name and bio</p>
            </div>

            <div>
              <Label htmlFor="email" className="text-white">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={user?.email || ""}
                disabled
                className="mt-2 bg-slate-900 border-slate-700 text-slate-400"
              />
              <p className="text-slate-500 text-xs mt-1">Email cannot be changed</p>
            </div>

            <div>
              <Label htmlFor="displayName" className="text-white">
                Display Name
              </Label>
              <Input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                className="mt-2 bg-slate-900 border-slate-700 text-white placeholder:text-slate-400"
              />
            </div>

            <div>
              <Label htmlFor="bio" className="text-white">
                Bio
              </Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself..."
                className="mt-2 bg-slate-900 border-slate-700 text-white placeholder:text-slate-400 min-h-[100px]"
              />
            </div>

            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </form>

          {/* Change Password */}
          <form
            onSubmit={handleChangePassword}
            className="bg-slate-800 rounded-xl border border-slate-700 p-6 md:p-8 space-y-6"
          >
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Change Password</h2>
              <p className="text-slate-400 text-sm mb-6">Update your password to keep your account secure</p>
            </div>

            <div>
              <Label htmlFor="newPassword" className="text-white">
                New Password
              </Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="Enter new password"
                className="mt-2 bg-slate-900 border-slate-700 text-white placeholder:text-slate-400"
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-white">
                Confirm New Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm new password"
                className="mt-2 bg-slate-900 border-slate-700 text-white placeholder:text-slate-400"
              />
            </div>

            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={isChangingPassword}>
              {isChangingPassword ? "Changing..." : "Change Password"}
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}
