"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { Crown, LogOut } from "lucide-react"
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

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="px-4  flex h-14 w-full items-center ">
        {/* <MainNav /> */}
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Crown />
            <span className=" font-bold ">Logophile</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            {navbarItems.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "transition-colors ",
                  pathname === href || pathname?.startsWith(href)
                    ? "font-bold bg-gradient-to-r from-purple-500 to-sky-400 bg-clip-text text-transparent"
                    : "text-foreground/60",
                )}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-1 items-center  space-x-2 justify-end">
          {/* <TokenCredit /> */}
          <nav className="flex items-center">
            <div></div>

            <DropdownMenu>
              <DropdownMenuTrigger>
                <LogOut />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Logout </DropdownMenuLabel>

              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </div>
    </header>
  )
}
