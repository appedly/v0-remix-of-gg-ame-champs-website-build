"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { AdminNav } from "@/components/admin-nav"
import { SettingsForm } from "@/components/settings-form"

type FeatureFlag = {
  id: string
  key: string
  enabled: boolean
  description: string | null
}

export default function SettingsPage() {
  const router = useRouter()
  const [settings, setSettings] = useState<FeatureFlag[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      // Check for admin_session flag set by hardcoded login
      const adminSession = localStorage.getItem("admin_session")
      
      if (!adminSession) {
        // Fallback to checking Supabase auth
        const supabase = createClient()
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          router.push("/admin/login")
          return
        }

        // Verify admin role
        const { data: userData } = await supabase
          .from("users")
          .select("role")
          .eq("id", session.user.id)
          .single()

        if (userData?.role !== "admin") {
          router.push("/admin/login")
          return
        }

        await fetchSettings()
        setIsLoading(false)
      } else {
        // Admin session found in localStorage (hardcoded credentials)
        await fetchSettings()
        setIsLoading(false)
      }
    }

    const fetchSettings = async () => {
      const supabase = createClient()
      const { data } = await supabase.from("feature_flags").select("*")
      setSettings(data || [])
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B1020] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0B1020]">
      <AdminNav userName="Admin" />

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-3xl font-bold text-white mb-8">Platform Settings</h1>
        <SettingsForm settings={settings} />
      </main>
    </div>
  )
}
