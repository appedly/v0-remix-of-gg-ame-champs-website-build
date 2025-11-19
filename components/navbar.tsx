"use client"

import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Menu, X, Gamepad2, Trophy, HelpCircle, Mail } from "lucide-react"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const windowHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (currentScrollY / windowHeight) * 100
      setScrollProgress(progress)
      
      if (currentScrollY < 10) {
        setIsVisible(true)
        setLastScrollY(currentScrollY)
        return
      }
      
      const scrollDifference = Math.abs(currentScrollY - lastScrollY)
      
      if (scrollDifference > 5) {
        if (currentScrollY > lastScrollY) {
          setIsVisible(false)
        } else {
          setIsVisible(true)
        }
        
        setLastScrollY(currentScrollY)
      }
    }

    let timeoutId: NodeJS.Timeout
    const throttledHandleScroll = () => {
      if (timeoutId) return
      timeoutId = setTimeout(() => {
        handleScroll()
        timeoutId = null
      }, 16)
    }

    window.addEventListener('scroll', throttledHandleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll)
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [lastScrollY])

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
    <>
      {/* Scroll progress bar */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-1 bg-slate-800/50">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 transition-all duration-300 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <nav 
        className={`fixed top-4 left-0 right-0 z-50 px-4 transition-all duration-300 ease-in-out ${
          isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto bg-slate-900/80 backdrop-blur-xl border border-blue-400/20 rounded-full px-6 py-3 shadow-[0_0_30px_rgba(59,130,246,0.15)] hover:shadow-[0_0_40px_rgba(59,130,246,0.25)] transition-shadow">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0 group" aria-label="GGameChamps Home">
              <div className="relative">
                <Image 
                  src="/logo.png" 
                  alt="GGameChamps Logo" 
                  width={40} 
                  height={40} 
                  className="w-10 h-10 transition-transform group-hover:scale-110 group-hover:rotate-6" 
                />
                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="text-lg font-black text-white hidden sm:block group-hover:text-blue-400 transition-colors">
                GGameChamps
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6 flex-1 justify-center">
              <NavLink href="#tournaments" onClick={handleNavClick} icon={<Trophy className="w-4 h-4" />}>
                Tournaments
              </NavLink>
              <NavLink href="#how-it-works" onClick={handleNavClick} icon={<Gamepad2 className="w-4 h-4" />}>
                How It Works
              </NavLink>
              <NavLink href="#features" onClick={handleNavClick} icon={<Trophy className="w-4 h-4" />}>
                Features
              </NavLink>
              <NavLink href="#faq" onClick={handleNavClick} icon={<HelpCircle className="w-4 h-4" />}>
                FAQ
              </NavLink>
              <NavLink href="#contact" onClick={handleNavClick} icon={<Mail className="w-4 h-4" />}>
                Contact
              </NavLink>
            </div>

            {/* CTA Button */}
            <div className="hidden lg:flex items-center flex-shrink-0">
              <Link
                href="/login"
                className="group relative px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full hover:from-blue-600 hover:to-cyan-600 transition-all font-bold text-sm uppercase tracking-wide shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:scale-105 overflow-hidden"
                aria-label="Pre Register for GGameChamps"
              >
                <span className="relative z-10">Pre Register</span>
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700" />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="lg:hidden text-white p-2 hover:bg-blue-500/10 rounded-full transition-colors"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="lg:hidden pt-4 mt-4 border-t border-blue-400/20">
              <div className="flex flex-col gap-3 pb-2">
                <NavLink href="#tournaments" mobile onClick={handleNavClick} icon={<Trophy className="w-4 h-4" />}>
                  Tournaments
                </NavLink>
                <NavLink href="#how-it-works" mobile onClick={handleNavClick} icon={<Gamepad2 className="w-4 h-4" />}>
                  How It Works
                </NavLink>
                <NavLink href="#features" mobile onClick={handleNavClick} icon={<Trophy className="w-4 h-4" />}>
                  Features
                </NavLink>
                <NavLink href="#faq" mobile onClick={handleNavClick} icon={<HelpCircle className="w-4 h-4" />}>
                  FAQ
                </NavLink>
                <NavLink href="#contact" mobile onClick={handleNavClick} icon={<Mail className="w-4 h-4" />}>
                  Contact
                </NavLink>
                <Link
                  href="/login"
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full hover:from-blue-600 hover:to-cyan-600 transition-all text-center font-bold text-sm mt-2 uppercase tracking-wide shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                  onClick={() => setIsOpen(false)}
                  aria-label="Pre Register for GGameChamps"
                >
                  Pre Register
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  )
}

function NavLink({
  href,
  children,
  mobile,
  onClick,
  icon,
}: {
  href: string
  children: React.ReactNode
  mobile?: boolean
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void
  icon?: React.ReactNode
}) {
  return (
    <Link
      href={href}
      onClick={(e) => onClick?.(e, href)}
      className={`
        relative text-slate-300 hover:text-white transition-all text-sm font-semibold flex items-center gap-2
        ${mobile ? "px-4 py-3 hover:bg-blue-500/10 rounded-lg" : ""}
        group
      `}
      aria-label={typeof children === 'string' ? children : undefined}
    >
      {icon && <span className="group-hover:text-blue-400 transition-colors">{icon}</span>}
      <span>{children}</span>
      {!mobile && (
        <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
      )}
    </Link>
  )
}
