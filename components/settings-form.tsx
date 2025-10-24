"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type FeatureFlag = {
  id: string
  key: string
  enabled: boolean
  description: string | null
}

export function SettingsForm({ settings }: { settings: FeatureFlag[] }) {
  const [flags, setFlags] = useState<Record<string, boolean>>(
    settings.reduce(
      (acc, flag) => {
        acc[flag.key] = flag.enabled
        return acc
      },
      {} as Record<string, boolean>,
    ),
  )
  const [isLoading, setIsLoading] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const router = useRouter()

  const handleToggle = async (flagKey: string, newValue: boolean) => {
    setFlags((prev) => ({ ...prev, [flagKey]: newValue }))

    setIsLoading(true)
    const supabase = createClient()

    const { error } = await supabase.from("feature_flags").update({ enabled: newValue }).eq("key", flagKey)

    if (error) {
      alert("Error updating setting: " + error.message)
      setFlags((prev) => ({ ...prev, [flagKey]: !newValue }))
    } else {
      router.refresh()
    }

    setIsLoading(false)
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsChangingPassword(true)
    setMessage(null)

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" })
      setIsChangingPassword(false)
      return
    }

    if (newPassword.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters" })
      setIsChangingPassword(false)
      return
    }

    // Update admin password in localStorage
    const adminSession = localStorage.getItem("admin_session")
    if (adminSession) {
      const admin = JSON.parse(adminSession)
      admin.password = newPassword
      localStorage.setItem("admin_session", JSON.stringify(admin))
      setMessage({ type: "success", text: "Password changed successfully!" })
      setNewPassword("")
      setConfirmPassword("")
    }

    setIsChangingPassword(false)
  }

  return (
    <div className="space-y-8">
      <div className="bg-[#1a2332] rounded-lg border border-[#2a3342] p-8 space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Change Admin Password</h2>
          <p className="text-white/60 text-sm mb-6">Update your admin password</p>
        </div>

        {message && (
          <div
            className={`p-3 rounded-lg border ${
              message.type === "success"
                ? "bg-green-500/10 border-green-500/20 text-green-400"
                : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4">
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
              className="mt-2 bg-[#0B1020] border-[#2a3342] text-white placeholder:text-white/40"
            />
          </div>

          <div>
            <Label htmlFor="confirmPassword" className="text-white">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm new password"
              className="mt-2 bg-[#0B1020] border-[#2a3342] text-white placeholder:text-white/40"
            />
          </div>

          <Button type="submit" className="bg-[#4A6CFF] hover:bg-[#6A5CFF] text-white" disabled={isChangingPassword}>
            {isChangingPassword ? "Changing..." : "Change Password"}
          </Button>
        </form>
      </div>

      {/* Feature Flags Section */}
      <div className="bg-[#1a2332] rounded-lg border border-[#2a3342] p-8 space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Feature Flags</h2>
          <p className="text-white/60 text-sm mb-6">Control which features are enabled on the platform</p>

          <div className="space-y-4">
            {settings.map((flag) => (
              <div key={flag.id} className="flex items-center justify-between p-4 bg-[#0B1020] rounded-lg">
                <div className="flex-1">
                  <Label htmlFor={flag.key} className="text-white font-medium">
                    {flag.key ? flag.key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) : "Unknown Flag"}
                  </Label>
                  {flag.description && <p className="text-white/60 text-sm mt-1">{flag.description}</p>}
                </div>
                <Switch
                  id={flag.key}
                  checked={flags[flag.key] || false}
                  onCheckedChange={(checked) => handleToggle(flag.key, checked)}
                  disabled={isLoading}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
