"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function PrivacyPolicy() {
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
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Privacy Policy</h1>
            <p className="text-white/60 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

            <div className="space-y-8 text-white/80 leading-relaxed">
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
                <p>
                  GGameChamps ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and otherwise process your information in connection with our Platform.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">2. Information We Collect</h2>
                <p className="mb-4">We collect various types of information, including:</p>
                <ul className="list-disc list-inside space-y-2 text-white/70">
                  <li><strong className="text-white">Account Information:</strong> Email, username, password, and profile details</li>
                  <li><strong className="text-white">Content:</strong> Uploaded clips, submissions, and any associated metadata</li>
                  <li><strong className="text-white">Usage Data:</strong> Information about how you interact with the Platform</li>
                  <li><strong className="text-white">Device Information:</strong> IP address, browser type, and device identifiers</li>
                  <li><strong className="text-white">Cookies:</strong> Data collected through cookies and similar technologies</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Your Information</h2>
                <p className="mb-4">We use collected information to:</p>
                <ul className="list-disc list-inside space-y-2 text-white/70">
                  <li>Provide and improve the Platform and our services</li>
                  <li>Process your submissions and tournament participation</li>
                  <li>Authenticate your identity and prevent fraud</li>
                  <li>Communicate with you about your account or the Platform</li>
                  <li>Analyze usage patterns to enhance user experience</li>
                  <li>Comply with legal obligations and enforce our Terms</li>
                  <li>Send promotional materials (with your consent where required)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">4. Information Sharing</h2>
                <p>
                  We do not sell your personal information. We may share information with:
                </p>
                <ul className="list-disc list-inside mt-4 space-y-2 text-white/70">
                  <li>Service providers who assist in operating the Platform</li>
                  <li>Legal authorities when required by law</li>
                  <li>Other users (e.g., your public profile information)</li>
                  <li>Business partners with your consent</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">5. Data Security</h2>
                <p>
                  We implement industry-standard security measures to protect your personal information. However, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security of your data.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">6. Cookies and Tracking</h2>
                <p>
                  We use cookies and similar technologies to enhance your experience on the Platform. You can control cookie settings through your browser preferences, though some features may not work properly without them.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">7. Your Privacy Rights</h2>
                <p>
                  Depending on your location, you may have the right to:
                </p>
                <ul className="list-disc list-inside mt-4 space-y-2 text-white/70">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate information</li>
                  <li>Request deletion of your information</li>
                  <li>Opt out of certain processing activities</li>
                  <li>Port your data to another service</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">8. Data Retention</h2>
                <p>
                  We retain personal information for as long as necessary to provide our services and fulfill the purposes outlined in this Privacy Policy. You may request deletion of your information at any time, subject to legal and operational requirements.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">9. Third-Party Links</h2>
                <p>
                  The Platform may contain links to third-party websites. We are not responsible for their privacy practices. We encourage you to review the privacy policies of any third-party sites before providing your information.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">10. Changes to This Policy</h2>
                <p>
                  We may update this Privacy Policy periodically. We will notify you of significant changes by posting the updated policy on the Platform. Your continued use of the Platform indicates your acceptance of any modifications.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">11. Contact Us</h2>
                <p>
                  If you have questions about this Privacy Policy or our privacy practices, please contact us at:
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
