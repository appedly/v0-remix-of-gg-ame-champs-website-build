import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  console.log("[v0] Creating Supabase client with URL:", supabaseUrl ? "✓ Found" : "✗ Missing")
  console.log("[v0] Anon key:", supabaseAnonKey ? "✓ Found" : "✗ Missing")

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
