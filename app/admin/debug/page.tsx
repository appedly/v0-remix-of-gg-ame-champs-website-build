"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function AdminDebugPage() {
  const router = useRouter()
  const [authInfo, setAuthInfo] = useState<any>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      
      // Check localStorage
      const adminSession = localStorage.getItem("admin_session")
      
      // Check Supabase session
      const { data: sessionData } = await supabase.auth.getSession()
      
      // Check user role
      let userData = null
      if (sessionData.session) {
        const { data } = await supabase
          .from("users")
          .select("role, display_name")
          .eq("id", sessionData.session.user.id)
          .single()
        userData = data
      }
      
      setAuthInfo({
        localStorage: adminSession,
        session: sessionData.session,
        user: userData,
        userId: sessionData.session?.user?.id,
        userEmail: sessionData.session?.user?.email
      })
      
      setLoading(false)
    }

    checkAuth()
  }, [])

  if (loading) {
    return <div className="p-8 text-white">Loading debug info...</div>
  }

  return (
    <div className="min-h-screen bg-[#0B1020] p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">Admin Debug Info</h1>
        
        <div className="bg-[#1a2332] rounded-lg border border-[#2a3342] p-6 space-y-4">
          <div>
            <h3 className="text-white font-semibold mb-2">Local Storage Admin Session:</h3>
            <pre className="text-green-400 bg-black/30 p-2 rounded">
              {JSON.stringify(authInfo.localStorage, null, 2)}
            </pre>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-2">Supabase Session:</h3>
            <pre className="text-blue-400 bg-black/30 p-2 rounded text-sm">
              {JSON.stringify({
                hasSession: !!authInfo.session,
                userId: authInfo.userId,
                userEmail: authInfo.userEmail
              }, null, 2)}
            </pre>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-2">User Data:</h3>
            <pre className="text-yellow-400 bg-black/30 p-2 rounded">
              {JSON.stringify(authInfo.user, null, 2)}
            </pre>
          </div>
          
          <div className="pt-4 border-t border-[#2a3342]">
            <button
              onClick={() => router.push("/admin/dashboard")}
              className="bg-[#4A6CFF] hover:bg-[#6A5CFF] text-white px-4 py-2 rounded mr-4"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => router.push("/admin/login")}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}