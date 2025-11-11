"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: "How do tournaments work?",
      answer:
        "Tournaments run weekly for each supported game. Submit your best clips during the submission period, and the community votes on the winners. Top submissions receive cash prizes and recognition.",
    },
    {
      question: "How are winners determined?",
      answer:
        "Winners are determined through community voting. Each registered user can vote on submissions, and the clips with the most votes win. We have anti-cheat measures to prevent vote manipulation.",
    },
    {
      question: "When do I receive my prize money?",
      answer:
        "Prize money is distributed within 24 hours of tournament completion through your preferred payment method (PayPal, Stripe, or crypto).",
    },
    {
      question: "What games are supported?",
      answer:
        "We currently support popular games including Valorant, Fortnite, Apex Legends, Call of Duty, League of Legends, and more. New games are added based on community demand.",
    },
    {
      question: "Is there a free trial?",
      answer:
        "Yes! Early access members get free entry to their first 3 tournaments. After that, tournament entry fees vary based on the prize pool.",
    },
  ]

  return (
    <section id="faq" className="py-32 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Got Questions?</h2>
            <p className="text-5xl md:text-6xl font-bold text-white">We've Got Answers</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-[#1a2332]/50 backdrop-blur-sm rounded-2xl border border-[#2a3342] overflow-hidden transition-all hover:border-[#4A6CFF]/50"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-8 py-6 flex items-center justify-between text-left"
                >
                  <span className="text-lg font-semibold text-white pr-8">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-white/60 transition-transform flex-shrink-0 ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div className={`overflow-hidden transition-all ${openIndex === index ? "max-h-96" : "max-h-0"}`}>
                  <div className="px-8 pb-6 text-white/70 leading-relaxed">{faq.answer}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
