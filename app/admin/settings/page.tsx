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
    const adminSession = localStorage.getItem("admin_session")
    if (!adminSession) {
      router.push("/admin/login")
      return
    }

    const fetchSettings = async () => {
      const supabase = createClient()
      const { data } = await supabase.from("feature_flags").select("*")
      setSettings(data || [])
      setIsLoading(false)
    }

    fetchSettings()
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
