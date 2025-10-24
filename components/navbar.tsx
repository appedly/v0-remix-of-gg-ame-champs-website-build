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
      <div className="max-w-7xl mx-auto bg-[#0B1020]/60 backdrop-blur-md border border-white/10 rounded-full px-6 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <Image src="/logo.png" alt="GGameChamps" width={40} height={40} className="w-10 h-10" />
            <span className="text-lg font-bold text-white hidden sm:block">GGameChamps</span>
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
          <div className="hidden lg:flex items-center flex-shrink-0">
            <Link
              href="/login"
              className="px-6 py-2 bg-white text-[#0B1020] rounded-full hover:bg-white/90 transition-colors font-semibold text-sm"
            >
              Pre Register
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
                href="/login"
                className="px-4 py-2 bg-white text-[#0B1020] rounded-full hover:bg-white/90 transition-colors text-center font-semibold text-sm mt-2"
                onClick={() => setIsOpen(false)}
              >
                Pre Register
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
        relative text-white/80 hover:text-white transition-colors text-sm font-medium
        ${mobile ? "px-2 py-1" : ""}
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
