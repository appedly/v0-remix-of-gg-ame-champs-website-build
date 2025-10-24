import Image from "next/image"
import Link from "next/link"

export default function SignupSuccessPage() {
  return (
    <div className="min-h-screen bg-[#0B1020] flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <Image src="/logo.png" alt="GGameChamps" width={80} height={80} className="w-20 h-20 mx-auto mb-6" />

        <div className="bg-[#1a2332] rounded-lg border border-[#2a3342] p-8">
          <div className="w-16 h-16 bg-[#00C2FF]/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-[#00C2FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-white mb-4">Check Your Email</h1>
          <p className="text-white/70 mb-6">
            We've sent you a confirmation email. Please verify your email address to complete your admin account setup.
          </p>

          <Link
            href="/admin/login"
            className="inline-block px-6 py-3 bg-[#4A6CFF] text-white rounded-lg hover:bg-[#6A5CFF] transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  )
}
