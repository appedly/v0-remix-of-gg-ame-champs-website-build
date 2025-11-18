"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { loginWithGoogle } from "./oauth-actions"
import { Eye, EyeOff } from "lucide-react"
import { GameEntryPortal } from "@/components/game-entry-portal"

// Force dynamic rendering since this page uses client-side Supabase
export const dynamic = 'force-dynamic'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showPortal, setShowPortal] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData(e.currentTarget)
      const email = formData.get("email") as string
      const password = formData.get("password") as string

      const supabase = createClient()

      console.log("[v0] Attempting login for:", email)

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log("[v0] Login result:", {
        user: data.user?.id,
        session: !!data.session,
        error: authError,
      })

      if (authError) {
        setError(authError.message)
        setIsLoading(false)
        return
      }

      if (data.session) {
        console.log("[v0] Login successful, showing portal...")
        setShowPortal(true)
        setTimeout(() => {
          router.push("/dashboard")
          router.refresh()
        }, 1800)
      }
    } catch (error: unknown) {
      console.error("[v0] Login error:", error)
      setError(error instanceof Error ? error.message : "An error occurred")
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true)
    setError(null)
    try {
      await loginWithGoogle()
    } catch (error: unknown) {
      console.error("[v0] Google login error:", error)
      setError(error instanceof Error ? error.message : "An error occurred")
      setIsGoogleLoading(false)
    }
  }

  return (
    <>
      <GameEntryPortal isOpen={showPortal} onComplete={() => setShowPortal(false)} />
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,#1a2845_25%,#0a0f1e_25%,#0a0f1e_50%,#1a2845_50%,#1a2845_75%,#0a0f1e_75%,#0a0f1e)] bg-[length:60px_60px] opacity-30" />
        </div>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FFD700]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#FF6347]/5 rounded-full blur-3xl" />
        </div>

        <div className="w-full max-w-md relative z-10 animate-game-entry">
        <div className="text-center mb-8 animate-minecraft-slide delay-100" style={{ animationDelay: '0.1s' }}>
          <div className="relative mb-4">
            <Image src="/logo.png" alt="GGameChamps" width={120} height={120} className="w-30 h-30 mx-auto" />
          </div>
          <h1 className="text-4xl font-minecraft font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FF6347] mb-2 tracking-wider">
            ► LOGIN ◄
          </h1>
          <p className="text-cyan-400 text-lg font-minecraft tracking-wide">RESPAWN TO COMPETE</p>
        </div>

        <div className="bg-[#1a2845]/60 backdrop-blur-xl rounded-2xl border-2 border-cyan-400/30 p-8 shadow-2xl shadow-cyan-500/10 hover:border-cyan-400/50 hover:shadow-cyan-500/20 transition-all duration-300">
          <Button
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading}
            className="w-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] hover:from-[#FFC700] hover:to-[#FF9500] text-black h-12 rounded-lg font-minecraft font-bold text-base mb-6 flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/50 border border-yellow-300/30"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {isGoogleLoading ? "⏳ LOADING..." : "➤ GOOGLE LOGIN ◄"}
          </Button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-cyan-400/20" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#1a2845]/80 text-cyan-400/60 font-minecraft tracking-wider">◆ OR ◆</span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <Label htmlFor="email" className="text-cyan-400 font-minecraft tracking-wider text-sm">
                EMAIL ADDRESS
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                required
                className="mt-2 bg-[#0B1020] border-2 border-cyan-400/20 text-white placeholder:text-cyan-400/30 rounded-xl focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all font-minecraft"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-cyan-400 font-minecraft tracking-wider text-sm">
                PASSWORD
              </Label>
              <div className="relative mt-2">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="bg-[#0B1020] border-2 border-cyan-400/20 text-white rounded-xl focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all pr-10 font-minecraft"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-400/60 hover:text-cyan-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-500/20 border-2 border-red-500/50 rounded-lg animate-minecraft-pop">
                <p className="text-red-300 text-sm font-minecraft">⚠ {error}</p>
              </div>
            )}

            <Button type="submit" className="w-full bg-gradient-to-r from-[#00D9FF] to-[#4fc3f7] hover:from-[#00E9FF] hover:to-[#5FDCFF] text-black font-minecraft font-bold text-base rounded-xl h-12 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/50 border border-cyan-300/30 disabled:opacity-50" disabled={isLoading}>
              {isLoading ? "⏳ RESPAWNING..." : "► ENTER GAME ◄"}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-3">
            <p className="text-cyan-400/80 text-sm font-minecraft tracking-wider">
              NO ACCOUNT YET?{" "}
              <Link href="/signup" className="text-[#FFD700] hover:text-[#FFA500] transition-colors font-bold">
                CREATE ONE
              </Link>
            </p>
            <p className="text-cyan-400/60 text-xs font-minecraft tracking-wider">
              <Link href="/forgot-password" className="text-cyan-300 hover:text-cyan-200 transition-colors">
                ◆ FORGOT PASSWORD? ◆
              </Link>
            </p>
          </div>
        </div>

          <div className="mt-6 text-center">
            <Link href="/" className="text-white/60 hover:text-white text-sm transition-colors">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
