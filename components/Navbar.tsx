"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { Crown, LogOut, Home, Settings, Menu, X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { navbarItems } from "@/constants/navitems"

export function Navbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  
  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard' || pathname === '/'
    }
    return pathname === href || pathname?.startsWith(href + '/')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
      <div className="px-4 sm:px-6 flex h-16 items-center justify-between">
        {/* Logo & Desktop Nav */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="p-1.5 rounded-lg bg-primary shadow-sm group-hover:shadow-md transition-shadow">
              <Crown className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-foreground leading-tight">
                Best Vocabulary
              </span>
              <span className="text-[10px] text-muted-foreground font-medium -mt-0.5">
                Admin Portal
              </span>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navbarItems.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive(href)
                    ? "text-primary-foreground bg-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5 text-foreground" />
            ) : (
              <Menu className="h-5 w-5 text-foreground" />
            )}
          </button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-muted transition-colors">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatar.jpg" alt="Admin" />
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                    AD
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:block text-sm font-medium text-foreground">Admin</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-xl">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Admin</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    admin@bestvocabulary.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/" className="flex items-center cursor-pointer rounded-lg">
                  <Home className="mr-2 h-4 w-4" />
                  <span>Home</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-lg">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive rounded-lg">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur-md">
          <nav className="px-4 py-3 space-y-1">
            {navbarItems.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "block px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive(href)
                    ? "text-primary-foreground bg-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
