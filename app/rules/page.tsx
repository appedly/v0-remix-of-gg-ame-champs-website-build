"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function Rules() {
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
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Platform Rules</h1>
            <p className="text-white/60 mb-8">Effective: {new Date().toLocaleDateString()}</p>

            <div className="space-y-8 text-white/80 leading-relaxed">
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">1. Submission Guidelines</h2>
                <p className="mb-4">All submissions must comply with the following:</p>
                <ul className="list-disc list-inside space-y-2 text-white/70">
                  <li>Original content or content you have rights to use</li>
                  <li>Relevant to the specified tournament or game</li>
                  <li>High-quality video with clear audio (when applicable)</li>
                  <li>Free from watermarks or promotional overlays (unless approved)</li>
                  <li>Within the specified duration limits</li>
                  <li>No bootleg, modified, or low-quality footage</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">2. Content Standards</h2>
                <p className="mb-4">All content must be appropriate for all audiences:</p>
                <ul className="list-disc list-inside space-y-2 text-white/70">
                  <li>No profanity, slurs, or hate speech</li>
                  <li>No graphic violence or explicit content</li>
                  <li>No harassment or bullying directed at individuals</li>
                  <li>No sexually suggestive material</li>
                  <li>No content promoting illegal activities</li>
                  <li>No sponsored or paid promotional content without disclosure</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">3. Voting and Engagement</h2>
                <ul className="list-disc list-inside space-y-2 text-white/70">
                  <li>One vote per user per submission</li>
                  <li>Vote manipulation or botting is strictly prohibited</li>
                  <li>No voting for your own submissions unless explicitly allowed</li>
                  <li>Users must maintain respectful conduct in comments and feedback</li>
                  <li>Engaging in sham voting can result in account suspension</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">4. Tournament Participation</h2>
                <ul className="list-disc list-inside space-y-2 text-white/70">
                  <li>Each user can only enter one submission per tournament (unless specified otherwise)</li>
                  <li>Submissions must be made before the deadline</li>
                  <li>Late submissions will not be accepted under any circumstances</li>
                  <li>Tournament rules vary by event; always read the specific tournament terms</li>
                  <li>Winners must comply with all prize distribution requirements</li>
                  <li>Failure to claim prizes within the specified timeframe may forfeit rewards</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">5. Account Conduct</h2>
                <ul className="list-disc list-inside space-y-2 text-white/70">
                  <li>One account per person; multi-accounting is prohibited</li>
                  <li>Do not impersonate other users or create misleading profiles</li>
                  <li>Maintain professional and respectful behavior toward other users</li>
                  <li>Do not attempt to circumvent platform safety measures</li>
                  <li>Account credentials must not be shared or sold</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">6. Copyright and Intellectual Property</h2>
                <ul className="list-disc list-inside space-y-2 text-white/70">
                  <li>You are responsible for ensuring you have rights to all content you upload</li>
                  <li>Do not submit copyrighted material without proper authorization</li>
                  <li>Respect third-party music, art, and creative works</li>
                  <li>GGameChamps will respond to copyright claims in accordance with applicable law</li>
                  <li>Repeated copyright violations may result in account termination</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">7. Community Expectations</h2>
                <ul className="list-disc list-inside space-y-2 text-white/70">
                  <li>Treat all community members with respect and dignity</li>
                  <li>Constructive feedback is encouraged; personal attacks are not</li>
                  <li>No spam, excessive self-promotion, or off-topic content</li>
                  <li>Respect the platform's purpose: celebrating gaming excellence</li>
                  <li>Help maintain a positive and inclusive environment for all users</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">8. Enforcement and Penalties</h2>
                <p className="mb-4">Violations of these rules may result in:</p>
                <ul className="list-disc list-inside space-y-2 text-white/70">
                  <li>Warning and content removal</li>
                  <li>Temporary account suspension</li>
                  <li>Permanent account termination</li>
                  <li>Forfeiture of tournament prizes or winnings</li>
                  <li>Legal action for serious violations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">9. Appeals Process</h2>
                <p>
                  If you believe your account has been suspended or your content removed in error, you can submit an appeal to our moderation team. Appeals must be submitted within 30 days of the action and should include detailed information about your case.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">10. Rule Updates</h2>
                <p>
                  GGameChamps reserves the right to update these rules at any time. Changes will be announced on the Platform. Continued use of the Platform constitutes acceptance of updated rules. Please check this page regularly for the latest guidelines.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">11. Questions or Concerns</h2>
                <p>
                  If you have questions about these rules or need clarification, please reach out to our support team:
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
