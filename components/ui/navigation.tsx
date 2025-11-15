import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from './avatar'
import { Button } from './button'
import { Badge } from './badge'
import { 
  Trophy, 
  Users, 
  Upload, 
  BarChart3, 
  User, 
  Settings, 
  LogOut,
  Menu,
  Bell,
  ChevronDown,
  Gamepad2
} from 'lucide-react'

const navigationVariants = cva(
  "fixed top-0 left-0 right-0 z-50 bg-bg-base border-b border-border"
)

interface NavigationProps extends React.HTMLAttributes<HTMLElement>,
  VariantProps<typeof navigationVariants> {
  user?: {
    username: string
    email: string
    avatar?: string
    notificationCount?: number
  }
  currentPage?: string
}

function Navigation({
  className,
  user,
  currentPage = 'dashboard',
  ...props
}: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = React.useState(false)

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, href: '/dashboard' },
    { id: 'tournaments', label: 'Tournaments', icon: Trophy, href: '/tournaments' },
    { id: 'submissions', label: 'My Submissions', icon: Upload, href: '/submissions' },
    { id: 'leaderboard', label: 'Leaderboard', icon: Users, href: '/leaderboard' },
    { id: 'profile', label: 'Profile', icon: User, href: '/profile' },
  ]

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)
  const toggleProfileDropdown = () => setIsProfileDropdownOpen(!isProfileDropdownOpen)

  return (
    <nav className={cn(navigationVariants(), className)} {...props}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg icon-bg-primary">
                  <Gamepad2 className="size-6" />
                </div>
                <span className="text-xl font-bold text-primary">GGameChamps</span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navigationItems.map((item) => {
                const Icon = item.icon
                const isActive = currentPage === item.id
                
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200",
                      isActive 
                        ? "text-primary bg-primary/10 border border-primary/20" 
                        : "text-secondary hover:text-primary hover:bg-primary/5"
                    )}
                  >
                    <Icon className="size-4" />
                    {item.label}
                  </a>
                )
              })}
            </div>
          </div>

          {/* Right side items */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            {user?.notificationCount && user.notificationCount > 0 && (
              <Button variant="tertiary" size="sm" className="relative p-2">
                <Bell className="size-5" />
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 size-5 p-0 flex items-center justify-center text-xs"
                >
                  {user.notificationCount}
                </Badge>
              </Button>
            )}

            {/* Profile Dropdown */}
            {user && (
              <div className="relative">
                <Button
                  variant="tertiary"
                  size="sm"
                  onClick={toggleProfileDropdown}
                  className="flex items-center gap-2 p-2"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.username} />
                    <AvatarFallback className="text-xs">
                      {user.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden lg:block text-body-small">{user.username}</span>
                  <ChevronDown className="size-4" />
                </Button>

                {/* Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-bg-elevated border border-border rounded-lg shadow-lg py-1 z-50">
                    <div className="px-4 py-2 border-b border-border">
                      <p className="text-body-small font-medium text-primary">{user.username}</p>
                      <p className="text-caption text-secondary">{user.email}</p>
                    </div>
                    <a href="/profile" className="flex items-center gap-2 px-4 py-2 text-body-small text-secondary hover:text-primary hover:bg-bg-hover">
                      <User className="size-4" />
                      Edit Profile
                    </a>
                    <a href="/settings" className="flex items-center gap-2 px-4 py-2 text-body-small text-secondary hover:text-primary hover:bg-bg-hover">
                      <Settings className="size-4" />
                      Settings
                    </a>
                    <div className="border-t border-border my-1"></div>
                    <a href="/logout" className="flex items-center gap-2 px-4 py-2 text-body-small text-error hover:bg-error/10">
                      <LogOut className="size-4" />
                      Sign Out
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button variant="tertiary" size="sm" onClick={toggleMobileMenu}>
                <Menu className="size-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-bg-elevated">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon
                const isActive = currentPage === item.id
                
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200",
                      isActive 
                        ? "text-primary bg-primary/10 border border-primary/20" 
                        : "text-secondary hover:text-primary hover:bg-primary/5"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="size-5" />
                    {item.label}
                  </a>
                )
              })}
            </div>
            <div className="pt-4 pb-3 border-t border-border">
              <div className="px-4 flex items-center">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.avatar} alt={user?.username} />
                  <AvatarFallback>
                    {user?.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-3">
                  <div className="text-body-small font-medium text-primary">{user?.username}</div>
                  <div className="text-caption text-secondary">{user?.email}</div>
                </div>
              </div>
              <div className="mt-3 px-2 space-y-1">
                <a href="/profile" className="flex items-center gap-3 px-3 py-2 rounded-md text-body-small text-secondary hover:text-primary hover:bg-primary/5">
                  <User className="size-4" />
                  Profile
                </a>
                <a href="/settings" className="flex items-center gap-3 px-3 py-2 rounded-md text-body-small text-secondary hover:text-primary hover:bg-primary/5">
                  <Settings className="size-4" />
                  Settings
                </a>
                <a href="/logout" className="flex items-center gap-3 px-3 py-2 rounded-md text-body-small text-error hover:bg-error/10">
                  <LogOut className="size-4" />
                  Sign Out
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export { Navigation, navigationVariants }