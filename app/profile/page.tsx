"use client"

import type React from "react"
import { User, Lock, Trophy, TrendingUp, CheckCircle2, Users, Crown, Gift } from "lucide-react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { UserNav } from "@/components/user-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

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

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold text-white">Profile</h1>
            {isFoundingMember && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg border border-yellow-500/30">
                <Crown className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400 font-semibold text-xs uppercase tracking-wide">Founding Member</span>
              </div>
            )}
          </div>
          <p className="text-slate-400">Manage your account and view your stats</p>
        </div>

        {/* Message Alert */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-xl border ${
              message.type === "success"
                ? "bg-green-500/10 border-green-500/20 text-green-400"
                : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Trophy className="text-blue-500" size={20} />
                </div>
              </div>
              <h3 className="text-slate-400 text-xs mb-1 uppercase tracking-wide">Total Clips</h3>
              <p className="text-2xl font-bold text-white">{stats.totalSubmissions}</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300 hover:-translate-y-1 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="text-green-500" size={20} />
                </div>
              </div>
              <h3 className="text-slate-400 text-xs mb-1 uppercase tracking-wide">Approved</h3>
              <p className="text-2xl font-bold text-white">{stats.approvedSubmissions}</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 hover:-translate-y-1 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="text-purple-500" size={20} />
                </div>
              </div>
              <h3 className="text-slate-400 text-xs mb-1 uppercase tracking-wide">Votes</h3>
              <p className="text-2xl font-bold text-white">{stats.totalVotes}</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300 hover:-translate-y-1 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                  <Users className="text-amber-500" size={20} />
                </div>
              </div>
              <h3 className="text-slate-400 text-xs mb-1 uppercase tracking-wide">Referrals</h3>
              <p className="text-2xl font-bold text-white">{referralCount}</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Profile Information */}
          <Card className="border-slate-700">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <User className="text-blue-500" size={20} />
                </div>
                <div>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your display name and bio</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-300 text-sm">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="bg-slate-800 border-slate-700 text-slate-400"
                  />
                  <p className="text-slate-500 text-xs">Email cannot be changed</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="displayName" className="text-slate-300 text-sm">
                    Display Name
                  </Label>
                  <Input
                    id="displayName"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-slate-300 text-sm">
                    Bio
                  </Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 min-h-[80px] resize-none"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300" 
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card className="border-slate-700">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Lock className="text-purple-500" size={20} />
                </div>
                <div>
                  <CardTitle>Security</CardTitle>
                  <CardDescription>Update your password</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-slate-300 text-sm">
                    New Password
                  </Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="Enter new password"
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-slate-300 text-sm">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Confirm new password"
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white transition-all duration-300" 
                  disabled={isChangingPassword}
                >
                  {isChangingPassword ? "Changing..." : "Change Password"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
