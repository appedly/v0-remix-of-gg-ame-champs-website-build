import { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export const metadata: Metadata = {
  title: 'Cookie Policy - GGameChamps',
  description: 'Cookie Policy for GGameChamps - Learn how we use cookies and tracking technologies.',
}

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-[#0B1020]">
      <Navbar />
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Home
            </Link>
          </div>

          <div className="bg-gradient-to-br from-[#1a2332]/60 to-[#0f1621]/60 rounded-3xl border border-[#2a3342]/40 backdrop-blur-md p-8 md:p-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-8" style={{ fontFamily: 'var(--font-eb-garamond), Georgia, serif' }}>
              Cookie Policy
            </h1>

            <div className="prose prose-invert max-w-none">
              <p className="text-lg text-white/80 leading-relaxed mb-8" style={{ fontFamily: 'var(--font-eb-garamond), Georgia, serif' }}>
                Last updated: {new Date().toLocaleDateString()}
              </p>

              <section className="mb-12">
                <h2 className="text-2xl font-semibold text-white mb-4">What Are Cookies</h2>
                <p className="text-white/70 leading-relaxed mb-4">
                  Cookies are small text files that are placed on your computer or mobile device when you visit our website. 
                  They help us provide you with a better experience by remembering your preferences and enabling certain functionality.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-semibold text-white mb-4">How We Use Cookies</h2>
                <div className="space-y-4">
                  <div className="p-4 bg-[#1a2332]/40 rounded-xl border border-[#2a3342]/30">
                    <h3 className="text-lg font-medium text-white mb-2">Essential Cookies</h3>
                    <p className="text-white/70">
                      These cookies are necessary for the website to function and cannot be switched off in our systems. 
                      They are usually only set in response to actions made by you which amount to a request for services.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-[#1a2332]/40 rounded-xl border border-[#2a3342]/30">
                    <h3 className="text-lg font-medium text-white mb-2">Performance Cookies</h3>
                    <p className="text-white/70">
                      These cookies allow us to count visits and traffic sources so we can measure and improve the performance 
                      of our site. They help us to know which pages are the most and least popular and see how visitors move around the site.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-[#1a2332]/40 rounded-xl border border-[#2a3342]/30">
                    <h3 className="text-lg font-medium text-white mb-2">Functional Cookies</h3>
                    <p className="text-white/70">
                      These cookies enable the website to provide enhanced functionality and personalization. 
                      They may be set by us or by third party providers whose services we have added to our pages.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-semibold text-white mb-4">Third-Party Cookies</h2>
                <p className="text-white/70 leading-relaxed mb-4">
                  We use various third-party services that may place their own cookies on your device. These include:
                </p>
                <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
                  <li>Analytics services (Google Analytics)</li>
                  <li>Social media platforms</li>
                  <li>Payment processors</li>
                  <li>Authentication providers</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-semibold text-white mb-4">Managing Your Cookies</h2>
                <p className="text-white/70 leading-relaxed mb-4">
                  You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer 
                  and you can set most browsers to prevent them from being placed. However, if you do this, you may have to 
                  manually adjust some preferences every time you visit a site and some services and functionality may not work.
                </p>
                <div className="p-4 bg-[#4A6CFF]/10 rounded-xl border border-[#4A6CFF]/30">
                  <p className="text-[#4A6CFF] font-medium mb-2">Browser Settings</p>
                  <p className="text-white/70 text-sm">
                    Most browsers allow you to refuse to accept cookies and to delete cookies. The methods for doing so vary 
                    from browser to browser, and from version to version. You can obtain up-to-date information about blocking 
                    and deleting cookies via your browser's help documentation.
                  </p>
                </div>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-semibold text-white mb-4">Changes to This Policy</h2>
                <p className="text-white/70 leading-relaxed">
                  We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, 
                  legal, or regulatory reasons. We will notify you of any changes by posting the new Cookie Policy on this page 
                  and updating the "Last updated" date at the top of this policy.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-semibold text-white mb-4">Contact Us</h2>
                <p className="text-white/70 leading-relaxed mb-4">
                  If you have any questions about this Cookie Policy, please contact us:
                </p>
                <div className="p-4 bg-[#1a2332]/40 rounded-xl border border-[#2a3342]/30">
                  <p className="text-white/70">
                    Email: privacy@ggamechamps.com<br />
                    Website: www.ggamechamps.com
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}