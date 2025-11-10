"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1e] via-[#0f1428] to-[#0a0f1e]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#4A6CFF]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#00D9FF]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-[#00C2FF] hover:text-[#00D9FF] transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 md:p-12 shadow-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Terms and Conditions</h1>
            <p className="text-white/60 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

            <div className="space-y-8 text-white/80 leading-relaxed">
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
                <p>
                  By accessing and using GGameChamps ("the Platform"), you agree to be bound by these Terms and Conditions. If you do not agree to abide by the above, please do not use this service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">2. User Responsibilities</h2>
                <p>
                  You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer. You agree to accept responsibility for all activities that occur under your account or password. You must notify us immediately of any unauthorized use of your account.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">3. Content and Conduct</h2>
                <p>
                  You agree not to upload, post, or otherwise transmit any content that:
                </p>
                <ul className="list-disc list-inside mt-4 space-y-2 text-white/70">
                  <li>Is unlawful, threatening, abusive, defamatory, obscene, vulgar, or otherwise objectionable</li>
                  <li>Infringes on any intellectual property rights</li>
                  <li>Violates any local, state, national, or international law</li>
                  <li>Is spam, contains malware, or attempts to interfere with the Platform</li>
                  <li>Impersonates or misrepresents your identity or association with any person or entity</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">4. Submissions and Rights</h2>
                <p>
                  By submitting content to GGameChamps, you grant us a non-exclusive, royalty-free, perpetual, irrevocable, and fully sublicensable right to use, reproduce, modify, adapt, publish, translate, and distribute such content in any media worldwide.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">5. Limitation of Liability</h2>
                <p>
                  GGameChamps is provided "as is" without warranty of any kind, express or implied. We shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the Platform or its content.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">6. Intellectual Property</h2>
                <p>
                  All content on the Platform, including but not limited to text, graphics, logos, images, and software, is the property of GGameChamps or its content suppliers and is protected by international copyright laws.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">7. Account Termination</h2>
                <p>
                  We reserve the right to terminate any account that violates these Terms and Conditions or engages in conduct deemed inappropriate or harmful to the Platform or its users.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">8. Changes to Terms</h2>
                <p>
                  GGameChamps reserves the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting to the Platform. Your continued use of the Platform following the posting of revised Terms constitutes your acceptance of the changes.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">9. Governing Law</h2>
                <p>
                  These Terms and Conditions are governed by and construed in accordance with the laws applicable in the jurisdiction where GGameChamps operates, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">10. Contact Us</h2>
                <p>
                  If you have any questions about these Terms and Conditions, please contact us at:
                </p>
                <p className="mt-4">
                  Email: <a href="mailto:contact@ggamechamps.com" className="text-[#00C2FF] hover:text-[#00D9FF] transition-colors">contact@ggamechamps.com</a>
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
