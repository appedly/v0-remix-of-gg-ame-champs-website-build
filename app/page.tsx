import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { HowItWorks } from "@/components/how-it-works"
import { Testimonials } from "@/components/testimonials"
import { FAQ } from "@/components/faq"
import { CTASection } from "@/components/cta-section"
import { GamesSlider } from "@/components/games-slider"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { TournamentsSection } from "@/components/tournaments-section"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0B1020]">
      <Navbar />
      <main>
        <Hero />
        <TournamentsSection />
        <Features />
        <HowItWorks />
        <Testimonials />
        <GamesSlider />
        <FAQ />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
