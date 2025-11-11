"use client"

import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Menu, X } from "lucide-react"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault()
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" })
        setIsOpen(false)
      }
    }
  }

  return (
    <nav className="fixed top-4 left-0 right-0 z-50 px-4">
      <div className="mx-auto max-w-7xl rounded-full border border-white/15 bg-[#101a2d]/80 px-6 py-3.5 shadow-[0_25px_60px_-35px_rgba(8,12,23,0.9)] backdrop-blur-xl transition-[background-color,border-color]">
        <div className="flex w-full items-center justify-between">
          <Link href="/" className="flex flex-shrink-0 items-center gap-2">
            <Image src="/logo.png" alt="GGameChamps" width={40} height={40} className="h-10 w-10" />
            <span className="hidden text-xl font-bold tracking-tight text-[#f5f5f5] drop-shadow-[0_8px_25px_rgba(10,15,30,0.6)] sm:block">
              GGameChamps
            </span>
          </Link>

          {/* Desktop Navigation - Center */}
          <div className="hidden lg:flex items-center gap-8 flex-1 justify-center">
            <NavLink href="#tournaments" onClick={handleNavClick}>
              Tournaments
            </NavLink>
            <NavLink href="#how-it-works" onClick={handleNavClick}>
              How It Works
            </NavLink>
            <NavLink href="#features" onClick={handleNavClick}>
              Features
            </NavLink>
            <NavLink href="#faq" onClick={handleNavClick}>
              FAQ
            </NavLink>
            <NavLink href="#contact" onClick={handleNavClick}>
              Contact
            </NavLink>
          </div>

          {/* CTA Button - Right Side */}
          <div className="hidden lg:flex flex-shrink-0 items-center">
            <Link
              href="/signup"
              className="group inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-2.5 text-sm font-semibold text-white/85 transition-all duration-300 hover:border-white/60 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/15"
            >
              Join Waitlist
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden text-white">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden pt-4 mt-4 border-t border-white/10">
            <div className="flex flex-col gap-3 pb-2">
              <NavLink href="#tournaments" mobile onClick={handleNavClick}>
                Tournaments
              </NavLink>
              <NavLink href="#how-it-works" mobile onClick={handleNavClick}>
                How It Works
              </NavLink>
              <NavLink href="#features" mobile onClick={handleNavClick}>
                Features
              </NavLink>
              <NavLink href="#faq" mobile onClick={handleNavClick}>
                FAQ
              </NavLink>
              <NavLink href="#contact" mobile onClick={handleNavClick}>
                Contact
              </NavLink>
              <Link
                href="/signup"
                className="mt-2 rounded-full border border-white/25 px-4 py-2 text-center text-sm font-semibold text-white/85 transition-all duration-300 hover:border-white/60 hover:bg-white/10 hover:text-white"
                onClick={() => setIsOpen(false)}
              >
                Join Waitlist
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

function NavLink({
  href,
  children,
  mobile,
  onClick,
}: {
  href: string
  children: React.ReactNode
  mobile?: boolean
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void
}) {
  return (
    <Link
      href={href}
      onClick={(e) => onClick?.(e, href)}
      className={`
        relative px-2 text-sm font-semibold tracking-wide text-white/80 transition-colors duration-200 hover:text-white
        ${mobile ? "py-1" : ""}
        group
      `}
    >
      {children}
      {/* Flame border effect on hover - desktop only */}
      {!mobile && (
        <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-[#FF7A1A] to-[#FFD166] scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
      )}
    </Link>
  )
}
