import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen bg-[#0B1020] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-[#1a2332] rounded-lg border border-[#2a3342] p-8">
          <h1 className="text-2xl font-bold text-white mb-4">Authentication Error</h1>
          <p className="text-white/60 mb-6">
            There was an error confirming your email. The link may have expired or already been used.
          </p>
          <div className="space-y-3">
            <Button asChild className="w-full bg-[#4A6CFF] hover:bg-[#6A5CFF]">
              <Link href="/login">Go to Login</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full border-[#2a3342] text-white hover:bg-[#1a2332] bg-transparent"
            >
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
