"use client"

import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"

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
      <div className="fixed top-0 left-0 right-0 z-[60] h-0.5 bg-slate-900/50">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 transition-all duration-300"
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
        <div className="max-w-7xl mx-auto bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-full px-6 py-3.5 shadow-lg">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group" aria-label="GGameChamps Home">
              <div className="relative">
                <Image 
                  src="/logo.png" 
                  alt="GGameChamps Logo" 
                  width={36} 
                  height={36} 
                  className="w-9 h-9 transition-transform group-hover:scale-105" 
                />
              </div>
              <span className="text-lg font-bold text-white hidden sm:block group-hover:text-blue-400 transition-colors">
                GGameChamps
              </span>
            </Link>

            {/* Desktop Navigation */}
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

            {/* CTA Button */}
            <div className="hidden lg:flex items-center flex-shrink-0">
              <Link
                href="/login"
                className="group relative px-6 py-2.5 bg-blue-600 text-white rounded-full font-semibold text-sm transition-all duration-200 hover:bg-blue-500 active:scale-95"
                aria-label="Pre Register for GGameChamps"
              >
                Pre Register
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="lg:hidden text-white p-2 hover:bg-slate-800 rounded-full transition-colors"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="lg:hidden pt-4 mt-4 border-t border-slate-700/50">
              <div className="flex flex-col gap-2 pb-2">
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
                  className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-500 transition-all text-center font-semibold text-sm mt-2"
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
        relative text-slate-300 hover:text-white transition-colors text-sm font-medium
        ${mobile ? "px-4 py-2.5 hover:bg-slate-800/50 rounded-lg" : ""}
        group
      `}
      aria-label={typeof children === 'string' ? children : undefined}
    >
      {children}
      {!mobile && (
        <span className="absolute inset-x-0 -bottom-1 h-[2px] bg-blue-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
      )}
    </Link>
  )
}
